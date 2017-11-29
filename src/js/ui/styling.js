/*jshint esversion: 6 */

const colorBands = ["rgb(19, 52, 83)", "rgb(13, 78, 73)", "rgb(16, 94, 40)"];
export const Colors = ["rgb(39, 127, 150)",
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
export const ColorSchemes = ["rgb(38, 47, 52)", "rgb(21, 28, 32)"];
export const Blacks = ["rgb(147, 147, 147)", "rgb(103, 102, 106)", "rgb(195, 195, 195)"];
let stackColors = [["rgb(11, 107, 128)", "rgb(125, 173, 244)", "rgb(37, 131, 199)"],
					["rgb(245, 165, 106)", "rgb(128, 64, 21)", "rgb(181, 93, 70)", "rgb(128, 40, 21)"],
					["rgb(210, 166, 66)", "rgb(218, 154, 46)", "rgb(231, 226, 91)"],
					[]];

export const Styles = (function() {
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
