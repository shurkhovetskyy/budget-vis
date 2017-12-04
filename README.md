## Budget Visualization

This is a visualization concept designed as part of [OpenBudgets.eu](https://openbudgets.eu/) project. Built using [D3](https://github.com/d3) it allows creating interactive visualizations of budget data.

Live version of this visualization using data from Bonn, Germany is [available here](https://budget-bonn.herokuapp.com/).

## Running locally

Have latest version of [Node.js](https://nodejs.org/en/) installed. Navigate to root of project directory and fetch project dependencies:
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
