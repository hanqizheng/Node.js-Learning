'use strict';

const koa = require('koa');
const app = new koa();
/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;


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
};  