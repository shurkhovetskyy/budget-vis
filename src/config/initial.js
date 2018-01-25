import { View, Mode, Sort, Action } from './options';

import CONFIG from './settings.json';

export const skeleton = {
	name: '',
	view: View.TIME,
	mode: Mode.SPENDING,
	sort: Sort.NUM,
	year: null,
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
	highlight: null
}

export const initial = {
	levels: [
		// 0
		{ ... skeleton,
			name: CONFIG.name,
			view: View.TIME,
			mode: Mode.SPENDING,
			sort: Sort.NUM,
			year: 2014,
			openDimensions: CONFIG.startDimensions,
		}
	],
	action: null,
	width: 0,
	tooltip: {}
};
