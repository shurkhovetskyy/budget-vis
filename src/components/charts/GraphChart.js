import React, { Component } from 'react';

import Chart from './Chart';
import { View, Mode, Sort, Action, Interaction } from '../../config/options';
import { getItemColor } from '../../utils';
import Styles from '../../config/styles';
import { val } from '../../utils/val';

import CONFIG from '../../config/settings';

export default class GraphChart extends Chart {

	constructor(props) {
		super(props);

		this.xScale = d3.scale.ordinal();
		this.xScaleGraph = d3.scale.linear();
		this.xAxis = d3.svg.axis().scale(this.xScaleGraph);

		this.line = d3.svg.line()
		//	.interpolate("cardinal")
			.x(d => this.xScaleGraph(d.year))
			.y(d => this.yScale(d.value));

		this.pathData = {};
		this.bandLimit = 16;

		this.association = View.TIME;
	}

	componentDidUpdate (prevProps) {
		this.container =	this.container ||
							d3.select("#graphcon-" + this.props.level);

		this.axisWidth = this.props.width - Styles.axisWidthShift;
		this.graphWidth = this.axisWidth - Styles.rightPadding;

		this.labelsCon = this.labelsCon || d3.select("#labelscon-graph-" + this.props.level);

		this.action = this.props.action;

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
			return;
		}
		super.componentDidUpdate(prevProps);
	}

	addDimension (dim) {
		if (!this.handleState.call(this, dim))
			return;
		if (this.active) {
			this.props.openDimensions.forEach(
				d => this.renderDimension(d));
		} else
			this.renderDimension(dim);
	}

	removeDimension (dim) {
		this.minimizeItems(this.container
			.select("#path-" + this.props.level + "-" + dim)).remove();

		this.minimizeItems(this.container
			.selectAll("circle.dim-" + dim)).remove();

		// Update remaining paths and points.
		if (this.active) {
			if (this.noData || !this.dataAvailable()) {
				// update the noDataMessage and exit.
				this.noDataMessage();
			} else {
				this.updateYScale();
				this.setAxis();
				this.props.openDimensions.forEach(
					d => this.renderDimension(d));
			}
		}
	}

	renderDimension (dim) {
		if (!this.dimAvailable(dim))
			return;
		const _this = this;
		const data = this.getPathData(dim);
		const id = this.props.level + "-" + dim;

		let path = this.container.select("#path-" + id);
		let points = this.container.selectAll("circle")
						.filter(".dim-" + dim)
						.data(data);
		// If path being built for the first time...
		if (!path.empty()) {
			path.transition().duration(1000)
				.attr("d", this.line(data))
				.style("opacity", 1);

			points.transition().duration(1000)
				.attr("cy", (d) => this.yScale(d.value))
				.style("opacity", 1);
			if (this.action == Action.RESIZE)
				points.transition("x").duration(1000)
					.attr("cx", d => this.xScaleGraph(d.year));
			// Keep to bring opacity back after fast display switch.
			//	if (!this.chartSet) {
			// 		path.transition().style("opacity", 1);
			//		points.transition().style("opacity", 1);
			//	}
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
	}

	minimizeItems (items = null, duration = 1000) {
		items = items || this.container.selectAll('.path, .point');
		const trans = items.transition().duration(duration);
		trans.style("opacity", 0);
		return trans;
	}

	/*
	*	Returns sums for all years available for specified dimension
	*	necessary to draw the graph.
	*/
	getPathData (dim) {
		if (![Action.MODE, Action.YEAR, Action.UPDATE, Action.ADD]
				.includes(this.action)
			&& this.pathData.hasOwnProperty(dim)) {
				return this.pathData[dim];
			}

		const years = CONFIG.dimYears[dim];
		const data = years.map(y => ({
			value:
			//	d3.sum(this.data.map(
			//		item => val(item, dim, this.props.mode, y))),
				this.getYearValue(dim, y),
			dim: dim,
			year: y
		}));
		this.pathData[dim] = data;
		return data;
	}

	getDimensionData (dim) {
		return CONFIG.years;
	}

	getYearValue (dim, year) {
		const dimData = this.props.data[this.props.mode][dim];
		const item = dimData.filter(d => Object.values(d).includes(year));

		return item.shift().value;
	}

	buildPath = function (dim, data) {
		const _this = this;
		const path = this.container.append("path")
			.attr("d", this.line(data))
			.attr("stroke", getItemColor(dim))
			.attr("class", "path dim-" + dim)
			.attr("id", "path-" + this.props.level + "-" + dim);
		const tl = path.node().getTotalLength();
		path.attr("stroke-dasharray", tl)
			.attr("stroke-dashoffset", tl);
		return path;
	}

	buildPoints (p, dim) {
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
	}

	placePoint (display) {
		this.attr("cx", d => display.xScaleGraph(d.year))
			.attr("cy", d => display.yScale(d.value));
	}

	dimAvailable (dim) {
		return CONFIG.dimYears[dim].length > 0;
	}

	getLabels () {
		return CONFIG.years;
	}

	getLabelX (i) {
		const band = this.xScale.rangeBand();
		let x = i * band + this.xScale.range()[0];
	//	x = x - 15;
		return x;
	}

	updateXScale () {
		const y = CONFIG.years;
		this.xScale.domain(d3.range(y.length-1));
		this.xScaleGraph.domain([y[0], y[y.length-1]]);
	}

	updateYScale () {
		const max = this.getShownMax(),
			  min = this.getShownMin();

		this.yScale.domain([min, max]);
		this.yAxis.scale(this.yScale);
	}

	updateXScaleRange () {
		const range = [Styles.leftPadding, this.graphWidth];
		this.xScale.rangeRoundBands(range, 0.0);
		this.xScaleGraph.range(range, 0.1);
	}

	// Gets highest value across all visisble dimensions.
	getShownMax () {
		const availableDims = this.props.openDimensions.filter(
			dim => CONFIG.dimYears[dim].length > 0);

		const max = Math.max.apply(null, availableDims.map(
			dim => d3.max(this.props.data[this.props.mode][dim].map(
				item => item.value
			)))
		);

		//console.log("Max: " + max);
		return max;
	}

	// Gets minimum value across all visible dimensions.
	getShownMin = function () {
		const availableDims = this.props.openDimensions.filter(
			dim => CONFIG.dimYears[dim].length > 0);

		const min = Math.min.apply(null, availableDims.map(
			dim => d3.min(this.props.data[this.props.mode][dim].map(
				item => item.value
			)))
		);
		//console.log("Min: " + min);
		return min;
	}

	setListeners (display) {
		this.on("mouseover", d => display.mouseOver(d, d3.event.target))
			.on("mouseout", d => display.mouseOut(d))
			.on("click", d => display.props.callbacks.click(d))
			;
	}

	mouseOver (d, target) {
		const circles = this.container.selectAll("circle");
		circles.filter(".year-" + d)
				.attr("fill-opacity", 0.5)
				.attr("r", 10);

		const labels = this.labelsCon.selectAll(".axis-label");
		labels.transition().duration(100)
			.style("opacity", 0.4 * this.lop);

		d3.select(target).transition().duration(100)
			.style("opacity", 1);

		this.props.callbacks.mouseOver(d);
	}

	mouseOut (d) {
		const p = this.container.selectAll("circle")
						.filter(".year-" + d)
						.transition("out").duration(250)
						.attr("fill-opacity", 1)
						.attr("r", 5);

		const labels = this.labelsCon.selectAll(".axis-label");
		labels.transition().duration(500).delay(1000)
			.style("opacity", 1 * this.lop);

		this.props.callbacks.mouseOut(d);
	}

	render() {
		return (
			<g className = 'graphcon'
				id = {'graphcon-' + this.props.level}
				ref = { node => this.node = node}
			/>
		);
   }
}
