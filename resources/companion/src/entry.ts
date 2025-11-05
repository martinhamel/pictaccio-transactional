import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { bootstrap, onExit } from 'lib/bootstrap';
import { logger } from 'lib/core/logger';

function exitHandler(kind: string, exitCode: number|string, error: Error): void {
    switch (kind) {
    case 'SIGINT':
    case 'SIGUSR1':
    case 'SIGUSR2':
        logger.info(`Application received ${exitCode}`, {area: 'MAIN', action: 'exiting', reason: exitCode});
        process.exit(0);
        break;

    case 'uncaught-exception':
        logger.error('Uncaught exception, application closing.', {
            area: 'MAIN',
            action: 'exiting',
            reason: 'uncaught-exception',
            error
        });
        console.log(error);
        //process.exit(1);
        break;

    default:
        logger.info(`Application closing with exit code ${exitCode}`, {
            area: 'MAIN',
            action: 'exiting',
            reason: exitCode
        });
    }
}

logger.info(`Pictacio starting ...`, {area: 'MAIN'});
onExit(exitHandler);


/*
 * Load the app's modules
 */
import { configLoader } from 'lib/loaders/config';
import { typediLoader } from 'lib/loaders/typedi';
import { servicesLoader } from 'lib/loaders/services';
import { schedulerLoader } from 'lib/loaders/scheduler';
import { typeormLoader } from 'lib/loaders/typeorm';
import * as process from 'node:process';
import type { ConfigGenService } from 'services/config_gen_service';
import { RedisPubsubService } from 'services/redis_pubsub_service';
import { Container } from 'typedi';

bootstrap([
    typediLoader,
    configLoader,
    schedulerLoader,
    typeormLoader,
    servicesLoader
])
.then(async () => {
    logger.info('... Application started successfully', {area: 'MAIN'});

    if (process.argv.includes('--init')) {
        logger.info('Initialization requested', {area: 'MAIN'});

        await Container.get<ConfigGenService>('config-gen').init(process.argv.includes('--debug'));
        process.exit(0);
    } else {
        Container.get<RedisPubsubService>('redis-pubsub').init();
    }
})
.catch((error) => {
    logger.error('An error occurred', {area: 'MAIN', message: error.message, stack: error.stack});
});
