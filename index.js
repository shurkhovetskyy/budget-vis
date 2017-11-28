var express = require('express');
var favicon = require('serve-favicon');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(favicon(__dirname + '/public/favicon.png'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('OpenBudgets.EU Visualization is running on port', app.get('port'));
});
