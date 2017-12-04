/*jshint esversion: 6 */

import { Styles } from './ui/styling';
import { MoneyNum, MoneySign, val } from './utils';

export const Tooltip = (function () {
	const tooltip = {};

	const DIRECTION_UP = "up";
	const DIRECTION_DOWN = "down";
	const DIRECTION_LEFT = "left";
	const DIRECTION_RIGHT = "right";

	const duration = 50;

	tooltip.draw = function (d, x, y, direction, c, stacked) {
		const id = c.level + "-" + d.dim;
		let toolcon = c.levelContainer.select("#toolcon"), box, arrow;
		if (toolcon.empty()) {
			toolcon = c.levelContainer.append("div")
					.attr("id", "toolcon")
					.attr("class", "toolcon");
			box = toolcon.append ("div")
					.attr("id", "tooltip")
					.attr("class", "box tooltip");
			arrow = toolcon.append("div")
					.attr("id", "arrow")
					.attr("class", "arrow tooltip");
			let content = box.append("div").attr("class", "content");
			content.append("div").attr("class", "title");
			let fig = content.append("div").attr("class", "fig");
			fig.append("div").attr("class", "num");
			fig.append("div").attr("class", "sign");
			content.append("div").attr("class", "stats");
			content.append("div").attr("class", "text");
		} else {
			box = c.levelContainer.select("#tooltip");
			arrow = c.levelContainer.select("#arrow")
				.style("visibility", "visible");
			toolcon.selectAll("div")
				.classed("hidden-delay", false)
				.classed("hidden", false);
		}

		const value = val(d, d.dim, c.mode, c.year);
		box.select(".text").text('');
		box.select(".title").text(d.category);
		box.select(".num").text("€" + MoneyNum(value));
		box.select(".sign").text(MoneySign(value));

		const sumFun = (item) => stacked ? val(item, d.dim, c.mode, c.year) :
							Math.abs(val(item, d.dim, c.mode, c.year));

		let sum = d3.sum(c.dataset.map(sumFun));
		const label = stacked ? "Kostenart" : c.selectionName;
		const percentage = Math.abs((value / sum * 100));
		box.select(".stats")
			.text(d3.format(".1f")(percentage) + "% of " + label);

		let ay, ty;
		if (direction==DIRECTION_UP) {
			ay = y + Styles.arrowHeight;
			ty = ay ;
			arrow.classed("up", true);
			arrow.classed("down", false);
		} else if (direction == DIRECTION_DOWN) {
			ay = y - Styles.arrowHeight;	// arrow y
			ty = ay - Styles.tooltipHeight - 3;	// tooltip y

			arrow.classed("down", true);
			arrow.classed("up", false);
		}

		arrow.style("top", ay);
		arrow.style("left", x - Styles.arrowHeight);
		// Prevent x overflow.
		const boundary = c.width;
		const client = box.node();
		x = x - client.offsetWidth / 2;
		let dx = x + client.offsetWidth - boundary;
		x = x - Math.max(dx, 0);

		box.style("top", ty);
		box.style("left", x);
	};

	tooltip.hide = function (c, delay = true) {
		c.levelContainer.selectAll(".tooltip")
			.classed(delay ? "hidden-delay" : "hidden", true);
	};

	tooltip.help = function (x, y, direction, c, help) {
		let toolcon = c.levelContainer.select("#toolcon"), box, arrow;
		if (toolcon.empty()) {
			toolcon = c.levelContainer.append("div")
					.attr("id", "toolcon")
					.attr("class", "toolcon");
			box = toolcon.append ("div")
					.attr("id", "tooltip")
					.attr("class", "tooltip");
			arrow = toolcon.append("div")
					.attr("id", "arrow")
					.attr("class", "arrow tooltip");
			let content = box.append("div").attr("class", "content");
			content.append("div").attr("class", "title");
			let fig = content.append("div").attr("class", "fig");
			fig.append("div").attr("class", "num");
			fig.append("div").attr("class", "sign");
			content.append("div").attr("class", "stats");
			content.append("div").attr("class", "text");
		} else {
			toolcon.selectAll("div")
				.classed("hidden-delay", false)
				.classed("hidden", false);
			box = c.levelContainer.select("#tooltip");
			arrow = c.levelContainer.select("#arrow")
				.style("visibility", "hidden");
		}

		const text = box.select(".text").html(help);
		box.select(".title").text('');
		box.select(".num").text('');
		box.select(".sign").text('');
		box.select(".stats").text('');

		// Place div in the middle so that its width is calculated
		// properly without div getting squeezed at the edge.
		box.style("left", Styles.widthControlPanel);
		let width = text.node().clientWidth;
		let tx;
		if (direction==DIRECTION_LEFT) {
			tx = x;
		} else if (direction == DIRECTION_RIGHT) {
			tx = x - width - 10; // tooltip x
		}

		// Prevent x overflow.
		const boundary = c.width;
		const client = box.node();
		x = x - client.offsetWidth / 2;
		let dx = x + client.offsetWidth - boundary;
		x = x - Math.max(dx, 0);

		// Y
		y = y - 4;
		const height = client.offsetHeight;
		const dy = (height + y) - Styles.height;
		y = y - Math.max(dy, 0);

		box.style("top", y);
		box.style("left", tx);
		box.classed("hidden-delay", false)
			.classed("hidden", false);
	};

	tooltip.UP = DIRECTION_UP;
	tooltip.DOWN = DIRECTION_DOWN;
	tooltip.RIGHT = DIRECTION_RIGHT;
	tooltip.LEFT = DIRECTION_LEFT;

	return tooltip;
})();
