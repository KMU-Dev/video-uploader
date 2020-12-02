import Router from 'koa-router';
import GoogleAPIService from '../service/GoogleAPIService';


export const index = new Router();

index.get('/', async ctx => {
    
    const googleAPIService = GoogleAPIService.getInstance();
    const scopes = ['https://www.googleapis.com/auth/drive.file', 'openid']
    ctx.response.redirect(await googleAPIService.getAuthUrl(scopes));
});
