# HTTP 
2018-07-09

http应该是Node.js里面非常重要的一个模块了。

这个模块多以例子代码为主

## http一个简单的例子

```js
const http = require('http');

const server = http.createServer((req,res) => {
    let url = req.url;
    res.end('访问的地址是' + url);
    
});

server.listen(3000);

const client = http.get('http://127.0.0.1:3000',(res) => {
    res.pipe(process.stdout);
});

```
在上面这个简单的例子里，涉及了4个实例。大部分时候，serverReq、serverRes 才是主角。

* server：http.Server实例，用来提供服务，处理客户端的请求。
* client：http.ClientReques实例，用来向服务端发起请求。
* serverReq/clientRes：其实都是 http.IncomingMessage实。serverReq 用来获取客户端请求的相关信息，如request header；而clientRes用来获取服务端返回的相关信息，比如response header。
* serverRes：http.ServerResponse实例

这是一个最简单的示例，就可以搭建起来一个服务器和一个客户端。

## http.request
下面是一个典型的HTTP请求报文，里面最重要的内容包括：HTTP版本、请求方法、请求地址、请求头部。

```http
GET /hello HTTP/1.1
Host: 127.0.0.1:3000
Connection: keep-alive
Cache-Control: no-cache
```

那么，如何获取上面提到的信息呢？很简单，直接上代码

```js
// getClientInfo.js
var http = require('http');

var server = http.createServer(function(req, res){
    console.log( '1、客户端请求url：' + req.url );
    console.log( '2、http版本：' + req.httpVersion );
    console.log( '3、http请求方法：' + req.method );
    console.log( '4、http请求头部' + JSON.stringify(req.headers) );

    res.end('ok');
});

server.listen(3000);
```

```bash
1、客户端请求url：/hello
2、http版本：1.1
3、http请求方法：GET
4、http headers：{"host":"127.0.0.1:3000","connection":"keep-alive","cache-control":"no-cache","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36","postman-token":"1148986a-ddfb-3569-e2c0-585634655fe4","accept":"*/*","accept-encoding":"gzip, deflate, sdch, br","accept-language":"zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4"}
```

### 获取GET请求的参数
```js
// GETParameters.js
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res){
    var urlObj = url.parse(req.url);
    var query = urlObj.query;
    var queryObj = querystring.parse(query);
    
    console.log( JSON.stringify(queryObj) );
    
    res.end('ok');
});

server.listen(3000);
```

假如我访问 http://127.0.0.1:3000/name?name=hanqizheng&age=22

服务端输出如下

```bash
{"name":"hanqizheng","age":"22"}
```

### 获取POST请求参数
```js
// POSTParameters.js
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res){
    
    var body = '';  
    req.on('data', function(thunk){
        body += thunk;
    });

    req.on('end', function(){
        console.log( 'post body is: ' + body );
        res.end('ok');
    }); 
});

server.listen(3000);
```
然后我是在postman模拟post请求的，然后body以raw的形式发送name=hanqizheng&age=22

```bash
post body is: name=hanqizheng&age=22
```

## http.response
一个web服务程序，接受到来自客户端的http请求后，向客户端返回正确的响应内容，这就是`res`的职责。



