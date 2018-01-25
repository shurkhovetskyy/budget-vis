import axios from 'axios';

import store from '../config/store';
import {
	View,
	Mode,
	Sort,
	Action,
	TooltipOpts
} from '../config/options';

import {
	fetch,
	checkSort,
	checkYear,
	checkMode,
	checkView
} from './utils';

import Styles from '../config/styles';

import { fetchData } from './';

const CONFIG = require('../config/settings.json')

// Graph interactions

export function graphMouseOver (year, level) {
	return function (dispatch) {
		dispatch ({
			type: "GRAPH_MOUSE_OVER",
			level: level,
			payload: year
		});
	}
}

export function graphMouseOut (year, level) {
	return function (dispatch) {
		dispatch ({
			type: "GRAPH_MOUSE_OUT",
			level: level,
			payload: year
		});
	}
}

export function openYear (year, level) {
	return function (dispatch) {
		dispatch ({
			type: "OPEN_YEAR",
			level: level,
			payload: year
		});
//		if (fetchData) {
			const ls = {...store.getState().levels[level],
				view: View.CATS,
			 	year: year
			};
			fetch(dispatch, ls, Action.ACTIVATE);
//		}
	};
}

// Bar interactions

export function barMouseOver (d, bar, level) {
	const tooltipY = Styles.tooltipY - 1;

	const box = bar.getBBox();
	const tooltipX = 	box.x +
						box.width / 2 +
						Styles.leftMargin +
						Styles.widthControlPanel;

	return function (dispatch) {
		dispatch ({
			type: "BAR_MOUSE_OVER",
			level: level,
			tooltipX: tooltipX,
			tooltipY: tooltipY,
			toolTipDirection: TooltipOpts.DOWN,
	//		toolTipDirection: TooltipOpts.DIRECTION_UP,
			payload: d
		});
	}
}

export function barMouseOut (bar, level) {
	return function (dispatch) {
		dispatch ({
			type: "BAR_MOUSE_OUT",
			level: level,
			payload: bar
		});
	}
}

export function openLevel (bar, level) {
	let ls = null;
	let built;
	if (level < CONFIG.levels.length - 1) {
		const parent = bar.category;
		const levels = store.getState().levels;
		const state = levels[level];

		built = levels.length-1 > level;
		let openDims = state.openDimensions;
		if (built) {
			const builtDims = levels[level+1].openDimensions;
			const newDimensions = openDims.filter(
				v => !builtDims.includes(v));
			openDims = [...builtDims, ...newDimensions];
		}

		ls = {
			name: parent,
			view: built ? levels[level+1].view : View.CATS,
			parent: parent,
			mode: built ? levels[level+1].mode : state.mode,
			sort: built ? levels[level+1].sort : state.sort,
			year: state.year,
			displayYear: null,
			level: level+1,
			data: {
				[View.TIME]: [],
				[View.CATS]: []
			},
			stackedData: [],
			openDimensions: openDims,	//Array.from(CONFIG.startDimensions),
			mark: 1,
			selection: 'n',
			highlight: null
		}
	}
	return function (dispatch) {
		dispatch ({
			type: "OPEN_LEVEL",
			level: level,
			payload: ls
		});

		dispatch ({
			type: "BAR_CLICK",
			level: level,
			payload: bar.id
		});

		if (ls == null)
			return;

		let act = Action.ACTIVATE;
		if (built)
			act = Action.UPDATE;

		fetch(dispatch, ls, act);
	}
}

// Stacks interactions

export function stacksMouseOver (d, target, level) {
	const tooltipY = Styles.tooltipY - 1;
	const id = level + "-" + d.dim;
	// X
	const box = target.getBBox();
	let x = box.x + box.width / 2;
	x = x + 3 * Styles.dimListMargin;
	x = x + store.getState().width - Styles.widthRight;
	// Y
	const el = document.getElementById("dim-entry-" + id);
	let y = el.offsetTop;
		y = y + Styles.topMargin + Styles.stackHeight + 51; // bottom of stacks
	let by = y + Styles.tooltipHeight + Styles.arrowHeight,
		direction = TooltipOpts.UP;
	// if tooltip overflow bottom
	if (by > Styles.height)	{
		direction = TooltipOpts.DOWN;
		y = y - Styles.stackHeight;
	}

	return function (dispatch) {
		dispatch ({
			type: "STACKS_MOUSE_OVER",
			level: level,
			tooltipX: x,
			tooltipY: y,
			toolTipDirection: direction,
			payload: d
		});
	}
}

export function stacksMouseOut (level) {

	return function (dispatch) {
		dispatch ({
			type: "STACKS_MOUSE_OUT",
			level: level
		});
	}
}

// Help

// Stacks interactions

export function helpClick (x, y, direction, text, level) {
	return function (dispatch) {
		dispatch ({
			type: "HELP_CLICK",
			level: level,
			tooltipX: x,
			tooltipY: y,
			toolTipDirection: direction,
			payload: text
		});
	}
}
