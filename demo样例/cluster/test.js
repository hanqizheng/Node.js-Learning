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