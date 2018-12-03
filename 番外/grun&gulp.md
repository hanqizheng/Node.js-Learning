# Grunt & Gulp

## 用途和场景

前端开发有时会与一些非常繁琐的操作打交道，每次都要重复那几步类似的操作，不做又不行，实在是烦人。

所以就需要一个工具每次自动来帮助完成这些繁琐的工作。

但是另一个问题就由此产生，繁琐的工作有千千万万，一个人根本不可能开发出满足所有操作的一个工具或者多个工具。

所以就从`工具`开发转向`工具框架`的开发

每个`工具`则作为`框架插件`的形式放入框架，这样一来，不用一个人开发所有的功能，大家用到哪一个功能就开发哪一个功能，然后分享自己的插件供别的开发者使用。

**Grunt和Gulp就是这样的工具框架**

## Grunt
Grunt 是基于Node.js的。

Grunt中每个工具插件都作为一个包的形式存在，然后放在`npm`上进行管理。

### Gruntfile
首先要明白，这是一个 JS 文件，你可以写任意的 JS 代码，比如声明一个 对象 来存储一会要写任务的参数，或者是一个变量当作开关等等。

然后，所有的代码要包裹在

```js
module.exports = function(grunt) {
    ...
};
```

这个文件就是Grunt的配置文件，Grunt完成什么工作都在这个文件中进行配置

这个文件中与Grunt有关的只有`3`部分代码

#### 任务配置代码

调用插件，配置一次要执行的任务和实现的功能

```js
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  uglify: {
    options: {
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    build: {
      src: 'src/<%= pkg.name %>.js',
      dest: 'build/<%= pkg.name %>.min.js'
    }
  }
});
```

可以看出，具体的任务配置代码以对象格式放在 grunt.initConfig 函数里面，其中先写了一句 pkg: grunt.file.readJSON('package.json') 功能是读取 package.json 文件，并把里面的信息获取出来，方便在后面任务中应用（例如下面就用了 <%= pkg.name %> 来输出项目名称），这样可以提高灵活性。之后就是 uglify 对象，这个名字是固定的，表示下面任务是调用 uglify 插件的，首先先配置了一些全局的 options 然后新建了一个 build 任务。

也就是说，在 Uglify 插件下面，有一个 build 任务，内容是把 XX.js 压缩输出到 xx.min.js 里面。如果你需要更多压缩任务，也可以参照 build 多写几个任务。

#### 插件加载代码

加载所需要的工具插件的代码

```js
grunt.loadNpmTasks('grunt-contrib-uglify');
```

#### 任务注册代码

注册一个任务，其中包含着`任务配置代码`

```js
grunt.registerTask('default', ['uglify']);
```

这样，就可以用Grunt来执行注册一个task从而根据任务配置代码和所需要的插件来执行相应的操作。


## Gulp
官方给出的解释：`基于文件流的构建系统`。（我不知道在说什么.jpg）

其实做的事情与Grunt一样或者说及其类似，只是在构建流程上与组建只能的划分等有所区别。


## Grunt & Gulp

构建流程上 
- Grunt的流程大概是：读文件 -> 修改文件 -> 写文件 -> 读文件 -> 修改文件 -> 写文件 ....
- Gulp的流程大概是 ： 读文件 -> 修改文件 -> 修改文件 -> 修改文件 -> .... -> 写文件


基于
- Grunt是基于配置的，所以就需要上面所说的那么多不是很好理解的配置代码
- Gulp是基于工作流程的，但是其实最后也是配置代码，但是这么做的性能大大提高。
 
## 参考

- [Grunt 新手一日入门](http://yujiangshui.com/grunt-basic-tutorial/)
- [gulp：入门简介](https://www.cnblogs.com/chyingp/p/gulp-introduction.html)