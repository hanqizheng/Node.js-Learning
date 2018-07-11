//服务端解压

const http = require('http');
const zlib = require('zlib');

const responseText = 'hello world';

const server = http.createServer(function(req, res){
    const acceptEncoding = req.headers['accept-encoding'];
    //和压缩的时候一样，都是要先看看有没有accept-coding
    if(acceptEncoding.indexOf('gzip')!=-1){
        res.writeHead(200, {
            'content-encoding': 'gzip'
        });
        res.end( zlib.gzipSync(responseText) );
    }else{
        res.end(responseText);
    }

});

server.listen('3000');