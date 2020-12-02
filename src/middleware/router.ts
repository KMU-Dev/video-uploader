import Router from 'koa-router';
import { index } from '../route';
import { oauth } from '../route/oauth';

export const router = new Router();

// configure subrouters
router.use('/', index.routes(), index.allowedMethods());
router.use('/oauth2callback', oauth.routes(), oauth.allowedMethods());
