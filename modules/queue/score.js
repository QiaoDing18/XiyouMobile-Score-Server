// 成绩等待队列

var queue = {};

exports.addUser = function(username, handle){
  queue[username] = handle;
};

exports.removeUser = function(username){
  if(queue[username].event){
    queue[username].event.call();
  }
  delete queue[username];
};

exports.testUser = function(){
  if(queue[username]){
    return true;
  }else{
    return false;
  }
};


exports.addEvent = function(username, event){
  queue[username].event = event;
};