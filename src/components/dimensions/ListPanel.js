import React, { Component } from 'react';
import classNames from 'classnames';

import {
	ListAux,
	ListDesc,
	ListRemove,
	ListEntry
} from './elements';

import { Action, View, Mode, Interaction } from '../../config/options';

import { val, getTimeArray } from '../../utils/val';

import CONFIG from '../../config/settings.json';

export default class ListPanel extends React.Component {
	constructor (props) {
		super(props);
		this.first = true;
		this.maxDimSum = 0;
	}

	shouldComponentUpdate (nextProps) {
		if ([	Action.YEAR,
				Action.ADD,
				Action.REMOVE,
				Action.ACTIVATE,
				Action.MODE,
				Action.UPDATE,
				Interaction.GRAPH_OVER,
				Interaction.GRAPH_OUT
			].includes(nextProps.action))
				return true;

		return false;
	}

	componentDidMount () {
		this.first = false;
	}

	handleAdd (e, dim) {
		const removeClick = (d3.select(e.target).classed("dim-remove"));
		const open = this.props.openDimensions.includes(dim);
		if (open || removeClick)
			return;
		this.props.callbacks.add(dim);
	}

	handleRemove (e, dim) {
		const len = this.props.openDimensions.length;
		if (len == 1)
			return;
		this.props.callbacks.remove(dim);
	}

	calculateSum (dim, year) {
		if (!this.props.openDimensions.includes(dim))
			return 0;

		if (CONFIG.hasOwnProperty("dimYears")) {
			if (!CONFIG.dimYears[dim].includes(year))
				return 0;
		}

		let sum;
		if (this.props.view == View.TIME) {
			if (this.props.data[View.TIME].length == 0)
				return 0;
			// let data = this.props.data;
			// data = data[View.TIME]
			// data = getTimeArray(data, this.props.mode, dim);
			// data = data.filter(d => Object.values(d).includes(this.props.year));
			// sum = data.shift().value;
			let item = this.props.data
							[View.TIME]
							[this.props.mode]
							[dim];
			item = item.filter(d => Object.values(d).includes(year));
			sum = item.shift().value;
		} else if (this.props.view == View.CATS) {
			if (this.props.data[View.CATS].length == 0)
				return 0;
			sum = d3.sum(this.props.data[this.props.view]
				.map(item => val(
						item,
						dim,
						this.props.mode,
						year
				)));
		}
		return sum;
	}

	/*
	*	Returns true if max of stacked chart changes.
	*/
	getMax () {
		if (this.props.stackedData.length == 0)
			return 0;
		// Set domain to be sum of stacks of largest chart.
		const sd = this.props.openDimensions,
			  sds = this.props.stackedData,
			  c = this.props,
			  oldMax = this.maxDimSum;
		const maxSum = Math.max.apply(null,
				sd.map(dim => Math.abs(sds.map(d =>
					val(d, dim, c.mode, c.year))
						.reduce((a, b) => a + b))));
		this.maxDimSum = maxSum;
	//	this.stackScale = d3.scale.linear().domain([0, maxSum]);
	//	return maxSum != oldMax;
		return maxSum;
	}

	render() {
		const dims = Array.from(CONFIG.dimensions);
		let openDims = this.props.openDimensions;
		if (this.first)
			openDims = [];

		const l = this.props.level;
		let year = this.props.displayYear;
		let stacksVisible = false;
		let figsVisible = true;
		let delayHide = false;
		let instantShow = false;
		if (this.props.view == View.CATS) {
			year = this.props.year;
		//	this.first = false;
			if (this.props.mode!=Mode.BAL)
				stacksVisible = true;

		} else if (this.props.view == View.TIME) {
			if (this.props.action == Interaction.GRAPH_OVER) {
				instantShow = true;
			} else { //if (this.props.action == Interaction.GRAPH_OUT) {
				delayHide = true;
				figsVisible = false;
				if(this.props.action == Action.ACTIVATE)
					year = this.props.year;
			}
		}

		const maxSum = this.getMax();

		return (
			<div className = 'sidediv rightcon' id = {'right-' + l}>
				<div className = 'dimcon' id = {'dimcon-' + l}>
					<div className = 'dim-list' id = {'dim-list-' + l}>
						{dims.map((dim, i) =>
							<ListEntry
								dim = {dim}
								year = {year}
								maxSum = {maxSum}
								mode = {this.props.mode}
								stackedData = {this.props.stackedData}
								figsVisible = {figsVisible}
								stacksVisible = {stacksVisible}
								instantShow = {instantShow}
								delayHide = {delayHide}
								openDimensions = {openDims}
								last = {i == (dims.length - 1)}
								value = {this.calculateSum(dim, year)}
								level = {l}
								add = {(e) => this.handleAdd(e, dim)}
								remove = {(e) => this.handleRemove(e, dim)}
								callbacks = {this.props.callbacks}
								key = {dim}
								first = {this.first}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}

}
