import axios from 'axios';

import {
	View,
	Mode,
	Sort,
	Action
} from '../config/options';

const CONFIG = require('../config/settings.json')

export function checkSort (sort) {
	if (!Object.values(Sort).includes(sort))
		throw "Invalid sort.";
}

export function checkYear(year) {
	if (!CONFIG.years.includes(parseInt(year)))
		throw "Invalid year.";
}

export function checkMode (mode) {
	if (!Object.values(Mode).includes(mode))
		throw "Invalid mode.";
}

export function checkView (view) {
	if (!Object.values(View).includes(view))
		throw "Invalid view.";
}

// ls - level state
export function fetch (dispatch, ls, userAction) {
	const view = 'view=' + ls.view;
	const level = 'level=' + ls.level;
	const parent = 'parent=' + ls.parent;
	const year = 'year=' + ls.year;
	let params = [view, level, parent];
	if (ls.view == View.CATS)
		params.push(year);	// only relevant for categories
	const query = '/data?' + params.join('&');
	//console.log(query);
	axios.get(query)
		.then((resp) => {
			dispatch({
				type: "FETCH_DATA",
				level: ls.level,
				view: ls.view,
				userAction: userAction,
				payload: resp.data
			});
		});
}
