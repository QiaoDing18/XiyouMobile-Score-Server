var express = require('express');
var app = express();

var getScores = require("../score/getScore.js");
var getYears = require("../score/yearScore.js");
var scoreQ = require("../queue/score.js");
var json = require("../login/json.js");

app.use('./all', function(){
  var username = req.query.username;
  var session = req.query.session;
  var password = req.query.password;
  getScore(username, session, function(err, result){
    json(res, err, result);
  });
});

app.use('./year', function(){
  var username = req.query.username;
  var session = req.query.session;
  var year = req.query.year;
  var semester = req.query.semester;
  var update = req.query.update;
  var password = req.query.password;

  if(scoreQ.testUser(username)){
    scoreQ.addEvent(username, function(){
      getYears(username, password, session, year, semester, update, function(err, result){
        json(res, err, result);
      });
    });
    return;
  }
  getYears(username, password, session, year, semester, update, function(err, result){
    json(res, err, result);
  });
});

module.exports = router;