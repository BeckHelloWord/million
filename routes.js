var fs = require('fs');
var url=require('url');
var path=require('path');
//读取文件内容

module.exports = function (app) {
  app.get('/', function (req, res) {
	   res.sendfile('./index.html');
  });
    app.get('/test', function (req, res) {
        res.sendfile('./test.html');
    });
  app.get('/wd_api/:class/:id', function(req, res){
      fs.readFile(__dirname+'/wd_api/'+req.params.class+'/'+req.params.id+'.json','utf-8',function(err,data){
          if(err)throw err;
          var jsonObj=JSON.parse(data);
          res.send(data);
      });
  });
    app.post('/wd_api/:class/:id', function(req, res){
      fs.readFile(__dirname+'/wd_api/'+req.params.class+'/'+req.params.id+'.json','utf-8',function(err,data){
          if(err)throw err;
          var jsonObj=JSON.parse(data);
          res.send(data);
      });
  });
};