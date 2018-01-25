import React, { Component } from 'react';
import classNames from 'classnames';

import { Action, View, Mode, Interaction } from '../../config/options';
import { val } from '../../utils/val';

import {
	getStackItemColor,
	getItemColor
} from '../../utils';

import Styles from '../../config/styles';

import CONFIG from '../../config/settings.json';

export default class StackedChart extends Component {

	constructor(props) {
		super(props);

		this.dimCon = null;

		// Stack charts' scales.
		this.stackScales = [];
		this.figsVisible = true;

		this.active = false;
	}

	shouldComponentUpdate (nextProps) {
		const open = nextProps.openDimensions.includes(this.props.dim)
					&& nextProps.stacksVisible;
		if (open != this.active) {
			this.active = open;
			return true;
		}

		if (nextProps.maxSum != this.props.maxSum)
			return true;

		return false;
	}

	componentDidUpdate () {
		this.dimCon = this.dimcon || d3.select("#dimcon-" + this.props.level);

		if (!this.active) {
			const stackscon = d3.select("#stackscon-" + this.props.id);
		//	stackscon.select("#stacks-" + this.props.id).remove();
		} else {
			this.stackScale = d3.scale.linear().domain([0, this.props.maxSum]);
			this.renderDimension(this.props.dim);
		}
	}

	renderDimension (dim) {
		if (this.props.mode == Mode.BAL)
			return;
		const sds = this.props.stackedData,
			  c = this.props,
			  id = this.props.level + "-" + dim,
			  di = CONFIG.dimensions.indexOf(dim),
			  desc = this.dimCon.select("#dim-desc-" + id),
			  sc = desc.select("#stackscon-" + id);
		let sg = sc.select("#stacks-" + id);
		if (sg.empty()) {
			sg = sc.append("g")
				.attr("class", "stacks")
				.attr("id", "stacks-" + id);
		}

		const filtered = sds.filter(d =>
			Math.abs(val(d, dim, c.mode, c.year)) != 0);
		// Each stack is at least one pixel wide even though
		// some stacks normally would not even be visible
		// due to small values. So subtract number of stacks from
		// regular range to account for extra width of each stack.
		this.stackScale.rangeRound([0, Styles.stackWidth], 0.0);

		//	const rd = filtered.map (d => (Object.assign({dim: dim}, d)));
		const layers = d3.layout.stack()
			.y (d => d.x)
			.out((d, y0, y) => { d.x0 = y0, d.y = 0 })(
				filtered.map(d => [dim].map(dimension =>
					Object.assign(
						{ dim: dim,
							x: Math.abs(val(d, dim, c.mode, c.year))
						}, d))))
			.map(d => d[0]);
		const len = layers.length;
		const stacks = sg.selectAll("rect").data(layers);
		stacks.enter().append("rect")
						.attr("class", "stacked-rect")
						.attr("width", 0)
						.attr("height", Styles.stackHeight)
						.attr("fill", (d, i) => getStackItemColor(i))
						.attr("x", -len)
						.attr("index", (d, i) => i)
						.style("opacity", 0);

		stacks.transition ()
			.duration (1000)
			.attr("width", d => this.stackScale(d.x) + 1)
			.attr("x", d => this.stackScale(d.x0))
			.style("opacity", 1);

		stacks.exit()
			.transition()
			.duration (1000)
			.attr("width", 0)
			.attr("x", Styles.widthRight)
			.style("opacity", 0)
			.remove();

		stacks	.on("mouseover", d => this.handleMouseOver(d, d3.event.target))
		 		.on("mouseout", d => this.handleMouseOut(d, d3.event.target));
	}

	handleMouseOver (d, target) {
		const id = this.props.level + '-' + d.dim;
		const con = this.dimCon.select("#stackscon-" + id)
		const stack = con	.selectAll(".stacked-rect")
							.filter(s => s.id == d.id);
		stack.attr('fill', getItemColor(d.dim));
		this.props.callbacks.mouseOver(d, target);
	}

	handleMouseOut (d, target) {
		// const id = this.props.level + '-' + d.dim;
		// const con = this.dimCon.select("#stackscon-" + id)
		// const stack = con	.selectAll(".stacked-rect")
		// 					.filter(s => s.id == d.id);

		const stack = d3.select(target);
		const index = parseInt(stack.attr("index"));
		stack.attr('fill', getStackItemColor(index))

		this.props.callbacks.mouseOut();
	}

	render () {
		return (
			<svg id = {'stackscon-' + this.props.id}
				className = {
					classNames({
						'stackscon': true,
						'hidden': !this.props.stacksVisible || !this.active
					})
				}
			/>
		);
	}
}
