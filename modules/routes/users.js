var express = require('express');
var app = express();

var verCode = require('../login/verCode.js');
var login = require('../login/login.js');
var getInfo = require('../login/info.js');
var json = require('../login/json.js');
var infoQ = require("../queue/info.js");

//验证码
app.use('./verCode', function(req, res){
  verCode(function(err, result){
    json(res, err, result);
  });
});


//登录
app.use('./login', function(req, res){
  var username = req.query.username;
  var password = req.query.password;
  var session = req.query.session;
  var verCode = req.query.verCode;
  login(username, password, verCode, session, function(){
    json(res, err, result);
  });
});

//获取信息
app.use('./getInfo', function(req, res){
  var username = req.query.username;
  var session = req.query.session;
  var password = req.query.password;

  if(infoQ.testUser(username)){
    infoQ.addEvent(username, function(){
      getInfo(username, password, session, function(){
        json(res, err, result);
      });
    });
    return;
  }

  getInfo(username, password, session, function(){
    json(res, err, result);
  });
});


module.exports = router;