const http = require('http');

http.createServer(function(request,response){

    //响应（返回）头
    response.writeHead(200,{'Conent-Type':'text/plain;charset=utf-8'});

    //response.writeHead(200,{'Content-Type':'text/html'});
    
    response.write('Chinese can not display?????');

    response.end();
}).listen(3000);

let date = new Date();

console.log("this program has been started.The start time is :" + date.getTime());