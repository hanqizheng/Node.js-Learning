# Async 
2018-07-19

先说明Async是在**ES2017**标准引入，并不是ES6的特性哦！

## Async是什么？？？

Async可是一个好东西。

### Async 和 Generator
我们先来看一段代码，这是Generator的写法。
```js
const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```
另一段代码，是Async的写法
```js
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```
也许我们都发现了，Async就是把function * 换成了 async function，把yield换成了await。

但是真的只是这样吗？肯定不是啊，程序猿没有这么闲啊啊啊。

阮大侠一句话
> async 函数是什么？一句话，它就是 Generator 函数的语法糖。

Async对Generator是改进了的，他之所以能取代Generator成为异步编程的终极方法，是有原因的。

**1.内置执行器**

比起Generator调用不执行，需要next来推动，async是和普通函数一样，调用即执行的，因为他内置了执行器。

**2.返回值是Promise类型**
这个太重要了，比起Genertor返回一个迭代器（iterator），这个返回一个Promise就很自然，很方便了。

## Async 基本使用
由于Async返回的是一个Promise的对象，所以我们可以直接对Async函数的返回值进行类似Promise的操作，比如then一下
```js
async function getStockPriceByName(name) {
  const symbol = await getStockSymbol(name);
  const stockPrice = await getStockPrice(symbol);
  return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
  console.log(result);
});
```
这里的getStockSymbol(name),getStockPrice(symbol).都没有给出具体的实现，但是不重要，重要的是调用Async函数getStockPriceByName(name)可以直接then，因为返回的是一个Promise对象。


由于async函数返回的是 Promise 对象，可以作为await命令的参数。所以，上面的例子也可以写成下面的形式。
```js
async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello world', 50);
```

async函数内部return语句返回的值，会成为then方法回调函数的参数。
```js
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```

async函数返回的 Promise 对象，必须等到内部所有await命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到return语句或者抛出错误。也就是说，只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数。

下面是一个例子。
```js
async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log)
// "ECMAScript 2017 Language Specification"
```
上面代码中，函数getTitle内部有三个操作：抓取网页、取出文本、匹配页面标题。只有这三个操作全部完成，才会执行then方法里面的console.log。

## 说说await
正常情况下，await命令后面是一个 Promise 对象。如果不是，会被转成一个立即resolve的 Promise 对象。
```js
async function f() {
  return await 123;
}

f().then(v => console.log(v))
// 123
```
按理说async函数是应该返回一个Promise对象的，但是上面这段代码是return一个await 123;

123是普通数值，所以他会瞬间转成一个Promise对象而且瞬间resolve，这样返回的就是一个Promise对象了。

await命令后面的 Promise 对象如果变为reject状态，则reject的参数会被catch方法的回调函数接收到。
```js
async function f() {
  await Promise.reject('出错了');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了
```
注意，上面代码中，await语句前面没有return，但是reject方法的参数依然传入了catch方法的回调函数。这里如果在await前面加上return，效果是一样的。

只要一个await语句后面的 Promise 变为reject，那么整个async函数都会中断执行。
```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}
```
上面代码中，第二个await语句是不会执行的，因为第一个await语句状态变成了reject。

**那我不希望遇到错误就中断，仍继续执行该怎么办呢？？？？**
这时可以将第一个await放在try...catch结构里面，这样不管这个异步操作是否成功，第二个await都会执行。
```js
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world
```
另一种方法是await后面的 Promise 对象再跟一个catch方法，处理前面可能出现的错误。
```js
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
```
## Koa中的Async

注意部分可以阅读[[Koa+egg入门]](https://github.com/hanqizheng/Node.js-LearningDialog/blob/master/Node.js%E7%9B%B8%E5%85%B3%E5%9F%BA%E7%A1%80/koa%26egg/Koa%2BEgg%E5%85%A5%E9%97%A8.md)

## 错误处理（TODO）
别给自己立Flag了 orz