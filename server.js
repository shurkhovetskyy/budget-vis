const express = require('express');
const favicon = require('serve-favicon');
const fs = require('fs');

const app = express();

const View = require('./src/config/options').View;
const utils = Object.assign({},	require('./src/utils/years'),
								require('./src/utils/roll'));


var cache = null;
var dimYears = null;

app.set('port', (process.env.PORT || 4000));
app.use(express.static(__dirname + '/'));

app.use(favicon(__dirname + '/src/favicon.ico'));

app.set('views', __dirname + '/');
app.set('view engine', 'ejs');

app.render('index', {title: 'res vs app render'}, function(err, html) {
    console.log(html);
});

app.get('/dim-years', function(req, res) {
	res.send(dimYears);
});

app.get('/stacks', function(req, res) {
	console.log("Stacks-all");

//	fs.readFile("data/out_full_en.csv", 'utf8', function(err, raw) {
		if (err) throw err;

		let data, parent, year, dim, level;
		parent = req.query.parent;
		year = req.query.year;
		level = req.query.level;
		console.log("Parent", parent);
		data = utils.getStacks(raw, parent, year, level);

		res.setHeader('Content-Type', 'application/json');
		res.send(data);
		return res;
//	});

});

app.get('/data', function(req, res) {
	var start = new Date().getTime();

	const view = req.query.view;
	let data, parent, year, dim, stacks;
	//	if (view == "categories") {
		level = req.query.level;
		parent = req.query.parent;
		year = req.query.year;
		console.log("Level", level);
		console.log("Parent", parent);
		data = utils.getData(cache, level, parent, year);

		stacks = utils.getStacks(cache, parent, year, level-1);

	if (view == View.TIME) {
	//	data = JSON.stringify(utils.overtime(data));
		data = utils.overtime(data);
	}

	var end = new Date().getTime();
	var time = end - start;
	console.log('Execution time: ' + time);

	let resp = { };
	resp.data = data;
	resp.stacks = stacks;

	res.setHeader('Content-Type', 'application/json');
	res.send(resp);
});

app.get('*', function(req, res) {
	console.log("Render");
	res.render('index');
});

app.listen(app.get('port'), function() {
  console.log('React App is running on port', app.get('port'));

  fs.readFile("data/out_full_en.csv", 'utf8', function(err, raw) {
	  cache = utils.parse(raw);
	  dimYears = utils.getDimYears(utils.getData(cache));
	  return;
  })

});
