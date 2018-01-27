const express = require('express');
const favicon = require('serve-favicon');
const fs = require('fs');

const app = express();

const View = require('./src/config/options').View;
const utils = Object.assign({},	require('./src/utils/years'),
								require('./src/utils/roll'));

const CONFIG = require('./src/config/settings.json');

app.set('port', (process.env.PORT || 4000));
app.set('views', __dirname + '/');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/'));
app.use(favicon(__dirname + '/src/favicon.ico'));

let cache = null;
let dimYears = null;

app.get('/dim-years', function(req, res) {
	res.send(dimYears);
});

app.get('/stacks', function(req, res) {
	if (err) throw err;

	let data, parent, year, dim, level;
	parent = req.query.parent;
	year = req.query.year;
	level = req.query.level;
	console.log("Parent", parent);
	data = utils.getStacks(raw, parent, year, level);

	res.setHeader('Content-Type', 'application/json');
	res.send(data);
});

app.get('/data', function(req, res) {
	const view = req.query.view;
	const level = req.query.level;
	const parent = req.query.parent;
	const year = req.query.year;

	let data = utils.getData(cache, level, parent, year);
	const stacks = utils.getStacks(cache, parent, year, level-1);

	if (view == View.TIME)
		data = utils.overtime(data);

	let resp = { };
	resp.data = data;
	resp.stacks = stacks;

	res.setHeader('Content-Type', 'application/json');
	res.send(resp);
});

app.get('*', function(req, res) {
	res.render('index');
});

app.listen(app.get('port'), function() {
  console.log(	'OpenBudget App visualizing',
  				CONFIG.datafile,
				'is running on port',
				app.get('port')
			);

  fs.readFile('data/' + CONFIG.datafile, 'utf8', function(err, raw) {
	  cache = utils.parse(raw);
	  dimYears = utils.getDimYears(utils.getData(cache));
	  return;
  })
});
