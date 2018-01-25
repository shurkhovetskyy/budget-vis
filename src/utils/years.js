const d3 = Object.assign({},	require("d3-dsv"),
								require("d3-collection"),
								require("d3-request"),
								require("d3-array"));

const val = require('./val').val;
const Mode = require('../config/options').Mode;
const CONFIG = require('../config/settings.json');

/**
*	Returns list of years for which data is available
*	for specified dimension.
*/
function getAvailableYears (dim, data) {
	const range = CONFIG.yearsRange;
	const years = Array.from({ length: range[1] - range[0] + 1 },
		(v, k) => k + range[0]);
	const res = years.map(y => ({
		value: d3.sum(data.map(
			item => val(item, dim, Mode.COMB, y))),
		year: y
	}));
	return res.filter(d => d.value!=0).map(d => d.year);
}

/**
*	Finds list of years for which data is available
*	for each dimension separately.
*/
function getDimYears (data) {
	if (CONFIG.hasOwnProperty("dimYears"))
		return CONFIG.dimYears;
	const dimYears = {};
	CONFIG.dimensions.forEach (dim =>
		dimYears[dim] = getAvailableYears(dim, data));
	CONFIG.dimYears = dimYears;
	return dimYears;
}

module.exports.getDimYears = getDimYears;
