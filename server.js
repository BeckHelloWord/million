var express = require('express');
var app = express();
var path=require('path');
var routes = require('./routes')(app);
app.use(express.static(path.join(__dirname)));//添加静态资源根目录   static(root,[options])
app.listen(3030);
console.log("Server runing at port: " + 3030 + ".");