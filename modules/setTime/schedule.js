var schedule = require("node-schedule");
var func = require("./func.js");

function setTime(){
  var rule = new schedule.RecurrenceRule();
  rule.hour = 2;
  rule.minute = 0;
  schedule.scheduleJob(rule, func);
}


module.exports = setTime;