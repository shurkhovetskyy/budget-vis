import { colors, colorSchemes, blacks } from '../config/colors';
import { Sign } from '../config/text';
import { Sort } from '../config/options';
import { val } from './val';

const CONFIG = require('../config/settings.json');

export function getItemColor (dim) {
	const color = colors[CONFIG.dimensions
		.indexOf(dim) % colors.length];
	return color;
}

export function getLevelColor (level) {
	return colorSchemes[level % colorSchemes.length];
}

export function getStackItemColor (index) {
	const color = blacks[index % blacks.length];
	return color;
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

export function sortUtil (a, b, sort, mode, year, sortDim) {
	let res;
	if (sort == Sort.NUM)
		res = d3.descending(	val(a, sortDim, mode, year),
								val(b, sortDim, mode, year));
	else if (sort == Sort.ABC)
		res = d3.ascending(a.category, b.category);
	else
		res = 0;

	return res;
}

/**
*	Returns first available dimension among those shown.
*/
export function firstDim (shown, year) {
	const availableDimensions = shown.filter(
		dim => CONFIG.dimYears[dim].includes(year));
	return availableDimensions.shift();
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
