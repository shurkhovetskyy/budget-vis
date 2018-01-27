import axios from 'axios';

import store from '../config/store';
import {
	View,
	Mode,
	Sort,
	Action
} from '../config/options';

import {
	fetch,
	checkSort,
	checkYear,
	checkMode,
	checkView
} from './utils';

import { skeleton, fallback } from '../config/state';

const CONFIG = require('../config/settings.json')

export function fetchDimYears () {
	return function (dispatch) {
		axios.get('/dim-years')
			.then((resp) => {
				CONFIG.dimYears = resp.data;
				dispatch({
					type: "FETCH_DIM_YEARS"
				});
			});
	}
}

export function fetchAll (levels = null) {
	levels = levels || fallback.levels;
	return function (dispatch) {
		levels.forEach((level) => {
			fetch(dispatch, level, Action.ACTIVATE);
		});
	};
}

export function setFallback () {
	return function (dispatch) {
		dispatch ({
				type: "SET_FALLBACK",
				payload: fallback
		});

		dispatch(fetchAll());
	};
}

export function setAll (params) {
	let all = [];
	const levels = params.levels.split('-');
	const views = params.views.split('-');
	const parents = params.parents.split('&&');
	const modes = params.modes.split('-');
	const sorts = params.sorts.split('-');
	const years = params.years.split('-');
	const openDims = params.dims.split('-');

	levels.forEach ((l, i) => {
		if (l!=i)
			throw "Invalid level."
		checkView(views[i]);
		checkMode(modes[i]);
		checkYear(years[i]);
		checkSort(sorts[i]);

		let actualDims = openDims[i].split('+').map(
			d => CONFIG.dimensions[parseInt(d)]);

		let parent = parents[i];
		let level = {...skeleton,
			name: parent == 'na' ? CONFIG.name : parent,
			view: views[i],
			parent: parent,
			mode: modes[i],
			sort: sorts[i],
			year: parseInt(years[i]),
			level: i,
			openDimensions: actualDims,	//Array.from(CONFIG.startDimensions),
			mark: 1,
		}

		all.push(level);
	});

	return function (dispatch) {
		dispatch ({
				type: "SET_ALL",
				payload: all
		});

		dispatch(fetchAll(all));
	};
}

export function setView (view, level, fetchData = true) {
	checkView(view);

	return function (dispatch) {
		dispatch ({
			type: "SET_VIEW",
			level: level,
			payload: view
		});
		if (fetchData) {
			const ls = {...store.getState().levels[level], view: view };
			fetch(dispatch, ls, Action.ACTIVATE);
		}
	};
}

export function setMode (mode, level) {
	checkMode(mode);
	return function (dispatch) {
		dispatch ({
			type: "SET_MODE",
			level: level,
			payload: mode
		});
	}
}

export function setYear (year, level, fetchData = true) {
	checkYear(year);
	return function (dispatch) {
		dispatch ({
			type: "SET_YEAR",
			level: level,
			payload: year
		});
		if (fetchData) {
			const ls = {...store.getState().levels[level], year: year };
			fetch(dispatch, ls, Action.YEAR);
		}
	};
}

export function setSort (sort, level) {
	checkSort(sort);
	return function (dispatch) {
		dispatch ({
			type: "SET_SORT",
			level: level,
			payload: sort
		});
	}
}

export function setWidth (width) {
	return function (dispatch) {
		dispatch ({
			type: "SET_WIDTH",
			payload: width
		});
	}
}

export function addDimension (dim, level) {
	return function (dispatch) {
		dispatch ({
			type: "ADD_DIMENSION",
			level: level,
			payload: dim
		});
	}
}

export function removeDimension (dim, level) {
	return function (dispatch) {
		dispatch ({
			type: "REMOVE_DIMENSION",
			level: level,
			payload: dim
		});
	}
}
