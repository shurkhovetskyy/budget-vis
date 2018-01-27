import { View, Mode, Sort, Action } from './options';

import CONFIG from './settings.json';

export const skeleton = {
	name: '',
	view: null,
	mode: null,
	sort: null,
	year: '',
	displayYear: null,
	parent: 'na',
	level: 0,
	openDimensions: [],
	data: {
		[View.TIME]: [],
		[View.CATS]: []
	},
	stackedData: [],
	mark: 0,
	selection: 'n',
	highlight: null,
}

export const initial = {
	levels: [
		{...skeleton}
	],
	action: null,
	width: 0,
	tooltip: {}
}

export const fallback = {
	levels: [
		// 0
		{ ... skeleton,
			name: CONFIG.name,
			view: View.TIME,
			mode: Mode.SPENDING,
			sort: Sort.NUM,
			year: 2015,
			openDimensions: CONFIG.startDimensions,
		}
	],
	action: null,
	width: 0,
	tooltip: {}
};
