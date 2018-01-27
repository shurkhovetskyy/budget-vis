import React, { Component } from 'react';

import Chart from './Chart';
import { View, Mode, Sort, Action, Interaction } from '../../config/options';
import { getItemColor, sortUtil, firstDim } from '../../utils';
import Styles from '../../config/styles';
import { val } from '../../utils/val';

import CONFIG from '../../config/settings';

export default class BarChart extends Chart {

	constructor(props){
		super(props);

		this.xScale = d3.scale.ordinal();
		this.xGroup = d3.scale.ordinal();
		this.xAxis = d3.svg.axis().scale(this.xScale);

		this.bandLimit = 14
		this.association = View.CATS;
		this.builtDims = [];
		this.selection = 'n';
	}

	componentDidUpdate (prevProps) {
		this.container =	this.container ||
							d3.select("#barscon-" + this.props.level);

		this.axisWidth = this.props.width - Styles.axisWidthShift;
		this.actWidth = this.axisWidth - Styles.rightPadding;

		this.action = this.props.action;

		if (this.props.action == Action.SORT) {
			this.sortBars(0, this.props.sort);
			return;
		}

		if (this.props.action == Action.MODE) {
			this.updateData();
			this.sortBars(0, this.props.sort);
			return;
		}

		const oldDims = prevProps.openDimensions;
		const newDims = this.props.openDimensions;

		if (this.props.action == Action.UPDATE) {
			this.updateData();
			this.updateLabels();
			return;
		}

		if (this.action==Action.ADD) {
			const dim = newDims.filter(
				v => !oldDims.includes(v)).shift();
			this.addDimension(dim);
			return;
		}

		if (this.action==Action.REMOVE) {
			const dim = oldDims.filter(
				v => !newDims.includes(v)).shift();
			this.removeDimension(dim);
			this.builtDims = newDims;
			return;
		}

		this.labelsCon = this.labelsCon || d3.select("#labelscon-bar-" + this.props.level);

		if (Action.YEAR == this.props.action) {
			this.updateLabels();
			this.updateData();
			return;
		}

		super.componentDidUpdate(prevProps);
	}

	updateXScaleRange (range) {
		this.xScale.rangeRoundBands([0, this.actWidth], 0.2);
		this.xGroup.rangeRoundBands([0, this.xScale.rangeBand()], 0);
	}

	updateXScale  () {
		this.xScale.domain(d3.range(this.props.data.length));
		this.xGroup.rangeRoundBands([0, this.xScale.rangeBand()], 0);
	};

	updateYScale () {
		const c = this.props;
		if (c.mode == Mode.SPENDING || c.mode == Mode.COMB)
			this.yScale.domain([0, this.getShownMax()
			]);
		else if (c.mode == Mode.REVENUE)
			this.yScale.domain([this.getShownMin(), 0]);
		else if (c.mode == Mode.BAL) {
			let min = this.getShownMin();
			let max = this.getShownMax();
			if (min > 0)
				min = 0;
			else if (max < 0)
				max = 0;
			// If all values are zero, show an empty
			// chart with coordinates stretched to extremes.
			if (min==0 && max==0) {
				max = this.getShownMax(Mode.SPENDING);
				min = this.getShownMin(Mode.REVENUE);
			}
			this.yScale.domain([min, max]);
		}

		this.yAxis.scale(this.yScale);
	}

	getShownMax (mode = this.props.mode) {
		const max = Math.max.apply(null, this.props.openDimensions.map(
			dim => d3.max(this.props.data.map(d =>
				val(d, dim, mode, this.props.year)))));
		//console.log("Max: " + max);
		return max;
	};

	getShownMin (mode = this.props.mode) {
		const min = Math.min.apply(null, this.props.openDimensions.map(
			dim => d3.min(this.props.data.map(d =>
				val(d, dim, mode, this.props.year)))));
		//console.log("Min: " + min);
		return min;
	};

	getLabels () {
		return this.props.data.map(c => c.category);
	}

	getLabelX (i) {
		return this.xScale(i) + this.xScale.rangeBand() / 2;
	};

	addDimension (dim) {
		if (!super.handleState.call(this, dim))
			return;

		this.xGroup.domain(d3.range(
			this.props.openDimensions.length));

		// Select all existing bars to reduce their width.
		let bars = this.container
					.selectAll(".bar-rect")
					.filter(b => b.dim!=dim);

		if (this.chartSet && !bars.empty()) {
			const _this = this;

			bars.transition()
				.duration(500)
				.call(function () {
					_this.setBarsWidth.call(this, _this);
				 	_this.setBarsHeight.call(this, _this);
				})
				;
		}
		this.renderDimension(dim);
		this.container.selectAll(".bar-rect")
				.filter(d => d.id==this.props.selection)
				.style("opacity", 1.0);
	}

	removeDimension = function (dim) {
		const stayingBars = this.container
				.selectAll(".bar-rect")
				.filter(b => this.props.openDimensions.includes(b.dim));

		const goingBars = this.container
				.selectAll(".bar-rect").filter(b => b.dim == dim);

		this.xGroup.domain(d3.range(this.props.openDimensions.length));
		// If display is not active, then all bars are
		// going hence no need to update scale.
		if (this.active) {
			// while if is display is active and only dimensions
			// left open have no data available...
			if (this.noData || !this.dataAvailable()) {
				// update the noDataMessage and exit.
				this.noDataMessage();
			} else {
				this.updateYScale();
				const _this = this;
				stayingBars.transition()
				//	.delay(function (d, i) { return i / dl * 500; })
					.duration(500)
					.call(function () { _this.setBarsHeight.call(this, _this); })
					.transition()
					.call(function () { _this.setBarsWidth.call(this, _this); });
				this.setAxis(true, false);
			}
		}
		this.minimizeItems(goingBars).remove();
	};

	renderDimension (dim) {
		this.xGroup.domain(d3.range(
			this.props.openDimensions.length));

		const _this = this;
		let bars = this.container
					.selectAll(".bar-rect")
					.filter(b => b.dim == dim);

		// Disable all interaction before transitions.
		bars.call(function() {
			_this.setListeners.call(this, _this, true); })

		if (!this.dimAvailable(dim)) {
			this.minimizeItems(bars);
			return;
		}
		let duration = 1000;

		const hi = this.hi;
		const lo = this.lo;
		const newDim = !this.builtDims.includes(dim);
		const neverBuilt = (Action.YEAR==this.action && bars.empty());
		if ([Action.ADD, Action.UPDATE].includes(this.action) || neverBuilt) {
			bars = this.buildBars(bars, dim);
			if (this.action == Action.ADD || newDim || neverBuilt) {
				bars.call(function () {
						_this.setBarsWidth.call(this, _this); })
					.attr("y", this.yScale(0))
					.attr("height", 0);
				duration = 500;
			}
		}

		const delay = 500;
		const offDelay = (this.chartSet ? (newDim ? 1000 : 500) : 0);
		const dl = this.props.data.length;

		if ([Action.YEAR].includes(this.action)) {
			bars = bars.data(this.getDimensionData(dim));
		}

		// Enforce "on end" to bu executed once.
		let numTrans = bars.size();
		bars.transition()
			.delay((d, i) => {
				if (_this.action == Action.ADD || newDim)
					return (offDelay + (i / dl) * delay);
				return 0;
			})
			.duration(duration)
			.call(function () {
				if(_this.action!=Action.RESIZE)
					_this.setBarsHeight.call(this, _this);
				if ([Action.UPDATE, Action.RESIZE].includes(_this.action)) {
					_this.setBarsWidth.call(this, _this);
					if (Action.UPDATE == _this.action)
						this.style("opacity", _this.hi);
				}

			})
			.each("end", () => {
					if (--numTrans == 0)
						this.setListeners.call(bars, this);
				}
			);
	}

	dimAvailable (dim) {
		return CONFIG.dimYears[dim].includes(this.props.year);
	};

	getDimensionData (dim) {
		const data = this.props.data.map(
			d => (Object.assign({dim: dim}, d)));
		return data;
	}

	// Generates the bars and attaches data to them.
	buildBars (bars, dim) {
		const c = this.c,
			  _this = this;
		const hi = 1.0;
		const lo = 0.4;

		// Specify which dimension is represented by this set of bars.
		// All dimensions are kept so that sorting is possible by
		// dimensions other than current.
		bars = bars.data(this.getDimensionData(dim));

		bars.enter()
			.append("rect")
			// To make sure bars only appear within chart.
			.attr("x", this.axisWidth - this.xScale.rangeBand())
			.attr("fill", getItemColor(dim))
			.style("fill-opacity", 0)
			.attr("dim", dim)
			.attr("class", "bar-rect level-" + this.props.level)
			// .call(function() {
			// 	_this.setListeners.call(this, _this); })
			.style("opacity", (d) => {
				if (this.action==Action.ADD && this.props.selection!='n') {
					if (d.id == this.props.selection)	return hi;
					else 						return lo;
				}
			});

		bars.exit()
			.call(function() {
				_this.setListeners.call(this, _this, true); })
			.transition()
			.call(function () {
				_this.onExitTrans.call(this, _this); });

		if (!this.builtDims.includes(dim))
			this.builtDims.push(dim);
		return bars;
	};

	minimizeItems (items = null, duration = 500) {
		items = items || this.container.selectAll('.bar-rect');
		const trans = items.transition().duration(duration);
		trans	.attr("y", this.yScale(0))
				.attr("height", 0);
		return trans;
	};

	sortBars = function (dimension, sort = null) {
		const c = this.props,
			  sd = c.openDimensions,
			  _this = this;

		this.sortDim = c.openDimensions[dimension];

		this.props.data.sort((a, b) => this.sortUtil(a, b));

		// Sort bars.
		sd.forEach((dim, k) => {
			let bars = this.container.selectAll('rect')
						.filter(b => b.dim == dim);
			bars.sort((a, b) => this.sortUtil(a, b))
				.transition("sort").duration(500)
				.attr("x", (d, i) => {
					let pos = (this.xScale.rangeBand() / sd.length) * k;
					return this.xScale(i) + pos; });
		});

		// Sort labels.
		this.labelsCon.selectAll("span")
			.filter(".axis-label")
			.sort((a, b) => this.sortUtil(a, b))
			.transition("sort")
			.duration(500)
			.style("left", (d, i) => this.getLabelX(i));
	};

	sortUtil (a, b) {
		return sortUtil(a, b,
						this.props.sort,
						this.props.mode,
						this.props.year,
						firstDim(	this.props.openDimensions,
									this.props.year)
					);
	}

	/*
	*	Methods which run on bar elements.
	*/

	setBarsWidth (display) {
		const sd = display.props.openDimensions;
		this.attr("width", display.xGroup.rangeBand())
			.attr("x", d => {
				const k = sd.indexOf(d.dim),
					  i = display.props.data.map(
					//	  item => item.data).indexOf(d.data),
						item => item.category).indexOf(d.category),
					  r = display.xGroup(k);
				return display.xScale(i) + r;
			});
	}

	setBarsHeight (display) {
		const c = display.props;
		this.style("fill-opacity", 1)
			.attr("y", d => {
				// Add/subtract 1 pixel to keep short distance
				// between bars and axis.
				const v = val(d, d.dim, c.mode, c.year);
				if (v >= 0) return (display.yScale(v) - 1);
				else 		return (display.yScale(0) + 1);
			})
			.attr("height", d => {
				const s = display.yScale(0);
				const v = val(d, d.dim, c.mode, c.year);
				return Math.abs(display.yScale(0) -
				display.yScale(
					val(d, d.dim, c.mode, c.year)))});
	}

	onExitTrans (display) {
		this.duration(1000)
			.attr("x", display.axisWidth)
			.style("fill-opacity", "0")
			.remove();
	}

	setListeners (display, disable = false) {
		this.on("mouseover", disable ? null :
				d => display.mouseOver(d, d3.event.target))
			.on("mouseout", disable ? null :
				d => display.mouseOut(d, d3.event.target))
			.on("click", disable ? null :
				d => display.click(d));
	}

	highlight (index, highlight = true) {

	//	c.destroy();
		const transition = this.container.transition().duration(150);
		const bars = this.container.selectAll(".bar-rect");
		const labels = this.labelsCon.selectAll(".axis-label");
		const dimColor = getItemColor();
		const duration = 100,
			  hi = this.hi,
			  lo = this.lo;

		const o = this.lop;
		let delay, durationOut = duration;
		if (highlight)
			delay = 0;
		else {
			delay = 1000;
			durationOut = 500;	// longer transtion on mouseout
		}

		labels.transition().duration(durationOut).delay(delay)
			.style("opacity", !highlight ? hi * o : lo * o)
			.style("font-weight", "normal");
		bars.transition(this.selection=='n' ? "general" : null)
			.duration(durationOut).delay(delay)
			.style("opacity", !highlight ? hi : lo);

		if (highlight && (index != this.selection)) {
			const bar = bars.filter(d => d.id==index);
			const highDuration = duration;
			bar.transition("highlight-index").duration(highDuration)
				.style("opacity", "1.0");
			const label = labels.filter(d => d.id==index);
			label.transition().duration(0)
				.style("opacity", hi);
		}
		const selectionBar = bars.filter(d => d.id==this.selection);
		selectionBar.transition().duration(duration)
			.style("opacity", hi);
	//		.style("fill", "white");
		const selectionLabel = labels.filter(d => d.id==this.selection);
		selectionLabel.transition().duration(duration)
			.style("opacity", hi)
			.style("font-weight", "bold");
	}

	click (d) {
		this.selection = d.id;
		this.highlight(d.id);
		this.props.callbacks.click(d);
	}

	mouseOver (d, target) {
		if (d == null)
			return;
		let bar;
		if (target instanceof HTMLSpanElement) {
			const first = firstDim(	this.props.openDimensions,
									this.props.year);
			d = Object.create(d);
			d.dim = first;
			const selection = this.container
					.selectAll(".bar-rect")
					.filter(
						b => b.id==d.id && b.dim==first);
			bar = selection.node();
		} else
			bar = target;

		if (d.id!=this.selection)
			this.highlight(d.id);

		this.props.callbacks.mouseOver(d, bar);
	}

	mouseOut (d) {
		if (d == null)
			return;
		// this.c.levelContainer.selectAll(".tooltip")
		// 	.classed("hidden-delay", true);
		if (this.props.selection == 'n')
			this.highlight(d.id, false);
		else
			this.highlight(this.props.selection);

		this.props.callbacks.mouseOut(d)
	}

	render() {
		return (
			<g className = 'barscon'
				id = {'barscon-' + this.props.level}
				ref = { node => this.node = node}
			/>
		);
   }
}
