// ----- 获取验证码和session ----- //

var request = require('request');

var getVer = function(callback){
  var url = 'http://222.24.62.100/CheckCode.aspx';
  var options = {
    url: url,
    encoding: null,
    Accept : "image/webp,image/*,*/*;q=0.8",
    method: 'GET',
    headers: {
      Referer: 'http://222.24.62.100/'
    }
  };
  request(options, function(err, res, body){
    if(err){
      callback(true, "Server Error");
      return;
    }
    var session = res.headers['set-cookie'][0];
    session = session.substr(0, session.indexOf(';'));
    
    if(!session){
      callback(true, "Server Error");
      return;
    }
    var imgBuf = body.toString('base64');
    imgBuf = "data:image/Gif;base64," + imgBuf;
    callback(false, {
     session : session,     //session
     verCode : imgBuf,      //base64
    });   
  });
};

module.exports = getVer;