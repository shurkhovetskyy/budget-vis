const d3 = Object.assign({},	require("d3-dsv"),
								require("d3-collection"),
								require("d3-request"),
								require("d3-array"));

const val = require('./val').val;
const getDimYears = require ('./years').getDimYears;
const Mode = require('../config/options').Mode;

const CONFIG = require('../config/settings.json');

function overtime (rolled) {
	getDimYears(rolled);
	const data = {};
	const modes = [Mode.SPENDING, Mode.REVENUE, Mode.BAL];
	modes.forEach(mode => {
		let modeData = {};
		CONFIG.dimensions.forEach (dim =>
			modeData[dim] = mapYears(dim, mode, rolled))

		data[mode] = modeData;
	});
	return data;
}

function mapYears (dim, mode, rolled) {
	const data = CONFIG.dimYears[dim].map(y => (
		{
			value: d3.sum(rolled.map(
				item => Object(val(item, dim, mode, y)))),
			dim: dim,
			year: y
		}
	));
	return data;
}

function getData (data, level = 0, parent = 'na', year = '') {
	const levelData = getLevelData(data, level, parent, year);
	const rolled = roll(levelData);
	return rolled;
}

function getStacks (raw, parent = 'na', year, parentLevel) {
	var start = new Date().getTime();
		const data = raw;

	var end = new Date().getTime();
	var time = end - start;
	console.log('	Parsing time: ' + time);

	const levelData = getStacksLevelData(
		data, CONFIG.levels.length - 1, parent, year, parentLevel);
	const stacks = roll(levelData);

	return stacks;
}

function parse (raw) {
	return d3.dsvFormat(";").parse(raw);
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
			.entries(c.value.data);
		item.data = rolled;
		return item;
	});
}

function getStacksLevelData (data, level, parent, year, parentLevel) {
	const levels = CONFIG.levels;
	//console.log(data.length);
	if (parent != 'na')
		data = data.filter(v => v[levels[parentLevel]] == parent)

	if (year != '')
		data = data.filter(v => v.Year == year);
	//console.log(data.length);
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
		.entries(data);
	return ready;
}

function getLevelData (data, level, parent, year) {
	const levels = CONFIG.levels;
	//console.log(data.length);
	if (parent != 'na')
		data = data.filter(v => v[levels[level-1]] == parent)

	if (year != '')
		data = data.filter(v => v.Year == year);
	//console.log(data.length);
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
		.entries(data);
	return ready;
}

function generateEntry (v) {
	const entry = {};
	CONFIG.dimensions.forEach (dim =>
		entry[dim] = d3.sum(v, d => parseFloat(d[dim])));
	return entry;
}

module.exports = {
	getData: getData,
	overtime: overtime,
	getStacks: getStacks,
	parse: parse
};
