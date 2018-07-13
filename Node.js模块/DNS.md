# DNS 
2018-07-09

## DNS是什么？

DNS(Domain Name System)域名系统。是将域名转化为ip地址的。其中一个域名可以对应多个（最少一个）ip地址，而一个ip地址则不一定要对应域名。

## DNS的两类函数

### dns.lookup() & dns.lookupServer()

dns.lookup()是用来域名解析的。当我们想知道一个域名对应的ip地址可以
```js
const dns = require('dns');

const option = {all:true};

dns.lookup('www.github.com',option,(error,address,family) => {
    if(error){
        throw error;
    }

    console.log(address);
});
```
输出
```
[ { address: '13.229.188.59', family: 4 },
  { address: '52.74.223.119', family: 4 },
  { address: '13.250.177.223', family: 4 } ]
```
参数方面的话

- hostname 要解析的域名，是一个字符串
- option {

    family:代表接受IPV4 还是IPV6的ip地址，默认是都接受

    all:是一个bool值，当其为真的时候，返回域名对应的所有ip地址
  
  } 

- callback:回调函数{

    error:错误信息

    address:解析后的ip地址

    family:接受IPV4或者IPV6，默认都接受

  }


需要注意的是dns.lookup()是借用操作系统工具进行域名解析，且不需要进行网络通信。

而且lookup()在内部是使用到了线程池的，所以对其他进程都会产生一些影响。

dns.lookupServer()则是通过ip地址返回主机名（域名）

### 其他函数

这一类函数是真实的要联网进行DNS服务器进行域名解析。他们并没有使用底层操作系统工具来进行域名解析，而是使用网络进行域名解析。

dns.resolve() \ dns.resolve4() \ dns.resolve6()

这三个函数都是联网解析域名的函数

```js
const dns = require('dns');

dns.resolve4('www.github.com',(err,address) => {
    if(err){
        throw err;
    }

    console.log(address);
});
```
输出结果
```
[ '13.229.188.59', '52.74.223.119', '13.250.177.223' ]
```
类似于dns.lookupServer(),dns.reverse()的作用也是通过一个ip地址来返回域名。
