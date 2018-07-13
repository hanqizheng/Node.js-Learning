# Koa 框架下的 GET & POST 请求

其实在koa框架下的 GET请求 和 POST请求使用方法大同小异，仅仅是因为koa将request和response包装在了一个ctx里面。

## GET 
```js
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

```

## POST
```js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx,next) => {
    //get方式请求页面
    if(ctx.url === '/' && ctx.method === 'GET'){
        //写了一个最简单的html来作为一个提交表单的界面 提交方为POST
        let html =' <h1>koa2 request post demo</h1>'+
                    '<form method="POST" action="/">'+
                    '<p>userName</p>'+
                    '<input name="userName" /><br/>'+
                    '<p>nickName</p>'+
                    '<input name="nickName" /><br/>'+
                    '<p>email</p>'+
                    '<input name="email" /><br/>'+
                    '<button type="submit">submit</button>'+
                    '</form>'
        ctx.body = html;

    }
    else if(ctx.url === '/' && ctx.method === 'POST'){
        let postData =await parsePostData(ctx);
        console.log(postData);
        ctx.body = postData;
    }
    else{
        ctx.body = '404 not found';
    }
});

parsePostData = (ctx) => {
    //由于是post请求，所以没办法直接获取到请求的信息
    //所以需要先用node.js原生的req解析表单数据成query string
    //然后在转换成JSON格式的对象
    return new Promise((resolve,reject) => {
        try {
            let postData = '';

            //添加一个原生的监听器，有数据传来的时候触发，然后将数据拼接
            ctx.req.addListener('data',(data) => {
                postData += data;
            });

            //添加一个原生的监听器，数据传输结束触发，返回成功的解析成string的data
            ctx.req.addListener('end',() => {
                let parseData = parseQueryString(postData);
                resolve(parseData);
            });
        } catch (error) {
            reject(error);
        }
    });
}

parseQueryString = (queryString) =>{
    let queryData = {};
    let queryStrList = queryString.split('&');

    console.log(queryStrList);

    //这个for循环是什么新操作。。。我得查一下
    for(let [index,queryString] of queryStrList.entries()){
        let itemList = queryString.split('=');
        queryData[itemList[0]] = decodeURIComponent(itemList[1]);
    }

    return queryData;
}

app.listen(3000);
```