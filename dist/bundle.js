/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = getStackItemColor;
/* harmony export (immutable) */ __webpack_exports__["b"] = getItemColor;
/* harmony export (immutable) */ __webpack_exports__["c"] = getLevelColor;
/*jshint esversion: 6 */

const DATA_CONFIG = __webpack_require__(7);

// Non-used
const colorBands = ["rgb(19, 52, 83)", "rgb(13, 78, 73)", "rgb(16, 94, 40)"];
const highColors = ["rgb(39, 127, 150)",
				"rgb(212, 124, 60)",
				"rgb(224, 219, 86)",
				"rgb(78, 194, 101)",
			//	"rgb(121, 178, 194)"
			];
let stackColors = [["rgb(11, 107, 128)", "rgb(125, 173, 244)", "rgb(37, 131, 199)"],
					["rgb(245, 165, 106)", "rgb(128, 64, 21)", "rgb(181, 93, 70)", "rgb(128, 40, 21)"],
					["rgb(210, 166, 66)", "rgb(218, 154, 46)", "rgb(231, 226, 91)"],
					[]];

// Used
const Colors = ["rgb(39, 127, 150)",
				"rgb(212, 124, 60)",
				"rgb(224, 219, 86)",
				"rgb(78, 194, 101)",
			//	"rgb(121, 178, 194)"
			];

			//"rgb(121, 178, 194)" - nice blue ---- rgb(121, 20, 34)
const ColorSchemes = ["rgb(38, 47, 52)", "rgb(21, 28, 32)"];
const Blacks = ["rgb(147, 147, 147)", "rgb(103, 102, 106)", "rgb(195, 195, 195)"];


function getStackItemColor (index) {
	const color = Blacks[index % Blacks.length];
	return color;
}

function getItemColor (dim) {
//	const color = shadeRGBColor(this.colorBand, 0.3 + 0.2 * sd.indexOf(dim));
	const color = Colors[DATA_CONFIG.dimensions
		.indexOf(dim) % Colors.length];
	return color;
}

function getLevelColor (level) {
	return ColorSchemes[level % ColorSchemes.length];
}

const Styles = (function() {
	function getStyleProperty(property) {
		const styles = getComputedStyle(document.documentElement);
		return String(styles.getPropertyValue(property)).trim();
	}

	const styles = {
		leftMargin : parseFloat(getStyleProperty('--left-margin')),
		leftPadding:  parseFloat(getStyleProperty('--left-padding')),
		rightPadding: parseFloat(getStyleProperty('--right-padding')),
		widthRight: parseFloat(getStyleProperty('--width-right')),
		height: parseFloat(getStyleProperty('--height')),
		chartHeight: parseFloat(getStyleProperty('--chart-height')),
		labelMargin: parseFloat(getStyleProperty('--label-margin')),
		topPadding: parseFloat(getStyleProperty('--top-padding')),
		bottomPadding: parseFloat(getStyleProperty('--bottom-padding')),
		labelTruncate: parseFloat(getStyleProperty('--label-truncate')),
		dimEntryHeight: parseFloat(getStyleProperty('--dim-entry-height')),
		dimListMargin: parseFloat(getStyleProperty('--dim-list-margin')),
		stackHeight: parseFloat(getStyleProperty('--stack-height')),
		stackWidth: parseFloat(getStyleProperty('--stack-width')),
		widthControlPanel: parseFloat(getStyleProperty('--width-control-panel')),
		axisMarginRight: parseFloat(getStyleProperty('--axis-margin-right')),
		topMargin: parseFloat(getStyleProperty('--top-margin')),
		tooltipHeight: parseFloat(getStyleProperty('--tooltip-height')),
		arrowHeight: parseFloat(getStyleProperty('--arrow-height')),
		headerHeight: parseFloat(getStyleProperty('--header-height'))
	};

	// Bar tooltip y.
	let y = styles.headerHeight + styles.topMargin + styles.topPadding;
//	y = y - styles.tooltipHeight - styles.arrowHeight;
	styles.tooltipY = y;

//	styles.bottomPadding = styles.labelMargin + styles.labelLength;

	return styles;
}) ();
/* harmony export (immutable) */ __webpack_exports__["a"] = Styles;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*jshint esversion: 6 */

const Mode = {
	SPENDING: "plus",
	REVENUE: "minus",
	COMB: "combined",
	BAL: "balanced"
};
/* harmony export (immutable) */ __webpack_exports__["b"] = Mode;


const Action = {
	MODE: "mode",
	RESIZE: "resize",
	YEAR: "year",
	UPDATE: "update",
	ADD: "add"
};
/* harmony export (immutable) */ __webpack_exports__["a"] = Action;


const Sort = {
	NUM: "num",
	ABC: "abc"
};
/* harmony export (immutable) */ __webpack_exports__["c"] = Sort;


const View = {
	TIME: "overtime",
	CATS: "categories"
};
/* harmony export (immutable) */ __webpack_exports__["d"] = View;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = firstDim;
/* harmony export (immutable) */ __webpack_exports__["h"] = roll;
/* harmony export (immutable) */ __webpack_exports__["i"] = rollLevelData;
/* harmony export (immutable) */ __webpack_exports__["f"] = readYears;
/* harmony export (immutable) */ __webpack_exports__["k"] = setDimYears;
/* harmony export (immutable) */ __webpack_exports__["l"] = val;
/* harmony export (immutable) */ __webpack_exports__["j"] = scroll;
/* harmony export (immutable) */ __webpack_exports__["a"] = MoneyNum;
/* harmony export (immutable) */ __webpack_exports__["b"] = MoneySign;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_text__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__ = __webpack_require__(1);
/*jshint esversion: 6 */




const DATA_CONFIG = __webpack_require__(7);

/**
*	Returns first available dimension among those shown.
*/
function firstDim (shown, year) {
	const availableDimensions = shown.filter(
		dim => DATA_CONFIG.dimYears[dim].includes(year));
	return availableDimensions.shift();
}

function roll (value) {
	var cats = [];
	var item = null;
	var rolled = null;
	// Retrieve names of all categories.
	return value.map ((c, i) => {
		item = {category: c.key,
				id: i };
		rolled = d3.nest()
			.key(d => d.Year).key(d => d.Sign)
			.rollup (v => (generateEntry(v)))
			.entries(c.values.data);
		item.data = rolled;
		return item;
	});
}

function rollLevelData (csv, level) {
	const levels = DATA_CONFIG.levels;
	const ready = d3.nest()
		.key(function(d) {
			return d[levels[level]];
		})
		.rollup(function(v) {
			return {
				data: v,
				count: v.length
			};
		})
		.entries(csv);
	return ready;
}

function generateEntry (v) {
	const entry = {};
	DATA_CONFIG.dimensions.forEach (dim =>
		entry[dim] = d3.sum(v, d => parseFloat(d[dim])));
	return entry;
}

/**
*	Returns list of years for which data is available
*	for specified dimension.
*/
function getAvailableYears (dim, data) {
	const years = Array.from(DATA_CONFIG.years);
	const res = years.map(y => ({
		value: d3.sum(data.map(
			item => val(item, dim, __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].COMB, y))),
		year: y
	}));
	return res.filter(d => d.value!=0).map(d => d.year);
}

/**
*	Calculates the list of years from the range specified.
*/
function readYears () {
	const range = DATA_CONFIG.yearsRange;
	const years = Array.from({ length: range[1] - range[0] + 1 },
		(v, k) => k + range[0]);
	DATA_CONFIG.years = years;
	return years;
}

/**
*	Finds list of years for which data is available
*	for each dimension separately.
*/
function setDimYears (data) {
	const dimYears = {};
	DATA_CONFIG.dimensions.forEach (dim =>
		dimYears[dim] = getAvailableYears(dim, data));
	DATA_CONFIG.dimYears = dimYears;
}

function getDatum (data, mode, dimension) {
	// Get index of a sign.
	const i = data.findIndex(d => d.key == mode);
	if (i == -1)	return 0.0;
	else 			return data[i].values[dimension];
}

/*
 *	Returns actual value given data item, desired dimension
 *	and current display mode.
 */
function val (d, dim, mode, year) {
	let yd;	// year data
	// For some categories data might not be available
	// for all years or for all signs. Then return 0.
	const yi = d.data.findIndex(d => d.key == year.toString());
	if (yi == -1)	return 0.0;
	else 			yd = d.data[yi].values;

	if (mode==__WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].SPENDING || mode==__WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].REVENUE)
		return getDatum(yd, mode, dim);

	// Getting objects holding values at different signs.
	const plusData = getDatum(yd, __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].SPENDING, dim);
	const minusData = getDatum(yd, __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].REVENUE, dim);

	if (mode==__WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].BAL)
		return plusData + minusData;
	else if (mode == __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].COMB) {
		const pa = Math.abs(plusData);
		const ma = Math.abs(minusData);
		return pa + ma;
	}
}

/**
*	Scrolls the page smoothly.
*/
function scroll (element, to, duration) {
    let start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    let animateScroll = function() {
        currentTime += increment;
        const val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

/**
   * Helper functions
   */
function tweenText (newValue) {
	return function () {
		var currentValue = + this.textContent;
		var i = d3.interpolateRound (currentValue, newValue);
		return function (t) {
			this.textContent = i(t);
		};
	};
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

function MoneyNum(labelValue) {
  // Nine Zeroes for Billions
  const v = Math.abs(Number(labelValue)) >= 1.0e+9 ? (d3.format(".2f")(Math.abs(Number(labelValue)) / 1.0e+9))
       // Six Zeroes for Millions
       : Math.abs(Number(labelValue)) >= 1.0e+6 ? (d3.format(".1f")(Math.abs(Number(labelValue)) / 1.0e+6))
       // Three Zeroes for Thousands
       : Math.abs(Number(labelValue)) >= 1.0e+3 ? (d3.format(".1f")(Math.abs(Number(labelValue)) / 1.0e+3))
       : (d3.format(".1f")(Math.abs(Number(labelValue))));

	   return (labelValue < 0) ? -v: v;
}

function MoneySign(labelValue) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9 ? __WEBPACK_IMPORTED_MODULE_0__ui_text__["b" /* Sign */].billion
       // Six Zeroes for Millions
       : Math.abs(Number(labelValue)) >= 1.0e+6 ? __WEBPACK_IMPORTED_MODULE_0__ui_text__["b" /* Sign */].million
       // Three Zeroes for Thousands
       : Math.abs(Number(labelValue)) >= 1.0e+3 ? __WEBPACK_IMPORTED_MODULE_0__ui_text__["b" /* Sign */].thousand
	   : "";
}

const adjustFontSize = function (element) {
    if(!element.innerHTML) return;
    const dummy = document.createElement('div');
		dummy.className = 'dummy';
    const elementStyle = getComputedStyle(element);
    dummy.style.font = elementStyle.font;
    dummy.style.padding = elementStyle.padding;
    dummy.style.boxSizing = elementStyle.boxSizing;
    dummy.innerHTML = element.innerHTML;
    document.body.appendChild(dummy);
    const dummyStyle = getComputedStyle(dummy);

    const rw = parseFloat(dummyStyle.width) / parseFloat(elementStyle.width);
    let font = parseFloat(dummy.style.fontSize) / rw;
	//	font = parseFloat(dummy.style.fontSize) / rh + 'px';
	font = Math.min(font, 32) + 'px';

    element.style.fontSize = font;
    document.body.removeChild(dummy);
};
/* harmony export (immutable) */ __webpack_exports__["c"] = adjustFontSize;


const getFontSize = function (element, text) {
  	//  if(!element.innerHTML) return;
    const dummy = document.createElement('div');
		dummy.className = 'dummy';
    const elementStyle = getComputedStyle(element);
    dummy.style.font = elementStyle.font;
    dummy.style.padding = elementStyle.padding;
    dummy.style.boxSizing = elementStyle.boxSizing;
	//	dummy.innerHTML = element.innerHTML;
	dummy.innerText = text;
    document.body.appendChild(dummy);
    const dummyStyle = getComputedStyle(dummy);

    const rw = parseFloat(dummyStyle.width) / parseFloat(elementStyle.width);
    let font = parseFloat(dummy.style.fontSize) / rw;
	//	font = parseFloat(dummy.style.fontSize) / rh + 'px';
	font = Math.min(font, 32) + 'px';

	//	element.style.fontSize = font;
    document.body.removeChild(dummy);
	return font;
};
/* unused harmony export getFontSize */


const hide = function (el, duration = 500) {
	el.transition().duration(duration)
		.style("opacity", 0)
		.transition().duration(duration)
		.style("visibility", "hidden")
		;
};
/* harmony export (immutable) */ __webpack_exports__["e"] = hide;


const reveal = function (el, duration = 500) {
	el.transition().duration(duration)
		.style("visibility", "visible")
		//	.transition().duration(duration)
		.style("opacity", 1);
};
/* harmony export (immutable) */ __webpack_exports__["g"] = reveal;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_styling__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(2);
/*jshint esversion: 6 */




const Tooltip = (function () {
	const tooltip = {};

	const DIRECTION_UP = "up";
	const DIRECTION_DOWN = "down";
	const DIRECTION_LEFT = "left";
	const DIRECTION_RIGHT = "right";

	const duration = 50;

	tooltip.draw = function (d, x, y, direction, c, stacked) {
		const id = c.level + "-" + d.dim;
		let toolcon = c.levelContainer.select("#toolcon"), box, arrow;
		if (toolcon.empty()) {
			toolcon = c.levelContainer.append("div")
					.attr("id", "toolcon")
					.attr("class", "toolcon");
			box = toolcon.append ("div")
					.attr("id", "tooltip")
					.attr("class", "box tooltip");
			arrow = toolcon.append("div")
					.attr("id", "arrow")
					.attr("class", "arrow tooltip");
			let content = box.append("div").attr("class", "content");
			content.append("div").attr("class", "title");
			let fig = content.append("div").attr("class", "fig");
			fig.append("div").attr("class", "num");
			fig.append("div").attr("class", "sign");
			content.append("div").attr("class", "stats");
			content.append("div").attr("class", "text");
		} else {
			box = c.levelContainer.select("#tooltip");
			arrow = c.levelContainer.select("#arrow")
				.style("visibility", "visible");
			toolcon.selectAll("div")
				.classed("hidden-delay", false)
				.classed("hidden", false);
		}

		const value = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["l" /* val */])(d, d.dim, c.mode, c.year);
		box.select(".text").text('');
		box.select(".title").text(d.category);
		box.select(".num").text("€" + Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* MoneyNum */])(value));
		box.select(".sign").text(Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* MoneySign */])(value));

		const sumFun = (item) => stacked ? Object(__WEBPACK_IMPORTED_MODULE_1__utils__["l" /* val */])(item, d.dim, c.mode, c.year) :
							Math.abs(Object(__WEBPACK_IMPORTED_MODULE_1__utils__["l" /* val */])(item, d.dim, c.mode, c.year));

		let sum = d3.sum(c.dataset.map(sumFun));
		const label = stacked ? "Kostenart" : c.selectionName;
		const percentage = Math.abs((value / sum * 100));
		box.select(".stats")
			.text(d3.format(".1f")(percentage) + "% of " + label);

		let ay, ty;
		if (direction==DIRECTION_UP) {
			ay = y + __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].arrowHeight;
			ty = ay ;
			arrow.classed("up", true);
			arrow.classed("down", false);
		} else if (direction == DIRECTION_DOWN) {
			ay = y - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].arrowHeight;	// arrow y
			ty = ay - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].tooltipHeight - 3;	// tooltip y

			arrow.classed("down", true);
			arrow.classed("up", false);
		}

		arrow.style("top", ay);
		arrow.style("left", x - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].arrowHeight);
		// Prevent x overflow.
		const boundary = c.width;
		const client = box.node();
		x = x - client.offsetWidth / 2;
		let dx = x + client.offsetWidth - boundary;
		x = x - Math.max(dx, 0);

		box.style("top", ty);
		box.style("left", x);
	};

	tooltip.hide = function (c, delay = true) {
		c.levelContainer.selectAll(".tooltip")
			.classed(delay ? "hidden-delay" : "hidden", true);
	};

	tooltip.help = function (x, y, direction, c, help) {
		let toolcon = c.levelContainer.select("#toolcon"), box, arrow;
		if (toolcon.empty()) {
			toolcon = c.levelContainer.append("div")
					.attr("id", "toolcon")
					.attr("class", "toolcon");
			box = toolcon.append ("div")
					.attr("id", "tooltip")
					.attr("class", "tooltip");
			arrow = toolcon.append("div")
					.attr("id", "arrow")
					.attr("class", "arrow tooltip");
			let content = box.append("div").attr("class", "content");
			content.append("div").attr("class", "title");
			let fig = content.append("div").attr("class", "fig");
			fig.append("div").attr("class", "num");
			fig.append("div").attr("class", "sign");
			content.append("div").attr("class", "stats");
			content.append("div").attr("class", "text");
		} else {
			toolcon.selectAll("div")
				.classed("hidden-delay", false)
				.classed("hidden", false);
			box = c.levelContainer.select("#tooltip");
			arrow = c.levelContainer.select("#arrow")
				.style("visibility", "hidden");
		}

		const text = box.select(".text").html(help);
		box.select(".title").text('');
		box.select(".num").text('');
		box.select(".sign").text('');
		box.select(".stats").text('');

		// Place div in the middle so that its width is calculated
		// properly without div getting squeezed at the edge.
		box.style("left", __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthControlPanel);
		let width = text.node().clientWidth;
		let tx;
		if (direction==DIRECTION_LEFT) {
			tx = x;
		} else if (direction == DIRECTION_RIGHT) {
			tx = x - width - 10; // tooltip x
		}

		// Prevent x overflow.
		const boundary = c.width;
		const client = box.node();
		x = x - client.offsetWidth / 2;
		let dx = x + client.offsetWidth - boundary;
		x = x - Math.max(dx, 0);

		// Y
		y = y - 4;
		const height = client.offsetHeight;
		const dy = (height + y) - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].height;
		y = y - Math.max(dy, 0);

		box.style("top", y);
		box.style("left", tx);
		box.classed("hidden-delay", false)
			.classed("hidden", false);
	};

	tooltip.UP = DIRECTION_UP;
	tooltip.DOWN = DIRECTION_DOWN;
	tooltip.RIGHT = DIRECTION_RIGHT;
	tooltip.LEFT = DIRECTION_LEFT;

	return tooltip;
})();
/* harmony export (immutable) */ __webpack_exports__["a"] = Tooltip;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*jshint esversion: 6 */

const Help = {
	EN: {
		view: "<strong>Over time</strong><br>Shows change in sum of all categories year over year.<br><br><strong>Categories</strong><br>Shows breakdown of single year.",
		mode: "<strong>Spending</strong><br>Amount spent.<br><br><strong>Revenue</strong><br>Amount earned. <br><br> <strong>Balance</strong><br>Differnece between Spending and Revenue, shows whether year/category earned or lost money.",
		year: "Displays amounts for selected year.",
		sort: "<strong>123</strong><br> Numerical sort of categories by amount.<br><br> <strong>ABC</strong><br> Alphabetical sort of categories by name.",
		fig: "Sum of amounts of all categories shown.",
		stack: "Breakdown of types of costs that constitute the sum above. This view is not available in balanced mode."
	}
};
/* harmony export (immutable) */ __webpack_exports__["a"] = Help;


const Sign = {
	billion : "B",
	million: "Mio",
	thousand: "Tsd"
};
/* harmony export (immutable) */ __webpack_exports__["b"] = Sign;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildChart", function() { return buildChart; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_styling__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__chart__ = __webpack_require__(8);
/*jshint esversion: 6 */





const DATA_CONFIG = __webpack_require__(7);

let charts = [];

function getChartAt (level) {
	let c = charts[level];
	// If no chart yet at this level.
	if (c==null) {
		c = new __WEBPACK_IMPORTED_MODULE_2__chart__["a" /* default */](level);
		charts.push(c);
		Object(__WEBPACK_IMPORTED_MODULE_1__utils__["j" /* scroll */])(document.body, __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].height * level, 500);
	} else {
		Object(__WEBPACK_IMPORTED_MODULE_1__utils__["j" /* scroll */])(document.body, __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].height * (level-1), 250);
		// If there is already chart at this level, check if there
		// are charts at deeper levels and destroy them.
		const rest = charts.slice(level + 1, charts.length);
		rest.forEach (rc => rc.destroy());
		charts = charts.slice(0, level + 1);
	}
	return c;
}

function buildChart(level, data, selectionName, year, shownDimensions) {
	if (level >= DATA_CONFIG.levels.length)
		return;

	const fullData = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["i" /* rollLevelData */])(data, level);
	const levelData = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* roll */])(fullData);
	const chart = getChartAt(level);

	chart	.setFullData(fullData)
			.setDataset(levelData)
			.setStackedDataset(Object(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* roll */])(Object(__WEBPACK_IMPORTED_MODULE_1__utils__["i" /* rollLevelData */])(
				data, DATA_CONFIG.levels.length - 1)))
			.setLevel(level)
			.setStartYear(year)
			.setShownDimensions(shownDimensions)
			.setSelectionName(selectionName)
			.setLevelDesc(DATA_CONFIG.levels[level])
			.build();
}

(function() {

	const redraw = () => charts.forEach (c => c.resize());
	const launch = (filename) =>
		d3.dsv(";", "text/plain")(filename, csv =>
			buildChart(0, csv,
				DATA_CONFIG.name,
				DATA_CONFIG.startYear,
				DATA_CONFIG.startDimensions));

	window.addEventListener("resize", redraw);

	launch("data/out1.csv");
})();




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Display;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_styling__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_ui_state__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_text__ = __webpack_require__(4);
/*jshint esversion: 6 */






const DATA_CONFIG = __webpack_require__(7);

function Display (chart) {
	this.c = chart;
	this.container = chart.mainContainer.append("g")
					//	.style("visibility", "hidden")
						;
	this.labelsCon = this.c.labelsGroup.append("div")
						.attr("class", "labelscon hidden");

	// Y-Axis
	this.yScale = d3.scale.linear().range([
		__WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].chartHeight - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].bottomPadding, __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].topPadding]);

	this.yAxis = d3.svg.axis()
				.orient("left")
				.ticks(5)
				.tickFormat(this.tickTextFormat);

	// Flag: false if labels have not yet set up.
	this.labelsSet = false;
	// Indicates if chart is displayed.
	this.chartSet = false;
	// Flag: true if this display is currently in use.
	this.active = false;
	// True when there is no data to show.
	this.noData = false;
}

Display.prototype.tickTextFormat = function(d) {
	const num = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* MoneyNum */])(d);
	const sign = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* MoneySign */])(d);
	let precision = 0;
	if (sign == __WEBPACK_IMPORTED_MODULE_3__ui_text__["b" /* Sign */].billion)
		precision = 2;
	return ((d3.format("." + precision + "f")(num) + " " + sign));
};

Display.prototype.setDataset = function (_) {
	this.dataset = _;
	this.updateXScale();
	this.updateXScaleRange();
	this.labelsText = this.getLabels();
};

Display.prototype.setAxis = function (x = false, y = false, fading = false) {
	const c = this.c;
	if (x)	this.updateXScale();
	if (y)	this.updateYScale();

	this.yAxis.tickSize(-this.c.axisWidth, 0);
//	console.log("setAxis");
	if (fading) {
		// Hide axis.
		const invTrans = this.c.axisCon
			.transition().duration(this.chartSet ? 500 : 250);
		invTrans.style("opacity", "0");
		// Change axis.
		const yTrans = invTrans.transition().duration(0);
		yTrans.call(this.yAxis);
		// Reveal axis.
		const visTrans = invTrans.transition().duration(500);
		visTrans.style("opacity", "1");
	} else {
		// Perform smooth transition on the axis.
		c.axisCon.transition().duration(1000)
			.call(this.yAxis)
			.style("opacity", 1);
	}

	// Only display zero axis if zero is in vicinity.
	const aboveMin = d3.min(this.yScale.range()) <= this.yScale(0);
	const belowMax = this.yScale(0) <= d3.max(this.yScale.range());
	if (!aboveMin || !belowMax) {
		c.zeroAxis
			.transition()
			.duration(500)
			.style("opacity", "0.0");
		return;
	}
	// Smooth transition of zero axis.
	c.zeroAxis
		.transition("hide")
		.duration(500)
		.style("opacity", "0.0")
		.transition("position")
	//	.duration(1000)
		.attr("y1", this.yScale(0))
		.attr("y2", this.yScale(0))
		.attr("x1", 0)
		.attr("x2", this.c.axisWidth)
		.transition("reveal")
		.duration(500)
		.style("opacity", "0.7")
		;
};

Display.prototype.updateLabels = function () {
	if ([__WEBPACK_IMPORTED_MODULE_2__ui_ui_state__["a" /* Action */].MODE, __WEBPACK_IMPORTED_MODULE_2__ui_ui_state__["a" /* Action */].YEAR].includes(this.c.action))
		return;

	console.log("updateLabels");

	let _this = this,
		  labels = this.generateLabels();
	const hi = 1.0;
  	const lo = 0.4;
	labels.transition()
		// Make sure labels appear quickly when shown
		// for the first time (set is false then).
		.duration(this.labelsSet ? 500 : 0)
		.style("opacity", 0)
		.transition().duration(10)
		.text((d, i) => this.labelsText[i])
		.transition().duration(50)
		.call(function () {
			_this.labelIn.call(this, _this); })
		.transition().duration(500)
		.style("opacity", d => {
			let cond = (d.id == this.selected || this.selected==-1);
			return cond ? (hi * this.lop) : (lo * this.lop);
		})
		// .style("font-weight", d => {
		// 	console.log(d.id == this.selected);
		// 	return (d.id == this.selected ? "bold" : "normal");
		// }

		;
};

Display.prototype.setNoDataMessage = function () {
	let html = "No <span>" + this.c.year + "</span> data available for";
	this.c.shownDimensions.forEach(
		d => html = html + "<br><span>" + d + "</span>");
	this.c.no.html(html);
};

/*
*	Shows/hides message indicating no data is available
*	for open dimensions for selected year.
*/
Display.prototype.noDataMessage = function (noData = true) {
	if (noData) {
		Object(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* hide */])(this.c.axisCon);
		Object(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* hide */])(this.container);
		this.setNoDataMessage();
		this.minimizeItems();
		this.chartSet = false;
	} else {
		this.c.axisCon.style("visibility", "visible");
		Object(__WEBPACK_IMPORTED_MODULE_1__utils__["g" /* reveal */])(this.container);
	}
	this.labelsCon.classed("hidden", noData);
	this.c.no.classed("reveal", noData);
};

Display.prototype.dataAvailable = function (dims = null) {
	var start = new Date().getTime();

	dims = dims || this.c.shownDimensions;
	const available = dims.map(d =>
		DATA_CONFIG.dimYears[d]
			.includes(this.c.year)).reduce((a, b) => a || b);
	console.log(available);
	this.noData = !available;

	var elapsed = new Date().getTime() - start;
	console.log(elapsed);
	return available;
};

/*
*	Shows all dimensions open.
*/
Display.prototype.setupChart = function (dims = null) {
	dims = dims || this.c.shownDimensions;
	console.log("setupChart");
	this.noDataMessage(false);
	this.setAxis(true, true, true);
	dims.forEach(dim => this.addDimension(dim));
	this.chartSet = true;
};

/**
*	Updates view.
*
*	The order of all checks and transitions is set specifically
*	to handle quick switches between states and views.
*
*	Unless you really, really, really know what you are doing
*	do not change anything here. Or the sky will fall.
*/
Display.prototype.updateData = function () {
	// if there is currently no data or year was changed...
	if(this.noData || this.c.action == __WEBPACK_IMPORTED_MODULE_2__ui_ui_state__["a" /* Action */].YEAR) {
		// if data not available and year was not changed...
		if(this.c.action != __WEBPACK_IMPORTED_MODULE_2__ui_ui_state__["a" /* Action */].YEAR)
			return;
		// if year was changed and data is still not available...
		if (!this.dataAvailable()) {
			// update message and exit.
			this.noDataMessage();
			return;
		}
		// if data is available now (noData changed to true)...
		else {
			// if chart has not been even built even yet, build it.
			if (!this.chartSet) {
				this.c.action = __WEBPACK_IMPORTED_MODULE_2__ui_ui_state__["a" /* Action */].ADD;
				Display.prototype.setupChart.call(this);
				return;
			}
			// otherwise just remove noData message (reveals already
			// set up chart) and update dimensions.
			this.noDataMessage(false);
		}
	}

	this.updateDimensions();
	this.updateLabels();
};

Display.prototype.updateDimensions = function () {
	console.log("UpdateDimensions");
	this.setAxis(true, true);
	const sd = this.c.shownDimensions;
	sd.forEach (dim => this.renderDimension(dim));
};

Display.prototype.generateLabels = function () {
	// if (this.labelsText != null)
	// 	return this.labelsText;

	const sd = this.c.shownDimensions,
		  _this = this,
		  labels = this.labelsCon.selectAll("span")
			.filter(".axis-label")
			.filter(".level-" + this.c.level)
			// Specify which dimension is represented by this set of bars.
			.data(this.getDimensionData(sd[0]));
	this.labelsText = this.getLabels();
	labels.enter()
		.append("span")
		.text((d, i) => this.labelsText[i])
		.attr("class", "axis-label level-" + this.c.level)
		.style("opacity", 0)
		.call(function () {
			_this.labelIn.call(this, _this); })
		.call(function() {
			_this.setListeners.call(this, _this); })
		;

	labels.exit()
		.transition()
		.duration(1000)
		.call(function () {
			_this.labelOut.call(this, _this); })
		.remove();

	if (this.xScale.rangeBand() < this.bandLimit)
		this.lop = 0.0;
	else
		this.lop = 1.0;

	return labels;
};

Display.prototype.restore = function () {
	this.selected = -1;
};

Display.prototype.labelOut = function (display) {
	const y = __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].chartHeight + __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].labelMargin,
		  w = display.c.axisWidth;
	this.style("left", w)
		.style("opacity", 0);
};

Display.prototype.labelIn = function (display) {
	this.style("left", (d, i) => display.getLabelX(i))
		.style("font-weight", d =>
			d.id == display.selected ? "bold" : "normal"
		);
};

Display.prototype.deactivate = function () {
	if (!this.active)
		return;
	this.active = false;
	this.chartSet = false;

	Object(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* hide */])(this.container);
	this.labelsCon.classed("hidden", true);

	this.c.shownDimensions.forEach(
		dim => this.removeDimension(dim));
};

Display.prototype.activate = function () {
	if (this.active)
		return;
	if (this.c.display!=null)
		this.c.display.deactivate();

	this.setupChart();
	if(!this.labelsSet) {
		this.updateLabels();
		this.labelsSet = true;
	}
	this.active = true;
	this.c.display = this;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = {"name":"Bonn Budget","levels":["Produktbereich","Bezeichnung","Profitcenter","Kostenart"],"dimensions":["Executed-Ist","Planentwurf","Plan"],"startDimensions":["Executed-Ist"],"stacks":"Kostenart","yearsRange":[2008,2024],"startYear":2015}

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Chart;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_styling__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tooltip__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_text__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__display_bar_display__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__display_graph_display__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__list_panel__ = __webpack_require__(11);
/*jshint esversion: 6 */
/*jshint loopfunc: true */











const DATA_CONFIG = __webpack_require__(7);

function Chart (level) {
	// Keeps track of visible dimensions.
	this.shownDimensions = [];
	// Actual dataset.
	this.dataset = [];
	// Actual dataset.
	this.stackedDataset = [];
	// Current mode.
	this.mode = __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].SPENDING;
	// View - categories or over time.
	this.viewMode = __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["d" /* View */].CATS;
	// Last action type.
	this.action = null;
	// Level of this chart (starts with 0).
	this.level = level;
	// Sum of largest dimension in current mode.
	this.maxDimSum = 0;
	this.widthRight = null;
	this.width = null;
	this.axisWidth = null;

	this.initialized = false;

	this.years = DATA_CONFIG.years || Object(__WEBPACK_IMPORTED_MODULE_4__utils__["f" /* readYears */])();

	this.initialBuild();

	this.barDisplay = new __WEBPACK_IMPORTED_MODULE_5__display_bar_display__["a" /* default */](this);
	this.graphDisplay = new __WEBPACK_IMPORTED_MODULE_6__display_graph_display__["a" /* default */](this);
	this.listPanel = new __WEBPACK_IMPORTED_MODULE_7__list_panel__["a" /* default */](this);

	this.setStackedDataset = function(_) {
		this.stackedDataset.length = 0;
		this.stackedDataset.push.apply(this.stackedDataset, _); //.dataset;
	//	this.stackCategories = unpacked.categories;
		return this;
	};

	this.setFullData = function (_) {
		this.fullData = _;
		return this;
	};

	this.setDataset = function(data) {
		this.dataset.length = 0;
		this.dataset.push.apply(this.dataset, data);

		if (!DATA_CONFIG.hasOwnProperty("dimYears"))
			Object(__WEBPACK_IMPORTED_MODULE_4__utils__["k" /* setDimYears */])(data);
		return this;
	};

	this.setStartYear = function (startYear) {
		this.year = startYear;
		if (this.yearSelect!=undefined)
			this.yearSelect.node().value = this.year;
		return this;
	};

	this.setShownDimensions = function (value) {
		this.shownDimensions = value;
		return this;
	};

	this.setSelectionName = function (value) {
		this.selectionName = value;
		return this;
	};

	this.setLevelDesc = function (value) {
		this.levelDesc = value;
		return this;
	};

	this.setLevel = function (value) {
		this.level = value;
		return this;
	};

	this.destroy = function () {
		this.levelContainer.transition("opacity").duration(500)
			.style("opacity", 0);
		this.levelContainer.transition("remove").duration(500).remove();
	};

	this.setDefaults = function () {
		this.display.restore();
	};

	this.build = function () {
		this.barDisplay.setDataset(this.dataset);
		this.graphDisplay.setDataset(this.dataset);
		if (!this.initialized) {
			this.action = __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["a" /* Action */].ADD;
			this.setTitle();
			this.barDisplay.activate();
			this.listPanel.activate();
			this.initialized = true;
		} else {
			this.action = __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["a" /* Action */].UPDATE;
			this.setDefaults();
			this.setTitle();
			this.updateData();
		}
		this.action = null;
	};

	this.addDimension = function (dim, push = true) {
		this.action = __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["a" /* Action */].ADD;
		if(push)
			this.shownDimensions.push(dim);
		this.display.addDimension(dim);
		this.action = null;
		//	this.listPanel.addDimension(dim);
		//	this.addDimensionList(dim);
	};

	this.removeDimension = function (dimension) {
		const ind = this.shownDimensions.indexOf(dimension);
		this.shownDimensions.splice(ind, 1);
		this.display.removeDimension(dimension);
		this.listPanel.updateStackedCharts();
	};

	this.resize = function () {
		this.action = __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["a" /* Action */].RESIZE;
		this.calcWidth();
		Object(__WEBPACK_IMPORTED_MODULE_4__utils__["c" /* adjustFontSize */])(this.selectionText.node());
		//console.log(width);

		this.barDisplay.updateXScaleRange();
		this.graphDisplay.updateXScaleRange();
		this.barDisplay.updateLabels();
		this.graphDisplay.updateLabels();
		this.display.updateDimensions();
	};

	// Updates visualization when data changes.
	this.updateData = function () {
		this.display.updateData();
		this.listPanel.updateStackedCharts();
	};

	// Sets title on the top left of the chart.
	this.setTitle = function () {

		// this.selectionText
		// 	.transition("hide")
		// 	.duration(500)
		// 	.style("opacity", 0)
		// 	.transition("text")
		// 	.text(this.selectionName);
		//
		// let fs = getFontSize(	this.selectionText.node(),
		// 						this.selectionName);
		//
		// this.selectionText
		// 	.style("font-size", fs)
		// 	.transition("reveal")
		// 	.duration(500)
		// 	.style("opacity", 1);

		this.levelText.text(this.levelDesc);
		this.selectionText.text(this.selectionName);
		Object(__WEBPACK_IMPORTED_MODULE_4__utils__["c" /* adjustFontSize */])(this.selectionText.node());
	};

	/*
	*	Control panel button UI response.
	*/
	this.buttonPress = function (button, con) {
		con.selectAll("button").classed("active-button", false);
		button.classed("active-button", true);
	};

	this.setHelp = function (item, help, visible = true) {
		const x = 100,
			  y = 140;
		__WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].help(x, y, __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].RIGHT, this, help);
	};

	this.setDisplay = function (viewMode) {
		this.viewMode = viewMode;
		this.action = __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["a" /* Action */].ADD;

		if(this.viewMode==__WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["d" /* View */].TIME) {
			this.buttonPress(this.displayOverTime, this.displaySwitch);
			this.graphDisplay.activate();
			this.listPanel.setYear(null);
			this.listPanel.figuresHide();
			this.listPanel.stackedChartsVisible(false);
			this.yearControl.classed("hidden", true);
			this.sortControl.classed("hidden", true);
		}
		else {
			this.buttonPress(this.displayCategories, this.displaySwitch);
			this.barDisplay.activate();
			this.yearControl.classed("hidden", false);
			this.sortControl.classed("hidden", false);
			this.listPanel.setYear(this.year);
			this.listPanel.figuresShow();
			if (viewMode != __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].BAL) {
				this.listPanel.stackedChartsVisible(true);
				this.listPanel.updateStackedCharts();
			}
		}
		this.action = null;
	};

	this.setYear = function () {
		this.action = __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["a" /* Action */].YEAR;
		this.year = parseInt(this.yearSelect.property("value"));
		this.listPanel.setYear(this.year);
		this.updateData();
		this.sortNumerical.classed("active-button", false);
		this.action = null;
	};

	this.setMode = function (mode) {
		this.action = __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["a" /* Action */].MODE;
		this.mode = mode;
		this.sortNumerical.classed("active-button", false);
		this.updateData();

		if (this.viewMode == __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["d" /* View */].TIME ||
			mode == __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].BAL)
			this.listPanel.stackedChartsVisible(false);
		else
			this.listPanel.stackedChartsVisible(true);

		this.modePlus.classed("active-button", false);
		this.modeMinus.classed("active-button", false);
		this.modeBal.classed("active-button", false);
	//	this.modeComb.classed("active-button", false);

		this.sortNumerical.classed("active-button", false);

		if (mode == __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].SPENDING) this.modePlus.classed("active-button", true);
		else if (mode == __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].REVENUE) this.modeMinus.classed("active-button", true);
		else if (mode == __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].BAL) this.modeBal.classed("active-button", true);
	//	else if (mode == Mode.COMB) this.modeComb.classed("active-button", true);
		this.action = null;
	};

	this.sortBars = function (dimension, sort = null) {
		this.display.sortBars(dimension, sort);
	};

	return this;
}

Chart.prototype.initialBuild = function () {

	this.board = d3.select("#board");
	this.levelContainer = this.board.append("div")
		.attr("id", "level-" + this.level)
		.attr("class", "levelcon level-" + this.level)
		.style("background-color", Object(__WEBPACK_IMPORTED_MODULE_0__ui_styling__["c" /* getLevelColor */])(this.level))
		.style("opacity", "0.0")
	//	.classed("hidden", true)
		;

	this.controlPanel = this.levelContainer.append("div")
		.attr("id", "controlpanel-" + this.level)
		.attr("class", "sidediv controlpanel");

	this.leftContainer = this.levelContainer.append("div")
		.attr("id", "left-" + this.level)
		.attr("class", "sidediv leftcon");

	this.calcWidth();

	this.headerLeftContainer = this.leftContainer.append("div")
		.attr("class", "headerleftcon header left")
		.attr("id", "header-left-" + this.level);

	this.rightContainer = this.levelContainer.append("div")
		.attr("id", "right-" + this.level)
		.attr("class", "sidediv rightcon");

	this.chartContainer = this.leftContainer.append("svg")
		.attr("id", "chart-" + this.level)
		.attr("class", "chartcon chart-" + this.level);

	this.labelsGroup = this.leftContainer.append("div")
		.attr("id", "labelsgroup-" + this.level)
		.attr("class", "labelsgroup");

	this.levelContainer.transition().duration(500)
		.style("opacity", "1.0");

	/*
	*	Axis containers.
	*/

	this.axisWrap = this.chartContainer.append("g")
		.attr("class", "axiswrap")
		.attr("transform", "translate(" + (__WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].leftMargin) +", 0)");

	this.axisCon = this.axisWrap.append("g")
		.attr("class", "axiscon");

	this.mainContainer = this.chartContainer.append("g")
		.attr("class", "maincon")
		.attr("id", "main-" + this.level)
		.attr("transform", "translate(" + __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].leftMargin +", 0)");

	this.zeroAxis = this.axisCon.append("line")
		.attr("class", "zero")
		.attr("opacity", 0);

	/*
	* 	Title.
	*	Headers.
	*/

	this.selectionText = this.headerLeftContainer.append("div")
		.attr("class", "title selection-name")
		.attr("id", "selection-name-" + this.level);
	//	.text("Bonn Budget");


	this.levelText = this.headerLeftContainer.append("div")
		.attr("class", "title level-name")
		.attr("id", "level-name-" + this.level);

	/*
	*	Controls.
	*/

	this.controlContainer = this.controlPanel.append("div")
		.attr("class", "controlcon")
		.attr("id", "controlbox-" + this.level);

	/*
	*	Display mode.
	*/

	this.displayControl = this.controlContainer.append("div")
		.attr("class", "displaybox controlbox")
		.attr("id", "displaybox-" + this.level);

	this.displayDesc = this.displayControl.append("div")
		.attr("class", "displaydesc controldesc")
		.attr("id", "displaydesc-" + this.level);

	this.displayText = this.displayDesc.append("span")
		.attr("class", "displaytext controltext")
		.attr("id", "displaytext-" + this.level)
		.text("View");

	this.displayHelp = this.displayDesc.append("span")
		.attr("class", "displayhelp controlhelp help")
		.attr("id", "displayhelp-" + this.level)
		.on("click", () => {
			const x = __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthControlPanel, y = 16;
			__WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].help(x, y, __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].LEFT, this, __WEBPACK_IMPORTED_MODULE_3__ui_text__["a" /* Help */].EN.view);
		});

	this.displaySwitch = this.displayControl.append("div")
		.attr("class", "switch");

	this.displayOverTime = this.displaySwitch.append("button")
		.attr("id", "displayovertime-" + this.level)
		.text("Over time")
		.on("click", () => this.setDisplay(__WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["d" /* View */].TIME));

	this.displayCategories = this.displaySwitch.append("button")
		.attr("class", "last active-button")
		.attr("id", "displaycats-" + this.level)
		.text("Categories")
		.on("click", () => this.setDisplay(__WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["d" /* View */].CATS));

	/*
	* Mode control.
	*/

	this.modeControl = this.controlContainer.append("div")
		.attr("class", "modebox controlbox")
		.attr("id", "modebox-" + this.level);

	this.modeDesc = this.modeControl.append("div")
		.attr("class", "modedesc controldesc")
		.attr("id", "modedesc-" + this.level);

	this.modeText = this.modeDesc.append("span")
		.attr("class", "modetext controltext")
		.attr("id", "modetext-" + this.level)
		.text("Mode");

	this.modeHelp = this.modeDesc.append("span")
		.attr("class", "modehelp controlhelp help")
		.attr("id", "modehelp-" + this.level)
		.on("click", () => {
			const x = __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthControlPanel, y = 80;
			__WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].help(x, y, __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].LEFT, this, __WEBPACK_IMPORTED_MODULE_3__ui_text__["a" /* Help */].EN.mode);
		});

	this.modeSwitch = this.modeControl.append("div")
			.attr("class", "switch");

	this.modePlus = this.modeSwitch.append("button")
		.attr("class", "active-button")
		.attr("id", "modeplus-" + this.level)
		.text("Spending")
		.on("click", () => {
			this.buttonPress(this.modePlus, this.modeSwitch);
			this.setMode(__WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].SPENDING);
		});

	this.modeMinus = this.modeSwitch.append("button")
		.attr("id", "modeMinus-" + this.level)
		.text("Revenue")
		.on("click", () => {
			this.buttonPress(this.modeMinus, this.modeSwitch);
			this.setMode(__WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].REVENUE);
		});

	this.modeBal = this.modeSwitch.append("button")
		.attr("id", "modeBal-" + this.level)
		.attr("class", "last")
		.text("Balance")
		.on("click", () => {
			this.buttonPress(this.modeBal, this.modeSwitch);
			this.setMode(__WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].BAL);
		});

	// this.modeComb = this.modeSwitch.append("button")
	// 	.attr("class", "last")
	// 	.attr("id", "modeComb-" + this.level)
	// 	.text("Com")
	// 	.on("click", () => {
	// 		this.buttonPress(this.modeComb, this.modeSwitch);
	// 		c.setMode(Mode.COMB);
	// 	});

	/*
	* Year control.
	*/

	this.yearControl = this.controlContainer.append("div")
		.attr("class", "yearbox controlbox")
		.attr("id", "yearbox-" + this.level);

	this.yearDesc = this.yearControl.append("div")
		.attr("class", "yeardesc controldesc")
		.attr("id", "yeardesc-" + this.level);

	this.yearText = this.yearDesc.append("span")
		.attr("class", "yeartext controltext")
		.attr("id", "yeartext-" + this.level)
		.text("Year");

	this.yearHelp = this.yearDesc.append("span")
		.attr("class", "yearhelp controlhelp help")
		.attr("id", "yearhelp-" + this.level)
		.on("click", () => {
			const x = __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthControlPanel, y = 144;
			__WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].help(x, y, __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].LEFT, this, __WEBPACK_IMPORTED_MODULE_3__ui_text__["a" /* Help */].EN.year);
		});

	this.yearSwitch = this.yearControl.append("div")
			.attr("class", "switch");

	this.yearSelect = this.yearSwitch.append('select')
				.attr('class','select')
			.on("change", () => this.setYear());

	this.yearSelect.selectAll("option")
			.data(Array.from(this.years).reverse()).enter()
			.append("option").text(d => d)
			.attr("class", "opt");

	this.yearSelect.node().value = this.year || DATA_CONFIG.startYear;

	/*
	* Sort control.
	*/

	this.sortControl = this.controlContainer.append("div")
		.attr("class", "sortbox controlbox")
		.attr("id", "sortbox-" + this.level);

	this.sortDesc = this.sortControl.append("div")
		.attr("class", "sortdesc controldesc")
		.attr("id", "sortdesc-" + this.level);

	this.sortText = this.sortDesc.append("span")
		.attr("class", "sorttext controltext")
		.attr("id", "sorttext-" + this.level)
		.text("Sort");

	this.sortHelp = this.sortDesc.append("span")
		.attr("class", "sorthelp controlhelp help")
		.attr("id", "sorthelp-" + this.level)
		.on("click", () => {
			const x = __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthControlPanel, y = 208;
			__WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].help(x, y, __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].LEFT, this, __WEBPACK_IMPORTED_MODULE_3__ui_text__["a" /* Help */].EN.sort);
		});

	this.sortSwitch = this.sortControl.append("div")
		.attr("class", "switch");

	this.sortNumerical = this.sortSwitch.append("button")
		.attr("id", "sortbytext-" + this.level)
		.text("123")
		.on("click", () => {
			this.buttonPress(this.sortNumerical, this.sortSwitch);
			this.sortBars(0, __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["c" /* Sort */].NUM);
		});

	this.sortAlphabetical = this.sortSwitch.append("button")
		.attr("class", "last active-button")
		.attr("id", "sortbytext-" + this.level)
		.text("ABC")
		.on("click", () => {
			this.buttonPress(this.sortAlphabetical, this.sortSwitch);
			this.sortBars(0, __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["c" /* Sort */].ABC);
		});

	this.controlContainer.selectAll(".help").on("mouseout",
	 		() => __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].hide(this, false));

	// No data message box.
	this.no = this.leftContainer.append("div")
		.attr("class", "nodata")
		.attr("id", "nodata-" + this.level);
};

Chart.prototype.calcWidth = function () {
	this.chartWidth = this.leftContainer.node().offsetWidth;
	this.width = this.chartWidth +
		__WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthControlPanel + __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthRight;

	this.axisWidth = this.width - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthRight -
					__WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].leftMargin - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthControlPanel
					- __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].axisMarginRight;
	this.actWidth = this.axisWidth - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].rightPadding;
	this.graphWidth = this.axisWidth - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].rightPadding;
	// Find minimum width acceptable for the chart.

	document.documentElement.style.setProperty("--width-page", this.width);
};


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = BarDisplay;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__display__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__script__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_styling__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tooltip__ = __webpack_require__(3);
/*jshint esversion: 6 */








function BarDisplay (chart) {
	__WEBPACK_IMPORTED_MODULE_0__display__["a" /* default */].call(this, chart);

	this.xScale = d3.scale.ordinal();
	this._xGroup = d3.scale.ordinal();
	// this.updateXScale();
	// this.updateXScaleRange();

	this.xAxis = d3.svg.axis().scale(this.xScale);

	this.barsContainer = this.container;
	this.barsContainer	.attr("class", "barscon")
						.attr("id", "barscon-" + chart.level);

	this.labelsCon.attr("id", "labelscon-bar-" + chart.level);

	// this.labelsText = this.getLabels();
	this.selected = -1;
	this.sortMode = __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["c" /* Sort */].ABC;
	this.bandLimit = 14;
}

BarDisplay.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_0__display__["a" /* default */].prototype);

BarDisplay.prototype.setupChart = function () {
	if (!this.dataAvailable()) {
		this.noDataMessage();
		return;
	}
	__WEBPACK_IMPORTED_MODULE_0__display__["a" /* default */].prototype.setupChart.call(this);
};

BarDisplay.prototype.minimizeItems = function (items = null, duration = 500) {
	items = items || this.barsContainer.selectAll('.bar-rect');
	const trans = items.transition().duration(duration);
	trans	.attr("y", this.yScale(0))
			.attr("height", 0);
	return trans;
};

BarDisplay.prototype.addDimension = function (dim, checkData = false) {
	// if display already active...
	if (this.active) {
		// and there is no data...
		if(this.noData) {
			// and new dimension data is also not available...
			if (!this.dataAvailable([dim])) {
				// update the noDataMessage and exit.
				this.setNoDataMessage();
				return;
			}
			// if data is now available, set up chart
			__WEBPACK_IMPORTED_MODULE_0__display__["a" /* default */].prototype.setupChart.call(this, [dim]);
		}
		// and chart is set, then update axis to accomodate
		// new data from new dimension.
		else if (this.chartSet)
			this.setAxis(true, true);
	}

	this._xGroup.domain(d3.range(this.c.shownDimensions.length));

	// Select all existing bars to reduce their width.
	let bars = this.barsContainer
				.selectAll(".bar-rect")
				.filter(b => b.dim!=dim);
	if (this.chartSet && !bars.empty()) {
		const _this = this;

		bars.transition()
			.duration(500)
			.call(function () {
				_this.setBarsWidth.call(this, _this);
			 	_this.setBarsHeight.call(this, _this);
			});
	}

	this.renderDimension(dim);
	this.barsContainer.selectAll(".bar-rect")
			.filter(d => d.id==this.selected)
			.style("opacity", 1.0);
};

// Generates the bars and attaches data to them.
BarDisplay.prototype.buildBars = function (bars, dim) {
	console.log("buildBars");
	const c = this.c,
		  _this = this;
	const hi = 1.0;
	const lo = 0.4;

	// Specify which dimension is represented by this set of bars.
	// All dimensions are kept so that sorting is possible by
	// dimensions other than current.
	bars = bars.data(this.getDimensionData(dim));

	bars.enter()
		.append("rect")
		// To make sure bars only appear within chart.
		.attr("x", c.axisWidth - this.xScale.rangeBand())
		.attr("fill", Object(__WEBPACK_IMPORTED_MODULE_3__ui_styling__["b" /* getItemColor */])(dim))
		.style("fill-opacity", 0)
		.attr("dim", dim)
		.attr("class", "bar-rect level-" + c.level)
		.call(function() {
			_this.setListeners.call(this, _this); })
		.style("opacity", (d) => {
			if (this.c.action==__WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["a" /* Action */].ADD && this.selected!=-1) {
				if (d.id == this.selected)	return hi;
				else 						return lo;
			}
		});

	bars.exit()
		.transition()
		.call(function () {
			_this.onExitTrans.call(this, _this); });
	return bars;
};

BarDisplay.prototype.updateXScaleRange = function (range) {
	this.xScale.rangeRoundBands([0, this.c.actWidth], 0.2);
	this._xGroup.rangeRoundBands([0, this.xScale.rangeBand()], 0);
};

BarDisplay.prototype.updateXScale = function () {
	this.xScale.domain(d3.range(this.c.fullData.length));
	this._xGroup.rangeRoundBands([0, this.xScale.rangeBand()], 0);
};

BarDisplay.prototype.updateYScale = function () {
	const c = this.c;
	if (c.mode == __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["b" /* Mode */].SPENDING || c.mode == __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["b" /* Mode */].COMB)
		this.yScale.domain([0, this.getShownMax()
		]);
	else if (c.mode == __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["b" /* Mode */].REVENUE)
		this.yScale.domain([this.getShownMin(), 0]);
	else if (c.mode == __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["b" /* Mode */].BAL) {
		let min = this.getShownMin();
		let max = this.getShownMax();
		if (min > 0)
			min = 0;
		else if (max < 0)
			max = 0;
		// If all values are zero, show an empty
		// chart with coordinates stretched to extremes.
		if (min==0 && max==0) {
			c.mode = __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["b" /* Mode */].SPENDING;
			max = this.getShownMax();
			c.mode = __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["b" /* Mode */].REVENUE;
			min = this.getShownMin();
			c.mode = __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["b" /* Mode */].BAL;
		}
		this.yScale.domain([min, max]);
	}

	this.yAxis.scale(this.yScale);
};

BarDisplay.prototype.renderDimension = function (dim) {
	console.log("renderDimension - " + dim);
	let bars = this.barsContainer
				.selectAll(".bar-rect")
				.filter(b => b.dim == dim);
	let duration = 1000;
	const _this = this;
	const hi = 1.0;
	const lo = 0.4;
	if ([__WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["a" /* Action */].ADD, __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["a" /* Action */].UPDATE].includes(this.c.action)) {
		bars = this.buildBars(bars, dim);
		if (this.c.action == __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["a" /* Action */].ADD) {
			bars.call(function () {
					_this.setBarsWidth.call(this, _this); })
				.attr("y", this.yScale(0))
				.attr("height", 0);
			duration = 500;
		}
	}

	const delay = 500;
	const offDelay = (this.chartSet ? 500 : 0);
	const dl = this.dataset.length;

	bars.transition()
		.delay((d, i) => {
			if (_this.c.action == __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["a" /* Action */].ADD)
				return (offDelay + (i / dl) * delay);
			return 0;
		})
		.duration(duration)
		.call(function () {
			if(_this.c.action!=__WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["a" /* Action */].RESIZE)
				_this.setBarsHeight.call(this, _this);
			if ([__WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["a" /* Action */].UPDATE, __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["a" /* Action */].RESIZE].includes(_this.c.action))
				_this.setBarsWidth.call(this, _this);
		});
};

BarDisplay.prototype.setDataset = function (_) {
	_.sort((a, b) => this.sortUtil(a, b));
	__WEBPACK_IMPORTED_MODULE_0__display__["a" /* default */].prototype.setDataset.call(this, _);
};


BarDisplay.prototype.removeAll = function () {
	const bars = this.barsContainer.selectAll(".bar-rect");
	bars.transition().duration(500)
		.attr("y", this.yScale(0))
		.attr("height", 0)
		.remove();
};

BarDisplay.prototype.removeDimension = function (dim) {
	const stayingBars = this.barsContainer
			.selectAll(".bar-rect")
			.filter(b => this.c.shownDimensions.includes(b.dim));

	const goingBars = this.barsContainer
			.selectAll(".bar-rect").filter(b => b.dim == dim);

	this._xGroup.domain(d3.range(this.c.shownDimensions.length));
	// If display is not active, then all bars are
	// going hence no need to update scale.
	if (this.active) {
		// while if is display is active and only dimensions
		// left open have no data available...
		if (this.noData || !this.dataAvailable()) {
			// update the noDataMessage and exit.
			this.noDataMessage();
		} else {
			this.updateYScale();
			const _this = this;
			stayingBars.transition()
			//	.delay(function (d, i) { return i / dl * 500; })
				.duration(500)
				.call(function () { _this.setBarsHeight.call(this, _this); })
				.transition()
				.call(function () { _this.setBarsWidth.call(this, _this); });
			this.setAxis(true, false);
		}
	}
	this.minimizeItems(goingBars).remove();
};

BarDisplay.prototype.getLabels = function () {
	return this.dataset.map(c => c.category);
};

BarDisplay.prototype.sortBars = function (dimension, sort = null) {
	const c = this.c,
		  sd = c.shownDimensions,
		  _this = this;

	this.sortMode = sort || this.sortMode;
	this.sortDim = c.shownDimensions[dimension];

	// let sortUtil = function (a, b) {
	// 	const c = _this.c;
	// 	if (_this.sortMode == Sort.NUM)
	// 		return d3.descending(	c.val(a, _this.sortDim),
	// 								c.val(b, _this.sortDim));
	// 	else if (_this.sortMode == Sort.ABC)
	// 		return d3.ascending(a.category, b.category);
	// };

	if (this.sortMode == __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["c" /* Sort */].NUM) {
		c.sortNumerical.classed("active-button", true);
		c.sortAlphabetical.classed("active-button", false);
	} else if (this.sortMode == __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["c" /* Sort */].ABC) {
		c.sortNumerical.classed("active-button", false);
		c.sortAlphabetical.classed("active-button", true);
	}

	this.dataset.sort((a, b) => this.sortUtil(a, b));

	// Sort bars.
	sd.forEach((dim, k) => {
		let bars = this.barsContainer.selectAll('rect')
					.filter(b => b.dim == dim);
		bars.sort((a, b) => this.sortUtil(a, b))
			.transition("sort").duration(500)
			.attr("x", (d, i) => {
				let pos = (this.xScale.rangeBand() / sd.length) * k;
				return this.xScale(i) + pos; });
	});

	// Sort labels.
	this.labelsCon.selectAll("span")
		.filter(".axis-label")
		.sort((a, b) => this.sortUtil(a, b))
		.transition("sort")
		.duration(500)
		.style("left", (d, i) => this.getLabelX(i));
};

// Gets highest value across all visisble dimensions.
BarDisplay.prototype.getShownMax = function () {
	const max = Math.max.apply(null, this.c.shownDimensions.map(
		dim => d3.max(this.dataset.map(d =>
			Object(__WEBPACK_IMPORTED_MODULE_2__utils__["l" /* val */])(d, dim, this.c.mode, this.c.year)))));
	console.log("Max: " + max);
	return max;
};

// Gets minimum value across all visible dimensions.
BarDisplay.prototype.getShownMin = function () {
	const min = Math.min.apply(null, this.c.shownDimensions.map(
		dim => d3.min(this.dataset.map(d =>
			Object(__WEBPACK_IMPORTED_MODULE_2__utils__["l" /* val */])(d, dim, this.c.mode, this.c.year)))));
	console.log("Min: " + min);
	return min;
};

BarDisplay.prototype.getDimensionData = function (dim) {
	const data = this.dataset.map(
		d => (Object.assign({dim: dim}, d)));
	return data;
};

BarDisplay.prototype.highlight = function (index, highlight = true) {
//	c.destroy();
	const transition = this.barsContainer.transition().duration(150);
	const bars = this.barsContainer.selectAll(".bar-rect");
	const labels = this.labelsCon.selectAll(".axis-label");
	const dimColor = Object(__WEBPACK_IMPORTED_MODULE_3__ui_styling__["b" /* getItemColor */])();
	const duration = 100,
		  hi = 1.0,
		  lo = 0.4;

	const o = this.lop;
	let delay, durationOut = duration;
	if (highlight)
		delay = 0;
	else {
		delay = 1000;
		durationOut = 500;	// longer transtion on mouseout
	}

	labels.transition().duration(durationOut).delay(delay)
		.style("opacity", !highlight ? hi * o : lo * o)
		.style("font-weight", "normal");
	bars.transition(this.selected==-1 ? "general" : null)
		.duration(durationOut).delay(delay)
		.style("opacity", !highlight ? hi : lo);

	if (highlight && (index != this.selected)) {
		const bar = bars.filter(d => d.id==index);
		bar.transition("highlight-index").duration(duration)
			.style("opacity", "1.0");
		const label = labels.filter(d => d.id==index);
		label.transition().duration(duration)
			.style("opacity", hi);
	}
	const selectedBar = bars.filter(d => d.id==this.selected);
	selectedBar.transition().duration(duration)
		.style("opacity", hi);
//		.style("fill", "white");
	const selectedLabel = labels.filter(d => d.id==this.selected);
	selectedLabel.transition().duration(duration)
		.style("opacity", hi)
		.style("font-weight", "bold");
};



BarDisplay.prototype.mouseOver = function (d, target) {
	let bar;
	if (target instanceof HTMLSpanElement) {
		const first = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["d" /* firstDim */])(this.c.shownDimensions, this.c.year);
		d = Object.create(d);
		d.dim = first;
		const selection = this.barsContainer
			.selectAll(".bar-rect").filter(b =>
				b.id==d.id && b.dim==first);
		bar = selection.node();
	} else
		bar = target;

	const box = bar.getBBox();
	let x = box.x + box.width / 2;
	x = x + __WEBPACK_IMPORTED_MODULE_3__ui_styling__["a" /* Styles */].leftMargin + __WEBPACK_IMPORTED_MODULE_3__ui_styling__["a" /* Styles */].widthControlPanel;

	__WEBPACK_IMPORTED_MODULE_5__tooltip__["a" /* Tooltip */].draw(d, x, __WEBPACK_IMPORTED_MODULE_3__ui_styling__["a" /* Styles */].tooltipY - 1, __WEBPACK_IMPORTED_MODULE_5__tooltip__["a" /* Tooltip */].DOWN, this.c, false);

	if (d.id!=this.selected)
		this.highlight(d.id);
};

BarDisplay.prototype.mouseOut = function (d) {
	this.c.levelContainer.selectAll(".tooltip")
		.classed("hidden-delay", true);
	if (this.selected==-1)
		this.highlight(d.id, false);
	else
		this.highlight(this.selected);
};

BarDisplay.prototype.click = function (d) {
	const c = this.c;
	const index = (this.dataset.map (r => r.id)).indexOf(d.id);

	// const y = Styles.height + Styles.labelLength + Styles.bottomPadding,
	// 	  x = this.xScale(index) + this.xScale.rangeBand() / 2,
	// 	  points = (x + 20) + " " + (y)+ " " + (x - 20) +" " + (y)  +" "+ (x) + " "  + (y - 20);
	//	points = [10, 20, 30, 40, 50, 60];

	const svg = c.chartContainer;
	if (this.selected==-1) {

	} else
		this.highlight(this.selected, false);
	this.selected = d.id;
	this.highlight(this.selected);
	Object(__WEBPACK_IMPORTED_MODULE_1__script__["buildChart"])(	c.level + 1,
				c.fullData[d.id].values.data,
				d.category,
				c.year,
				c.shownDimensions);
};

BarDisplay.prototype.sortUtil = function (a, b) {
	const c = this.c;
	if (this.sortMode == __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["c" /* Sort */].NUM)
		return d3.descending(	Object(__WEBPACK_IMPORTED_MODULE_2__utils__["l" /* val */])(a, this.sortDim, c.mode, c.year),
								Object(__WEBPACK_IMPORTED_MODULE_2__utils__["l" /* val */])(b, this.sortDim, c.mode, c.year));
	else if (this.sortMode == __WEBPACK_IMPORTED_MODULE_4__ui_ui_state__["c" /* Sort */].ABC)
		return d3.ascending(a.category, b.category);
};

const Properties = (function () {
	const module = {};

	module.name = function () {

	};

	return module;
})();

/*
*	Methods which run on bar elements.
*/

BarDisplay.prototype.setBarsWidth = function (display) {
	console.log("barsWidth");
	const sd = display.c.shownDimensions;
	this.attr("width", display._xGroup.rangeBand())
		.attr("x", d => {
			const k = sd.indexOf(d.dim),
				  i = display.dataset.map(
					  item => item.data).indexOf(d.data),
				  r = display._xGroup(k);
			return display.xScale(i) + r;
		});
	};

BarDisplay.prototype.setBarsHeight = function (display) {
	console.log("barsHeight");
	const c = display.c;
	this.style("fill-opacity", 1)
		.attr("y", d => {
			// Add/subtract 1 pixel to keep short distance
			// between bars and axis.
			const v = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["l" /* val */])(d, d.dim, c.mode, c.year);
			if (v >= 0) return (display.yScale(v) - 1);
			else 		return (display.yScale(0) + 1);
		})
		.attr("height", d => Math.abs(display.yScale(0)
			- display.yScale(Object(__WEBPACK_IMPORTED_MODULE_2__utils__["l" /* val */])(d, d.dim, c.mode, c.year))));
	};

BarDisplay.prototype.onExitTrans = function (display) {
	this.duration(1000)
		.attr("x", display.c.axisWidth)
		.style("fill-opacity", "0")
		.remove();
};

BarDisplay.prototype.getLabelX = function (i) {
	return this.xScale(i) + this.xScale.rangeBand() / 2;
};

BarDisplay.prototype.setListeners = function (display) {
	this.on("mouseover", d => display.mouseOver(d, d3.event.target))
		.on("mouseout", d => display.mouseOut(d))
		.on("click", d => display.click(d));
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = GraphDisplay;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__display__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_ui_state__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_styling__ = __webpack_require__(0);
/*jshint esversion: 6 */






const DATA_CONFIG = __webpack_require__(7);

function GraphDisplay (chart) {
	__WEBPACK_IMPORTED_MODULE_0__display__["a" /* default */].call(this, chart);

	this.xScale = d3.scale.ordinal();
	this.xScaleGraph = d3.scale.linear();
	this.xAxis = d3.svg.axis().scale(this.xScaleGraph);

	this.graphContainer = this.container;
	this.graphContainer
		.attr("class", "graphcon")
		.attr("id", "graphcon-" + this.c.level);
	this.labelsCon.attr("id", "labelscon-graph-" + chart.level);

	this.line = d3.svg.line()
	//	.interpolate("cardinal")
		.x(d => this.xScaleGraph(d.year))
		.y(d => this.yScale(d.value));

	// this.labelsText = this.years;
	// this.fillLabels();
	// this.max = null;
	// this.min = null;
	this.pathData = {};
	this.bandLimit = 16;
}

GraphDisplay.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_0__display__["a" /* default */].prototype);

GraphDisplay.prototype.minimizeItems = function (	items = null,
													duration = 1000) {
	items = items || this.graphContainer.selectAll('.path, .point');
	const trans = items.transition().duration(duration);
	trans.style("opacity", 0);
	return trans;
};

GraphDisplay.prototype.renderDimension = function (dim) {
	const _this = this;
	const data = this.getPathData(dim);
	const id = this.c.level + "-" + dim;

	let path = this.graphContainer.select("#path-" + id);
	let points = this.graphContainer.selectAll("circle")
					.filter(".dim-" + dim)
					.data(data);
	// If path being built for the first time...
	if (!path.empty()) {
		path.transition().duration(1000)
			.attr("d", this.line(data));

		points.transition().duration(1000)
			.attr("cy", (d) => this.yScale(d.value));
		if (this.c.action == __WEBPACK_IMPORTED_MODULE_2__ui_ui_state__["a" /* Action */].RESIZE)
			points.transition("x").duration(1000)
				.attr("cx", d => this.xScaleGraph(d.year));
		// Keep to bring opacity back after fast display switch.
		if (!this.chartSet) {
			path.transition().style("opacity", 1);
			points.transition().style("opacity", 1);
		}
	} else {
		path = this.buildPath(dim, data);
		const tl = path.node().getTotalLength();
		path.transition("line")
			// .delay(350)
			.duration(1500)
			.attr("stroke-dashoffset", 0)
			// Keep to avoid graph shortening.
			.transition()
			.attr("stroke-dasharray", tl * 10);

		points = this.buildPoints(points, dim);
		points.transition("points")
			.delay((d, i) => i / DATA_CONFIG.years.length * 1000)
			.duration(1000)
			.style("opacity", 1);
	}
};

GraphDisplay.prototype.updateData = function () {
	//this.setAxis(true, true, true);

	__WEBPACK_IMPORTED_MODULE_0__display__["a" /* default */].prototype.updateData.call(this);
};

GraphDisplay.prototype.removeDimension = function (dim) {
	this.minimizeItems(this.graphContainer
		.select("#path-" + this.c.level + "-" + dim)).remove();

	this.minimizeItems(this.graphContainer
		.selectAll("circle.dim-" + dim)).remove();

	// Update remaining paths and points.
	if (this.active) {
		this.updateYScale();
		this.setAxis();
		this.c.shownDimensions.forEach(
			d => this.renderDimension(d));
	}
};

/*
*	Returns sums for all years available for specified dimension
*	necessary to draw the graph.
*/
GraphDisplay.prototype.getPathData = function (dim) {
	if (![__WEBPACK_IMPORTED_MODULE_2__ui_ui_state__["a" /* Action */].MODE, __WEBPACK_IMPORTED_MODULE_2__ui_ui_state__["a" /* Action */].YEAR, __WEBPACK_IMPORTED_MODULE_2__ui_ui_state__["a" /* Action */].UPDATE]
			.includes(this.c.action)
		&& this.pathData.hasOwnProperty(dim)) {
			return this.pathData[dim];
		}

	const years = DATA_CONFIG.dimYears[dim];
	const data = years.map(y => ({
		value: d3.sum(this.dataset.map(
			item => Object(__WEBPACK_IMPORTED_MODULE_1__utils__["l" /* val */])(item, dim, this.c.mode, y))),
		dim: dim,
		year: y
	}));
	this.pathData[dim] = data;
	return data;
};

GraphDisplay.prototype.buildPath = function (dim, data) {
	const _this = this;
	const path = this.graphContainer.append("path")
		.attr("d", this.line(data))
		.attr("stroke", Object(__WEBPACK_IMPORTED_MODULE_3__ui_styling__["b" /* getItemColor */])(dim))
		.attr("class", "path dim-" + dim)
		.attr("id", "path-" + this.c.level + "-" + dim);
	const tl = path.node().getTotalLength();
	path.attr("stroke-dasharray", tl)
		.attr("stroke-dashoffset", tl);
	return path;
};

GraphDisplay.prototype.buildPoints = function (p, dim) {
	const _this = this;
	p.enter()
		.append("circle")
		.attr("r", 5)
		.attr("fill", Object(__WEBPACK_IMPORTED_MODULE_3__ui_styling__["b" /* getItemColor */])(dim))
		.attr("class",
			d => ("point dim-" + d.dim + " year-" + d.year))
		.style("opacity", 0)
		.call(function () {
			_this.placePoint.call(this, _this); });
	return p;
};

GraphDisplay.prototype.getLabels = function () {
	return DATA_CONFIG.years;
};

GraphDisplay.prototype.getDimensionData = function (dim) {
	return DATA_CONFIG.years;
};

GraphDisplay.prototype.addDimension = function (dim) {
	if (this.active) {
		this.setAxis(false, true);	// RETURN.
		this.c.shownDimensions.forEach(
			d => this.renderDimension(d));
	} else
		this.renderDimension(dim);
};

GraphDisplay.prototype.updateXScale = function () {
	const y = DATA_CONFIG.years;
	this.xScale.domain(d3.range(y.length-1));
	this.xScaleGraph.domain([y[0], y[y.length-1]]);
};

GraphDisplay.prototype.updateYScale = function () {
	const max = this.getShownMax(),
		  min = this.getShownMin();

	this.yScale.domain([min, max]);
	this.yAxis.scale(this.yScale);
};

GraphDisplay.prototype.updateXScaleRange = function () {
	const range = [__WEBPACK_IMPORTED_MODULE_3__ui_styling__["a" /* Styles */].leftPadding, this.c.graphWidth];
	this.xScale.rangeRoundBands(range, 0.0);
	this.xScaleGraph.range(range, 0.1);
};

GraphDisplay.prototype.getLabelX = function (i) {
	const band = this.xScale.rangeBand();
	let x = i * band + this.xScale.range()[0];
//	x = x - 15;
	return x;
};

// Gets highest value across all visisble dimensions.
GraphDisplay.prototype.getShownMax = function () {
	const max = Math.max.apply(null, this.c.shownDimensions.map(
		dim => d3.max(DATA_CONFIG.dimYears[dim].map(y => d3.sum(
			this.dataset.map(
				item => Object(__WEBPACK_IMPORTED_MODULE_1__utils__["l" /* val */])(item, dim, this.c.mode, y)))))));
//	console.log("Max: " + max);
	return max;
};

// Gets minimum value across all visible dimensions.
GraphDisplay.prototype.getShownMin = function () {
	const min = Math.min.apply(null, this.c.shownDimensions.map(
		dim => d3.min(DATA_CONFIG.dimYears[dim].map(y => d3.sum(
			this.dataset.map(
				item => Object(__WEBPACK_IMPORTED_MODULE_1__utils__["l" /* val */])(item, dim, this.c.mode, y)))))));
//	console.log("Min: " + min);
	return min;
};

GraphDisplay.prototype.placePoint = function (display) {
	this.attr("cx", d => display.xScaleGraph(d.year))
		.attr("cy", d => display.yScale(d.value));
};

GraphDisplay.prototype.setListeners = function (display) {
	this.on("mouseover", d => display.mouseOver(d, d3.event.target))
		.on("mouseout", d => display.mouseOut(d, d3.event.target))
		.on("click", d => display.click(d));
};

GraphDisplay.prototype.mouseOver = function (d, item) {
	this.c.listPanel.setYear(d);
	this.c.listPanel.figuresShow(true);
	this.c.listPanel.setFigures(d);

	const circles = this.graphContainer.selectAll("circle");

	circles.filter(".year-" + d)
			.attr("fill-opacity", 0.5)
			.attr("r", 10);

	const labels = this.labelsCon.selectAll(".axis-label");
	labels.transition().duration(100)
		.style("opacity", 0.4 * this.lop);

	d3.select(item).transition().duration(100)
		.style("opacity", 1);
	// const i = (this.c.dataset.map (r => r.id)).indexOf(d.id);
	// this.tooltip(d, i);
	// if (d.id==this.c.selected)
	// 	return;
	// this.setBarState(d.id, 0.7, 100);
};

GraphDisplay.prototype.mouseOut = function (d, item) {
	if(!this.active) return;
	this.c.listPanel.setYear(null);
	this.c.listPanel.figuresHide(true);

	const p = this.graphContainer.selectAll("circle")
					.filter(".year-" + d)
					.transition().duration(250)
					.attr("fill-opacity", 1)
					.attr("r", 5);

	const labels = this.labelsCon.selectAll(".axis-label");
	labels.transition().duration(500).delay(1000)
		.style("opacity", 1 * this.lop);
};

GraphDisplay.prototype.click = function (y) {
	this.c.year = y;
	this.c.yearSelect.node().value = y;
//	this.c.updateStackedCharts();
	this.c.setDisplay(__WEBPACK_IMPORTED_MODULE_2__ui_ui_state__["d" /* View */].CATS);
};

GraphDisplay.prototype.highlight = function () {

};


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ListPanel;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_styling__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tooltip__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(2);
/*jshint esversion: 6 */






const DATA_CONFIG = __webpack_require__(7);

function ListPanel (chart) {
	this.c = chart;
	this.dimCon = this.c.rightContainer.append("div")
		.attr("class", "dimcon")
		.attr("id", "dimscon-" + this.c.level);

	this.list = this.dimCon.append("div")
		.attr("class", "dim-list")
		.attr("id", "dim-list-" + this.c.level);

	// Stack charts' scales.
	this.stackScales = [];
	this.stacksVisible = true;
	this.figsVisible = true;
}

ListPanel.prototype.activate = function () {
	DATA_CONFIG.dimensions.forEach ((d, i) => this._listDimension(d, i));
	this.setYear(this.c.year);
	this.updateStackedCharts();
};

ListPanel.prototype.addDimension = function (dim) {
	const sd = this.c.shownDimensions,
		  sds = this.c.stackedDataset,
		  c = this.c;

	// If max remains the same then
	// fill only the new dim.
	if (!this.updateMax())
		this.renderDimension(dim);
	else
		this.updateStackedCharts(false);
};

/*
*	Sets individual figure for dimension.
*/
ListPanel.prototype.setFigure = function(dim, y) {
	const year = y || this.c.year;
	const value = this.dimCon
			.select("#dim-value-" + this.c.level + "-" + dim),
		  sign = this.dimCon
		  	.select("#dim-sign-"+ this.c.level + "-" + dim);

	const sum = d3.sum(this.c.dataset
		.map(item => Object(__WEBPACK_IMPORTED_MODULE_3__utils__["l" /* val */])(item, dim, this.c.mode, year)));

	value.text("€" + Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* MoneyNum */])(sum));
	sign.text(Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* MoneySign */])(sum));
};

/*
*	Sets the year for which aggregate numbers will be
*	displayed. Current mode is used.
*/
ListPanel.prototype.setFigures = function (year) {
	this.c.shownDimensions.forEach(d => this.setFigure(d, year));
};

ListPanel.prototype.setYear = function (y) {
	const yearBoxes = this.list.selectAll(".dim-year"),
		  year = y || '';
	if (y == null) {
		yearBoxes.classed("hidden-delay", true);
	} else {
		yearBoxes.classed("hidden-delay", false);
		yearBoxes.text(year.toString());
	}
};

ListPanel.prototype._listDimension = function (dim, i) {
	const entryHeight = __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].dimListSpacing + __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].stackHeight,
		  id = this.c.level + "-" + dim;

	let last = false;
	if (i==DATA_CONFIG.dimensions.length-1)
		last = true;
	const entry = this.list.append("div")
				.attr("class", "dim-entry" + (last ? " last" : ''))
				.attr("id", "dim-entry-"+ id);

	const aux = entry.append("div")
				.attr("class", "aux")
				.attr("id", "aix-" + id);

	const marker = aux.append("div")
					.attr("class", "dim-marker")
				.attr("id", "dim-marker-"+ id)
			.style("background-color", Object(__WEBPACK_IMPORTED_MODULE_0__ui_styling__["b" /* getItemColor */])(dim));

	const figHelp = aux.append("span")
		.attr("class", "fighelp listhelp help")
		.attr("id", "fighelp-" + id)
		.on("click", () => {
			const x = this.c.width - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthRight,
				  y = 41;
			__WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].help(x, y, __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].RIGHT, this.c, help.EN.fig);
		});

	const stackHelp = aux.append("span")
		.attr("class", "stackhelp listhelp help")
		.attr("id", "stackhelp-" + id)
		.on("click", () => {
			const x = this.c.width - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthRight,
				  y = 62;
			__WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].help(x, y, __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].RIGHT, this.c, help.EN.stack);
		});

	aux.selectAll(".help").on("mouseout",
			() => __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].hide(this.c, false));

	const desc = entry.append("div")
					.attr("class", "dim-desc")
					.attr("id", "dim-desc-"+ id);
	const nameBox = desc.append("div")
					.attr("class", "dim-namebox")
					.attr("id", "dim-namebox-"+ id);
	const name = nameBox.append("div")
					.attr("class", "dim-name name")
					.attr("id", "dim-name-"+ id)
					.text(dim);
	const year = nameBox.append("div")
					.attr("class", "dim-year name")
					.attr("id", "dim-year-"+ id);
//					.text(dim);
	const figure = desc.append("div")
					.attr("class", "dim-figure")
					.attr("id", "dim-figure-"+ id);
	const value = figure.append("div")
					.attr("class", "dim-value")
			.attr("id", "dim-value-"+ id);
	const sign = figure.append("div")
					.attr("class", "dim-sign")
			.attr("id", "dim-sign-"+ id);
	const stackscon = desc.append("svg")
					.attr("class", "stackscon")
					.attr("id", "stackscon-" + id);

	// Remove button.
	entry.append("div")
			.attr("class", "dim-remove")
			.attr("id", "dim-remove-"+ id)
			.on("click", () => {
				const len = this.c.shownDimensions.length;
				if (len > 1 && d3.select(d3.event.target).classed("dim-remove")) {
					this.c.removeDimension(dim);
					entry.classed("active", false);
					stackscon.select("#stacks-" + id).remove();
					this.updateStackedCharts();
				}
				// Hide all (only one left) remove buttons.
				if(len==2) {
					this.dimCon.selectAll(".dim-remove")
						.classed("hidden", true);
				}
			});

	entry.on("click", () => {
		const remove = (d3.select(d3.event.target).classed("dim-remove"));
		if (this.c.shownDimensions.indexOf(dim) < 0 && !remove) {
			this.c.addDimension(dim);
			entry.classed("active", true);
			this.addDimension(dim);
			this.dimCon.selectAll(".dim-remove")
				.classed("hidden", false);
		}
	});

	if (this.c.shownDimensions.indexOf(dim) != -1)
		entry.classed("active", true);
	// this._placeAdd();
	// this.updateStackedCharts(dim);
};

/*
* 	Seys visibility of aggreagate numbers in the panel.
*/
ListPanel.prototype.figuresShow = function (instantShow = false) {
	if (this.figsVisible) return;

	this.dimCon.selectAll(".dim-figure")
		.classed("hidden", false)
		.classed("hidden-delay", false);

	const entries = this.dimCon.selectAll(".dim-entry");
	// Shows figures instantly (-instant class has no transition).
	if (instantShow) {
		entries.classed("stacks-hidden-instant", true);
		entries.classed("stacks-hidden", false);
	}
	entries.classed("figs-hidden", false)
			.classed("figs-hidden-delay", false);

	this.figsVisible = true;
};

ListPanel.prototype.figuresHide = function (delayHide = false) {
	if (!this.figsVisible) return;

	this.dimCon.selectAll(".dim-figure")
		.classed(delayHide ? "hidden-delay" : "hidden", true);
	this.dimCon.selectAll(".dim-entry")
		.classed("figs-hidden", true)
		.classed("figs-hidden-delay", delayHide)
		.classed("stacks-hidden", true)
		.classed("stacks-hidden-instant", false);

	this.figsVisible = false;
};

ListPanel.prototype.stackedChartsVisible = function (visible) {
	if (this.stacksVisible == visible)
		return;
	this.dimCon.selectAll(".stackscon")
		.classed("hidden", !visible);

	this.dimCon.selectAll(".dim-entry")
		.classed("stacks-hidden", !visible)
		.classed("stacks-hidden-instant", !visible);

	this.stacksVisible = visible;
};

ListPanel.prototype.renderDimension = function (dim) {
	this.setFigure(dim);

	if (this.c.mode == __WEBPACK_IMPORTED_MODULE_1__ui_ui_state__["b" /* Mode */].BAL)
		return;
	const sds = this.c.stackedDataset,
		  c = this.c,
		  id = this.c.level + "-" + dim,
		  di = DATA_CONFIG.dimensions.indexOf(dim),
		  desc = this.dimCon.select("#dim-desc-" + id),
		  sc = desc.select("#stackscon-" + id);
	let sg = sc.select("#stacks-" + id);
	if (sg.empty()) {
		sg = sc.append("g")
			.attr("class", "stacks")
			.attr("id", "stacks-" + id);
	}

	const filtered = sds.filter(d =>
		Math.abs(Object(__WEBPACK_IMPORTED_MODULE_3__utils__["l" /* val */])(d, dim, c.mode, c.year)) != 0);
	// Each stack is at least one pixel wide even though
	// some stacks normally would not even be visible
	// due to small values. So subtract number of stacks from
	// regular range to account for extra width of each stack.
	this.stackScales[di].rangeRound([0, __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].stackWidth], 0.0);


//	const rd = filtered.map (d => (Object.assign({dim: dim}, d)));
	const layers = d3.layout.stack()
		.y (d => d.x)
		.out((d, y0, y) => { d.x0 = y0, d.y = 0 })(
			filtered.map(d => [dim].map(dimension =>
				Object.assign(
					{ dim: dim,
						x: Math.abs(Object(__WEBPACK_IMPORTED_MODULE_3__utils__["l" /* val */])(d, dim, c.mode, c.year))
					}, d))))
		.map(d => d[0]);
	const len = layers.length;
	const stacks = sg.selectAll("rect").data(layers);
	stacks.enter().append("rect")
					.attr("class", "stacked-rect")
					.attr("width", 0)
					.attr("height", __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].stackHeight)
					.attr("fill", (d, i) => Object(__WEBPACK_IMPORTED_MODULE_0__ui_styling__["d" /* getStackItemColor */])(i))
					.attr("x", -len)
					.attr("index", (d, i) => i)
					.style("opacity", 0);

	stacks.transition ()
		.duration (1000)
		.attr("width", d => this.stackScales[di](d.x) + 1)
		.attr("x", d => this.stackScales[di](d.x0))
		.style("opacity", 1);

	stacks.exit()
		.transition()
		.duration (1000)
		.attr("width", 0)
		.attr("x", __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthRight)
		.style("opacity", 0)
		.remove();

	stacks	.on("mouseover", d => this.mouseOver(d, d3.event.target))
			.on("mouseout", d => this.mouseOut(d, d3.event.target));
};

ListPanel.prototype.updateStackedCharts = function (updateMax = true) {
	if (updateMax)
		this.updateMax();
	const sd = this.c.shownDimensions;
	sd.forEach(dim => this.renderDimension(dim));
};

/*
*	Returns true if max was updated.
*/
ListPanel.prototype.updateMax = function () {
	// Set domain to be sum of stacks of largest chart.
	const sd = this.c.shownDimensions,
		  sds = this.c.stackedDataset,
		  c = this.c,
		  oldMax = this.maxSum;
	const maxSum = Math.max.apply(null,
			sd.map(dim => Math.abs(sds.map(d =>
				Object(__WEBPACK_IMPORTED_MODULE_3__utils__["l" /* val */])(d, dim, c.mode, c.year))
					.reduce((a, b) => a + b))));
	this.maxDimSum = maxSum;
	this.stackScales = [...Array(DATA_CONFIG.dimensions.length)].map(
		() => d3.scale.linear().domain([0, this.maxDimSum]).nice());
	return maxSum != oldMax;
};

ListPanel.prototype.mouseOver = function (d, target) {
	const c = this.c,
		  id = c.level + "-" + d.dim,
		  con = this.dimCon.select("#stackscon-" + id);
	const stack = con.selectAll(".stacked-rect")
					.filter(s => s.id==d.id);
	stack.attr('fill', Object(__WEBPACK_IMPORTED_MODULE_0__ui_styling__["b" /* getItemColor */])(d.dim));

	// X
	const box = target.getBBox();
	let x = box.x + box.width / 2;
		x = x + 3 * __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].dimListMargin;
	x = this.c.width - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].widthRight + x;
	// Y
	const el = document.getElementById("dim-entry-" + id);
	let y = el.offsetTop;
		y = y + __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].topMargin + __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].stackHeight + 51; // bottom of stacks
	let by = y + __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].tooltipHeight + __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].arrowHeight,
		direction = __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].UP;
	// if tooltip overflow bottom
	if (by > __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].height)	{
		direction = __WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].DOWN;
		y = y - __WEBPACK_IMPORTED_MODULE_0__ui_styling__["a" /* Styles */].stackHeight;
	}

	__WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* Tooltip */].draw(d, x, y, direction, c, true);
};

ListPanel.prototype.mouseOut = function (d, target) {
	this.c.levelContainer.selectAll(".tooltip")
		.classed("hidden", true);
	const stack = d3.select(target);
	const index = parseInt(stack.attr("index"));
	stack.attr('fill', Object(__WEBPACK_IMPORTED_MODULE_0__ui_styling__["d" /* getStackItemColor */])(index));
};


/***/ })
/******/ ]);