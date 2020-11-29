import Router from 'koa-router';


export const index = new Router();

index.get('/', ctx => {
    ctx.response.body = 'Hello world';
});
