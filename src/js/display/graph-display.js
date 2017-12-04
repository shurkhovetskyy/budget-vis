/*jshint esversion: 6 */

import Display from './display';
import { val } from '../utils';
import { Action, View } from '../ui/ui-state';
import { Styles, getItemColor } from '../ui/styling';

const CONFIG = require('../../../config.json');

export default function GraphDisplay (chart) {
	Display.call(this, chart);

	this.xScale = d3.scale.ordinal();
	this.xScaleGraph = d3.scale.linear();
	this.xAxis = d3.svg.axis().scale(this.xScaleGraph);

	this.graphContainer = this.container;
	this.graphContainer
		.attr("class", "graphcon")
		.attr("id", "graphcon-" + this.c.level);
	this.labelsCon.attr("id", "labelscon-graph-" + chart.level);

	this.line = d3.svg.line()
	//	.interpolate("cardinal")
		.x(d => this.xScaleGraph(d.year))
		.y(d => this.yScale(d.value));

	// this.labelsText = this.years;
	// this.fillLabels();
	// this.max = null;
	// this.min = null;
	this.pathData = {};
	this.bandLimit = 16;
}

GraphDisplay.prototype = Object.create(Display.prototype);

GraphDisplay.prototype.minimizeItems = function (	items = null,
													duration = 1000) {
	items = items || this.graphContainer.selectAll('.path, .point');
	const trans = items.transition().duration(duration);
	trans.style("opacity", 0);
	return trans;
};

GraphDisplay.prototype.renderDimension = function (dim) {
	const _this = this;
	const data = this.getPathData(dim);
	const id = this.c.level + "-" + dim;

	let path = this.graphContainer.select("#path-" + id);
	let points = this.graphContainer.selectAll("circle")
					.filter(".dim-" + dim)
					.data(data);
	// If path being built for the first time...
	if (!path.empty()) {
		path.transition().duration(1000)
			.attr("d", this.line(data));

		points.transition().duration(1000)
			.attr("cy", (d) => this.yScale(d.value));
		if (this.c.action == Action.RESIZE)
			points.transition("x").duration(1000)
				.attr("cx", d => this.xScaleGraph(d.year));
		// Keep to bring opacity back after fast display switch.
		if (!this.chartSet) {
			path.transition().style("opacity", 1);
			points.transition().style("opacity", 1);
		}
	} else {
		path = this.buildPath(dim, data);
		const tl = path.node().getTotalLength();
		path.transition("line")
			// .delay(350)
			.duration(1500)
			.attr("stroke-dashoffset", 0)
			// Keep to avoid graph shortening.
			.transition()
			.attr("stroke-dasharray", tl * 10);

		points = this.buildPoints(points, dim);
		points.transition("points")
			.delay((d, i) => i / CONFIG.years.length * 1000)
			.duration(1000)
			.style("opacity", 1);
	}
};

GraphDisplay.prototype.updateData = function () {
	//this.setAxis(true, true, true);

	Display.prototype.updateData.call(this);
};

GraphDisplay.prototype.removeDimension = function (dim) {
	this.minimizeItems(this.graphContainer
		.select("#path-" + this.c.level + "-" + dim)).remove();

	this.minimizeItems(this.graphContainer
		.selectAll("circle.dim-" + dim)).remove();

	// Update remaining paths and points.
	if (this.active) {
		this.updateYScale();
		this.setAxis();
		this.c.shownDimensions.forEach(
			d => this.renderDimension(d));
	}
};

/*
*	Returns sums for all years available for specified dimension
*	necessary to draw the graph.
*/
GraphDisplay.prototype.getPathData = function (dim) {
	if (![Action.MODE, Action.YEAR, Action.UPDATE]
			.includes(this.c.action)
		&& this.pathData.hasOwnProperty(dim)) {
			return this.pathData[dim];
		}

	const years = CONFIG.dimYears[dim];
	const data = years.map(y => ({
		value: d3.sum(this.dataset.map(
			item => val(item, dim, this.c.mode, y))),
		dim: dim,
		year: y
	}));
	this.pathData[dim] = data;
	return data;
};

GraphDisplay.prototype.buildPath = function (dim, data) {
	const _this = this;
	const path = this.graphContainer.append("path")
		.attr("d", this.line(data))
		.attr("stroke", getItemColor(dim))
		.attr("class", "path dim-" + dim)
		.attr("id", "path-" + this.c.level + "-" + dim);
	const tl = path.node().getTotalLength();
	path.attr("stroke-dasharray", tl)
		.attr("stroke-dashoffset", tl);
	return path;
};

GraphDisplay.prototype.buildPoints = function (p, dim) {
	const _this = this;
	p.enter()
		.append("circle")
		.attr("r", 5)
		.attr("fill", getItemColor(dim))
		.attr("class",
			d => ("point dim-" + d.dim + " year-" + d.year))
		.style("opacity", 0)
		.call(function () {
			_this.placePoint.call(this, _this); });
	return p;
};

GraphDisplay.prototype.getLabels = function () {
	return CONFIG.years;
};

GraphDisplay.prototype.getDimensionData = function (dim) {
	return CONFIG.years;
};

GraphDisplay.prototype.addDimension = function (dim) {
	if (this.active) {
		this.setAxis(false, true);	// RETURN.
		this.c.shownDimensions.forEach(
			d => this.renderDimension(d));
	} else
		this.renderDimension(dim);
};

GraphDisplay.prototype.updateXScale = function () {
	const y = CONFIG.years;
	this.xScale.domain(d3.range(y.length-1));
	this.xScaleGraph.domain([y[0], y[y.length-1]]);
};

GraphDisplay.prototype.updateYScale = function () {
	const max = this.getShownMax(),
		  min = this.getShownMin();

	this.yScale.domain([min, max]);
	this.yAxis.scale(this.yScale);
};

GraphDisplay.prototype.updateXScaleRange = function () {
	const range = [Styles.leftPadding, this.c.graphWidth];
	this.xScale.rangeRoundBands(range, 0.0);
	this.xScaleGraph.range(range, 0.1);
};

GraphDisplay.prototype.getLabelX = function (i) {
	const band = this.xScale.rangeBand();
	let x = i * band + this.xScale.range()[0];
//	x = x - 15;
	return x;
};

// Gets highest value across all visisble dimensions.
GraphDisplay.prototype.getShownMax = function () {
	const max = Math.max.apply(null, this.c.shownDimensions.map(
		dim => d3.max(CONFIG.dimYears[dim].map(y => d3.sum(
			this.dataset.map(
				item => val(item, dim, this.c.mode, y)))))));
//	console.log("Max: " + max);
	return max;
};

// Gets minimum value across all visible dimensions.
GraphDisplay.prototype.getShownMin = function () {
	const min = Math.min.apply(null, this.c.shownDimensions.map(
		dim => d3.min(CONFIG.dimYears[dim].map(y => d3.sum(
			this.dataset.map(
				item => val(item, dim, this.c.mode, y)))))));
//	console.log("Min: " + min);
	return min;
};

GraphDisplay.prototype.placePoint = function (display) {
	this.attr("cx", d => display.xScaleGraph(d.year))
		.attr("cy", d => display.yScale(d.value));
};

GraphDisplay.prototype.setListeners = function (display) {
	this.on("mouseover", d => display.mouseOver(d, d3.event.target))
		.on("mouseout", d => display.mouseOut(d, d3.event.target))
		.on("click", d => display.click(d));
};

GraphDisplay.prototype.mouseOver = function (d, item) {
	this.c.listPanel.setYear(d);
	this.c.listPanel.figuresShow(true);
	this.c.listPanel.setFigures(d);

	const circles = this.graphContainer.selectAll("circle");

	circles.filter(".year-" + d)
			.attr("fill-opacity", 0.5)
			.attr("r", 10);

	const labels = this.labelsCon.selectAll(".axis-label");
	labels.transition().duration(100)
		.style("opacity", 0.4 * this.lop);

	d3.select(item).transition().duration(100)
		.style("opacity", 1);
	// const i = (this.c.dataset.map (r => r.id)).indexOf(d.id);
	// this.tooltip(d, i);
	// if (d.id==this.c.selected)
	// 	return;
	// this.setBarState(d.id, 0.7, 100);
};

GraphDisplay.prototype.mouseOut = function (d, item) {
	if(!this.active) return;
	this.c.listPanel.setYear(null);
	this.c.listPanel.figuresHide(true);

	const p = this.graphContainer.selectAll("circle")
					.filter(".year-" + d)
					.transition().duration(250)
					.attr("fill-opacity", 1)
					.attr("r", 5);

	const labels = this.labelsCon.selectAll(".axis-label");
	labels.transition().duration(500).delay(1000)
		.style("opacity", 1 * this.lop);
};

GraphDisplay.prototype.click = function (y) {
	this.c.year = y;
	this.c.yearSelect.node().value = y;
//	this.c.updateStackedCharts();
	this.c.setDisplay(View.CATS);
};

GraphDisplay.prototype.highlight = function () {

};
