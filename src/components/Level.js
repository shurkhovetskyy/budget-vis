import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import ControlPanel from './controls/ControlPanel';
import BarChart from './charts/BarChart';
import GraphChart from './charts/GraphChart';
import { Axis, Labels } from './charts/elements';

import ListPanel from './dimensions/ListPanel';
import LevelHeader from './LevelHeader';
import Tooltip from './Tooltip';

import { View, Action, TooltipOpts } from '../config/options';
import { adjustFontSize, getLevelColor } from '../utils/';

import { Help } from '../config/text';
import store from '../config/store';
import Styles from '../config/styles';
import * as actions from '../actions/';
import * as interaction from '../actions/interaction';

import CONFIG from '../config/settings.json';

export default class Level extends React.Component {
	constructor(props) {
		super(props);

		this.controlActions = {
			view: (arg) => this.setView(arg),
			mode: (arg) => this.setMode(arg),
			year: (arg) => this.setYear(arg),
			sort: (arg) => this.setSort(arg)
		};

		this.listActions = {
			add: (arg) => this.addDimension(arg),
			remove: (arg) => this.removeDimension(arg),
			mouseOver: (d, target) => this.props.dispatch(
				interaction.stacksMouseOver(d, target, this.props.level)),
			mouseOut: () => this.props.dispatch(
				interaction.stacksMouseOut(this.props.level)),
			helpClick: (target, name) => this.listHelpClick(target, name),
			helpOut: () => this.props.dispatch(interaction.helpMouseOut(
				this.props.level))
		}

		this.graphActions = {
			mouseOver: (arg) => this.graphMouseOver(arg),
			mouseOut: (arg) => this.graphMouseOut(arg),
			click: (arg) => this.openYear(arg)
		}

		this.barActions = {
			mouseOver: (d, target) => this.barMouseOver(d, target),
			mouseOut: (arg) => this.barMouseOut(arg),
			click: (arg) => this.openLevel(arg)
		}
	}

	componentDidMount () {
		this.nameBox = d3.select("#selection-name-" + this.props.level)
		this.nameBox.node().innerHTML = this.levelName();
		adjustFontSize(this.nameBox.node());
		this.nameBox.transition().duration(750).style("opacity", 1);

		d3.select("#level-" + this.props.level)
			.transition()
			.duration(500)
			.style("opacity", 1);
	}

	componentDidUpdate (prevProps) {
		if ([Action.UPDATE, Action.RESIZE].includes(this.props.action)) {
			const trans = this.nameBox.transition("hide").duration(250);
			trans.style("opacity", 0);
			trans.each("end", () => {
				this.nameBox.node().innerHTML = this.levelName();
				adjustFontSize(this.nameBox.node());
			});
			trans.transition("reveal").duration(500).style("opacity", 1);
		} else if ([Action.ACTIVATE, Action.YEAR].includes(this.props.action)) {
			this.nameBox.select('span').node().innerHTML = this.props.year;
		}
	}

	levelName() {
		let html = this.props.name;
		html += ' <span>' + this.props.year + '</span>';
		return html;
	}

	// Control Panel

	setView (view) {
		this.props.dispatch(actions.setView(view, this.props.level));
		this.props.navigate();
	}

	setMode (mode) {
		this.props.dispatch(actions.setMode(mode, this.props.level));
		this.props.navigate();
	}

	setSort (sort) {
		this.props.dispatch(actions.setSort(sort, this.props.level));
		this.props.navigate();
	}

	setYear (year) {
		this.props.dispatch(actions.setYear(year, this.props.level));
		this.props.navigate();
	}

	// List Panel

	addDimension (dim) {
		this.props.dispatch(actions.addDimension(dim, this.props.level));
		this.props.navigate();
	}

	removeDimension (dim) {
		this.props.dispatch(actions.removeDimension(dim, this.props.level));
		this.props.navigate();
	}

	// Graph chart actions

	graphMouseOver(year) {
		this.props.dispatch(interaction.graphMouseOver(year, this.props.level));
	}

	graphMouseOut(year) {
		this.props.dispatch(interaction.graphMouseOut(year, this.props.level));
	}

	openYear (year) {
		this.props.dispatch(interaction.openYear(year, this.props.level));
		this.props.navigate();
	}

	// Bar chart actions

	barMouseOver(d, target) {
		this.props.dispatch(interaction.barMouseOver(d, target, this.props.level));
	}

	barMouseOut(bar) {
		this.props.dispatch(interaction.barMouseOut(bar, this.props.level));
	}

	openLevel (parent) {
		this.props.dispatch(interaction.openLevel(parent, this.props.level));
		this.props.navigate();
	}

	listHelpClick (target, name) {
		const entry = target.closest(".dim-entry");
		const x = this.props.width - Styles.widthRight;
		const y = helpY[name] + entry.offsetTop;

		this.props.dispatch(interaction.helpClick(
			x, y,
			TooltipOpts.RIGHT,
			Help[CONFIG.lang][name],
			this.props.level
		))
	}

	shouldComponentUpdate (nextProps) {
		if (nextProps.mark != this.props.mark)
			return true;
		if (nextProps.width != this.props.width)
			return true;

		return false;
	}

	render () {
		const level = this.props.level;
		return (
			<div id = {'level-' + level} className = 'levelcon'
				style = {{backgroundColor: getLevelColor(level)}}>
				<ControlPanel {...this.props}
					actions = {this.controlActions}
					dispatch = {this.props.dispatch}
				/>
				<div id = {'left-' + level}
					className = 'sidediv leftcon' >
					<LevelHeader level = {level}
								name = {this.props.name}
								view = {this.props.view}
								year = {this.props.year}
					/>
					<svg id = {'chart-' + level}
						className = {'chartcon chart-' + level} >

						<Axis level = {level}/>
						<g id = {'main-' + level}
							className = 'maincon'
							transform = {'translate(' + Styles.leftMargin + ', 0)'}>
							<GraphChart {...this.props}
								action = {this.props.action}
								callbacks = {this.graphActions}
								width = {this.props.width}
								data = {this.props.data[View.TIME]}
							/>
							<BarChart {...this.props}
								action = {this.props.action}
								callbacks = {this.barActions}
								width = {this.props.width}
								data = {this.props.data[View.CATS]}
							/>
						</g>
					</svg>

					<Labels level = {level}/>
					<div id = {'nodata-' + level} className = 'nodata' />
				</div>
				<ListPanel {...this.props}
					callbacks = {this.listActions}
					action = {this.props.action}
				/>
				<Tooltip {...this.props}
					action = {this.props.action}
					x = {this.props.tooltip.x}
					y = {this.props.tooltip.y}
					type = {this.props.tooltip.type}
					direction = {this.props.tooltip.direction}
					width = {this.props.width}
				/>
			</div>
		);
	}
}

const helpY = {
	'fig': 41,
	'stack': 62
}
