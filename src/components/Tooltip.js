import React, { Component } from 'react';
import classNames from 'classnames';

import Styles from '../config/styles';

import { MoneyNum, MoneySign } from '../utils/';

import { val } from '../utils/val';

import {
	View,
	TooltipOpts
} from '../config/options';

import CONFIG from '../config/settings';

export default class Tooltip extends Component {
	constructor(props) {
		super(props);
		this.active = false;
		this.d = null;
	}

	componentDidUpdate () {
		const box = d3.select("#tooltip-" + this.props.level);
		if (box.empty())
			return;

		const boxWidth = box.node().offsetWidth;
		const boundary = this.props.width;
		let x = this.props.x - boxWidth / 2;
		let dx = x + boxWidth - boundary;
		x = x - Math.max(dx, 0);

		box.style("left", x);
	}

	render() {
		let d = this.props.highlight;

		if (d == null) {
			if (this.active) {
				d = this.d;
				this.active = false;
			} else {
				return null;
			}
		} else {
			this.active = true;
			this.d = d;
		}

		const direction = this.props.direction;
		let x = this.props.x;
		let y = this.props.y;
		const l = this.props.level;
		const value = val(d, d.dim, this.props.mode, this.props.year);

		// Arrow
		let ay, ty, up;
		if (direction == TooltipOpts.UP) {
			ay = y + Styles.arrowHeight;
			ty = ay ;
			up = true;
		} else if (direction == TooltipOpts.DOWN) {
			ay = y - Styles.arrowHeight;	// arrow y
			ty = ay - Styles.tooltipHeight - 3;	// tooltip y
			up = false;
		}

		const sumFun = (item) => Math.abs(
			val(item, d.dim, this.props.mode, this.props.year));

		const sum = d3.sum(this.props.data[View.CATS].map(sumFun));
		const percentage = Math.abs((value / sum * 100));
		const label = this.props.name;

		console.log("STACKS TIP:", this.props.x, x);

		return (
			<div id = {'toolcon-' + l} className = 'toolcon'>
				<div id = {'tooltip-' + l}
					className = {
						classNames({
							'tooltip box': true,
							'hidden-delay': !this.active
						})
					}
					style = {{
						top: ty,
						left: x
					}} >
					<div className = 'content'>
						<div className = 'title'>
							{d.category}
						</div>
						<div className = 'fig'>
							<div className = 'num'>
								{CONFIG.currency + MoneyNum(value)}
							</div>
							<div className = 'sign'>
								{MoneySign(value)}
							</div>
						</div>
						<div className = 'stats'>
							{d3.format(".1f")(percentage)} % of {label}
						</div>
						<div className = 'text'>

						</div>
					</div>
				</div>
				<div className = {
						classNames({
							'arrow': true,
							'tooltip': true,
							'hidden-delay': !this.active,
							'down': !up,
							'up': up
						})
					}
					style = {{
						top: ay,
						left: x - Styles.arrowHeight
					}}
					id = {'arrow-' + l} >

				</div>
			</div>
		);
	}
}
