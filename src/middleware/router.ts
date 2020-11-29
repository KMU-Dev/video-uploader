import Router from 'koa-router';
import { index } from '../route';

export const router = new Router();

// configure subrouters
router.use('/', index.routes(), index.allowedMethods());
