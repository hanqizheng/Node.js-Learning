const http = require('http');
const fs = require('fs');
const mime = require('mime');
const path = require('path');

const chatServer = require('./lib/chat_server');

let cache = {};


//发送错误信息的函数
function send404(response){
    //设置相应头
    response.writeHead(404,{
        'Content-Type':'text-plain'
    });
    //设置响应信息
    response.write('Error 404:resource not found!');
    //响应结束
    response.end();
}

function sendFile(response,filePath,fileContents){
    response.writeHead(200,{
        'Content-Type':mime.getType(path.basename(filePath))
    });
    response.end(fileContents);
}

function serveStatic(response,cache,absPath){
    //判断是不是已经在缓存里
    if(cache[absPath]){
        //在缓存里，直接返回文件
        sendFile(response,absPath,cache[absPath]);
    }
    else{//检查文件是否存在
        fs.exists(absPath,(exists) => {
            if(exists){//存在
                fs.readFile(absPath,(err,data) => {
                    if(err){
                        send404(response);
                    }
                    else{
                        cache[absPath] = data;
                        sendFile(response,absPath,data);
                    }
                });
            }
            else{//不存在
                send404(response);
            }
        });
    }
}
//创建http服务器
const server = http.createServer((request,response) => {
    let filePath = false;
    if(request.url == '/'){
        filePath = 'public/index.html';
    }
    else{
        filePath = 'public' + request.url;
    }

    let absPath = './' + filePath;
    serveStatic(response,cache,absPath);
});

server.listen(3000,function(){
    console.log('server listening on port 3000');
})

chatServer.listen(server);