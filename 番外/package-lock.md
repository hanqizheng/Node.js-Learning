# package-lock.json的学问

其实大家如果现在都用的是版本比较新的node，相信在子自己的工程里都不乏看到一个奇怪的文件`packge-lock.json`.

每次我需要看一下`package.json`的时候，总是能发现还有个`packge-lock.json`，那么这个文件和`package.json`有什么区别？那这个文件又有什么用呢？

## 现在对比一下package.json和package-lock.json

我就随便找了一个项目，拿他的两个文件来对比一下到底有什么区别？

**package.json**
```js
{
  "name": "dota",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "dependencies": {
    "egg": "^2.2.1",
    "egg-scripts": "^2.5.0"
  },
  "devDependencies": {
    "autod": "^3.0.1",
    "autod-egg": "^1.0.0",
    "egg-bin": "^4.3.5",
    "egg-ci": "^1.8.0",
    "egg-mock": "^3.14.0",
    "eslint": "^4.11.0",
    "eslint-config-egg": "^6.0.0",
    "webstorm-disable-index": "^1.2.0"
  },
  "engines": {
    "node": ">=8.9.0"
  },
  "scripts": {
    ...
  },
  "ci": {
    "version": "8"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "author": "",
  "license": "MIT"
}
```

然后当你打开`package-lock.json`却被眼前的景象惊呆了，怎么这么一大堆？

不用慌张，因为有很多我们用到但不需要配的"系统级"(只是一个不恰当的描述)的依赖，也需要特别在`package-lock.json`写出，所以就会有这么多，我们只需要关注我们在`package.json`中的`denpendencies`里面的以来就ok

比如我在上面的代码段给出了一个依赖`"egg-mock": "^3.14.0"`，然后在`package-lock.json`中是什么样子的？

```js
"egg-mock": {
  "version": "3.21.0",
  "resolved": "https://registry.npmjs.org/egg-mock/-/egg-mock-3.21.0.tgz",
  "integrity": "sha512-0r1Fqg910cm3Ws+j8WEtk8XjrRAFoy7AzQXGMzhB8CxuKZM4ZU45fnWHSB0kdClMtatWTyLzYDtVDBc5ASd1PQ==",
  "dev": true,
  "requires": {
    "@types/power-assert": "^1.5.0",
    "await-event": "^2.1.0",
    "co": "^4.6.0",
    "coffee": "^5.1.0",
    "debug": "^4.0.1",
    "detect-port": "^1.2.3",
    "egg-logger": "^1.7.1",
    "egg-utils": "^2.4.1",
    "extend2": "^1.0.0",
    "get-ready": "^2.0.1",
    "globby": "^8.0.1",
    "is-type-of": "^1.2.0",
    "ko-sleep": "^1.0.3",
    "merge-descriptors": "^1.0.1",
    "methods": "^1.1.2",
    "mm": "^2.4.1",
    "power-assert": "^1.6.1",
    "rimraf": "^2.6.2",
    "supertest": "^3.3.0",
    "urllib": "^2.29.1"
  },
```

可以看到比起`package.json`中那么简单的一句话，这里却用一大段来详细描述。

其实小伙伴有注意到都是描述verison，`package.json`中的version多了一个`^`，这表示大于等于这个版本都ok。

但是在`package-lock.json`中却是详细的具体的一个版本。

**这就是package-lock.json存在的意义**，有的时候我们开发了一个项目放到了github上，当然是个正常人都会把`node_module`给ignore掉。当小明（另一个人）觉得这个项目不错就clone下来然后`npm install`一下，可是这个时候就会存在问题，比如我当时的`egg-mock`是`1.1.0`，但是时间推移，包更新了，install是默认安装最新的包，小明的`egg-mock`就安装成了`2.1.1`。

那这个问题就很大了，`2.1.1`版本的更新正好把我`1.1.0`版本中用到的某个功能给ban了，那整个项目就会报错无法运行了。

但如果我有`package-lock.json`的话，就可以限制具体版本，小明安装的就是我限定过的可用的版本了。

但但但是，由于这个问题其实好多人都习惯了，于是出来`package-lock.json`之后反而不习惯，所有这个改动的评价也是好坏参半，不过随着后续的更新，已经基本满足大家的要求了。