# Promise

2018-07-19

回调地狱(callback hell)想必大家都不陌生，nodejs最开始处理异步的办法就是回调函数。一两层还好，如果四五层一嵌套，看起来就挺唬人的。
```js
step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});
```

为了解决这个问题，各路神仙也是一直在想办法，最终被放到台面上来的是Promise(可谓千呼万唤使出来啊，ES6才把Promise彻底内置)

## 什么是Promise
其实总说回调地狱，小伙伴们也许还没有碰到过回调地狱，我也是小伙伴中的一员.....

所以我对Promise的作用真的没有一个清晰的认知，他到底扮演者一个什么样的角色，把在回调地狱里的程序猿就了出来呢？看阮大侠的教学答案应该是，Promise简直是救世主...

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise对象有以下两个特点。

（1）对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。


**所以记住Promise的状态转换是单次且冻结不可逆的**


promise的两种定义结构
```js
let promise = new Promise((resolve,reject) => {
    //do something

    if(/*异步操作成功*/){
        resolve();
    }
    else{//错误
        reject();
    }
});
```
或者
```js
function promise(){
    return new Promise((resolve,reject) => {
        if(/*异步操作成功*/){
            resolve();
        }
        else{//错误
            reject();
        }
    });
}
```

## Promise到底是怎么解决回调地狱的

要讨论Promise是如何解决回调地狱的，就要先说一下Promise的执行顺序。

### Promise在创建的时候就会立即执行

```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```
可以看到执行结果，Promise是最先在执行的，也许会有小伙伴觉得console.log()在resolve()前面，那换到后面是什么结果呢？在这里我就先给出答案，是一样的，因为resolve()是异步执行的！

在看完第一点其实也已经将第二点引出来了

### promise.then()
promise.then()是啥呢？then是和我们在定义Promise对象的时候所给出的resovle,和reject两个函数有关的，对，你没有看错，**resolve和reject是两个函数！！！**，它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

这两个函数是创建Promise实例的时候构造函数所接受的两个参数，分别代表promise转换的两种状态，resovle表示promise => fullfiled(成功),reject表示promise => reject(失败).

那么说了半天resolve和reject，他们和then有什么关系呢？

**then方法可以接受两个回调函数作为参数**。第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受Promise对象传出的值作为参数。

简单的说就是，我们可以把resolve(当然这里假设成功了，失败就是reject)就看作then的那个作为参数的函数，就是说当成功，就会resolve，之后就会触发then指定的函数异步执行。

### 我们来总结一下

我们想要摆脱回调地狱，就要用到Promise

那么我们就要先实例化一个Promise对象
```js
let promise = new Promise((resolve,reject) => {
    //do something

    if(/*异步操作成功*/){
        resolve();
    }
    else{//错误
        reject();
    }
});
```
或者
```js
function promise(){
    return new Promise((resolve,reject) => {
        if(/*异步操作成功*/){
            resolve();
        }
        else{//错误
            reject();
        }
    });
}
```

然后，如果成功，就将promise状态转化为fullfiled,也就是用resolve()函数去转换，然后就会触发then()函数对应的回调函数，reject同理！

接下来我给出自己测试的一个例子，如果能看着代码理解输出的顺序，说明对Promise基本是理解了。
```js
let promise = new Promise((resolve, reject) => {
    resolve('han');
    console.log('Promise');

});
  
promise.then((name) => {
    console.log('this is ' + name);

});

let p = new Promise((resolve,reject) => {
    resolve('li');
    console.log('Promise 1');
})

p.then((name) => {
    console.log('this is ' + name);
    let q = new Promise((resolve,reject) => {
        console.log('Promise 2');
        resolve('liu');
    });

    q.then((name) => {
        console.log('this is ' + name);
    })
});
  
console.log('Hi!');
```
```
Promise
Promise 1
Hi!
this is han
this is li
Promise 2
this is liu
```
要说一下this is li和Promise2打印的顺序是可以改变的，取决于console.log('this is ' + name)和let q = new Promise()的先后顺序，因为这两句同属p.then()的内部，在内部是顺序执行的。