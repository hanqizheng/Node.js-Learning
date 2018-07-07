//2018-07-07

const EventEmitter = require('events');

class MyEmitter extends EventEmitter{}

const myEmitter = new MyEmitter();

myEmitter.on('event',function(a,b){ 
    //在任务队列，所以只有在主线程执行完毕才会执行
    setTimeout(() => {
        console.log('异步的');
    },0);

    //nextTick是可以将任务添加在主线程执行栈尾部,所以肯定比所有任务队列里的任务都先执行
    process.nextTick((a,b) => {
        console.log('nextTick1');
        //支持嵌套，依次放入主线程执行栈尾部
        process.nextTick(function A(){
            console.log('nextTick2');
        });
    });

    //这里说是比setTimeout()先执行，但是每次运行都是在setTimeout()后面执行
    setImmediate(() => {
        console.log('setImmediate1');
        process.nextTick(function(){
            console.log('aaaa');
        });
        //嵌套的话会在下一次event loop中执行而不是在本次loop中执行，防止死循环
        setImmediate(() => {
            console.log('setImmediate2');
        });
    });
});

//在主线程 所以最先执行
myEmitter.on('plus',function(a,b){
    console.log(a + b);
});

console.log('1111');
myEmitter.emit('event',3,4);
myEmitter.emit('plus',3,4);

/*
1111
7
nextTick1
nextTick2
异步的
setImmediate1
aaaa
setImmediate
*/
