<img src="https://image.ibb.co/n8gNcw/budget.png" align="center">

# Budget Visualization

This is a visualization concept designed as part of [OpenBudgets.eu](https://openbudgets.eu/) project. Built using [D3](https://d3js.org/) it allows creating interactive visualizations of budget data.

Live version visualizing budget of Bonn, Germany is [available here](https://budget-bonn.herokuapp.com/).

**GNU GENERAL PUBLIC LICENSE Version 3.**

## Running locally

Have latest version of [Node](https://nodejs.org/en/) installed. Navigate to root of project directory and fetch project dependencies:
```bash
npm install --only=prod
```
To run visualization of Bonn data:
```bash
npm start
```
Visualization will be available in your browser at:
```
http://localhost:5000/
```

## Building

Install [webpack](https://webpack.js.org/):

```bash
npm install webpack
```

Build sources:

```bash
npm run build
```
Execute commands from previous section (Running locally) to see your build.


## Changing data/configuration

In order to use your own data, place the file in `data` directory and modify `config.json`.

```js
{
	"name" : "Bonn Budget",
	"datafile": "bonn-data.csv",
	"levels": ["Produktbereich", "Bezeichnung", "Profitcenter", "Kostenart"],
	"dimensions" : ["Executed-Ist", "Planentwurf", "Plan"],
	"startDimensions" : ["Executed-Ist"],
	"stacks" : "Kostenart",
	"yearsRange" : [2008, 2024],
	"startYear": 2015,
	"lang": "EN"
}
```
`levels` - short explanations/titles for each level of data.

`dimensions` - these are variables for which data is available. In Bonn budget data there is Executed budget, Planned budget and budget of Planentwurf (Plan Design in German).

`startDimensions` - list of dimensions which are open when visualization starts.

`stacks` - based on which dimension stacked barcharts on the right will be built. Leaving the property empty will result in no stacked barchart displayed.

`yearsRange` - specify all years for which data is available inclusively.

`lang` - you can specify the language and provide translations for all text and labels of visualization in `src/js/ui/text.js`. Bonn example is in English, but since data is in German, they are left as is.

Rest of parameters are self-explanatory.
