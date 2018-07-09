var http = require('http');

http.get('http://id.qq.com/', function(res){
    var data = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk){
        data += chunk;
    });
    res.on('end', function(){
        console.log(data);
    });
});