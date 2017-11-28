/*jshint esversion: 6 */
/*jshint sub:true*/

class BonnParser extends AbstractParser {

	constructor () {
	//	super();
	}

	static levelNames () {
		return ["Produktrahmen", "Produktbereich", "ProfitCenter", "Kostenart"];
	}
	static cats () {
		return ["Produktbereich", "Bezeichnung", "Profitcenter", "Kostenart"];
	}

	static parse (str) {
		if (str==""|| str==null) {
			return 0.0;
		} else {
			// var r = str.replace('.', '');
			// var r2 = r.replace(',','.');
			var fl = parseFloat(str);
			var a = fl;
			return (a < 0) ? a : a;
		}
	}

	static roll (csv, level) {
		var cats = this.cats();
		var ready = d3.nest()
		//	.key( d => d.Year)
			.key(function(d) {
				return d[cats[level]];
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

	static getDataset (data, level) {
		return this.roll (data, level);
	}

	static getStackedDataset (data) {
		return this.roll(data, this.cats().length-1);
	}

	static getLevelName (level) {
		return this.levelNames()[level];
	}

	static getFirstLevelName () {
		return "Bonn Budget";
	}

	static allowLevel (level) {
		return level < this.cats().length;
	}
}
