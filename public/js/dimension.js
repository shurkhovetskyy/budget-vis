/*jshint esversion: 6 */
class Dimension {

	constructor(name, chart) {
		this.name = name;
		this.c = chart;
	}

	setStackData (data) {
		this.data = data.filter(d => this.c.val(d, name) > 0);
	}

	setScaleStack () {

	}

	getScaleStack () {
		return this.xScaleStack;
	}
}
