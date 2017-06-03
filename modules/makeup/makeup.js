// 补考查询

var request = require("require");
var mongo = require("../mongo/mongo.js");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");

function makeup(username, session, callback){
  mongo.findName(username, function(err, result){
    if(err){
      callback(true, result + err);
      return;
    }
    if(result.length === 0){
      callback(true, "No Login");
      return;
    }

    var url = "http://222.24.62.120/xsbkkscx.aspx?gnmkdm=N121618" + "&xh=" + username + "&xm=" + encodeURI(result[0].name);

    request({
      url: url,
      method: "GET",
      encoding: null,
      headers: {
        Referer: "http://222.24.62.120/xs_main.aspx?xh=" + username,
        Cookie: session,
      }
    }, function(err, res, body){
      if(err){
        callback(true, "Server Error" + err);
        return;
      }
      if(Math.floor(res,statusCode / 100) === 3){
        callback(true, "Session Out");
        return;
      }
      body = iconv.decode(body, "GB2312").toString();
      var $ = cheerio.load(body);
      var table = $("#DataGrid1").find("tr").slice(1);
      var result = [];
      table.each(function(){
        var item = $(this).find("td");
        var data = {};
        data.classId = item.eq(0).text();
        data.className = item.eq(1).text();
        data.name = item.eq(2).text();
        data.time = item.eq(3).text();
        data.room = item.eq(4).text();
        data.seat = item.eq(5).text();
        data.form = item.eq(6).text() === "&nbsp;" ? "" : item.eq(7).text();
        result.push(data);
      });
      callback(false, result);
    });
  });
}

module.exports = makeup;