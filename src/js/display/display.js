/*jshint esversion: 6 */

import { Styles } from '../ui/styling';
import { reveal, hide, MoneyNum, MoneySign, val } from '../utils';
import { Mode, View, Action, Sort } from '../ui/ui-state';
import { Sign } from '../ui/text';

const CONFIG = require('../../../config.json');

export default function Display (chart) {
	this.c = chart;
	this.container = chart.mainContainer.append("g")
					//	.style("visibility", "hidden")
						;
	this.labelsCon = this.c.labelsGroup.append("div")
						.attr("class", "labelscon hidden");

	// Y-Axis
	this.yScale = d3.scale.linear().range([
		Styles.chartHeight - Styles.bottomPadding, Styles.topPadding]);

	this.yAxis = d3.svg.axis()
				.orient("left")
				.ticks(5)
				.tickFormat(this.tickTextFormat);

	// Flag: false if labels have not yet set up.
	this.labelsSet = false;
	// Indicates if chart is displayed.
	this.chartSet = false;
	// Flag: true if this display is currently in use.
	this.active = false;
	// True when there is no data to show.
	this.noData = false;
}

Display.prototype.tickTextFormat = function(d) {
	const num = MoneyNum(d);
	const sign = MoneySign(d);
	let precision = 0;
	if (sign == Sign[CONFIG.lang].billion)
		precision = 2;
	return ((d3.format("." + precision.toString() + "f")(num) + " " + sign));
};

Display.prototype.setDataset = function (_) {
	this.dataset = _;
	this.updateXScale();
	this.updateXScaleRange();
	this.labelsText = this.getLabels();
};

Display.prototype.setAxis = function (x = false, y = false, fading = false) {
	const c = this.c;
	if (x)	this.updateXScale();
	if (y)	this.updateYScale();

	this.yAxis.tickSize(-this.c.axisWidth, 0);
//	console.log("setAxis");
	if (fading) {
		// Hide axis.
		const invTrans = this.c.axisCon
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
		c.axisCon.transition().duration(1000)
			.call(this.yAxis)
			.style("opacity", 1);
	}

	// Only display zero axis if zero is in vicinity.
	const aboveMin = d3.min(this.yScale.range()) <= this.yScale(0);
	const belowMax = this.yScale(0) <= d3.max(this.yScale.range());
	if (!aboveMin || !belowMax) {
		c.zeroAxis
			.transition()
			.duration(500)
			.style("opacity", "0.0");
		return;
	}
	// Smooth transition of zero axis.
	c.zeroAxis
		.transition("hide")
		.duration(500)
		.style("opacity", "0.0")
		.transition("position")
	//	.duration(1000)
		.attr("y1", this.yScale(0))
		.attr("y2", this.yScale(0))
		.attr("x1", 0)
		.attr("x2", this.c.axisWidth)
		.transition("reveal")
		.duration(500)
		.style("opacity", "0.7")
		;
};

Display.prototype.updateLabels = function () {
	if ([Action.MODE, Action.YEAR].includes(this.c.action))
		return;

	console.log("updateLabels");

	let _this = this,
		  labels = this.generateLabels();
	const hi = 1.0;
  	const lo = 0.4;
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
			let cond = (d.id == this.selected || this.selected==-1);
			return cond ? (hi * this.lop) : (lo * this.lop);
		})
		// .style("font-weight", d => {
		// 	console.log(d.id == this.selected);
		// 	return (d.id == this.selected ? "bold" : "normal");
		// }

		;
};

Display.prototype.setNoDataMessage = function () {
	let html = this.noText();
	this.c.shownDimensions.forEach(
		d => html = html + "<br><span>" + d + "</span>");
	this.c.no.html(html);
};

/*
*	Shows/hides message indicating no data is available
*	for open dimensions for selected year.
*/
Display.prototype.noDataMessage = function (noData = true) {
	if (noData) {
		hide(this.c.axisCon);
		hide(this.container);
		this.setNoDataMessage();
		this.minimizeItems();
		this.chartSet = false;
	} else {
		this.c.axisCon.style("visibility", "visible");
		reveal(this.container);
	}
	this.labelsCon.classed("hidden", noData);
	this.c.no.classed("reveal", noData);
};

Display.prototype.dataAvailable = function (dims = null) {
	// var start = new Date().getTime();

	dims = dims || this.c.shownDimensions;
	const available = dims.map(d =>
		this.dimAvailable(d)).reduce((a, b) => a || b);
	console.log(available);
	this.noData = !available;

	// var elapsed = new Date().getTime() - start;
	// console.log(elapsed);
	return available;
};

/*
*	Shows all dimensions open.
*/
Display.prototype.setupChart = function (dims = null) {
	if (!this.dataAvailable()) {
		this.noDataMessage();
		return;
	}
	dims = dims || this.c.shownDimensions;
	console.log("setupChart");
	this.noDataMessage(false);
	this.setAxis(true, true, true);
	dims.forEach(dim => this.addDimension(dim));
	this.chartSet = true;
};

Display.prototype.handleState = function (dim) {
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
			Display.prototype.setupChart.call(this, [dim]);
		}
		// and chart is set, then update axis to accomodate
		// new data from new dimension.
		else if (this.chartSet)
			this.setAxis(true, true);
	}
	return true;
};

/**
*	Updates view.
*
*	The order of all checks and transitions is set specifically
*	to handle quick switches between states and views.
*
*	Unless you really, really, really know what you are doing
*	do not change anything here. Or the sky will fall.
*/
Display.prototype.updateData = function () {
	// if there is currently no data or year was changed...
	if(this.noData || this.c.action == Action.YEAR) {
		// if data not available and year was not changed...
		if(this.c.action != Action.YEAR)
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
				this.c.action = Action.ADD;
				Display.prototype.setupChart.call(this);
				return;
			}
			// otherwise just remove noData message (reveals already
			// set up chart) and update dimensions.
			this.noDataMessage(false);
		}
	}

	this.updateDimensions();
	this.updateLabels();
};

Display.prototype.updateDimensions = function () {
	console.log("UpdateDimensions");
	this.setAxis(true, true);
	this.c.shownDimensions.forEach (
		dim => this.renderDimension(dim));
};

Display.prototype.generateLabels = function () {
	// if (this.labelsText != null)
	// 	return this.labelsText;

	const sd = this.c.shownDimensions,
		  _this = this,
		  labels = this.labelsCon.selectAll("span")
			.filter(".axis-label")
			.filter(".level-" + this.c.level)
			// Specify which dimension is represented by this set of bars.
			.data(this.getDimensionData(sd[0]));
	this.labelsText = this.getLabels();
	labels.enter()
		.append("span")
		.text((d, i) => this.labelsText[i])
		.attr("class", "axis-label level-" + this.c.level)
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
		this.lop = 0.0;
	else
		this.lop = 1.0;

	return labels;
};

Display.prototype.restore = function () {
	this.selected = -1;
};

Display.prototype.labelOut = function (display) {
	const y = Styles.chartHeight + Styles.labelMargin,
		  w = display.c.axisWidth;
	this.style("left", w)
		.style("opacity", 0);
};

Display.prototype.labelIn = function (display) {
	this.style("left", (d, i) => display.getLabelX(i))
		.style("font-weight", d =>
			d.id == display.selected ? "bold" : "normal"
		);
};

Display.prototype.deactivate = function () {
	if (!this.active)
		return;
	this.active = false;
	this.chartSet = false;

	hide(this.container);
	this.labelsCon.classed("hidden", true);

	this.c.shownDimensions.forEach(
		dim => this.removeDimension(dim));
};

Display.prototype.activate = function () {
	if (this.active)
		return;
	if (this.c.display!=null)
		this.c.display.deactivate();

	this.setupChart();
	if(!this.labelsSet) {
		this.updateLabels();
		this.labelsSet = true;
	}
	this.active = true;
	this.c.display = this;
};
