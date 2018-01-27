# Budget Visualization

<img src="https://image.ibb.co/iQUdjb/budget.png" align="center">

This is a concept interactive visualization of budget data designed as part of [OpenBudgets.eu](https://openbudgets.eu/) project. Built with [React](https://reactjs.org/) view library, [Redux](https://redux.js.org/) state management and [D3](https://d3js.org/).

Live version visualizing budget of Bonn, Germany is [available here](https://budget-bonn.herokuapp.com/).

**GNU GENERAL PUBLIC LICENSE Version 3.**

## Running locally

Have latest version of [Node](https://nodejs.org/en/) installed. Navigate to root of project directory and fetch project dependencies:
```bash
npm install --only=prod
```
Run the app with:
```bash
npm start
```
Visualization will be available in your browser at:
```
http://localhost:4000/
```

## Building

Install dependencies:

```bash
npm install
```

Build sources:

```bash
npm run build
```

Run your build (port 4000 by default):
```bash
npm start
```

## Configuration

All settings are placed in `src/config/settings.json`:

```js
{
	"name" : "Bonn Budget",
	"datafile": "bonn-data-en.csv",
	"levels": ["Product Category", "Description", "Cost Type"],
	"levels_alias": ["Product Categories", "Descriptions", "Cost Types"],
	"dimensions" : ["Executed", "Plan-Design", "Plan"],
	"startDimensions" : ["Executed", "Plan-Design"],
	"stacks" : "Cost Type",
	"yearsRange" : [2008, 2024],
	"startYear": 2015,
	"lang": "EN",
	"currency": "€"
}
```

`name` - title of the visualization (top level of data hierarchy), can be anything.

`datafile` - source placed in /data directory.

`levels` - titles for each level of data hierarchy as per data (must correspond to columns in source).

`level_alias` - text descriptions for each level. In this example same as `levels` but plural for clarity (can be anything)

`dimensions` - variables for which data is available (maximum 3). In Bonn budget data there is Executed budget, Planned budget and budget of Planentwurf (Plan Design in German). These must correspond to columns in data as well.

`startDimensions` - list of dimensions which are open when visualization starts, must be a subset of `dimensions`.

`stacks` - variable (data column) based on which stacked bar charts on the right should be built, must be one of `dimensions`. Leaving the property empty will result in no stacked bar chart displayed.

`yearsRange` - specify all years for which data is available, inclusively.

`startYear` - year to which visualization should default at the beginning, must be in the range of `yearsRange`.

`lang` - you can specify the language and provide translations for all text and labels of visualization in `src/config/text.js`. Bonn budget demo is in English, with machine-translated data labels.

## Data

In order to use your own data, place the file in `data` directory and modify `src/config/settings.json` accordingly.

For example, to load the original German version of the data, simply change `datafile`:

```js
"datafile": "bonn-data-de.csv",
```

Since column names in `bonn-data-de.csv` are different, change `levels`, `stacks` and `dimensions` as well:

```js
"levels": ["Produktbereich", "Bezeichnung", "Kostenart"],
"stacks": "Kostenart",
"dimensions": ["Executed-Ist", "Plan", "Planentwurf"]
```

In short, when specifying new data, it must be ensured that its header has the following format:

`[levels], [dimensions], Year, Sign`

`Year` - capitalized, corresponds to year for which row holds information.

`Sign` - capitalized, can be either `plus` or `minus`. This is in case your data contains both positive and negative values (spending and revenue). If not, set value to `plus` for all rows.

Column order is irrelevant. See both `bonn-data-en.csv` and `bonn-data-de.csv` for examples.
