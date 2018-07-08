# Console

2018-07-08

今天...罪恶啊...

console 模块提供了一个简单的调试控制台，类似于 Web 浏览器提供的 JavaScript 控制台。

## console.log()

说到console肯定要说到console.log()!!!调试神器

```
console.log('我要输出一个东西');

//我要输出一个东西
```

一些别的用法
```
const count = 5;
console.log('count: %d', count);

//count: 5
```
与上述同等效果的
```
const count = 5;
console.log('count:', count);

//count: 5
```

## console.info()
console.log()的别名，效果一样。

## console.error()

输出错误信息的

```
console.error(new Error('错误！！'));

Error: 错误！！
    at Object.<anonymous> (/home/hqz/test/httpTest.js:1:77)
    at Module._compile (module.js:652:30)
    at Object.Module._extensions..js (module.js:663:10)
    at Module.load (module.js:565:32)
    at tryModuleLoad (module.js:505:12)    
    at Function.Module._load (module.js:497:3)
    at Function.Module.runMain (module.js:693:10)
    at startup (bootstrap_node.js:188:16)
    at bootstrap_node.js:609:3
```

## console.warn()

输出警告信息

```
/home/hqz/test/httpTest.js:2
myConsole.warn(`警告${name}`);
^

ReferenceError: myConsole is not defined
    at Object.<anonymous> (/home/hqz/test/httpTest.js:2:1)
    at Module._compile (module.js:652:30)
    at Object.Module._extensions..js (module.js:663:10)
    at Module.load (module.js:565:32)
    at tryModuleLoad (module.js:505:12)
    at Function.Module._load (module.js:497:3)
    at Function.Module.runMain (module.js:693:10)
    at startup (bootstrap_node.js:188:16)
    at bootstrap_node.js:609:3
```

