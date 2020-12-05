import Router from 'koa-router';
import { index } from '../route';
import { oauth } from '../route/oauth';
import { status } from '../route/status';

export const router = new Router();

// configure subrouters
router.use('/', index.routes(), index.allowedMethods());
router.use('/oauth2callback', oauth.routes(), oauth.allowedMethods());
router.use('/status', status.routes(), status.allowedMethods());
