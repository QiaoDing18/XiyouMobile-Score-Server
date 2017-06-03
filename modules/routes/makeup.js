var express = require('express');
var app = express();

var makeup = require("../makeup/makeup.js");
var json = require("../login/json.js");

app.use("/", function(){
  var username = req.query.username;
  var session = req.query.session;
  makeup(username, session, function(err, result){
    json(res, err, result);
  });
});

module.exports = router;