// 学年成绩

var mongo = require("../mongo/mongo.js");
var getScores = require("./getScores.js");


function year(username, password, session, year, semester){
  var updateFunc = function(){
    getScores(username, session, function(err, result){
      if(err){
        callback(err, result);
        return;
      }
      var updateTime = result.updateTime;
      result = result.score;
      var scores  = returnScore(result, year, semester);
      if(!scores){
        callback(true, "No Recode");
        return;
      }

      callback(false, {updateTime: updateTime, score: scores});
    });
  };

  if(update){
    updateFunc();
  }else{
    mongo.findName(username, function(){
      if(err){
        callback(true, result + err);
        return;
      }
      if(result.length === 0){
        callback(true, "No Login");
        return;
      }
      if(!result[0].json){
        updateFunc();
        return;
      }
      if(password != result[0].password){
        callback(true, "Error PSW");
        return;
      }

      var s = JSON.parse(result[0].json);
      var updateTime = s.updateTime;
      var scores = returnScore(s.score, year, semester);
      if(!score){
        callback(true, "No Recode");
        return;
      }
      callback(false, {updateTime: updateTime, score: scores});
    });
  }
}

function returnScore(scores, year, semester){
  if(!year){
    return scores;
  }else{
    for(var yearS = 0, len = scores.length; yearS < len; yearS++){
      if(scores[yearS].year == year){
        scores =  scores[yearS].Terms;
        break;
      }
    }
    if(yearS === len){
      return false;
    }
    if(!semester){
      return false;
    }
    for(var semeS = 0, len = scores.length; semeS < len; semeS++){
      if(score[semeS].Term == semester){
        scores = scores[semeS].Scores;
        break;
      }
    }
    if(semeS === len){
      return false;
    }
    return scores;
  }
}


module.exports = year;