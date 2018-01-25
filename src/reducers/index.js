import { initial } from '../config/initial';

import {
	Action,
	View,
	Interaction,
	Sort
} from '../config/options';

import { val } from '../utils/val';

import { sortUtil, firstDim } from '../utils/';

import CONFIG from '../config/settings';

const reducers = (state = initial, action) => {
	let nl = [...state.levels];	// new levels
	const load = action.payload;
	//console.log("Action", action);
	switch (action.type) {
		case 'SET_VIEW': {
			nl[action.level].view = action.payload;
			nl[action.level].mark += 1;
			return {...state, levels: nl, action: null};
		}
		case 'SET_MODE': {
			nl[action.level].mode = action.payload;
			nl[action.level].mark += 1;
		//	const a = nl[action.level].view == View.CATS ? Action.MODE : null;
			return {...state, levels: nl, action: Action.MODE};
		}
		case 'SET_YEAR': {
			nl[action.level].year = action.payload;
			nl[action.level].mark += 1;
			if (nl[action.level].sort == Sort.NUM)
				nl[action.level].sort = Sort.NA;
			return {...state, levels: nl, action: null };
		}
		case 'SET_SORT': {
			nl[action.level].sort = action.payload;
			nl[action.level].mark += 1;
			return {...state, levels: nl, action: Action.SORT};
		}

		case 'ADD_DIMENSION': {
			const od = nl[action.level].openDimensions;
			nl[action.level].openDimensions = [...od, action.payload];//.push(action.payload);
			nl[action.level].mark += 1;
			return {...state, levels: nl, action: Action.ADD};
		}

		case 'REMOVE_DIMENSION': {
			const od = [...nl[action.level].openDimensions];
			const ind = od.indexOf(action.payload);
			od.splice(ind, 1);
			nl[action.level].openDimensions = [...od];
			nl[action.level].mark += 1;
			return {...state, levels: nl, action: Action.REMOVE};
		}

		case 'SET_WIDTH': {
			return {...state,
				width: action.payload,
				action: Action.RESIZE
			};
		}

		case 'GRAPH_MOUSE_OVER': {
			nl[action.level].displayYear = action.payload;
			nl[action.level].mark += 1;
			nl[action.level].instantShow = true;
			return {...state,
				levels: nl,
				action: Interaction.GRAPH_OVER
			};
		}

		case 'GRAPH_MOUSE_OUT': {
			nl[action.level].mark += 1;
			nl[action.level].instantShow = false;
			return {...state,
				levels: nl,
				action: Interaction.GRAPH_OUT
			};
		}

		case 'BAR_MOUSE_OVER': {
			nl[action.level].mark += 1;
			nl[action.level].highlight = action.payload;
			return {...state,
				levels: nl,
				action: Interaction.BAR_OVER,
				tooltip: {
					x: action.tooltipX,
					y: action.tooltipY,
					direction: action.toolTipDirection
				}
			};
		}

		case 'BAR_MOUSE_OUT': {
			nl[action.level].mark += 1;
			nl[action.level].highlight = null;
			return {...state,
				levels: nl,
				action: Interaction.BAR_OUT
			};
		}

		case 'BAR_CLICK': {
			nl[action.level].mark += 1;
			nl[action.level].selection = action.payload;
			return {...state,
				levels: nl,
				action: Interaction.BAR_CLICK
			};
		}

		case 'STACKS_MOUSE_OVER': {
			nl[action.level].mark += 1;
			nl[action.level].highlight = action.payload;
			return {...state,
				levels: nl,
				action: Interaction.STACKS_OVER,
				tooltip: {
					x: action.tooltipX,
					y: action.tooltipY,
					direction: action.toolTipDirection
				}
			};
		}

		case 'STACKS_MOUSE_OUT': {
			nl[action.level].mark += 1;
			nl[action.level].highlight = null;
			return {...state,
				levels: nl,
				action: Interaction.STACKS_OUT
			};
		}

		case 'HELP_CLICK': {
			nl[action.level].mark += 1;
			nl[action.level].highlight = action.payload;
			return {...state,
				levels: nl,
				action: Interaction.HELP_CLICK,
				tooltip: {
					type: "help",
					x: action.tooltipX,
					y: action.tooltipY,
					direction: action.toolTipDirection
				}
			};
		}

		case 'HELP_OUT': {
			nl[action.level].mark += 1;
			nl[action.level].highlight = null;
			return {...state,
				levels: nl,
				action: Interaction.HELP_OUT
			};
		}

		case 'OPEN_LEVEL': {
		//	nl[action.level].mark += 1;
			nl[action.level].selection = action.selection;

			if (action.payload!=null) {
				if (nl.length -1 == action.level)
					nl.push(action.payload);
				else {
					//const rest = nl.slice(level + 2, nl.length)
					nl[action.level + 1] = action.payload;
					nl = nl.slice(0, action.level + 2);
				}
			}

			return {...state,
				levels: nl,
				action: Action.OPEN
			};
		}

		case 'OPEN_YEAR': {
			nl[action.level].mark += 1;
			nl[action.level].view = View.CATS;
			nl[action.level].year = action.payload;
			if (nl[action.level].sort == Sort.NUM)
				nl[action.level].sort = Sort.NA;
			return {...state,
				levels: nl,
				action: null
			};
		}

		case 'FETCH_DATA': {
			if(nl[action.level].view == View.CATS
			//	&& action.userAction != Action.YEAR
			) {
				action.payload.data.sort(
					(a, b) => sortUtil(a, b,
							nl[action.level].sort,
							nl[action.level].mode,
							nl[action.level].year,
							firstDim(
								nl[action.level].openDimensions,
								nl[action.level].year)
						))
				nl[action.level].stackedData = action.payload.stacks;
			}

			nl[action.level].data[action.view] = action.payload.data;
			nl[action.level].mark += 1;
			return {...state,
				levels: nl,
				action: action.userAction
			};
		}

		case 'FETCH_DIM_YEARS': {
			return {...state};
		}
		case 'SET_ALL': {
			return {...state,
				levels: action.payload,
				action: null
			};
		}
	}
	return state;
};

export default reducers;
