/*jshint esversion: 6 */

import { Styles } from './ui/styling';
import { scroll, rollLevelData, roll } from './utils';
import Chart from './chart';

const CONFIG = require('../../config.json');

let charts = [];

function getChartAt (level) {
	let c = charts[level];
	// If no chart yet at this level.
	if (c==null) {
		c = new Chart(level);
		charts.push(c);
		scroll(document.body, Styles.height * level, 500);
	} else {
		scroll(document.body, Styles.height * (level-1), 250);
		// If there is already chart at this level, check if there
		// are charts at deeper levels and destroy them.
		const rest = charts.slice(level + 1, charts.length);
		rest.forEach (rc => rc.destroy());
		charts = charts.slice(0, level + 1);
	}
	let x;
	return c;
}

function buildChart(level, data, selectionName, year, shownDimensions) {
	if (level >= CONFIG.levels.length)
		return;

	const fullData = rollLevelData(data, level);
	const levelData = roll(fullData);
	const chart = getChartAt(level);

	const stacks = roll(rollLevelData(
		data, CONFIG.levels.length - 1));

	chart	.setFullData(fullData)
			.setDataset(levelData)
			.setStackedDataset(stacks)
			.setLevel(level)
			.setStartYear(year)
			.setShownDimensions(shownDimensions)
			.setSelectionName(selectionName)
			.setLevelDesc(CONFIG.levels[level])
			.build();
}

(function() {
	const redraw = () => charts.forEach (c => c.resize());
	const launch = (filename) =>
		d3.dsv(";", "text/plain")(filename, csv =>
			buildChart(0, csv,
				CONFIG.name,
				CONFIG.startYear,
				CONFIG.startDimensions));

	window.addEventListener("resize", redraw);

	launch("data/out_full.csv");
//	launch("data/out1.csv");
})();

export { buildChart };
