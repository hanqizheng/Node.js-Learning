# Koa + Egg

2018-07-10

今天学习了egg框架，然后顺便把koa框架也看了一下

这两个框架将node提供的诸多模块封装好供开发者使用，使用起来很方便

## ctx(Contex)

ctx是koa和egg都有的一个新的对象，他其实本质上是把node.js自带的request\response两个对象包装了一下变成了一个对象ctx。如果想使用request或者response就可以通过ctx.req\ctx.res来使用。很方便。

## Middleware(中间件)
中间件在执行上的顺序是严格按照代码书写每个中间件的顺序执行的，且遇到await next()\next()才会跳转执行下一个中间件，如果没有则不会跳转到下一个中间件执行。
```js
  router.get('/', async (ctx,next) => {
      console.log('1');
      await next();
  });

  router.get('/', async (ctx,next) => {
    console.log('2');
  });

  router.get('/', async (ctx,next) => {
    console.log('3');
  });

  //第三个中间件是不会被执行的
```
中间件的跳转顺序遵循洋葱圈规则。。如果不好理解就看以下这个例子

```js
  router.get('/', async (ctx,next) => {
      console.log('1');
      await next();
      console.log('6');

  });

  router.get('/', async (ctx,next) => {
    console.log('2');
    await next();
    console.log('4');
    console.log('5');

  });

  router.get('/', async (ctx,next) => {
    console.log('3');
  });

  // 123456

```

## 实现了一个GET请求的登陆验证demo
```js
//router.js
'use strict';

const koa = require('koa');
const app = new koa();
/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  验证登录
  router.get('/login', controller.login.check);

};
```

```js
//controller/login.js
'use strict';

const Controller = require('egg').Controller;
const url = require('url');
const querystring = require('querystring');

class LoginController extends Controller{
    async check() {
        this.ctx.body = 'this is login page';

        get方法
        const myUrl = url.parse(this.ctx.url);
        const query = myUrl.query;
        const queryObj = querystring.parse(query);

        if(queryObj.username == 'hanqizheng' && queryObj.password == '123'){
            this.ctx.body = 'login successfully!';
            this.ctx.cookies.set('username',queryObj.username);
        }

    }
}

module.exports = LoginController;
```
当然我把用户名密码写死了。

## setCookie
koa或者egg可以很方便的设置cookies

```js
ctx.cookies.set('cookieName','cookieValue');
```
这就可以设置一个非常简单的cookie，当然还有第三个参数是cookie的option,比如http-only之类的选项进行设置。

## getCookie
```js
ctx.cookies.get('cookieName');
```
这样就可以查看一个cookie了。