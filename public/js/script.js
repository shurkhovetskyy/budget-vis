/*jshint esversion: 6 */

var dataset = [5, 10, 20, 23, 6 , 4, 6, 8, 9, 3, 6, 9, 2, 13];

var maxLength = 16;
var maxValue = 42;

const colorBands = ["rgb(19, 52, 83)", "rgb(13, 78, 73)", "rgb(16, 94, 40)"];
const colors = ["rgb(39, 127, 150)",
				"rgb(212, 124, 60)",
				"rgb(224, 219, 86)",
				"rgb(78, 194, 101)",
			//	"rgb(121, 178, 194)"
			];
const highColors = ["rgb(39, 127, 150)",
				"rgb(212, 124, 60)",
				"rgb(224, 219, 86)",
				"rgb(78, 194, 101)",
			//	"rgb(121, 178, 194)"
			];

			//"rgb(121, 178, 194)" - nice blue ---- rgb(121, 20, 34)
const colorSchemes = ["rgb(38, 47, 52)", "rgb(21, 28, 32)"];
const blacks = ["rgb(147, 147, 147)", "rgb(103, 102, 106)", "rgb(195, 195, 195)"];
let stackColors = [["rgb(11, 107, 128)", "rgb(125, 173, 244)", "rgb(37, 131, 199)"],
					["rgb(245, 165, 106)", "rgb(128, 64, 21)", "rgb(181, 93, 70)", "rgb(128, 40, 21)"],
					["rgb(210, 166, 66)", "rgb(218, 154, 46)", "rgb(231, 226, 91)"],
					[]];
//stackColors = colors;
var charts = [];

const Styles = (function() {
	function getStyleProperty(property) {
		var styles = getComputedStyle(document.documentElement);
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

const help = {
	EN: {
		view: "<strong>Over time</strong><br>Shows change in sum of all categories year over year.<br><br><strong>Categories</strong><br>Shows breakdown of single year.",
		mode: "<strong>Spending</strong><br>Amount spent.<br><br><strong>Revenue</strong><br>Amount earned. <br><br> <strong>Balance</strong><br>Differnece between Spending and Revenue, shows whether year/category earned or lost money.",
		year: "Displays amounts for selected year.",
		sort: "<strong>123</strong><br> Numerical sort of categories by amount.<br><br> <strong>ABC</strong><br> Alphabetical sort of categories by name.",
		fig: "Sum of amounts of all categories shown.",
		stack: "Breakdown of types of costs that constitute the sum above. This view is not available in balanced mode."
	}
};

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
	dsv(filename, csv=>buildChart(0, csv, parser.getFirstLevelName(), parser));
}

launchChart("data/out1.csv", BonnParser);

function redraw () {
	charts.forEach (c => c.resize());
}

window.addEventListener("resize", redraw);
