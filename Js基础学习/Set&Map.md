# Set & Map
2018-07-16

## Set
ES6推出的新的数据结构Set,类似于数，但是最大的特点就是，成员的值都是唯一的！

```js
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```
上面代码通过add方法向 Set 结构加入成员，结果表明 **Set 结构不会添加重复的值**。

Set在初始化的时候可以接受一个数组（或者能够遍历的数据结构）
```js
// 例一
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5
```

## 实例化Set包含的方法
add(value)：添加某个值，返回 Set 结构本身。

delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。

has(value)：返回一个布尔值，表示该值是否为Set的成员。

clear()：清除所有成员，没有返回值。

keys()：返回键名的遍历器

values()：返回键值的遍历器

entries()：返回键值对的遍历器

forEach()：使用回调函数遍历每个成员

我日后把这里补一下。。。今天好不想写

## WeakSet
WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

首先，WeakSet 的成员只能是对象，而不能是其他类型的值。
```js
const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set
```
上面代码试图向 WeakSet 添加一个数值和Symbol值，结果报错，因为 WeakSet 只能放置对象。

其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

如果想详细了解Js的垃圾回收机制之类的知识点，请参考[JS的垃圾回收]()。

## Map
JS中对象就是属性（键值对）的集合。但是传统上却只能用字符串当作键，这样就很大程度的产生了限制性。

所以推出了Map这样的数据结构，它允许键不光可以是字符串也可以是值，这样就从单一的字符串--值的对应关系，拓展到了值--值的对应关系。

Map构造函数接受数组作为参数，实际上执行的是下面的算法。
```js
const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map = new Map();

items.forEach(
  ([key, value]) => map.set(key, value)
);
```
事实上，不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数。这就是说，Set和Map都可以用来生成新的 Map。
```js
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```
上面代码中，我们分别使用 Set 对象和 Map 对象，当作Map构造函数的参数，结果都生成了新的 Map 对象。

注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。
```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```
上面代码的set和get方法，表面是针对同一个键，但实际上这是两个值，内存地址是不一样的，因此get方法无法读取该键，返回undefined。2个['a']只是长的一样，在内存中是两个地方。

如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），**则只要两个值严格相等，Map 将其视为一个键**，比如0和-0就是一个键，布尔值true和字符串true则是两个不同的键。另外，undefined和null也是两个不同的键。虽然**NaN不严格相等于自身，但 Map 将其视为同一个键**。
```js
let map = new Map();

map.set(-0, 123);
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123);
map.get(NaN) // 123
```

## Map实例化具有的属性和方法
Map 结构的实例有以下属性和操作方法。

### size 属性

size属性返回 Map 结构的成员总数。也可以理解成Map的大小，但是不太严谨，最好别这么理解。
```js
const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
```
### set(key, value)

set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。
```js
const m = new Map();

m.set('edition', 6)        // 键是字符串
m.set(262, 'standard')     // 键是数值
m.set(undefined, 'nah')    // 键是 undefined
```
set方法返回的是当前的Map对象，因此可以采用链式写法。
```js
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
  ```
  等价于
  ```js
let map = new Map().set(1,'a');
let map = new Map().set(2,'b');
let map = new Map().set(3,'c');
  ```

### get(key)

get方法读取key对应的键值，**如果找不到key，返回undefined**。
```js
const m = new Map();

const hello = function() {console.log('hello');};
m.set(hello, 'Hello!') // 键是函数

m.get(hello)  // Hello!
```
### has(key)

has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
```js
const m = new Map();

m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');

m.has('edition')     // true
m.has('years')       // false
m.has(262)           // true
m.has(undefined)     // true
```
### delete(key)

delete方法删除某个键，返回true。如果删除失败，返回false。
```js
const m = new Map();
m.set(undefined, 'nah');
m.has(undefined)     // true

m.delete(undefined)
m.has(undefined)       // false
```
### clear()

clear方法清除所有成员，没有返回值。
```js
let map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
map.clear()
map.size // 0
```

## Map与数组互换


### Map转数组
Map到数组的变换可以通过...很方便的就实现
```js
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```
### 数组转Map


将数组传入 Map 构造函数，就可以转为 Map。
```js
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```

## WeakMap （待续）