"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const bootstrap_1 = require("lib/bootstrap");
const logger_1 = require("lib/core/logger");
function exitHandler(kind, exitCode, error) {
    switch (kind) {
        case 'SIGINT':
        case 'SIGUSR1':
        case 'SIGUSR2':
            logger_1.logger.info(`Application received ${exitCode}`, { area: 'MAIN', action: 'exiting', reason: exitCode });
            process.exit(0);
            break;
        case 'uncaught-exception':
            logger_1.logger.error('Uncaught exception, application closing.', {
                area: 'MAIN',
                action: 'exiting',
                reason: 'uncaught-exception',
                error
            });
            console.log(error);
            break;
        default:
            logger_1.logger.info(`Application closing with exit code ${exitCode}`, {
                area: 'MAIN',
                action: 'exiting',
                reason: exitCode
            });
    }
}
logger_1.logger.info(`Pictacio starting ...`, { area: 'MAIN' });
(0, bootstrap_1.onExit)(exitHandler);
const config_1 = require("lib/loaders/config");
const typedi_1 = require("lib/loaders/typedi");
const services_1 = require("lib/loaders/services");
const scheduler_1 = require("lib/loaders/scheduler");
const typeorm_1 = require("lib/loaders/typeorm");
const process = tslib_1.__importStar(require("node:process"));
const typedi_2 = require("typedi");
(0, bootstrap_1.bootstrap)([
    typedi_1.typediLoader,
    config_1.configLoader,
    scheduler_1.schedulerLoader,
    typeorm_1.typeormLoader,
    services_1.servicesLoader
])
    .then(async () => {
    logger_1.logger.info('... Application started successfully', { area: 'MAIN' });
    if (process.argv.includes('--init')) {
        logger_1.logger.info('Initialization requested', { area: 'MAIN' });
        await typedi_2.Container.get('config-gen').init(process.argv.includes('--debug'));
        process.exit(0);
    }
    else {
        typedi_2.Container.get('redis-pubsub').init();
    }
})
    .catch((error) => {
    logger_1.logger.error('An error occurred', { area: 'MAIN', message: error.message, stack: error.stack });
});
//# sourceMappingURL=entry.js.map