# http 协议之Header的学习

2018-07-05

## http的Header
- #### General
只给出样例和常用的几个parameters的解释（其实是太多了....)

```
Request URL: https://csdnimg.cn/pubfooter/js/publib_footer-1.0.3.js
Request Method: GET
Status Code: 200  (from memory cache)
Remote Address: 59.108.138.253:443
Referrer Policy: no-referrer-when-downgrade
```
Request URL:请求的url
Request Method：请求的方式（Get,Post..)
Status Code: 状态码 表示成功失败之类的（404 502）

- #### Request Header

```
cache-control: public, max-age=3600
content-encoding: gzip
content-length: 1106
content-type: text/javascript; charset=utf-8
date: Thu, 05 Jul 2018 15:05:46 GMT
expires: Thu, 05 Jul 2018 16:05:46 GMT
last-modified: Thu, 21 Jun 2018 00:23:51 GMT
server: yunjiasu-nginx
status: 200
connection: keep-alive
```
cache-control:缓存控制方式，比较常用的有private 和 public.

**connection: keep-alive**.主要说下这个connection，表示连接方式。
我们知道http协议是无状态协议，用完就断了。但是这里的connection的参数如果是keep-alive就可以做到在一定时间内保存本次连接。但是是在一定时间内。web服务器配置文件一般都有个参数用来设置保持的时长（apache里面是KeepAliveTimeout ），过了这个时长之后还没有传输数据就断开TCP连接。**Keep-Alive 没能改变这个结果。应对措施就是采用cookie机制**


**http协议是无状态协议**
无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。

- #### Response Header

```
If-Modified-Since: Thu, 05 Jul 2018 09:50:32 GMT
Referer: https://blog.csdn.net/alanlzz/article/details/72846718
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36
```
Referer:当前网站的上一个url，追根溯源的意思
User-Agent:用户设备

## chrome 调试
这个还要在继续学习，上述获取的三个头的各个信息就是通过调试的Network模块获取的。