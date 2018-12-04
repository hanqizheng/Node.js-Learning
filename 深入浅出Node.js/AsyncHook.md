# Async Hooks

## 起因

Node.js 是因异步的特性而流行，然而异步的特性本身却有一定的缺陷。从笔者的角度看来简单来说有三个：1、思路差异；2、复杂的场景控制困难；3、难以调试/监控。其中的 1、2 在这几年层出不穷的轮子以及最终 async/await 特性的发布下已经日趋稳定。而第三个问题则是 Node.js 最近两个大版本中努力的方向。Async Hook 的出现在笔者看来一定程度上完善了异步的监控机制。

早期 domain 出现的时候就有同学想要按照 domain 的方式设计一个监听异步行为的 hook （参见 issue: implement domain-like hooks (asynclistener) for userland），基于这个出现了一个叫做 async-listener 的模块。该模块在 process 对象上 pollyfill 了几个监控异步行为的接口。而 8.0 中出现的 Async Hook 则可以说是 Node.js 对 async-listener 的官方支持。

```js
const async_hooks = require('async_hooks');

setTimeout(() => {
  console.log('first setTimeout id', async_hooks.currentId()); // 2
});

setTimeout(() => {
  console.log('second setTimeout id', async_hooks.currentId()); // 4
});
```

Async hook 对每一个函数（不论异步还是同步）提供了一个 Async scope，你可以通过 async_hooks.currentId() 获取当前函数的 Async ID。

```js
const async_hooks = require('async_hooks');

console.log('default Async Id', async_hooks.currentId()); // 1

process.nextTick(() => {
  console.log('nextTick Async Id', async_hooks.currentId()); // 5
  test();
});

function test () {
  console.log('nextTick Async Id', async_hooks.currentId()); // 5
}
```

在同一个 Async scope 中，你会拿到相同的 Async ID。

> 这部分是个人的理解，如果有错误，一定要告诉我！

这里我大致的理解就是，`Async ID`是跟`Async Scope`有关的。

`Async Scope`是什么呢？ 就可以理解为函数作用域，而这个函数不是一般的函数，是一个异步函数，所以，在这个作用域内都拥有的是相同的`Async ID`。

还有一个要注意的就是当`Async ID = 0`时，说明已经到了C/C++层面了


## Async Hooks相关
```js
const async_hooks = require('async_hooks');

// 获取当前执行上下文的异步的 Async ID
const cid = async_hooks.currentId();

// 获取调用当前异步的异步的 Async ID
const tid = async_hooks.triggerId();

// 创建一个新的 AsyncHook 实例. 所有回调都是可选项
const asyncHook = async_hooks.createHook({ init, before, after, destroy });

// 允许该实例中异步函数启用 hook 不会自动生效需要手动启用。
asyncHook.enable();

// 关闭监听异步事件
asyncHook.disable();

//
// 以下是可以监控的几个事件的 callback
//

// 对象构造时会触发 init 事件（此时资源可能还没初始化完 ）
// 因此 asyncId 引用的资源 (resource) 的所有字段都可能还未填充
function init(asyncId, type, triggerId, resource) { }

// before is called just before the resource's callback is called. It can be
// called 0-N times for handles (e.g. TCPWrap), and will be called exactly 1
// time for requests (e.g. FSReqWrap).
function before(asyncId) { }

// after is called just after the resource's callback has finished.
function after(asyncId) { }

// destroy is called when an AsyncWrap instance is destroyed.
function destroy(asyncId) { }
```

## Handle Object

Async Hooks 可以触发事件来通知我们关于 handle object 的变化。所以要了解 Async Hook 同时也需要了解 handle objects。

Node.js 的核心 API 大部分是用 JavaScript 定义的，然而 ECMAScript 标准却并没有规范 JavaScript 要如何使用 TCP socket、读取文件等等的一些列操作。

**这些操作是通过 C++ 调用 libuv 和 V8 来实现的，而 node 内部与这些 C++ 层交互的对象被称之为 handle objects**。

## 一些意外

虽然看起来是有前景，然而这个特性还处于试验中。可能会出现意外或者一些神奇的情况。

比如在 Async Hook 监控的异步中，console.log 也是基于异步实现的，所以如果在 Hook 中使用 console.log 来打印信息就会出现死循环。只能使用非常原始的方式在 Hook 中输出信息，即类似上文中大家看到的直接 fs.writeSync 的方式：

```js
const fs = require('fs');
const util = require('util');

function print(...args) {
  // use a function like this one when debugging inside an AsyncHooks callback
  fs.writeSync(1, `${util.format(...args)}\n`);
}
```

Async Hook 是对目前的异步进行 Hook，如果 Hook 中的代码如果出现异常， node 的进程会打出 stack trace 然后退出进程。所以不建议在这些 hook 中加入逻辑，如果加入 try/catch 可能会增加正常代码的维护成本，各位也最好谨慎使用这个试验性质的黑魔法。

