# Cluster

2018-07-12

今天研究一下Cluster（集群）这个概念。

先看一下官网的一个简单的例子

```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if(cluster.isMaster){
    console.log('主进程 ${process.pid} 正在运行');

    for(let i = 0; i < numCPUs; i++){
        cluster.fork();
    }

    cluster.on('exit',(Worker,code,singnal) => {
        console.log('工作进程 ${worker.process.pid} 已退出');
    });

}
else{
    http.createServer((requestAnimationFrame,res) => {
        res.writeHead(200);
        res.end('Hello,world!');
    }).listen(8000);

    console.log('工作进程${process.pid} 已启动');
}
```
```
主进程 3596 正在运行
工作进程 4324 已启动
工作进程 4520 已启动
工作进程 6056 已启动
工作进程 5644 已启动
```
其实cluster我暂时就可以把他理解成node.js的多进程实现。

程序通过cluster.fork()可以新开一个进程，然后多个进程共用一个端口。就是这么简单

## Cluster支持的两种分发模式
分发：其实就是将一个新的http链接分配个一个进程处理

第一种方法（也是除Windows外所有平台的默认方法），是循环法。由主进程负责监听端口，接收新连接后再将连接循环分发给工作进程。在分发中使用了一些内置技巧防止工作进程任务过载。

第二种方法是，主进程创建监听socket后发送给感兴趣的工作进程，由工作进程负责直接接收连接。

cluster还有好多对应的事件可以在特定的情况下触发，这些我就不一一列举，可以去Node.js的官方文档查看。