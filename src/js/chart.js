/*jshint esversion: 6 */
/*jshint loopfunc: true */

import { Styles, getLevelColor } from './ui/styling';
import { Mode, View, Action, Sort } from './ui/ui-state';
import { Tooltip } from './tooltip';
import { Help, Controls } from './ui/text';
import { getFontSize, adjustFontSize,
		 readYears, setDimYears } from './utils';

import BarDisplay from './display/bar-display';
import GraphDisplay from './display/graph-display';
import ListPanel from './list-panel';

const CONFIG = require('../../config.json');

export default function Chart (level) {
	// Keeps track of visible dimensions.
	this.shownDimensions = [];
	// Dimensions added at level above.
	this.newDimensions = [];
	// Actual dataset.
	this.dataset = [];
	// Actual dataset.
	this.stackedDataset = [];
	// Current mode.
	this.mode = Mode.SPENDING;
	// View - categories or over time.
	this.viewMode = View.CATS;
	// Last action type.
	this.action = null;
	// Level of this chart (starts with 0).
	this.level = level;
	// Sum of largest dimension in current mode.
	this.maxDimSum = 0;
	this.widthRight = null;
	this.width = null;
	this.axisWidth = null;

	this.initialized = false;

	this.years = CONFIG.years || readYears();

	this.initialBuild();

	this.barDisplay = new BarDisplay(this);
	this.graphDisplay = new GraphDisplay(this);
	this.listPanel = new ListPanel(this);

	this.setStackedDataset = function(_) {
		this.stackedDataset.length = 0;
		this.stackedDataset.push.apply(this.stackedDataset, _); //.dataset;
	//	this.stackCategories = unpacked.categories;
		return this;
	};

	this.setFullData = function (_) {
		this.fullData = _;
		return this;
	};

	this.setDataset = function(data) {
		this.dataset.length = 0;
		this.dataset.push.apply(this.dataset, data);

		if (!CONFIG.hasOwnProperty("dimYears"))
			setDimYears(data);
		return this;
	};

	this.setStartYear = function (startYear) {
		this.year = startYear;
		if (this.yearSelect!=undefined)
			this.yearSelect.node().value = this.year;
		return this;
	};

	this.setShownDimensions = function (value) {
		if (this.initialized) {
			this.newDimensions = value.filter(
				v => !this.shownDimensions.includes(v));
			this.shownDimensions = Array.from(value);
		}
		else
			this.shownDimensions = Array.from(value);
		return this;
	};

	this.setSelectionName = function (value) {
		this.selectionName = value;
		return this;
	};

	this.setLevelDesc = function (value) {
		this.levelDesc = value;
		return this;
	};

	this.setLevel = function (value) {
		this.level = value;
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
		this.barDisplay.setDataset(this.dataset);
		this.graphDisplay.setDataset(this.dataset);
		if (!this.initialized) {
			this.action = Action.ADD;
			this.setTitle();
			this.barDisplay.activate();
			this.listPanel.activate();
			this.initialized = true;
		} else {

			this.action = Action.UPDATE;
			this.setDefaults();
			this.setTitle();
			this.updateData();

			console.log(this.newDimensions);
			this.newDimensions.forEach(
				dim => this.listPanel.addDimension(dim));
			this.newDimensions.length = null;

		}
		this.action = null;
	};

	this.addDimension = function (dim, push = true) {
		this.action = Action.ADD;
		if(push)
			this.shownDimensions.push(dim);
		this.display.addDimension(dim);
		this.action = null;
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
		this.action = Action.RESIZE;
		this.calcWidth();
		adjustFontSize(this.selectionText.node());
		//console.log(width);

		this.barDisplay.updateXScaleRange();
		this.graphDisplay.updateXScaleRange();
		this.barDisplay.updateLabels();
		this.graphDisplay.updateLabels();
		this.display.updateDimensions();
	};

	// Updates visualization when data changes.
	this.updateData = function () {
		this.display.updateData();
		this.listPanel.updateStackedCharts();
	};

	// Sets title on the top left of the chart.
	this.setTitle = function () {

		// this.selectionText
		// 	.transition("hide")
		// 	.duration(500)
		// 	.style("opacity", 0)
		// 	.transition("text")
		// 	.text(this.selectionName);
		//
		// let fs = getFontSize(	this.selectionText.node(),
		// 						this.selectionName);
		//
		// this.selectionText
		// 	.style("font-size", fs)
		// 	.transition("reveal")
		// 	.duration(500)
		// 	.style("opacity", 1);

		this.levelText.text(this.levelDesc);
		this.selectionText.text(this.selectionName);
		adjustFontSize(this.selectionText.node());
	};

	/*
	*	Control panel button UI response.
	*/
	this.buttonPress = function (button, con) {
		con.selectAll("button").classed("active-button", false);
		button.classed("active-button", true);
	};

	this.setDisplay = function (viewMode) {
		this.viewMode = viewMode;
		this.action = Action.ADD;

		if(this.viewMode==View.TIME) {
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
			if (viewMode != Mode.BAL) {
				this.listPanel.stackedChartsVisible(true);
				this.listPanel.updateStackedCharts();
			}
		}
		this.action = null;
	};

	this.setYear = function () {
		this.action = Action.YEAR;
		this.year = parseInt(this.yearSelect.property("value"));
		this.listPanel.setYear(this.year);
		this.updateData();
		this.sortNumerical.classed("active-button", false);
		this.action = null;
	};

	this.setMode = function (mode) {
		this.action = Action.MODE;
		this.mode = mode;
		this.sortNumerical.classed("active-button", false);
		this.updateData();

		if (this.viewMode == View.TIME ||
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
		.style("background-color", getLevelColor(this.level))
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
		.text(Controls[CONFIG.lang].display);

	this.displayHelp = this.displayDesc.append("span")
		.attr("class", "displayhelp controlhelp help")
		.attr("id", "displayhelp-" + this.level)
		.on("click", () => {
			const x = Styles.widthControlPanel, y = 16;
			Tooltip.help(x, y, Tooltip.LEFT, this, Help.EN.view);
		});

	this.displaySwitch = this.displayControl.append("div")
		.attr("class", "switch");

	this.displayOverTime = this.displaySwitch.append("button")
		.attr("id", "displayovertime-" + this.level)
		.text(Controls[CONFIG.lang].overtime)
		.on("click", () => this.setDisplay(View.TIME));

	this.displayCategories = this.displaySwitch.append("button")
		.attr("class", "last active-button")
		.attr("id", "displaycats-" + this.level)
		.text(Controls[CONFIG.lang].categories)
		.on("click", () => this.setDisplay(View.CATS));

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
		.text(Controls[CONFIG.lang].mode);

	this.modeHelp = this.modeDesc.append("span")
		.attr("class", "modehelp controlhelp help")
		.attr("id", "modehelp-" + this.level)
		.on("click", () => {
			const x = Styles.widthControlPanel, y = 80;
			Tooltip.help(x, y, Tooltip.LEFT, this, Help.EN.mode);
		});

	this.modeSwitch = this.modeControl.append("div")
			.attr("class", "switch");

	this.modePlus = this.modeSwitch.append("button")
		.attr("class", "active-button")
		.attr("id", "modeplus-" + this.level)
		.text(Controls[CONFIG.lang].spending)
		.on("click", () => {
			this.buttonPress(this.modePlus, this.modeSwitch);
			this.setMode(Mode.SPENDING);
		});

	this.modeMinus = this.modeSwitch.append("button")
		.attr("id", "modeMinus-" + this.level)
		.text(Controls[CONFIG.lang].revenue)
		.on("click", () => {
			this.buttonPress(this.modeMinus, this.modeSwitch);
			this.setMode(Mode.REVENUE);
		});

	this.modeBal = this.modeSwitch.append("button")
		.attr("id", "modeBal-" + this.level)
		.attr("class", "last")
		.text(Controls[CONFIG.lang].balance)
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
		.text(Controls[CONFIG.lang].year);

	this.yearHelp = this.yearDesc.append("span")
		.attr("class", "yearhelp controlhelp help")
		.attr("id", "yearhelp-" + this.level)
		.on("click", () => {
			const x = Styles.widthControlPanel, y = 144;
			Tooltip.help(x, y, Tooltip.LEFT, this, Help.EN.year);
		});

	this.yearSwitch = this.yearControl.append("div")
			.attr("class", "switch");

	this.yearSelect = this.yearSwitch.append('select')
				.attr('class','select')
			.on("change", () => this.setYear());

	this.yearSelect.selectAll("option")
			.data(Array.from(this.years).reverse()).enter()
			.append("option").text(d => d)
			.attr("class", "opt");

	this.yearSelect.node().value = this.year || CONFIG.startYear;

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
		.text(Controls[CONFIG.lang].sort);

	this.sortHelp = this.sortDesc.append("span")
		.attr("class", "sorthelp controlhelp help")
		.attr("id", "sorthelp-" + this.level)
		.on("click", () => {
			const x = Styles.widthControlPanel, y = 208;
			Tooltip.help(x, y, Tooltip.LEFT, this, Help.EN.sort);
		});

	this.sortSwitch = this.sortControl.append("div")
		.attr("class", "switch");

	this.sortNumerical = this.sortSwitch.append("button")
		.attr("id", "sortbytext-" + this.level)
		.text(Controls[CONFIG.lang].num)
		.on("click", () => {
			this.buttonPress(this.sortNumerical, this.sortSwitch);
			this.sortBars(0, Sort.NUM);
		});

	this.sortAlphabetical = this.sortSwitch.append("button")
		.attr("class", "last active-button")
		.attr("id", "sortbytext-" + this.level)
		.text(Controls[CONFIG.lang].abc)
		.on("click", () => {
			this.buttonPress(this.sortAlphabetical, this.sortSwitch);
			this.sortBars(0, Sort.ABC);
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
