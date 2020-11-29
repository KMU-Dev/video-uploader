import "reflect-metadata";
import { createConnection } from "typeorm";
import Koa from 'koa';
import { scheduleJob, RecurrenceRule } from 'node-schedule';
import { router } from './middleware/router';
import MainService from "./service/MainService";


createConnection().then(async connection => {
    const app = new Koa();

    app.use(router.routes());
    app.use(router.allowedMethods());

    // Get service
    // const mainService = container.resolve(MainService);
    const mainService = MainService.getInstance();
    mainService.start();

    // Define scheduled jobs
    // const cron = '*/5 * * * * *'
    // scheduleJob(cron, mainService.start);

    app.listen(3000);
}).catch(error => console.log(error));
