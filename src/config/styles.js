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
	const y = styles.headerHeight + styles.topMargin + styles.topPadding;
	styles.tooltipY = y;
	styles.axisWidthShift = styles.widthRight +
							styles.leftMargin +
							styles.widthControlPanel +
							styles.axisMarginRight
	return styles;
}) ();

export default Styles;
