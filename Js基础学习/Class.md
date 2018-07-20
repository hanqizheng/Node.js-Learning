# Class
2018-07-20

其实说到class，学过C++，JAVA之类的OO语言一定对这个关键词不陌生。

但是对于新接触JavaScript语言的小伙伴（比如我，微笑.jpg）会很费解JS的对象创建方法。见下

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

let p = new Point(1, 2);
```

JS中对象的创建其实是通过Constructor(构造函数)来创建的，然后对象所具有什么方法（函数）都是放在构造函数的原型上（如果对原型不太熟悉的小伙伴，我日后会把这个括号变成原型的学习笔记链接，滑稽.jpg）。
就像这个样子
```js
let p = new Point(1,2);
```
通过构造函数new一个实例化的对象出来。这一步倒是和C++，JAVA差不多。他迷就迷在前面定义对象的属性和方法....的方法上了。

然后我们来说一下今天的主角Class

## 语法糖Class
class就是ES6给出的语法糖，让苦逼的JS程序猿写JS的时候可以和C++，JAVA这类语言一样定义。
```js
//定义类
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```
上面代码定义了一个“类”，可以看到里面有一个constructor方法，这就是构造方法，而this关键字则代表实例对象。也就是说，ES5 的构造函数Point，对应 ES6 的Point类的构造方法。

Point类除了构造方法，还定义了一个toString方法。注意，定义“类”的方法的时候，前面不需要加上function这个关键字，直接把函数定义放进去了就可以了。另外，方法之间不需要逗号分隔，加了会报错。

可以看到这样定义和C++，JAVA就非常相像了，除了构造函数的命名之类的细节不一样。

## class的本质

那么既然说是语法糖，就要探究一下他的本质，他的本质也很简单，就是我们写的第一段代码。
```js
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```
上面代码表明，类的数据类型就是函数，**类本身就指向构造函数。**

使用的时候，也是直接对类使用new命令，跟构造函数的用法完全一致。
```js
class Bar {
  doStuff() {
    console.log('stuff');
  }
}

var b = new Bar();
b.doStuff() // "stuff"
```

然后类内定义的所有方法，其实还是挂在了prototype原型上的。
```js
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```
```js
class B {}
let b = new B();

b.constructor === B.prototype.constructor // true
```
上面代码中，b是B类的实例，它的constructor方法就是B类原型的constructor方法。

## constructor
constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。
```js
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```
上面代码中，定义了一个空的类Point，JavaScript 引擎会自动为它添加一个空的constructor方法。

## class 表达式
与函数一样，类也可以使用表达式的形式定义。
```js
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```
上面代码使用表达式定义了一个类。需要注意的是，这个类的名字是MyClass而不是Me，Me只在 Class 的内部代码可用，指代当前类。
```js
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```
上面代码表示，Me只在 Class 内部有定义。

如果类的内部没用到的话，可以省略Me，也就是可以写成下面的形式。
```js
const MyClass = class { /* ... */ };
```

## Get() Set()
在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```js
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```
上面代码中，prop属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了。

## 继承
相比之前，现在有了class关键字之后，继承的写法也变得格外简单，只要通过extends关键字即可
```js
class Point {
}

class ColorPoint extends Point {
}
```
### super
super这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

第一种情况，super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。
```js
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```
上面代码中，子类B的构造函数之中的super()，代表调用父类的构造函数。这是必须的，否则 JavaScript 引擎会报错。

**注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B，因此super()在这里相当于A.prototype.constructor.call(this)。**
```js
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```
上面代码中，new.target指向当前正在执行的函数。可以看到，在super()执行时，它指向的是子类B的构造函数，而不是父类A的构造函数。也就是说，super()内部的this指向的是B。

第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
```js
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```
上面代码中，子类B当中的super.p()，就是将super当作一个对象使用。这时，super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()。