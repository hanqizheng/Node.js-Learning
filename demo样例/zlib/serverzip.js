//服务端的gzip
const http = require('http');
const zlib = require('zlib');
const fs = require('fs');
const path = './new/gzipTest.html';

const server = http.createServer((req,res) => {
    const acceptEncoding = req.headers['accept-encoding'];
    let gzip;

    if(acceptEncoding.indexOf('gzip') != -1){
        gzip = zlib.createGzip();
        
        // 记得响应 Content-Encoding，告诉浏览器：文件被 gzip 压缩过
        res.writeHead(200, {
            'Content-Encoding': 'gzip'
        });
        fs.createReadStream(path).pipe(gzip).pipe(res);
    }else{
        fs.createReadStream(path).pipe(res);
    }
});

server.listen(3000);