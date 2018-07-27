# Symbol
2018-07-26

Symbol 怎么说呢？要注意两点！！！

- 它是一种 **数据类型** 就比如string ， bool ， Number，而且它不是引用类型，是一种原始数据类型。**所以Symbol不是对象**
- Symbol不能new
  
```js
let s = Symbol();

typeof s
// "symbol"
```

Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
```js
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```
上面代码中，s1和s2是两个 Symbol 值。如果不加参数，它们在控制台的输出都是Symbol()，不利于区分。有了参数以后，就等于为它们加上了描述，输出的时候就能够分清，到底是哪一个值。

**注意**：Symbol函数中的参数，只是对当前Symbol值的一个描述，也就是一个代号，代号相同可不代表Symbol的值相同。

## 作为属性的Symbol
其实Symbol在一定意义上就是为了解决对象属性名的，所以作为属性的Symbol当然要说一下。

### 定义方式
好几种。。。。我们来看一下。
```js
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```
上面代码通过方括号结构和Object.defineProperty，将对象的属性名指定为一个 Symbol 值。

**注意**，Symbol 值作为对象属性名时，不能用点运算符。
```js
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"
```
上面代码中，因为点运算符后面总是字符串，所以不会读取mySymbol作为标识名所指代的那个值，导致a的属性名实际上是一个字符串，而不是一个 Symbol 值。

## 属性名的遍历
Symbol的获取方式还是有点特殊的，Object.getOwnPropertySymbols方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

const objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols
// [Symbol(a), Symbol(b)]
```
另一个新的 API，Reflect.ownKeys方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。
```js
let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3
};

Reflect.ownKeys(obj)
//  ["enum", "nonEnum", Symbol(my_key)]
```

## Symbol.for()

有时，我们希望重新使用同一个 Symbol 值，Symbol.for方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。
```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
```
上面代码中，s1和s2都是 Symbol 值，但是它们都是同样参数的Symbol.for方法生成的，所以实际上是同一个值。

**Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol,但是如果你调用Symbol.for("cat")30 次，每次都会返回同一个 Symbol 值，但是调用Symbol("cat")30 次，会返回 30 个不同的 Symbol 值。**

## Symbol.keyfor()
Symbol.keyFor方法返回一个已登记的 Symbol 类型值的key。
```js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```
上面代码中，变量s2属于未登记的 Symbol 值，所以返回undefined。

需要注意的是，Symbol.for为 Symbol 值登记的名字，是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值。
```js
iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
// true
```
上面代码中，iframe 窗口生成的 Symbol 值，可以在主页面得到