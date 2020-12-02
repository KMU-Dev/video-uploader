import "reflect-metadata";
import { createConnection } from "typeorm";
import Koa from 'koa';
import { scheduleJob } from 'node-schedule';
import { router } from './middleware/router';
import MainService from "./service/MainService";
import ConfigurationService from "./service/ConfigurationService";
import GoogleAPIService from "./service/GoogleAPIService";
import chalk from "chalk";


createConnection().then(async connection => {
    const app = new Koa();

    app.use(router.routes());
    app.use(router.allowedMethods());

    // init Google OAuth2 client
    console.log('Load credentials to Google OAuth2 client.');
    const configurationService = ConfigurationService.getInstance();
    const googleAPIService = GoogleAPIService.getInstance();
    const googleConfig = await configurationService.getConfig('google');
    await googleAPIService.initClient(googleConfig.oauthClient.keyPath);
    
    /* mainService.start().then(() => {
        console.log("MainService finished.");
    }).catch(err => {
        console.error(err);
    }); */

    // Define scheduled jobs
    const cron = '*/10 * * * *' // run on every 10 minutes
    scheduleJob(cron, () => {
        const mainService = MainService.getInstance();
        mainService.start()
                .then(() => {
                    console.log(chalk.green("MainService finished without any error."))
                }).catch(err => {
                    console.log(chalk.red('MainService end with following error!'));
                    console.error(err);
                });
    });

    app.listen(3000);
}).catch(error => console.log(error));
