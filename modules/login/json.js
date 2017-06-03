var json = function(res, err, result){
  if(err){
    res.jsonp({
      error: true,
      result: result,
    });
  }else{
    res.jsonp({
      error: false,
      result: result,
    });
  }
};

module.exports = json;