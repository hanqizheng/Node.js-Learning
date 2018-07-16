# Stream
2018-07-16

流的概念我们平时并不是直接使用的，而多半是别的Node.js的核心模块将Stream实例化来使用。

比如process.stdout、http.clientRequest。

## 从流中读数据

现在我通过一个简单的例子来熟悉一下利用流来读取文件
```js
const fs = require('fs');

let data = '';
//创建可读流,路径还要根据自己的来
const readStream = fs.createReadStream('./new/input.txt');
//设置编码格式
readStream.setEncoding('UTF-8');
//设置监听器来管理流的读入
readStream.on('data',(chunk) => {
    data += chunk;
});

readStream.on('end',() => {
    console.log(data);
});

readStream.on('error',(err) => {
    console.log(err);
});
```
可以看出，文件流的读取是通过事件(Event)来驱动的，当开始读取信息就触发data事件，读取结束就触发end事件。err事件是处理读取错误的情况。

如果不是很懂Event，请详细阅读[Event](https://github.com/hanqizheng/Node.js-LearningDialog/blob/master/Node.js%E6%A8%A1%E5%9D%97/Events.md)&[Event Emiiter](https://github.com/hanqizheng/Node.js-LearningDialog/blob/master/Node.js%E6%A8%A1%E5%9D%97/EventEmitter.md)
## 从流中写入数据
根读取数据非常类似，从流中写入数据也是利用Event的事件驱动。
```js
const fs = require('fs');
const data = 'hanqizheng';

const writeStream = fs.createWriteStream('./new/input.txt');

//将要写入的数据编写成UTF-8
writeStream.write(data,'UTF-8');
//标记文件末尾
writeStream.end();
//利用事件驱动来处理结束和错误的情况
writeStream.on('finish',() => {
    console.log('writing has finished');
});

writeStream.on('err',(err) => {
    console.log(err);
});
```
这样就可以把‘hanqizheng’写入到指定文件中，但是有一点要说，如果文件中有已经存在的内容，会被覆盖掉。具体文件的操作请仔细观看[File System](https://github.com/hanqizheng/Node.js-LearningDialog/blob/master/Node.js%E6%A8%A1%E5%9D%97/FileSystem.md)

## 管道流
之前的文件流已经学过很多遍了。

引入一个新的概念叫做管道流(pipe)。想象一下，现在有两个水桶，一个放在较高的地方，另一个放在较低的地方。然后在较高处水桶的底部与较低出水桶的顶部连接一根管子，这样水就会从较高处的水桶流入较低处的水桶。

我们可以把文件想象成木桶，然后水则是文件里的信息。这样就实现一种文件拷贝。
```js
const fs = require('fs');
const data = 'hanqizheng';

const readStream = fs.createReadStream('./new/input.txt');

const writeStream = fs.createWriteStream('./new/output.txt');
//管道读写操作
readStream.pipe(writeStream);

```
这样就能把input.txt的内容拷贝到output.txt中了。

