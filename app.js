var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var port = 80;
var bodyParser = require('body-parser');
var util = require('util');
var formidable = require('formidable');
var sd = require("silly-datetime");
var db = require('./db/config');

app.use('/static',express.static('static'));
app.use('/config',express.static('config'));
app.use('/uploads',express.static('uploads'));
app.use('/test',express.static('test'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const routes = require('./routes/index');
const rules = require('./routes/rules/index');

app.use('/', routes);
app.use('/rules', rules);

app.listen(port, () => {
	console.log('Listening on http://localhost:%s/', port);
})