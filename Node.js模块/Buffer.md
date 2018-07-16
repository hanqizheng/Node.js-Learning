# Buffer

2017-07-16

Buffer 的存在是因为JavaScript本身并没有二进制的数据类型，可是由于TCP等的一些技术需要对二进制的数据进行处理，所以Buffer应运而生。

## Buffer的创建
buffer 的创建有好几种方法，但是官方比较建议使用Buffer.from();

- new Buffer 创建
```js
const buf = new Buffer([0x1,0x2,0x3]);
//<Buffer 01 02 03>
```
- Buffer.alloc()
```js
const buf1 = Buffer.alloc(10);  // 长度为10的buffer，被0x0填充
const buf2 = Buffer.alloc(10, 1);  // 长度为10的buffer，填充0x1
```
- Buffer.allocUnsafe()
```js
const buf3 = Buffer.allocUnsafe(10);  // 长度为10的buffer，初始值不确定
```
- Buffer.from()
```js
//将一般的ascii码转化为别的表达形式
const buf = Buffer.from('hanqizheng', 'ascii');

console.log(buf.toString('hex'));
//68616e71697a68656e67

console.log(buf.toString('base64'));
//aGFucWl6aGVuZw==
```
反之亦然
```js
const buf = Buffer.from('aGFucWl6aGVuZw==', 'base64');

console.log(buf.toString('ascii'));
//hanqizheng
```
Buffer.from()也可以接受array参数
```js
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
console.log(buf.toString());
//buffer
```
- Buffer.from('1')

一开始不自觉的会将`Buffer.from('1')[0]`跟`"1"`划等号，其实`"1"`对应的编码是49。

```js
const buff = Buffer.from('1')  // <Buffer 31>
console.log(buff[0] === 1)  // false
```

这样对比就知道了，编码为1的是个控制字符，表示 Start of Heading。

```js
console.log( String.fromCharCode(49) )  // '1'
console.log( String.fromCharCode(1) )  // '\u0001'
```
## Buffer写入
```js
const buff = Buffer.alloc(4);
buff.write('a');  // 返回 1
console.log(buff);  // 打印 <Buffer 61 00 00 00>

buff.write('ab');  // 返回 2
console.log(buff);  // 打印 <Buffer 61 62 00 00>
```

## Buffer转成字符串
转成字符串当然是要用toString()啦！
```js
const buff = Buffer.from('hello');

console.log( buff.toString() );  // hello

console.log( buff.toString('utf8', 0, 2) );  // he
```

## Buffer转成JSON
当然是要用toJSON()啦，你一定猜到了
```js
var buff = Buffer.from('hello');

console.log( buff.toJSON() );  // { type: 'Buffer', data: [ 104, 101, 108, 108, 111 ] }
```

