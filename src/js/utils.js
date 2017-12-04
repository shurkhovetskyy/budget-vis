/*jshint esversion: 6 */

import { Sign } from './ui/text';
import { Mode } from './ui/ui-state';

const CONFIG = require('../../config.json');

/**
*	Returns first available dimension among those shown.
*/
export function firstDim (shown, year) {
	const availableDimensions = shown.filter(
		dim => CONFIG.dimYears[dim].includes(year));
	return availableDimensions.shift();
}

export function roll (value) {
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

export function rollLevelData (csv, level) {
	const levels = CONFIG.levels;
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
	CONFIG.dimensions.forEach (dim =>
		entry[dim] = d3.sum(v, d => parseFloat(d[dim])));
	return entry;
}

/**
*	Returns list of years for which data is available
*	for specified dimension.
*/
function getAvailableYears (dim, data) {
	const years = Array.from(CONFIG.years);
	const res = years.map(y => ({
		value: d3.sum(data.map(
			item => val(item, dim, Mode.COMB, y))),
		year: y
	}));
	return res.filter(d => d.value!=0).map(d => d.year);
}

/**
*	Calculates the list of years from the range specified.
*/
export function readYears () {
	const range = CONFIG.yearsRange;
	const years = Array.from({ length: range[1] - range[0] + 1 },
		(v, k) => k + range[0]);
	CONFIG.years = years;
	return years;
}

/**
*	Finds list of years for which data is available
*	for each dimension separately.
*/
export function setDimYears (data) {
	const dimYears = {};
	CONFIG.dimensions.forEach (dim =>
		dimYears[dim] = getAvailableYears(dim, data));
	CONFIG.dimYears = dimYears;
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
export function val (d, dim, mode, year) {
	let yd;	// year data
	// For some categories data might not be available
	// for all years or for all signs. Then return 0.
	const yi = d.data.findIndex(d => d.key == year.toString());
	if (yi == -1)	return 0.0;
	else 			yd = d.data[yi].values;

	if (mode==Mode.SPENDING || mode==Mode.REVENUE)
		return getDatum(yd, mode, dim);

	// Getting objects holding values at different signs.
	const plusData = getDatum(yd, Mode.SPENDING, dim);
	const minusData = getDatum(yd, Mode.REVENUE, dim);

	if (mode==Mode.BAL)
		return plusData + minusData;
	else if (mode == Mode.COMB) {
		const pa = Math.abs(plusData);
		const ma = Math.abs(minusData);
		return pa + ma;
	}
}

/**
*	Scrolls the page smoothly.
*/
export function scroll (element, to, duration) {
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

export function MoneyNum(labelValue) {
  // Nine Zeroes for Billions
  const v = Math.abs(Number(labelValue)) >= 1.0e+9 ? (d3.format(".2f")(Math.abs(Number(labelValue)) / 1.0e+9))
       // Six Zeroes for Millions
       : Math.abs(Number(labelValue)) >= 1.0e+6 ? (d3.format(".1f")(Math.abs(Number(labelValue)) / 1.0e+6))
       // Three Zeroes for Thousands
       : Math.abs(Number(labelValue)) >= 1.0e+3 ? (d3.format(".1f")(Math.abs(Number(labelValue)) / 1.0e+3))
       : (d3.format(".1f")(Math.abs(Number(labelValue))));

	   return (labelValue < 0) ? -v: v;
}

export function MoneySign(labelValue) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9 ? Sign[CONFIG.lang].billion
       // Six Zeroes for Millions
       : Math.abs(Number(labelValue)) >= 1.0e+6 ? Sign[CONFIG.lang].million
       // Three Zeroes for Thousands
       : Math.abs(Number(labelValue)) >= 1.0e+3 ? Sign[CONFIG.lang].thousand
	   : "";
}

export const adjustFontSize = function (element) {
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

export const getFontSize = function (element, text) {
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

export const hide = function (el, duration = 500) {
	el.transition().duration(duration)
		.style("opacity", 0)
		.transition().duration(duration)
		.style("visibility", "hidden")
		;
};

export const reveal = function (el, duration = 500) {
	el.transition().duration(duration)
		.style("visibility", "visible")
		//	.transition().duration(duration)
		.style("opacity", 1);
};
