/*jshint esversion: 6 */
/*jshint loopfunc: true */

// Mode from displaying values.

const Mode = {
	SPENDING: "plus",
	REVENUE: "minus",
	COMB: "combined",
	BAL: "balanced"
};

// Mode for visualization.
const VIEW_TIME = "time";
const VIEW_CATS = "cats";

// Actions.
const ACTION_MODE = "mode";
const ACTION_RESIZE = "resize";
const ACTION_YEAR = "year";
const ACTION_UPDATE = "update";
const ACTION_ADD = "add";

// Sorting.
const SORT_NUM = "num";
const SORT_ABC = "abc";

const DISPLAY_TIME = "overtime";
const DISPLAY_CATS = "categories";

function Chart (level) {

	// Keeps track of visible dimensions.
	this.shownDimensions = ["Executed-Ist"];
	var sd = this.shownDimensions;
	// List of all dimensions available in data.
	this.dimensions = ["Executed-Ist", "Planentwurf", "Plan"];
	var dims = this.dimensions;
	// List of categories.
	this.categories = [];
	// Actual dataset.
	this.dataset = [];
	var ds = this.dataset;
	// Actual dataset.
	this.stackedDataset = [];
	var sds = this.stackedDataset;
	// Stack charts' scales.
	this.stackScales = [];
	// Current mode.
	this.mode = Mode.SPENDING;
	// Last action type.
	this.action = null;

	this.level = level;
	// Sum of largest dimension in current mode.
	this.maxDimSum = 0;
	this.widthRight = null;

	this.width = null;
	this.axisWidth = null;

	this.years = ["2024", "2023", "2022", "2021", "2020",
					"2019", "2018", "2017", "2016",
					"2015", "2014", "2013", "2012", "2011",
					"2010", "2009", "2008"];
	this.year = "2015";

	this.displayMode = DISPLAY_CATS;
	this.stacksVisible = true;

//	var svgDimCon = null;
	this.selected = -1;
	this.initialized = false;
	this.fullData = null;

	this.tt = (dim) => test(dim);
//	this.tt = test;
	// this.tt = function (dim) {
	// 	test(dim);
	// };

	// Reference to chart.
	var c = this;

	this.initialBuild();

	this.barDisplay = new BarDisplay(this);
	this.graphDisplay = new GraphDisplay(this);
	this.listPanel = new ListPanel(this);

	this.setParser = function (value) {
		this.parser = value;
		return this;
	};

	this.getParser = function () {
		return this.parser;
	};

	this.setStackedDataset = function(data) {
		var unpacked = this._rollupDataset(data);
		this.stackedDataset.length = 0;
		this.stackedDataset.push.apply(this.stackedDataset, unpacked); //.dataset;
	//	this.stackCategories = unpacked.categories;

		return this;
	};

	this._rollupDataset = function (value) {
		var cats = [];
		var item = null;
		var rolled = null;
		var parser = this.parser;
		// Retrieve names of all categories.
		return value.map ((c, i) => {
			item = {category: c.key,
					id: i };
			rolled = d3.nest()
				.key(d => d.Year).key(d => d.Sign)
				.rollup (v => ({
					"Executed-Ist"	: d3.sum(v, d => parser.parse(d["Executed-Ist"])),
					"Planentwurf"		: d3.sum(v, d => parser.parse(d["Planentwurf"])),
					"Plan"		: d3.sum(v, d => parser.parse(d["Plan"])) }))
				.entries(c.values.data);
			item.data = rolled;
			return item;
		});
	};

	this.setDataset = function(data) {

		// var yearIndex = data.findIndex(
		// 	item => item.key == year.toString());
		var value = data;//[yearIndex].values;
		this.fullData = value;
		var ds = [];
		// if (value.length > 0) {
		// 	for (var key in value[0].values.dimensions)
		// 		this.dimensions.push(key);
		// }

	//	sd.forEach ((dim, i) => sd[i] = this.dimensions[i]);

		var unpacked = this._rollupDataset(value);
		this.dataset.length = 0; // Clearing dataset array.
		this.dataset.push.apply(this.dataset, unpacked); // Pushing new data.
		this.categories = unpacked.map(c => c.category);

		this.barDisplay.setDataset(this.dataset);
		this.graphDisplay.setDataset(this.dataset);

		return this;
	};

	this.setShownDimensions = function (value) {
		sd = value;
		return this;
	};

	this.setSelectionName = function (value) {
		this.selectionName = value;
		return this;
	};

	this.setLevelName = function (value) {
		this.levelName = value;
		return this;
	};

	this.setLevel = function (value) {
		this.level = value;
		this.colorBand = colorSchemes[this.level%colorSchemes.length];
		return this;
	};

	this.destroy = function () {
		this.levelContainer.transition("opacity").duration(500)
			.style("opacity", 0);
		this.levelContainer.transition("remove").duration(500).remove();

	};

	this.setDefaults = function () {
		this.display.restore();
	};

	this.build = function () {
		if (!this.initialized) {
			this.action = ACTION_ADD;
			// this.initialBuild();
			this.setTitle();
			this.barDisplay.activate();
			// this.barDisplay.updateLabels();
			this.listPanel.activate();
			this.initialized = true;
		} else {
			this.action = ACTION_UPDATE;
			this.setDefaults();
			this.setTitle();
			this.updateData();
		}
		this.action = null;
	};

	/*
	*	Spread parameter indicates whether to add dimension
	*	to the list of shown dimensions or not (in this case)
	*	it is already there.
	*/
	this.addDimension = function (dim, push = true) {
		var start = new Date().getTime();
		this.action = ACTION_ADD;
		if(push)
			sd.push(dim);
//		this.display.addDimension.call(this, dim);
		this.display.addDimension(dim);
		this.action = null;
		var elapsed = new Date().getTime() - start;
		console.log(elapsed);
	//	this.listPanel.addDimension(dim);
	//	this.addDimensionList(dim);
	};

	this.removeDimension = function (dimension) {
		const ind = this.shownDimensions.indexOf(dimension);
		this.shownDimensions.splice(ind, 1);
		this.display.removeDimension(dimension);
		this.listPanel.updateStackedCharts();
	};

	this.resize = function () {
		this.action = ACTION_RESIZE;
		this.calcWidth();
		adjustFontSize(this.selectionText.node());
		//console.log(width);

		this.barDisplay.updateXScaleRange();
		this.graphDisplay.updateXScaleRange();
		this.barDisplay.updateLabels();
		this.graphDisplay.updateLabels();
		this.display.updateDimensions();
	};

	this.getStackItemColor = function (index) {
	//	const color = stackColors[sd.indexOf(dim)%colors.length][index%3];
		const color = blacks[index%blacks.length];
		return color;
	};

	this.getItemColor = function (dim) {
	//	const color = shadeRGBColor(this.colorBand, 0.3 + 0.2 * sd.indexOf(dim));
		const color = colors[dims.indexOf(dim)%colors.length];
		return color;
	};

	// Updates visualization when data changes.
	this.updateData = function () {
		this.display.updateData();
		this.listPanel.updateStackedCharts();
	};

	// Sets title on the top left of the chart.
	this.setTitle = function () {

	//	console.log(fs);
	//	fs = "32px";
		this.selectionText
			.transition("hide")
			.duration(500)
			.style("opacity", 0)
			.transition("text")
			.text(this.selectionName);

		let fs = getFontSize(	this.selectionText.node(),
								this.selectionName);
		console.log()

		this.selectionText
			.style("font-size", fs)
			.transition("reveal")
			.duration(500)
			.style("opacity", 1);

		this.levelText.text(this.levelName);
	//	adjustFontSize(this.selectionText.node());
	};

	function getDatum (data, mode, dimension) {
		// Get index of a sign.
		var i = data.findIndex(d => d.key == mode);
		if (i == -1)	return 0.0;
		else 			return data[i].values[dimension];
	}

	/*
	 *	Returns actual value given data item, desired dimension
	 *	and current display mode.
	 */
	this.val = function (d, ...params) {
		var dim = d.dim;
		var year = this.year;
		var yd = null;	// year data

		// If dimension is sent separately, use it, otherwise
		// it is included in the data object d.
		if (params.length > 0) {
			dim = params[0];
			if (params.length > 1)
				year = params[1];
		}
		// For some categories data might not be available
		// for all years or for all signs. Then return 0.
		var yi = d.data.findIndex(d => d.key == year.toString());
		if (yi == -1)	return 0.0;
		else 			yd = d.data[yi].values;

		if (c.mode==Mode.SPENDING || c.mode==Mode.REVENUE)
			return getDatum(yd, c.mode, dim);

		// Getting objects holding values at different signs.
		const plusData = getDatum(yd, Mode.SPENDING, dim);
		const minusData = getDatum(yd, Mode.REVENUE, dim);

		if (c.mode==Mode.BAL)
			return plusData + minusData;
		else if (c.mode == Mode.COMB) {
			const pa = Math.abs(plusData);
			const ma = Math.abs(minusData);
			const ra = pa + ma;
			return ra;
		}
	};

	/*
	*	Control panel button UI response.
	*/
	this.buttonPress = function (button, con) {
		con.selectAll("button").classed("active-button", false);
		button.classed("active-button", true);
	};

	this.setHelp = function (item, help, visible = true) {
		const x = 100,
			  y = 140;
		Tooltip.help(x, y, Tooltip.RIGHT, this, help);
	};

	this.setDisplay = function (displayMode) {
		this.displayMode = displayMode;
		this.action = ACTION_ADD;

		if(this.displayMode==DISPLAY_TIME) {
			this.buttonPress(this.displayOverTime, this.displaySwitch);
			this.graphDisplay.activate();
			this.listPanel.setYear(null);
			this.listPanel.figuresHide();
			this.listPanel.stackedChartsVisible(false);
			this.yearControl.classed("hidden", true);
			this.sortControl.classed("hidden", true);
		}
		else {
			this.buttonPress(this.displayCategories, this.displaySwitch);
			this.barDisplay.activate();
			this.yearControl.classed("hidden", false);
			this.sortControl.classed("hidden", false);
			this.listPanel.setYear(this.year);
			this.listPanel.figuresShow();
			if (displayMode != Mode.BAL) {
				this.listPanel.stackedChartsVisible(true);
				this.listPanel.updateStackedCharts();
			}
		}
		this.action = null;
	};

	this.setYear = function () {
		this.action = ACTION_YEAR;
		this.year = this.yearSelect.property("value");
		this.listPanel.setYear(this.year);
		this.updateData();
	//	this.display.sortBars(0, SORT_NUM);
		this.sortNumerical.classed("active-button", false);
		// this.sortAlphabetical.classed("active-button", false);
		this.action = null;
	};

	this.setMode = function (mode) {
		this.action = ACTION_MODE;
		this.mode = mode;
		this.sortNumerical.classed("active-button", false);
		this.updateData();

		if (this.displayMode == DISPLAY_TIME ||
			mode == Mode.BAL)
			this.listPanel.stackedChartsVisible(false);
		else
			this.listPanel.stackedChartsVisible(true);

		this.modePlus.classed("active-button", false);
		this.modeMinus.classed("active-button", false);
		this.modeBal.classed("active-button", false);
	//	this.modeComb.classed("active-button", false);

		this.sortNumerical.classed("active-button", false);

		if (mode == Mode.SPENDING) this.modePlus.classed("active-button", true);
		else if (mode == Mode.REVENUE) this.modeMinus.classed("active-button", true);
		else if (mode == Mode.BAL) this.modeBal.classed("active-button", true);
	//	else if (mode == Mode.COMB) this.modeComb.classed("active-button", true);
		this.action = null;
	};

	this.sortBars = function (dimension, sort = null) {
		this.display.sortBars(dimension, sort);
	};

	return this;
}

Chart.prototype.initialBuild = function () {

	this.board = d3.select("#board");
	this.levelContainer = this.board.append("div")
		.attr("id", "level-" + this.level)
		.attr("class", "levelcon level-" + this.level)
		.style("background-color", this.colorBand)
		.style("opacity", "0.0")
	//	.classed("hidden", true)
		;

	this.controlPanel = this.levelContainer.append("div")
		.attr("id", "controlpanel-" + this.level)
		.attr("class", "sidediv controlpanel");

	this.leftContainer = this.levelContainer.append("div")
		.attr("id", "left-" + this.level)
		.attr("class", "sidediv leftcon");

	this.calcWidth();

	this.headerLeftContainer = this.leftContainer.append("div")
		.attr("class", "headerleftcon header left")
		.attr("id", "header-left-" + this.level);

	this.rightContainer = this.levelContainer.append("div")
		.attr("id", "right-" + this.level)
		.attr("class", "sidediv rightcon");

	this.chartContainer = this.leftContainer.append("svg")
		.attr("id", "chart-" + this.level)
		.attr("class", "chartcon chart-" + this.level);

	this.labelsGroup = this.leftContainer.append("div")
		.attr("id", "labelsgroup-" + this.level)
		.attr("class", "labelsgroup");

	this.levelContainer.transition().duration(500)
		.style("opacity", "1.0");

	/*
	*	Axis containers.
	*/

	this.axisWrap = this.chartContainer.append("g")
		.attr("class", "axiswrap")
		.attr("transform", "translate(" + (Styles.leftMargin) +", 0)");

	this.axisCon = this.axisWrap.append("g")
		.attr("class", "axiscon");

	this.mainContainer = this.chartContainer.append("g")
		.attr("class", "maincon")
		.attr("id", "main-" + this.level)
		.attr("transform", "translate(" + Styles.leftMargin +", 0)");

	this.zeroAxis = this.axisCon.append("line")
		.attr("class", "zero")
		.attr("opacity", 0);

	/*
	* 	Title.
	*	Headers.
	*/

	this.selectionText = this.headerLeftContainer.append("div")
		.attr("class", "title selection-name")
		.attr("id", "selection-name-" + this.level);
	//	.text("Bonn Budget");


	this.levelText = this.headerLeftContainer.append("div")
		.attr("class", "title level-name")
		.attr("id", "level-name-" + this.level);

	/*
	*	Controls.
	*/

	this.controlContainer = this.controlPanel.append("div")
		.attr("class", "controlcon")
		.attr("id", "controlbox-" + this.level);

	/*
	*	Display mode.
	*/

	this.displayControl = this.controlContainer.append("div")
		.attr("class", "displaybox controlbox")
		.attr("id", "displaybox-" + this.level);

	this.displayDesc = this.displayControl.append("div")
		.attr("class", "displaydesc controldesc")
		.attr("id", "displaydesc-" + this.level);

	this.displayText = this.displayDesc.append("span")
		.attr("class", "displaytext controltext")
		.attr("id", "displaytext-" + this.level)
		.text("View");

	this.displayHelp = this.displayDesc.append("span")
		.attr("class", "displayhelp controlhelp help")
		.attr("id", "displayhelp-" + this.level)
		.on("click", () => {
			const x = Styles.widthControlPanel, y = 16;
			Tooltip.help(x, y, Tooltip.LEFT, this, help.EN.view);
		});

	this.displaySwitch = this.displayControl.append("div")
		.attr("class", "switch");

	this.displayOverTime = this.displaySwitch.append("button")
		.attr("id", "displayovertime-" + this.level)
		.text("Over time")
		.on("click", () => this.setDisplay(DISPLAY_TIME));

	this.displayCategories = this.displaySwitch.append("button")
		.attr("class", "last active-button")
		.attr("id", "displaycats-" + this.level)
		.text("Categories")
		.on("click", () => this.setDisplay(DISPLAY_CATS));

	/*
	* Mode control.
	*/

	this.modeControl = this.controlContainer.append("div")
		.attr("class", "modebox controlbox")
		.attr("id", "modebox-" + this.level);

	this.modeDesc = this.modeControl.append("div")
		.attr("class", "modedesc controldesc")
		.attr("id", "modedesc-" + this.level);

	this.modeText = this.modeDesc.append("span")
		.attr("class", "modetext controltext")
		.attr("id", "modetext-" + this.level)
		.text("Mode");

	this.modeHelp = this.modeDesc.append("span")
		.attr("class", "modehelp controlhelp help")
		.attr("id", "modehelp-" + this.level)
		.on("click", () => {
			const x = Styles.widthControlPanel, y = 80;
			Tooltip.help(x, y, Tooltip.LEFT, this, help.EN.mode);
		});

	this.modeSwitch = this.modeControl.append("div")
			.attr("class", "switch");

	this.modePlus = this.modeSwitch.append("button")
		.attr("class", "active-button")
		.attr("id", "modeplus-" + this.level)
		.text("Spending")
		.on("click", () => {
			this.buttonPress(this.modePlus, this.modeSwitch);
			this.setMode(Mode.SPENDING);
		});

	this.modeMinus = this.modeSwitch.append("button")
		.attr("id", "modeMinus-" + this.level)
		.text("Revenue")
		.on("click", () => {
			this.buttonPress(this.modeMinus, this.modeSwitch);
			this.setMode(Mode.REVENUE);
		});

	this.modeBal = this.modeSwitch.append("button")
		.attr("id", "modeBal-" + this.level)
		.attr("class", "last")
		.text("Balance")
		.on("click", () => {
			this.buttonPress(this.modeBal, this.modeSwitch);
			this.setMode(Mode.BAL);
		});

	// this.modeComb = this.modeSwitch.append("button")
	// 	.attr("class", "last")
	// 	.attr("id", "modeComb-" + this.level)
	// 	.text("Com")
	// 	.on("click", () => {
	// 		this.buttonPress(this.modeComb, this.modeSwitch);
	// 		c.setMode(Mode.COMB);
	// 	});

	/*
	* Year control.
	*/

	this.yearControl = this.controlContainer.append("div")
		.attr("class", "yearbox controlbox")
		.attr("id", "yearbox-" + this.level);

	this.yearDesc = this.yearControl.append("div")
		.attr("class", "yeardesc controldesc")
		.attr("id", "yeardesc-" + this.level);

	this.yearText = this.yearDesc.append("span")
		.attr("class", "yeartext controltext")
		.attr("id", "yeartext-" + this.level)
		.text("Year");

	this.yearHelp = this.yearDesc.append("span")
		.attr("class", "yearhelp controlhelp help")
		.attr("id", "yearhelp-" + this.level)
		.on("click", () => {
			const x = Styles.widthControlPanel, y = 144;
			Tooltip.help(x, y, Tooltip.LEFT, this, help.EN.year);
		});

	this.yearSwitch = this.yearControl.append("div")
			.attr("class", "switch");

	this.yearSelect = this.yearSwitch.append('select')
				.attr('class','select')
			.on("change", () => this.setYear());

	this.yearSelect.selectAll("option")
			.data(this.years).enter()
			.append("option").text(d => d)
			.attr("class", "opt");

	this.yearSelect.node().value = this.year;

	/*
	* Sort control.
	*/

	this.sortControl = this.controlContainer.append("div")
		.attr("class", "sortbox controlbox")
		.attr("id", "sortbox-" + this.level);

	this.sortDesc = this.sortControl.append("div")
		.attr("class", "sortdesc controldesc")
		.attr("id", "sortdesc-" + this.level);

	this.sortText = this.sortDesc.append("span")
		.attr("class", "sorttext controltext")
		.attr("id", "sorttext-" + this.level)
		.text("Sort");

	this.sortHelp = this.sortDesc.append("span")
		.attr("class", "sorthelp controlhelp help")
		.attr("id", "sorthelp-" + this.level)
		.on("click", () => {
			const x = Styles.widthControlPanel, y = 208;
			Tooltip.help(x, y, Tooltip.LEFT, this, help.EN.sort);
		});

	this.sortSwitch = this.sortControl.append("div")
		.attr("class", "switch");

	this.sortNumerical = this.sortSwitch.append("button")
		.attr("id", "sortbytext-" + this.level)
		.text("123")
		.on("click", () => {
			this.buttonPress(this.sortNumerical, this.sortSwitch);
			this.sortBars(0, SORT_NUM);
		});

	this.sortAlphabetical = this.sortSwitch.append("button")
		.attr("class", "last active-button")
		.attr("id", "sortbytext-" + this.level)
		.text("ABC")
		.on("click", () => {
			this.buttonPress(this.sortAlphabetical, this.sortSwitch);
			this.sortBars(0, SORT_ABC);
		});

	this.controlContainer.selectAll(".help").on("mouseout",
	 		() => Tooltip.hide(this, false));

	// No data message box.
	this.no = this.leftContainer.append("div")
		.attr("class", "nodata")
		.attr("id", "nodata-" + this.level);
};

Chart.prototype.calcWidth = function () {
	this.chartWidth = this.leftContainer.node().offsetWidth;
	this.width = this.chartWidth +
		Styles.widthControlPanel + Styles.widthRight;

	this.axisWidth = this.width - Styles.widthRight -
					Styles.leftMargin - Styles.widthControlPanel
					- Styles.axisMarginRight;
	this.actWidth = this.axisWidth - Styles.rightPadding;
	this.graphWidth = this.axisWidth - Styles.rightPadding;
	// Find minimum width acceptable for the chart.

	document.documentElement.style.setProperty("--width-page", this.width);
};
