const Koa = require('koa');
const app = new Koa();

app.use(async (ctx,next) => {
    //get方法相对简单一些
    //获取url
    //获取query
    //然后就ok了
    
    let url = ctx.url;
    let body = ctx.request.body;
    let reqQuery = ctx.request.query;
    let reqQueryString = ctx.request.querystring;

    let ctxQuery = ctx.query;
    let ctxQuertString = ctx.querystring;

    ctx.body = {
        url,
        reqQuery,
        reqQueryString,
        ctxQuery,
        ctxQuertString
    }
});

app.listen(3000);
