const View = {
	TIME: "overtime",
	CATS: "categories"
};

const Mode = {
	SPENDING: "plus",
	REVENUE: "minus",
	COMB: "comb",
	BAL: "bal"
};

const Sort = {
	NUM: "amount",
	ABC: "name",
	NA: 'na'
};

const Action = {
	MODE: "mode",
	RESIZE: "resize",
	YEAR: "year",
	UPDATE: "update",
	ADD: "add",
	REMOVE: "remove",
	SORT: "sort",
	ACTIVATE: "activate",
	OPEN: "open"
};

const Interaction = {
	GRAPH_OVER: "graph_mouse_over",
	GRAPH_OUT: "graph_mouse_out",
	BAR_OVER: "bar_over",
	BAR_OUT: "bar_out",
	BAR_CLICK: "bar_click",
	STACKS_OVER: "stacks_over",
	STACKS_OUT: "stacks_out"
}

const TooltipOpts = {
	UP: "up",
	DOWN: "down",
	LEFT: "left",
	RIGHT: "right"
};

const TextMapping = {
	[Mode.SPENDING]: "Spending",
	[Mode.REVENUE]: "Revenue",
	[Mode.BAL]: "Balance",
	[View.TIME]: "Over time",
	[View.CATS]: "Categories"
}

module.exports = {
	Action: Action,
	Interaction: Interaction,
	View: View,
	Sort: Sort,
	Mode: Mode,
	TextMapping: TextMapping,
	TooltipOpts: TooltipOpts
};
