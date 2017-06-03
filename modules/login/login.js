// ----- 登录 ----- //

var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

var mongo = require("../mongo/mongo.js");
var getInfo = require("./info.js");
var getScores = require("../score/getScores.js");
var scoreQ = require("../queue/score.js");
var infoQ = require("../queue/info.js");


var login = function(username, password, verCode, session, callback){
  if(!username || !password || !verCode || !session){
    callback(true, "no data");
    return;
  }

  if(username === '' || password === ''){
    callback(true, 'Account Error');
    return;
  }

  var options = {
    url: 'http://222.24.62.100/default2.aspx',
    method: 'POST',
    form: {
      '__VIEWSTATE':'dDwtNTE2MjI4MTQ7Oz5O9kSeYykjfN0r53Yqhqckbvd83A==',
      'txtUserName':username,
      'Textbox1':'',
      'TextBox2':password,
      'txtSecretCode':verCode,
      'RadioButtonList1':'%D1%A7%C9%FA',
      'Button1':'',
      'lbLanguage':'',
      'hidPdrs':'',
      'hidsc':'',
    },
    headers: {
      'Host': '222.24.62.100',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'Origin': 'http://222.24.62.100',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Referer': 'http://222.24.62.100/default2.aspx',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
      'Cookie': session,
    }
  };

  request(options, function(err, res, body){
    if(err){
      callback(true, 'Server Error');
      return;
    }
    body = iconv.decode(body, "GB2312").toString();
    var ifSuccess = body.indexOf('Object moved');
    
    if(ifSuccess == -1){
      callback(true, 'Please check your password or vercode');
      return;
    }

    mongo.findName(username, function(err, result){
      if(err){
        console.log(err + result);
      }
      if(result.length === 0){
        getRealName(username, password, session, callback);
      }else{
        callback(false, {session: session});
      }
    });
  });
};


var getRealName = function(username, password, session, callback, isFixName){
  var options = {
    url: "http://222.24.62.100/xs_main.aspx?xh=" + username,
    method: "GET",
    encoding: null,
    headers: {
      Referer: "http://222.24.62.100/",
      Cookie: session
    },
  };

  request(options, function(err, res, body){
    if(err){
      console.log(err);
      return;
    }

    body = iconv.decode(body, "GB2312");
    var $ = cheerio.load(body);
    var name = $("#xhxm").text().replace("同学","");

    realName = name;


    function addOrFixCallback(){
      scoreQ.addUser(username, {});
      infoQ.addUser(username, {});
      callback(false, {session: session});

      getInfo(username, password, session, function(err){
        infoQ.removeUser(username);
        if(err){
          console.log(err);
        }
      });

      getScores(username, session, function(err){
        scoreQ.removeUser(username);
        if(err){
          console.log(err);
        }
      });

      console.log("newLogin " + username);
    }

    if(isFixName){
      mongo.update(username, {name: name}, addOrFixCallback);
    }else{
      mongo.add({username: username, password: password, name: name}, addOrFixCallback);
    }

  });

};


module.exports = login;