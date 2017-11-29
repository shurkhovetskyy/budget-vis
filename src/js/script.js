/*jshint esversion: 6 */

var CONFIG = require('../../data/config.json');

import { Styles } from './ui/styling';
import Chart from './chart';
import BonnParser from './bonn-parser';

var maxLength = 16;
var maxValue = 42;


console.log(CONFIG.dimensions);


//stackColors = colors;
var charts = [];

function getChartAt (level) {
	var c = charts[level];
	// If no chart yet at this level.
	if (c==null) {
		c = new Chart(level);
		charts.push(c);
		scrollTo(document.body, Styles.height * level, 500);
	} else {
		scrollTo(document.body, Styles.height * (level-1), 250);
		// If there is chart at this level, check if there
		// are charts at deeper levels and destroy them.
		var rest = charts.slice(level + 1, charts.length);
		rest.forEach (rc => rc.destroy());
		charts = charts.slice(0, level + 1);

	}
	return c;
}

function buildChart(level, data, selectionName, parser) {
	if (!parser.allowLevel(level))
		return;

	const chart = getChartAt(level)
			.setParser (parser)
			.setDataset(parser.getDataset(data, level))
			.setStackedDataset(parser.getStackedDataset(data))
			.setLevel(level)
			.setSelectionName(selectionName)
			.setLevelName(parser.getLevelName(level));
	chart.build();
}

function launchChart (filename, parser) {
	var dsv = d3.dsv(";", "text/plain");
	dsv(filename, csv => buildChart(0, csv, parser.getFirstLevelName(), parser));
}

launchChart("data/out1.csv", BonnParser);

function redraw () {
	charts.forEach (c => c.resize());
}

window.addEventListener("resize", redraw);

export {buildChart};
