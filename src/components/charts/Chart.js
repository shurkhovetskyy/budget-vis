import React, { Component } from 'react';

import Styles from '../../config/styles';

import {
	MoneyNum,
	MoneySign,
	reveal,
	hide,
	firstDim
} from '../../utils/';

import {
	Action,
	Interaction
} from '../../config/options';

import {
	Sign
} from '../../config/text';



import CONFIG from '../../config/settings';

import {
	setDimYears
} from './helpers';

import { val } from '../../utils/val';

class Chart extends React.Component {

	constructor(props){
		super(props);

		// Y-Axis
		this.yScale = d3.scale.linear().range([
			Styles.chartHeight - Styles.bottomPadding, Styles.topPadding]);

		this.yAxis = d3.svg.axis()
					.orient("left")
					.ticks(5)
					.tickFormat(tickTextFormat);

		this.axisCon = null;
		this.zeroAxis = null;

		// Flag: false if labels have not yet set up.
		this.labelsSet = false;
		// Indicates if chart is displayed.
		this.chartSet = false;
		// Flag: true if this display is currently in use.
		this.active = false;
		// True when there is no data to show.
		this.noData = false;

		this.hi = 1.0;
		this.lo = 0.4;
	}

	componentDidUpdate (prevProps) {

		this.axisCon = this.axisCon || d3.select("#axiscon-" + this.props.level);
		this.zeroAxis = this.zeroAxis || d3.select("#zero-" + this.props.level);

		this.no = this.no || d3.select("#nodata-" + this.props.level);
		// if (!CONFIG.hasOwnProperty("dimYears"))
		// 	setDimYears(this.props.data);

		this.updateXScale();
		this.updateXScaleRange();

		if (this.props.action == Action.ACTIVATE) {
			this.action = Action.ADD;
			if (this.props.view==this.association) {
				this.bindLabels();
				this.activate();
			} else
				this.deactivate();
			return;
		}

		if (this.props.action==Action.RESIZE) {
			this.action = Action.RESIZE;
			this.updateLabels();
			if (!this.active)
				return;
			this.updateDimensions();
			return;
		}
		// if view did not change, then this
		// chart is active, update it
		if ([Action.YEAR, Action.MODE].includes(this.props.action))
			this.updateData();

		// if (prevProps.view == this.props.view && this.active)
		// 	this.updateData();
	}

	shouldComponentUpdate (nextProps) {
		if (!CONFIG.hasOwnProperty('dimYears'))
			return false;


		if (nextProps.view != this.association) {
			if (!this.active && nextProps.action==Action.RESIZE)
				return true;
			if (!this.active)
				return false;
		}

		if (Object.values(Action).includes(nextProps.action))
			return true;

		// if (Object.values(Interaction).includes(nextProps.action))
		// 	return true;

		return false;
	}


	/**
	*	Updates view.
	*
	*	The order of all checks and transitions is set specifically
	*	to handle quick switches between states and views.
	*
	*	Unless you really, really, really know what you are doing
	*	do not change anything here or the sky will fall.
	*/
	updateData () {
		// if there is currently no data or year was changed...
		if(this.noData || this.action == Action.YEAR) {
			// if data not available and year was not changed...
			if(this.action != Action.YEAR)
				return;
			// if year was changed and data is still not available...
			if (!this.dataAvailable()) {
				// update message and exit.
				this.noDataMessage();
				return;
			}
			// if data is available now (noData changed to true)...
			else {
				// if chart has not been even built even yet, build it.
				if (!this.chartSet) {
					this.action = Action.ADD;
					this.setup.call(this);
					return;
				}
				// otherwise just remove noData message (reveals already
				// set up chart) and update dimensions.
				this.noDataMessage(false);
			}
		}

		this.updateDimensions();
	//	this.updateLabels();
	};

	updateDimensions () {
		console.log("UpdateDimensions");
		this.setAxis(true, true);
		this.props.openDimensions.forEach (
			dim => this.renderDimension(dim));
	};

	updateLabels () {
		if ([Action.MODE, Action.YEAR].includes(this.props.action))
			return;

		//console.log("updateLabels", this.xScale.range());

		let _this = this,
			  labels = this.generateLabels();
		const hi = this.hi;
	  	const lo = this.lo;
		labels.transition()
			// Make sure labels appear quickly when shown
			// for the first time (set is false then).
			.duration(this.labelsSet ? 500 : 0)
			.style("opacity", 0)
			.transition().duration(10)
			.text((d, i) => this.labelsText[i])
			.transition().duration(50)
			.call(function () {
				_this.labelIn.call(this, _this); })
			.transition().duration(500)
			.style("opacity", d => {
				let cond = (d.id == this.props.selection || this.props.selection=='n');
				return cond ? (hi * this.lop) : (lo * this.lop);
			})
			// .style("font-weight", d => {
			// 	console.log(d.id == this.selection);
			// 	return (d.id == this.selection ? "bold" : "normal");
			// }

			;
	}

	generateLabels () {
		// if (this.labelsText != null)
		// 	return this.labelsText;

		const sd = this.props.openDimensions,
			  _this = this,
			  labels = this.labelsCon.selectAll("span")
				.filter(".axis-label")
			//	.filter(".level-" + this.props.level)
				// Specify which dimension is represented by this set of bars.
				.data(this.getDimensionData(
					firstDim(sd, this.props.year)));
		this.labelsText = this.getLabels();
		labels.enter()
			.append("span")
			.text((d, i) => this.labelsText[i])
			.attr("class", "axis-label level-" + this.props.level)
			.style("opacity", 0)
			.call(function () {
				_this.labelIn.call(this, _this); })
			.call(function() {
				_this.setListeners.call(this, _this); })
			;

		labels.exit()
			.transition()
			.duration(1000)
			.call(function () {
				_this.labelOut.call(this, _this); })
			.remove();

		if (this.xScale.rangeBand() < this.bandLimit)
			this.lop = 0.2;
		else
			this.lop = 1.0;

		return labels;
	};

	bindLabels () {
		const od = this.props.openDimensions;
		const labels = this.labelsCon.selectAll("span")
						.filter(".axis-label")
						.data(this.getDimensionData(
							firstDim(od, this.props.year)));;
		const _this = this;
		labels.call(function() {
			_this.setListeners.call(this, _this); });
	}

	labelOut (display) {
		const y = Styles.chartHeight + Styles.labelMargin,
			  w = display.axisWidth;
		this.style("left", w)
			.style("opacity", 0);
	}

	labelIn (display) {
		this.style("left", (d, i) => display.getLabelX(i))
			.style("font-weight", d =>
				d.id == display.props.selection ? "bold" : "normal"
			);
	}

	dataAvailable (dims = null) {
		// var start = new Date().getTime();

		dims = dims || this.props.openDimensions;
		const available = dims.map(d =>
			this.dimAvailable(d)).reduce((a, b) => a || b);
		console.log(available);
		this.noData = !available;

		// var elapsed = new Date().getTime() - start;
		// console.log(elapsed);
		return available;
	};

	handleState (dim) {
		// if display already active...
		if (this.active) {
			// and there is no data...
			if(this.noData) {
				// and new dimension data is also not available...
				if (!this.dataAvailable([dim])) {
					// update the noDataMessage and exit.
					this.setNoDataMessage();
					return false;
				}
				// if data is now available, set up chart
				this.setup.call(this, [dim]);
			}
			// and chart is set, then update axis to accomodate
			// new data from new dimension.
			else if (this.chartSet)
				this.setAxis(true, true);
		}
		return true;
	};

	setNoDataMessage = function () {
		let html = this.noText();
		this.props.openDimensions.forEach(
			d => html = html + "<br><span>" + d + "</span>");
		this.no.html(html);
	};

	noText () {
		return "No <span>" + this.props.year + "</span> data available for";
	};
	/*
	*	Shows/hides message indicating no data is available
	*	for open dimensions for selection year.
	*/
	noDataMessage (noData = true) {
		if (noData) {
			hide(this.axisCon);
			hide(this.container);
			this.setNoDataMessage();
			this.minimizeItems();
			this.chartSet = false;
		} else {
			this.axisCon.style("visibility", "visible");
			reveal(this.container);
		}
		this.labelsCon.classed("hidden", noData);
		this.no.classed("reveal", noData);
	};

	setAxis (x = false, y = false, fading = false) {
		if (x)	this.updateXScale();
		if (y)	this.updateYScale();

		this.yAxis.tickSize(-this.axisWidth, 0);
		console.log("setAxis");
		if (fading) {
			// Hide axis.
			const invTrans = this.axisCon
				.transition().duration(this.chartSet ? 500 : 250);
			invTrans.style("opacity", "0");
			// Change axis.
			const yTrans = invTrans.transition().duration(0);
			yTrans.call(this.yAxis);
			// Reveal axis.
			const visTrans = invTrans.transition().duration(500);
			visTrans.style("opacity", "1");
		} else {
			// Perform smooth transition on the axis.
			this.axisCon.transition().duration(1000)
				.call(this.yAxis)
				.style("opacity", 1);
		}

		// Only display zero axis if zero is in vicinity.
		const aboveMin = d3.min(this.yScale.range()) <= this.yScale(0);
		const belowMax = this.yScale(0) <= d3.max(this.yScale.range());
		if (!aboveMin || !belowMax) {
			this.zeroAxis
				.transition()
				.duration(500)
				.style("opacity", "0.0");
			return;
		}
		// Smooth transition of zero axis.
		this.zeroAxis
			.transition("hide")
			.duration(500)
			.style("opacity", "0.0")
			.transition("position")
		//	.duration(1000)
			.attr("y1", this.yScale(0))
			.attr("y2", this.yScale(0))
			.attr("x1", 0)
			.attr("x2", this.axisWidth)
			.transition("reveal")
			.duration(500)
			.style("opacity", "0.7")
			;
	}

	setup (dims = null) {
		if (!this.dataAvailable()) {
			this.noDataMessage();
			return;
		}
		this.noDataMessage(false);
		this.setAxis(true, true, true);

		dims = dims || this.props.openDimensions;
		dims.forEach(dim => this.addDimension(dim));

		this.chartSet = true;
	}

	activate () {
		this.setup();
		if(!this.labelsSet) {
			this.updateLabels();
			this.labelsSet = true;
		}
		this.active = true;
	}

	deactivate () {
		if (!this.active)
			return;
		this.active = false;
		this.chartSet = false;

		hide(this.container);
		this.labelsCon.classed("hidden", true);

		this.props.openDimensions.forEach(
			dim => this.removeDimension(dim));
	}
}

function tickTextFormat (d) {
	const num = MoneyNum(d);
	const sign = MoneySign(d);
	let precision = 0;
	if (sign == Sign[CONFIG.lang].billion)
		precision = 2;
	return ((d3.format("." + precision.toString() + "f")(num) + " " + sign));
};

export default Chart;
