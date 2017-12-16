/*jshint esversion: 6 */

const express = require('express');
const favicon = require('serve-favicon');
const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/'));

//app.use(favicon(__dirname + '/src/favicon.png'));

app.set('views', __dirname + '/');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {

	const obj = {
		name:"what",
		age:24,
		year:req.params.year
	};

	console.log(req.query);
	// response.end(JSON.stringify(obj));
//	res.send("Year: " + req.params.year + " " + req.params.data);
	res.render('index', obj);
});

app.get('/y=:year&d=:data', function (req, res) {
		res.send("Year: " + req.params.year + " " + req.params.data);
});

app.listen(app.get('port'), function() {
  console.log('OpenBudgets.EU Visualization is running on port',
  	app.get('port'));
});
