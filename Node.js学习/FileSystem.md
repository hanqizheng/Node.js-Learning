# File System

2018-07-11

对文件的操作也经常在平时敲代码的时候用到，所以今天就来看看文件的操作

只列举出来比较常用的

## 向一个文件中写点东西

```js
const fs = require('fs');

fs.writeFile('./new/test','buyaozhaoji',(err) => {
    if(err){
        throw err;
    }
    else{
        console.log('write successfully');
    }
});
```
非常简单的即行代码，就可以做到，**但要注意这种方法是异步的**

同步方法
```js
const fs = require('fs');

fs.writeFileSync('./new/test','write in file',(err) => {
    if(err){
        throw err;
    }
    else{
        console.log('write successfully');
    }
});
```

当然上述方法会将文件原有的内容覆盖掉，如何在文件已有内容的基础上写入一些东西呢？请看

```js
const fs = require('fs');

fs.appendFile('./new/test','\nappend something',(err) => {
    if(err){
        throw err;
    }
    else{
        console.log('append successfully');
    }
});
```
当然appendFile()也有同步方法。

## 从文件中读一些东西出来
从文件中读一些东西出来也是非常简单的操作

```js
const fs = require('fs');

const content = fs.readFile('./new/test','utf-8',(err,data) => {
    if(err){
        throw err;
    }
    else{
        console.log(data);
    }
});
```
这种是异步的读取，也有同步的，和上述方法一模一样，调用带有Sync的对应函数即可。

## 给文件换个名字

给文件重命名也只需要一个函数就可以轻松搞定
```js
const fs = require('fs');

fs.rename('./new/test','./new/TestFile',(err) => {
    if(err){
        throw err;
    }
    else{
        console.log('rename successfully!');
    }
});
```
