# EventEmitter
**2018-07-07**

首先第一件要知道的事情就是，同步执行情况下，I/O的开销很大，会造成整个程序效率的低下。

解决I/O的低效可以

- 开启新进程：每个请求都开启一个新进程。利：简单；弊：大量的链接意味着大量的进程。
- 开启新线程：每个请求都开启一个新线程。利：简单，而且跟进程比，对系统内核更加友好，因为线程比进程轻的多;弊:不是所有的机器都支持线程，而且对于要处理共享资源的情况，多线程编程会很快变得太过于复杂。

第二件要知道的事，为一个任务创建一个线程，当有很多个线程（也就是多线程），在并发的时候就会一点点将内存消耗殆尽。

**Node.js不是多线程的**，因为线程的消耗太“重”了。它们两个是单线程、基于事件的，这就把处理众多连接所产生的线程/进程消耗给消除了。

## Event Loop

我把整个事件循环理解为有一个无限的循环，在一直循环执行事件。

有一个执行栈（我把它理解为主线程），还有一个等待队列（那些回调函数）。
首先是将执行栈中的所有任务一个挨一个的执行，直到执行完毕。然后去询问等待队列有没有事件，但后执行等待队列中的事件。

大致过程就是这个样子。

### setTimeout() setInterval() setImmidiate() process.nextTick()

可以用这几个函数很好的理解一下Event Loop的执行顺序。

setTimeout()和setInterval()基本功能完全一样，只是前者只执行一次，而后者会无限循环执行。

setTimeout(callback func,delay time);
两个参数分别代表要执行的回调函数、和在执行完执行栈内的所有程序后延时多久执行回调函数。单位毫秒

```
myEmitter.on('event',function(){ 
    //在任务队列，所以只有在主线程执行完毕才会执行
    setTimeout(() => {
        console.log('异步的');
    },0);
});

myEmitter.emit('event');
console.log('aaaa');

//aaaa
//异步的
```
虽然在console.log()之前触发了事件'event'但是由于异步执行的原因，event事件是被放在等待队列中等待执行栈所有的任务执行完毕才会执行。所以先输出aaaa再输出异步的。

setImmediate方法则是在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次Event Loop时执行，这与setTimeout(fn, 0)很像.
```
setImmediate(function A() {
  console.log(1);
  setImmediate(function B(){console.log(2);});
});

setTimeout(function timeout() {
  console.log('TIMEOUT FIRED');
}, 0);
```
setImmediate与setTimeout(fn,0)各自添加了一个回调函数A和timeout，都是在下一次Event Loop触发。那么，哪个回调函数先执行呢？答案是不确定。运行结果可能是1  TIMEOUT FIRED  2，也可能是TIMEOUT FIRED  1  2。

process.nextTick()则是将要执行的回调函数插入到执行栈的尾部执行，所以用process.nextTick()插入的回调函数一定比等待队列中的回调函数执行的要早。
```
myEmitter.on('event',function(){ 
    //在任务队列，所以只有在主线程执行完毕才会执行
    setTimeout(() => {
        console.log('异步的');
    },0);


    process.nextTick((a,b) => {
        console.log('nextTick1');
    });
});

myEmitter.emit('event');
console.log('aaaa');

//aaaa
//nextTick1
//异步的
```

## EventEmitter类里的方法

之前介绍了 emitter.on()  emitter.emit()

这里学习了emitter.removeListener()等别的方法，我把自己写的测试demo放在了/demo/events.





