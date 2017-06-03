// 定时任务内容
var request = require("request");
var mongo = require("../mongo/mongo.js");
var login = require("../login/login.js");
var scores = require("../score/getScores.js");

function func(){
  mongo.getAllUser(function(err, result){
    if(err){
      console.log("GetUser Error");
      return;
    }
    var index = 0, len = result.length;
    (function getScores(){
      if(index >= len){
        console.log("Update Over");
        return;
      }

      login(result[index].username, result[index].password, function(err, results){
        if(err){
          console.log(result[index].username + "Update GetName Error");
          index++;
          getScores();
        }else{
          scores(result[index].username, result.session, function(err){
            if(err){
              console.log(result[index].username + "Update Request Error");
            }else{
              console.log(result[index].username + "Update OK");
            }

            index++;
            getScores();
          });
        }
      });
    })();
  });
}


module.exports = func;