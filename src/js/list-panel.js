/*jshint esversion: 6 */

import { Styles, getStackItemColor, getItemColor } from './ui/styling';
import { Mode } from './ui/ui-state';
import { Tooltip } from './tooltip';
import { MoneyNum, MoneySign, val } from './utils';

const DATA_CONFIG = require('../../data/config.json');

export default function ListPanel (chart) {
	this.c = chart;
	this.dimCon = this.c.rightContainer.append("div")
		.attr("class", "dimcon")
		.attr("id", "dimscon-" + this.c.level);

	this.list = this.dimCon.append("div")
		.attr("class", "dim-list")
		.attr("id", "dim-list-" + this.c.level);

	// Stack charts' scales.
	this.stackScales = [];
	this.stacksVisible = true;
	this.figsVisible = true;
}

ListPanel.prototype.activate = function () {
	DATA_CONFIG.dimensions.forEach ((d, i) => this._listDimension(d, i));
	this.setYear(this.c.year);
	this.updateStackedCharts();
};

ListPanel.prototype.addDimension = function (dim) {
	const sd = this.c.shownDimensions,
		  sds = this.c.stackedDataset,
		  c = this.c;

	// If max remains the same then
	// fill only the new dim.
	if (!this.updateMax())
		this.renderDimension(dim);
	else
		this.updateStackedCharts(false);
};

/*
*	Sets individual figure for dimension.
*/
ListPanel.prototype.setFigure = function(dim, y) {
	const year = y || this.c.year;
	const value = this.dimCon
			.select("#dim-value-" + this.c.level + "-" + dim),
		  sign = this.dimCon
		  	.select("#dim-sign-"+ this.c.level + "-" + dim);

	const sum = d3.sum(this.c.dataset
		.map(item => val(item, dim, this.c.mode, year)));

	value.text("€" + MoneyNum(sum));
	sign.text(MoneySign(sum));
};

/*
*	Sets the year for which aggregate numbers will be
*	displayed. Current mode is used.
*/
ListPanel.prototype.setFigures = function (year) {
	this.c.shownDimensions.forEach(d => this.setFigure(d, year));
};

ListPanel.prototype.setYear = function (y) {
	const yearBoxes = this.list.selectAll(".dim-year"),
		  year = y || '';
	if (y == null) {
		yearBoxes.classed("hidden-delay", true);
	} else {
		yearBoxes.classed("hidden-delay", false);
		yearBoxes.text(year.toString());
	}
};

ListPanel.prototype._listDimension = function (dim, i) {
	const entryHeight = Styles.dimListSpacing + Styles.stackHeight,
		  id = this.c.level + "-" + dim;

	let last = false;
	if (i==DATA_CONFIG.dimensions.length-1)
		last = true;
	const entry = this.list.append("div")
				.attr("class", "dim-entry" + (last ? " last" : ''))
				.attr("id", "dim-entry-"+ id);

	const aux = entry.append("div")
				.attr("class", "aux")
				.attr("id", "aix-" + id);

	const marker = aux.append("div")
					.attr("class", "dim-marker")
				.attr("id", "dim-marker-"+ id)
			.style("background-color", getItemColor(dim));

	const figHelp = aux.append("span")
		.attr("class", "fighelp listhelp help")
		.attr("id", "fighelp-" + id)
		.on("click", () => {
			const x = this.c.width - Styles.widthRight,
				  y = 41;
			Tooltip.help(x, y, Tooltip.RIGHT, this.c, help.EN.fig);
		});

	const stackHelp = aux.append("span")
		.attr("class", "stackhelp listhelp help")
		.attr("id", "stackhelp-" + id)
		.on("click", () => {
			const x = this.c.width - Styles.widthRight,
				  y = 62;
			Tooltip.help(x, y, Tooltip.RIGHT, this.c, help.EN.stack);
		});

	aux.selectAll(".help").on("mouseout",
			() => Tooltip.hide(this.c, false));

	const desc = entry.append("div")
					.attr("class", "dim-desc")
					.attr("id", "dim-desc-"+ id);
	const nameBox = desc.append("div")
					.attr("class", "dim-namebox")
					.attr("id", "dim-namebox-"+ id);
	const name = nameBox.append("div")
					.attr("class", "dim-name name")
					.attr("id", "dim-name-"+ id)
					.text(dim);
	const year = nameBox.append("div")
					.attr("class", "dim-year name")
					.attr("id", "dim-year-"+ id);
//					.text(dim);
	const figure = desc.append("div")
					.attr("class", "dim-figure")
					.attr("id", "dim-figure-"+ id);
	const value = figure.append("div")
					.attr("class", "dim-value")
			.attr("id", "dim-value-"+ id);
	const sign = figure.append("div")
					.attr("class", "dim-sign")
			.attr("id", "dim-sign-"+ id);
	const stackscon = desc.append("svg")
					.attr("class", "stackscon")
					.attr("id", "stackscon-" + id);

	// Remove button.
	entry.append("div")
			.attr("class", "dim-remove")
			.attr("id", "dim-remove-"+ id)
			.on("click", () => {
				const len = this.c.shownDimensions.length;
				if (len > 1 && d3.select(d3.event.target).classed("dim-remove")) {
					this.c.removeDimension(dim);
					entry.classed("active", false);
					stackscon.select("#stacks-" + id).remove();
					this.updateStackedCharts();
				}
				// Hide all (only one left) remove buttons.
				if(len==2) {
					this.dimCon.selectAll(".dim-remove")
						.classed("hidden", true);
				}
			});

	entry.on("click", () => {
		const remove = (d3.select(d3.event.target).classed("dim-remove"));
		if (this.c.shownDimensions.indexOf(dim) < 0 && !remove) {
			this.c.addDimension(dim);
			entry.classed("active", true);
			this.addDimension(dim);
			this.dimCon.selectAll(".dim-remove")
				.classed("hidden", false);
		}
	});

	if (this.c.shownDimensions.indexOf(dim) != -1)
		entry.classed("active", true);
	// this._placeAdd();
	// this.updateStackedCharts(dim);
};

/*
* 	Seys visibility of aggreagate numbers in the panel.
*/
ListPanel.prototype.figuresShow = function (instantShow = false) {
	if (this.figsVisible) return;

	this.dimCon.selectAll(".dim-figure")
		.classed("hidden", false)
		.classed("hidden-delay", false);

	const entries = this.dimCon.selectAll(".dim-entry");
	// Shows figures instantly (-instant class has no transition).
	if (instantShow) {
		entries.classed("stacks-hidden-instant", true);
		entries.classed("stacks-hidden", false);
	}
	entries.classed("figs-hidden", false)
			.classed("figs-hidden-delay", false);

	this.figsVisible = true;
};

ListPanel.prototype.figuresHide = function (delayHide = false) {
	if (!this.figsVisible) return;

	this.dimCon.selectAll(".dim-figure")
		.classed(delayHide ? "hidden-delay" : "hidden", true);
	this.dimCon.selectAll(".dim-entry")
		.classed("figs-hidden", true)
		.classed("figs-hidden-delay", delayHide)
		.classed("stacks-hidden", true)
		.classed("stacks-hidden-instant", false);

	this.figsVisible = false;
};

ListPanel.prototype.stackedChartsVisible = function (visible) {
	if (this.stacksVisible == visible)
		return;
	this.dimCon.selectAll(".stackscon")
		.classed("hidden", !visible);

	this.dimCon.selectAll(".dim-entry")
		.classed("stacks-hidden", !visible)
		.classed("stacks-hidden-instant", !visible);

	this.stacksVisible = visible;
};

ListPanel.prototype.renderDimension = function (dim) {
	this.setFigure(dim);

	if (this.c.mode == Mode.BAL)
		return;
	const sds = this.c.stackedDataset,
		  c = this.c,
		  id = this.c.level + "-" + dim,
		  di = DATA_CONFIG.dimensions.indexOf(dim),
		  desc = this.dimCon.select("#dim-desc-" + id),
		  sc = desc.select("#stackscon-" + id);
	let sg = sc.select("#stacks-" + id);
	if (sg.empty()) {
		sg = sc.append("g")
			.attr("class", "stacks")
			.attr("id", "stacks-" + id);
	}

	const filtered = sds.filter(d =>
		Math.abs(val(d, dim, c.mode, c.year)) != 0);
	// Each stack is at least one pixel wide even though
	// some stacks normally would not even be visible
	// due to small values. So subtract number of stacks from
	// regular range to account for extra width of each stack.
	this.stackScales[di].rangeRound([0, Styles.stackWidth], 0.0);


//	const rd = filtered.map (d => (Object.assign({dim: dim}, d)));
	const layers = d3.layout.stack()
		.y (d => d.x)
		.out((d, y0, y) => { d.x0 = y0, d.y = 0 })(
			filtered.map(d => [dim].map(dimension =>
				Object.assign(
					{ dim: dim,
						x: Math.abs(val(d, dim, c.mode, c.year))
					}, d))))
		.map(d => d[0]);
	const len = layers.length;
	const stacks = sg.selectAll("rect").data(layers);
	stacks.enter().append("rect")
					.attr("class", "stacked-rect")
					.attr("width", 0)
					.attr("height", Styles.stackHeight)
					.attr("fill", (d, i) => getStackItemColor(i))
					.attr("x", -len)
					.attr("index", (d, i) => i)
					.style("opacity", 0);

	stacks.transition ()
		.duration (1000)
		.attr("width", d => this.stackScales[di](d.x) + 1)
		.attr("x", d => this.stackScales[di](d.x0))
		.style("opacity", 1);

	stacks.exit()
		.transition()
		.duration (1000)
		.attr("width", 0)
		.attr("x", Styles.widthRight)
		.style("opacity", 0)
		.remove();

	stacks	.on("mouseover", d => this.mouseOver(d, d3.event.target))
			.on("mouseout", d => this.mouseOut(d, d3.event.target));
};

ListPanel.prototype.updateStackedCharts = function (updateMax = true) {
	if (updateMax)
		this.updateMax();
	const sd = this.c.shownDimensions;
	sd.forEach(dim => this.renderDimension(dim));
};

/*
*	Returns true if max was updated.
*/
ListPanel.prototype.updateMax = function () {
	// Set domain to be sum of stacks of largest chart.
	const sd = this.c.shownDimensions,
		  sds = this.c.stackedDataset,
		  c = this.c,
		  oldMax = this.maxSum;
	const maxSum = Math.max.apply(null,
			sd.map(dim => Math.abs(sds.map(d =>
				val(d, dim, c.mode, c.year))
					.reduce((a, b) => a + b))));
	this.maxDimSum = maxSum;
	this.stackScales = [...Array(DATA_CONFIG.dimensions.length)].map(
		() => d3.scale.linear().domain([0, this.maxDimSum]).nice());
	return maxSum != oldMax;
};

ListPanel.prototype.mouseOver = function (d, target) {
	const c = this.c,
		  id = c.level + "-" + d.dim,
		  con = this.dimCon.select("#stackscon-" + id);
	const stack = con.selectAll(".stacked-rect")
					.filter(s => s.id==d.id);
	stack.attr('fill', getItemColor(d.dim));

	// X
	const box = target.getBBox();
	let x = box.x + box.width / 2;
		x = x + 3 * Styles.dimListMargin;
	x = this.c.width - Styles.widthRight + x;
	// Y
	const el = document.getElementById("dim-entry-" + id);
	let y = el.offsetTop;
		y = y + Styles.topMargin + Styles.stackHeight + 51; // bottom of stacks
	let by = y + Styles.tooltipHeight + Styles.arrowHeight,
		direction = Tooltip.UP;
	// if tooltip overflow bottom
	if (by > Styles.height)	{
		direction = Tooltip.DOWN;
		y = y - Styles.stackHeight;
	}

	Tooltip.draw(d, x, y, direction, c, true);
};

ListPanel.prototype.mouseOut = function (d, target) {
	this.c.levelContainer.selectAll(".tooltip")
		.classed("hidden", true);
	const stack = d3.select(target);
	const index = parseInt(stack.attr("index"));
	stack.attr('fill', getStackItemColor(index));
};
