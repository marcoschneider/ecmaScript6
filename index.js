'use strict';

var express = require('express');
var app = express();

app.use('/purecss', express.static(__dirname + '/node_modules/purecss/build'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});