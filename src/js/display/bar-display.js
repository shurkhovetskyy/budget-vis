/*jshint esversion: 6 */

import Display from './display';
import { buildChart } from '../script';
import { val, firstDim } from '../utils';
import { Styles, getItemColor } from '../ui/styling';
import { Mode, Action, Sort } from '../ui/ui-state';
import { Tooltip } from '../tooltip';

export default function BarDisplay (chart) {
	Display.call(this, chart);

	this.xScale = d3.scale.ordinal();
	this._xGroup = d3.scale.ordinal();
	// this.updateXScale();
	// this.updateXScaleRange();

	this.xAxis = d3.svg.axis().scale(this.xScale);

	this.barsContainer = this.container;
	this.barsContainer	.attr("class", "barscon")
						.attr("id", "barscon-" + chart.level);

	this.labelsCon.attr("id", "labelscon-bar-" + chart.level);

	// this.labelsText = this.getLabels();
	this.selected = -1;
	this.sortMode = Sort.ABC;
	this.bandLimit = 14;
}

BarDisplay.prototype = Object.create(Display.prototype);

BarDisplay.prototype.setupChart = function () {
	if (!this.dataAvailable()) {
		this.noDataMessage();
		return;
	}
	Display.prototype.setupChart.call(this);
};

BarDisplay.prototype.minimizeItems = function (items = null, duration = 500) {
	items = items || this.barsContainer.selectAll('.bar-rect');
	const trans = items.transition().duration(duration);
	trans	.attr("y", this.yScale(0))
			.attr("height", 0);
	return trans;
};

BarDisplay.prototype.addDimension = function (dim, checkData = false) {
	// if display already active...
	if (this.active) {
		// and there is no data...
		if(this.noData) {
			// and new dimension data is also not available...
			if (!this.dataAvailable([dim])) {
				// update the noDataMessage and exit.
				this.setNoDataMessage();
				return;
			}
			// if data is now available, set up chart
			Display.prototype.setupChart.call(this, [dim]);
		}
		// and chart is set, then update axis to accomodate
		// new data from new dimension.
		else if (this.chartSet)
			this.setAxis(true, true);
	}

	this._xGroup.domain(d3.range(this.c.shownDimensions.length));

	// Select all existing bars to reduce their width.
	let bars = this.barsContainer
				.selectAll(".bar-rect")
				.filter(b => b.dim!=dim);
	if (this.chartSet && !bars.empty()) {
		const _this = this;

		bars.transition()
			.duration(500)
			.call(function () {
				_this.setBarsWidth.call(this, _this);
			 	_this.setBarsHeight.call(this, _this);
			});
	}

	this.renderDimension(dim);
	this.barsContainer.selectAll(".bar-rect")
			.filter(d => d.id==this.selected)
			.style("opacity", 1.0);
};

// Generates the bars and attaches data to them.
BarDisplay.prototype.buildBars = function (bars, dim) {
	console.log("buildBars");
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
		.attr("x", c.axisWidth - this.xScale.rangeBand())
		.attr("fill", getItemColor(dim))
		.style("fill-opacity", 0)
		.attr("dim", dim)
		.attr("class", "bar-rect level-" + c.level)
		.call(function() {
			_this.setListeners.call(this, _this); })
		.style("opacity", (d) => {
			if (this.c.action==Action.ADD && this.selected!=-1) {
				if (d.id == this.selected)	return hi;
				else 						return lo;
			}
		});

	bars.exit()
		.transition()
		.call(function () {
			_this.onExitTrans.call(this, _this); });
	return bars;
};

BarDisplay.prototype.updateXScaleRange = function (range) {
	this.xScale.rangeRoundBands([0, this.c.actWidth], 0.2);
	this._xGroup.rangeRoundBands([0, this.xScale.rangeBand()], 0);
};

BarDisplay.prototype.updateXScale = function () {
	this.xScale.domain(d3.range(this.c.fullData.length));
	this._xGroup.rangeRoundBands([0, this.xScale.rangeBand()], 0);
};

BarDisplay.prototype.updateYScale = function () {
	const c = this.c;
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
			c.mode = Mode.SPENDING;
			max = this.getShownMax();
			c.mode = Mode.REVENUE;
			min = this.getShownMin();
			c.mode = Mode.BAL;
		}
		this.yScale.domain([min, max]);
	}

	this.yAxis.scale(this.yScale);
};

BarDisplay.prototype.renderDimension = function (dim) {
	console.log("renderDimension - " + dim);
	let bars = this.barsContainer
				.selectAll(".bar-rect")
				.filter(b => b.dim == dim);
	let duration = 1000;
	const _this = this;
	const hi = 1.0;
	const lo = 0.4;
	if ([Action.ADD, Action.UPDATE].includes(this.c.action)) {
		bars = this.buildBars(bars, dim);
		if (this.c.action == Action.ADD) {
			bars.call(function () {
					_this.setBarsWidth.call(this, _this); })
				.attr("y", this.yScale(0))
				.attr("height", 0);
			duration = 500;
		}
	}

	const delay = 500;
	const offDelay = (this.chartSet ? 500 : 0);
	const dl = this.dataset.length;

	bars.transition()
		.delay((d, i) => {
			if (_this.c.action == Action.ADD)
				return (offDelay + (i / dl) * delay);
			return 0;
		})
		.duration(duration)
		.call(function () {
			if(_this.c.action!=Action.RESIZE)
				_this.setBarsHeight.call(this, _this);
			if ([Action.UPDATE, Action.RESIZE].includes(_this.c.action))
				_this.setBarsWidth.call(this, _this);
		});
};

BarDisplay.prototype.setDataset = function (_) {
	_.sort((a, b) => this.sortUtil(a, b));
	Display.prototype.setDataset.call(this, _);
};


BarDisplay.prototype.removeAll = function () {
	const bars = this.barsContainer.selectAll(".bar-rect");
	bars.transition().duration(500)
		.attr("y", this.yScale(0))
		.attr("height", 0)
		.remove();
};

BarDisplay.prototype.removeDimension = function (dim) {
	const stayingBars = this.barsContainer
			.selectAll(".bar-rect")
			.filter(b => this.c.shownDimensions.includes(b.dim));

	const goingBars = this.barsContainer
			.selectAll(".bar-rect").filter(b => b.dim == dim);

	this._xGroup.domain(d3.range(this.c.shownDimensions.length));
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

BarDisplay.prototype.getLabels = function () {
	return this.dataset.map(c => c.category);
};

BarDisplay.prototype.sortBars = function (dimension, sort = null) {
	const c = this.c,
		  sd = c.shownDimensions,
		  _this = this;

	this.sortMode = sort || this.sortMode;
	this.sortDim = c.shownDimensions[dimension];

	// let sortUtil = function (a, b) {
	// 	const c = _this.c;
	// 	if (_this.sortMode == Sort.NUM)
	// 		return d3.descending(	c.val(a, _this.sortDim),
	// 								c.val(b, _this.sortDim));
	// 	else if (_this.sortMode == Sort.ABC)
	// 		return d3.ascending(a.category, b.category);
	// };

	if (this.sortMode == Sort.NUM) {
		c.sortNumerical.classed("active-button", true);
		c.sortAlphabetical.classed("active-button", false);
	} else if (this.sortMode == Sort.ABC) {
		c.sortNumerical.classed("active-button", false);
		c.sortAlphabetical.classed("active-button", true);
	}

	this.dataset.sort((a, b) => this.sortUtil(a, b));

	// Sort bars.
	sd.forEach((dim, k) => {
		let bars = this.barsContainer.selectAll('rect')
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

// Gets highest value across all visisble dimensions.
BarDisplay.prototype.getShownMax = function () {
	const max = Math.max.apply(null, this.c.shownDimensions.map(
		dim => d3.max(this.dataset.map(d =>
			val(d, dim, this.c.mode, this.c.year)))));
	console.log("Max: " + max);
	return max;
};

// Gets minimum value across all visible dimensions.
BarDisplay.prototype.getShownMin = function () {
	const min = Math.min.apply(null, this.c.shownDimensions.map(
		dim => d3.min(this.dataset.map(d =>
			val(d, dim, this.c.mode, this.c.year)))));
	console.log("Min: " + min);
	return min;
};

BarDisplay.prototype.getDimensionData = function (dim) {
	const data = this.dataset.map(
		d => (Object.assign({dim: dim}, d)));
	return data;
};

BarDisplay.prototype.highlight = function (index, highlight = true) {
//	c.destroy();
	const transition = this.barsContainer.transition().duration(150);
	const bars = this.barsContainer.selectAll(".bar-rect");
	const labels = this.labelsCon.selectAll(".axis-label");
	const dimColor = getItemColor();
	const duration = 100,
		  hi = 1.0,
		  lo = 0.4;

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
	bars.transition(this.selected==-1 ? "general" : null)
		.duration(durationOut).delay(delay)
		.style("opacity", !highlight ? hi : lo);

	if (highlight && (index != this.selected)) {
		const bar = bars.filter(d => d.id==index);
		bar.transition("highlight-index").duration(duration)
			.style("opacity", "1.0");
		const label = labels.filter(d => d.id==index);
		label.transition().duration(duration)
			.style("opacity", hi);
	}
	const selectedBar = bars.filter(d => d.id==this.selected);
	selectedBar.transition().duration(duration)
		.style("opacity", hi);
//		.style("fill", "white");
	const selectedLabel = labels.filter(d => d.id==this.selected);
	selectedLabel.transition().duration(duration)
		.style("opacity", hi)
		.style("font-weight", "bold");
};



BarDisplay.prototype.mouseOver = function (d, target) {
	let bar;
	if (target instanceof HTMLSpanElement) {
		const first = firstDim(this.c.shownDimensions, this.c.year);
		d = Object.create(d);
		d.dim = first;
		const selection = this.barsContainer
			.selectAll(".bar-rect").filter(b =>
				b.id==d.id && b.dim==first);
		bar = selection.node();
	} else
		bar = target;

	const box = bar.getBBox();
	let x = box.x + box.width / 2;
	x = x + Styles.leftMargin + Styles.widthControlPanel;

	Tooltip.draw(d, x, Styles.tooltipY - 1, Tooltip.DOWN, this.c, false);

	if (d.id!=this.selected)
		this.highlight(d.id);
};

BarDisplay.prototype.mouseOut = function (d) {
	this.c.levelContainer.selectAll(".tooltip")
		.classed("hidden-delay", true);
	if (this.selected==-1)
		this.highlight(d.id, false);
	else
		this.highlight(this.selected);
};

BarDisplay.prototype.click = function (d) {
	const c = this.c;
	const index = (this.dataset.map (r => r.id)).indexOf(d.id);

	// const y = Styles.height + Styles.labelLength + Styles.bottomPadding,
	// 	  x = this.xScale(index) + this.xScale.rangeBand() / 2,
	// 	  points = (x + 20) + " " + (y)+ " " + (x - 20) +" " + (y)  +" "+ (x) + " "  + (y - 20);
	//	points = [10, 20, 30, 40, 50, 60];

	const svg = c.chartContainer;
	if (this.selected==-1) {

	} else
		this.highlight(this.selected, false);
	this.selected = d.id;
	this.highlight(this.selected);
	buildChart(	c.level + 1,
				c.fullData[d.id].values.data,
				d.category,
				c.year,
				c.shownDimensions);
};

BarDisplay.prototype.sortUtil = function (a, b) {
	const c = this.c;
	if (this.sortMode == Sort.NUM)
		return d3.descending(	val(a, this.sortDim, c.mode, c.year),
								val(b, this.sortDim, c.mode, c.year));
	else if (this.sortMode == Sort.ABC)
		return d3.ascending(a.category, b.category);
};

const Properties = (function () {
	const module = {};

	module.name = function () {

	};

	return module;
})();

/*
*	Methods which run on bar elements.
*/

BarDisplay.prototype.setBarsWidth = function (display) {
	console.log("barsWidth");
	const sd = display.c.shownDimensions;
	this.attr("width", display._xGroup.rangeBand())
		.attr("x", d => {
			const k = sd.indexOf(d.dim),
				  i = display.dataset.map(
					  item => item.data).indexOf(d.data),
				  r = display._xGroup(k);
			return display.xScale(i) + r;
		});
	};

BarDisplay.prototype.setBarsHeight = function (display) {
	console.log("barsHeight");
	const c = display.c;
	this.style("fill-opacity", 1)
		.attr("y", d => {
			// Add/subtract 1 pixel to keep short distance
			// between bars and axis.
			const v = val(d, d.dim, c.mode, c.year);
			if (v >= 0) return (display.yScale(v) - 1);
			else 		return (display.yScale(0) + 1);
		})
		.attr("height", d => Math.abs(display.yScale(0)
			- display.yScale(val(d, d.dim, c.mode, c.year))));
	};

BarDisplay.prototype.onExitTrans = function (display) {
	this.duration(1000)
		.attr("x", display.c.axisWidth)
		.style("fill-opacity", "0")
		.remove();
};

BarDisplay.prototype.getLabelX = function (i) {
	return this.xScale(i) + this.xScale.rangeBand() / 2;
};

BarDisplay.prototype.setListeners = function (display) {
	this.on("mouseover", d => display.mouseOver(d, d3.event.target))
		.on("mouseout", d => display.mouseOut(d))
		.on("click", d => display.click(d));
};
