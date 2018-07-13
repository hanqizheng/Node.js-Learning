# Zlib

2018-07-11

web或者说浏览器向服务器端发送资源请求的时候，服务器可以先将资源进行压缩，然后再传给浏览器，这样不仅可以减少流量的损耗，然后还能因为体即变小而加快访问速度。比如gzip

node.js中能做到这一点的就是zlib模块了

## 简单的例子
```js
const fs = require('fs');
const zlib = require('zlib');

const gzip = zlib.createGzip();

const inFile = fs.createReadStream('./new/TestFile');
const out = fs.createWriteStream('./new/TestFile');

inFile.pipe(gzip).pipe(out);
```
上述几行代码就能将一个制定的**本地文件**压缩。找到对应文件所在的地方，他明显已经变成一个压缩文件了。

那么怎么解压呢？

```js
const fs = require('fs');
const zlib = require('zlib');

const gunzip = zlib.createGunzip();

const inFile = fs.createReadStream('./new/TestFile');
const outFile = fs.createWriteStream('./new/TestFile');

inFile.pipe(gunzip).pipe(outFile);
```
也是很简单的几句代码就能解决

## 服务器端的压缩与解压缩

在最开始说过服务器端要通过这个技术来加快浏览速度减轻流量消耗

那么服务器端怎么压缩呢？
首先要判断 是否包含accept-encoding的值,像这个样子
```http
accept-encoding: gzip
```
如果有就压缩后再返回，如果没有则不压缩

```js
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
```
这样打开chrome的f12的Network可以看到页html的content-encoding是gzip

服务器端解压，和上面步骤基本一样的，类比的看一下
```js
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
```