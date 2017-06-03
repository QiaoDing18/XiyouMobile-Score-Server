var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log('Start Success on ' + port);
});

var routes = require('./modules/routes/index.js');
var users = require('./modules/routes/users.js');
var score = require('./modules/routes/score.js');
var makeup = require('./modules/routes/makeup.js');
var schedule = require("./modules/setTime/schedule.js");

app.use('/users', users);
app.use('/score', score);
app.use('/makeup', makeup);