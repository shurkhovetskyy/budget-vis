/*jshint esversion: 6 */

import { Styles } from './ui/styling';
import { scrollTo } from './utils';
import Chart from './chart';

const DATA_CONFIG = require('../../data/config.json');

let charts = [];

function getChartAt (level) {
	let c = charts[level];
	// If no chart yet at this level.
	if (c==null) {
		c = new Chart(level);
		charts.push(c);
		scrollTo(document.body, Styles.height * level, 500);
	} else {
		scrollTo(document.body, Styles.height * (level-1), 250);
		// If there is already chart at this level, check if there
		// are charts at deeper levels and destroy them.
		const rest = charts.slice(level + 1, charts.length);
		rest.forEach (rc => rc.destroy());
		charts = charts.slice(0, level + 1);
	}
	return c;
}

function roll (csv, level) {
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

function buildChart(level, data, selectionName) {
	if (level >= DATA_CONFIG.levels.length)
		return;

	const chart = getChartAt(level)
			.setDataset(roll(data, level))
			.setStackedDataset(roll(data, DATA_CONFIG.levels.length - 1))
			.setLevel(level)
			.setSelectionName(selectionName)
			.setLevelName(DATA_CONFIG.levels[level]);
	chart.build();
}



(function() {
	const redraw = () => charts.forEach (c => c.resize());
	const launchChart = (filename) =>
		d3.dsv(";", "text/plain")(filename, csv =>
			buildChart(0, csv, DATA_CONFIG.name));

	window.addEventListener("resize", redraw);

	launchChart("data/out1.csv");
})();

export { buildChart };
