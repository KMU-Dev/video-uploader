import Router from 'koa-router';

export const status = new Router();

status.get('/', async ctx => {
    ctx.body = "Healthy!";
});
