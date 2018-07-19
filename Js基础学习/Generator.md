# Generator
2018-07-19

上一节（其实就在刚才，嘻嘻）我们学习了[Promise](https://github.com/hanqizheng/Node.js-LearningDialog/blob/master/Node.js%E7%9B%B8%E5%85%B3%E5%9F%BA%E7%A1%80/Promise.md),一种为了解决回调地狱应运而生的解决方法，而且非常好用！！！

那么这一节，我们来学习另一种异步方法，Generator.

其实，他的地位很尴尬啊。。。前有[Promise](https://github.com/hanqizheng/Node.js-LearningDialog/blob/master/Node.js%E7%9B%B8%E5%85%B3%E5%9F%BA%E7%A1%80/Promise.md),开辟了异步编程的新天地，后有[async](),作为异步编程的接班人，Generator更像是一种过度期的产物，但是还是要学习一下的（但因为是过度的，后面也用不是很多，所以明白基本的执行过程和原理我觉得就ok,所以介绍会简单)

## 什么是Generator
这里引用一下阮大侠的话，说的很清楚

Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

如果觉得还是懵逼状，那么咱们看个例子
```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```

Generator是要和yield搭配使用。

上面代码定义了一个 Generator 函数helloWorldGenerator，它内部有两个yield表达式（hello和world），即该函数有三个状态：hello，world 和 return 语句（结束执行）。

然后，Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象。

下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。换言之，Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。
```js
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```
有点感觉吗？其实学过C/C++的同学应该有点感觉了，这里的generator其实就是在内部创建了一个迭代器(iterator)。这个迭代器会遍历generator内部yield定义的每一个状态。直至完毕。上面的代码一共有三个状态(hello,world,ending)而迭代器却不止可以执行三遍，他可以执行很多变，但是超过yield定义的状态就只会得到undefined。

那也许会疑问（其实是我的疑问，不许笑！！），那iterator在哪儿呢？

Generator绕就绕在这里了，他这个函数，玩了半天，返回的竟然不是我们最终想要的东西，**而是一个iterator**

我们需要在后续通过  **返回.next();**  来操作这个迭代器，让他一步一步往下去遍历Generator内部定义的所有状态。

## yield
还是引用的阮大侠的原话

由于 Generator 函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。

遍历器对象的next方法的运行逻辑如下。

（1）遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。

（2）下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。

（3）如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。

（4）如果该函数没有return语句，则返回的对象的value属性值为undefined。

需要注意的是，yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，因此等于为 JavaScript 提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。
```js
function* gen() {
  yield  123 + 456;
}
```
上面代码中，yield后面的表达式123 + 456，不会立即求值，只会在next方法将指针移到这一句时，才会求值。

## yield 和 return
yield表达式与return语句既有相似之处，也有区别。相似之处在于，都能返回紧跟在语句后面的那个表达式的值。区别在于每次遇到yield，函数暂停执行，下一次再从该位置继续向后执行，而return语句不具备位置记忆的功能。一个函数里面，只能执行一次（或者说一个）return语句，但是可以执行多次（或者说多个）yield表达式。正常函数只能返回一个值，因为只能执行一次return；Generator 函数可以返回一系列的值，因为可以有任意多个yield。从另一个角度看，也可以说 Generator 生成了一系列的值，这也就是它的名称的来历（英语中，generator 这个词是“生成器”的意思）。

Generator 函数可以不用yield表达式，这时就变成了一个单纯的暂缓执行函数。
```js
function* f() {
  console.log('执行了！')
}

var generator = f();

setTimeout(function () {
  generator.next()
}, 2000);
```
上面代码中，函数f如果是普通函数，在为变量generator赋值时就会执行。但是，函数f是一个 Generator 函数，就变成只有调用next方法时，函数f才会执行。

另外需要注意，yield表达式只能用在 Generator 函数里面，用在其他地方都会报错。
```js
(function (){
  yield 1;
})()
// SyntaxError: Unexpected number
```