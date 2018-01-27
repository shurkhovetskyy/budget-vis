import React from 'react';
import ReactDom from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

import Level from './Level';
import store from '../config/store';
import Styles from '../config/styles';
import {Action} from '../config/options';
import * as actions from '../actions/';
import { readYears, setDimYears, scroll } from '../utils/';

const CONFIG = require('../config/settings.json');

@connect ((store) => store)
export default class Board extends React.Component {
	constructor (props) {
		super(props);
		readYears();
	}

	componentDidMount() {
		window.addEventListener("resize",
			() => this.props.dispatch(actions.setWidth(calcWidth())));

		this.props.dispatch(actions.fetchDimYears());

		const width = calcWidth();
		try {
			this.props.dispatch(actions.setAll(this.props.match.params));
			this.props.dispatch(actions.setWidth(width));
		} catch (e) {
			console.log("Error: ", e);
			this.props.dispatch(actions.setFallback());
			this.props.dispatch(actions.setWidth(width));
			navigate(this.props.history, store.getState().levels);
		}
	}

	componentDidUpdate () {
		if (this.props.action == Action.OPEN) {
			const level = store.getState().levels.length - 1;
			scroll(document.body, Styles.height * level, 500);
		}
	}

	render() {
		const state = store.getState();
		return (
			<div id = "board" >
				{store.getState().levels.map((level, i) => (
					<Level {...state.levels[i]}
						dispatch = {store.dispatch}
						navigate = {() => navigate(
							this.props.history,
							state.levels)}
						history = {this.props.history}
						key = {i}
						level = {i}
						action = {state.action}
						width = {state.width}
						tooltip = {state.tooltip}
					/>
				))}
			</div>
		);
	}
}

function getURL (levels) {
	const strLevels = levels.map((l, i) => i).join('-');
	const strViews = levels.map(l => l.view).join('-');
	const strParents = levels.map(l => l.parent).join('&&');
	const strModes = levels.map(l => l.mode).join('-');
	const strYears = levels.map(l => l.year).join('-');
	const strSorts = levels.map(l => l.sort).join('-');
	const strOpenDims = levels.map(l => l.openDimensions.map(
		d => CONFIG.dimensions.indexOf(d)).join('+')).join('-');

	const url = '/' + [
		strLevels,
		strViews,
		strParents,
		strModes,
		strYears,
		strSorts,
		strOpenDims
	].join('/');

	return url;
}

function navigate (history, levels) {
	history.replace(getURL(levels));
}

function calcWidth () {
	const boardWidth = d3.select("#board").node().offsetWidth;
	document.documentElement.style.setProperty(
		"--width-page", boardWidth);
	return boardWidth;
}
