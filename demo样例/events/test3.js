//2018-07-07



const eventEmintter = require('events');

class MyEmitter extends eventEmintter{

}

const myEmitter = new MyEmitter();
const emtter2 = new MyEmitter();

let A = (a) => {
    console.log(a);
}

myEmitter.on('event',A);


//这时候event只有A
myEmitter.emit('event',5);

//在event 队列头插入一个 事件B
myEmitter.prependListener('event',B = () => {
    console.log('B');
});

//B 6
myEmitter.emit('event',6);

//删除A
myEmitter.removeListener('event',A);

//只有B执行，A已经没有，所以不会打印7
myEmitter.emit('event',7);

//打印现在的myEmitter
console.log(myEmitter);

/*
5
B
6
B
MyEmitter {
  domain: null,
  _events: { event: [Function: B] },
  _eventsCount: 1,
  _maxListeners: undefined }
*/
