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