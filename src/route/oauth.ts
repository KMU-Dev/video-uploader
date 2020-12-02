import Router from "koa-router";
import GoogleAPIService from "../service/GoogleAPIService";


export const oauth = new Router();

oauth.get('/', async ctx => {
    const googleAPIService = GoogleAPIService.getInstance();

    const rawCode = ctx.query.code;
    const token = await googleAPIService.getTokens(rawCode);

    if (token.access_token) ctx.body = "Authorization succeeded!";
    else ctx.body = "Authorization failed. Please contact site admin."
});
