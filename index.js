var express = require('express');
var fs = require('fs');
var app = express();

app.get('/',function (req,res) {
    fs.readFile('index.html',function (error,data) {
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
    })
});
app.listen(80,function () {
    console.l('connectec 80 port')
});