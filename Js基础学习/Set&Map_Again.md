# Set & Map Again

## review
在上一节我们已经知道
- `Set中的值是唯一的`
- Set在创建的时候就不会添加重复的值进去，所以可以用来数组去重
- Set本身是一个构造函数，用来生成Set的数据结构
- Set作为构造函数的时候可以接受带有`iterable`的所有数据结构作为参数
- Set加入值的时候不会发生类型转换，内部判断两值是否想等类似于`===`
- `WeakSet`与`Set`类似，但是成员只能是对象，且对象都是弱引用，即垃圾回收不考虑对`WeakSet`中对象的引用，`如果其他对象都不再引用该对象，那么该对象就会被回收，即使他还在WeakSet中`。


## Set遍历操作
上一节给出了`Set`的遍历方法，但是没有具体说，在这里说一下。

```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

上面代码中，entries方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等。

`Set`的默认遍历方法是`values`方法，所以在书写遍历时可以这么写
```js

let set = new Set(['red', 'green', 'blue']);

for (let x of set) {
  console.log(x);
}
// red
// green
// blue
```
这样省略`values`的写法一样可以

## 几个函数
这几个函数才是这一节主要要讲的


### map()

**让原数组中的每个元素通过某种计算`产生一个新数组`**

```js
a = [1, 2, 3, 4, 5]

b = a.map(i => {
  return i * 2;  
})

// a[1, 2, 3, 4, 5]
// b[2, 4, 6, 8, 10]
```
map 是将a中每个元素拿出来进行一番操作，然后将新值返回给新数组

### filter()
**筛选出数组中符合条件的元素`组成新数组`**

```js
a = [1, 2, 3, 4, 5]

b = a.filter(i => {
	return i > 3;
});

// a[1, 2, 3, 4, 5]
// b[4, 5]
```

### reduce()
**让数组的`前项`和``后项`做某种运算，并累计最终值**

```js
a = [1, 2, 3, 4, 5]

c = a.reduce((pre, next) => {
	return pre + next;
})

// a[1, 2, 3, 4, 5]
// c 15（1 + 2 + 3 + 4 + 5）
```

### every()
**检测数组中的每一项是否符合条件， 全部符合条件返回`true`，不全部满足返回`false`**

```js
a = [1, 2, 3, 4, 5]

b = a.every(i => {
   return i > 0; 
});

// b true

b = a.every(i => {
   return i > 3; 
});

// b false
```

### some()
**与every()对比，只要有满足条件的选项则返回`true`， 如果一个满足的条件都没有，返回`false`**

```js
a = [1, 2, 3, 4, 5]

b = a.some(i => {
   return i > 3; 
});

// b true

b = a.some(i => {
   return i > 6; 
});

// b false

```