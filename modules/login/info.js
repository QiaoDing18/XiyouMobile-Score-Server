// ----- 获取信息 ----- //

var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var mongo = require("../mongo/mongo.js");

function getInfo(username, password, session, callback){
  mongo.findName(username, function(err, result){
    if(err){
      callback(true, result + err);
      return;
    }
    if(result.length === 0){
      callback("No Login");
      return;
    }
    if(result[0].info && JSON.parse(result[0].info).class !== ""){
      if(result[0].password === password){
        callback(false, JSON.parse(result[0].info));
      }else{
        callback(true, "Error PSW");
      }
      return;
    }
    var realName = result[0].name;
    var options = {
      url: "http://222.24.62.100/xsgrxx.aspx?xh=" + username + "&xm=" + encodeURI(realName) + "&gnmkdm=N121501",
      method: "GET",
      encoding: null,
      headers: {
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding':'gzip, deflate, sdch',
        'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
        'Connection':'keep-alive',
        'Cookie':session,
        'Host':'222.24.62.100',
        'Referer':'http://222.24.62.100/xs_main.aspx?xh=' + username,
        'Upgrade-Insecure-Requests':'1',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
      },
    };

    request(options, function(err, res, body){
      if(err){
        callback(true, "Server Error");
        return;
      }
      if(Math.floor(res.statusCode / 100) === 3){
        callback(true, "Session Out");
        return;
      }
      body = iconv.decode(body, "GB2312").toString();

      var $ = cheerio.load(body);
      var inf = {
        username: $("#xh").text(),
        realName: $("#xm").text(),
        sex: $("#lbl_xb").text(),
        class: $("#lbl_xzb").text(),
      };
      mongo.update(username, {info: JSON.stringify(inf)});

      callback(false, {
        num: username,
        name: inf.realName,
        sex: inf.sex,
        class: inf.class,
        message: "access success",
      });
    });
  });

  
}

module.exports = getInfo;