"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigGenService = void 0;
const tslib_1 = require("tslib");
const config_schema_1 = require("core/config_schema");
const transac_config_1 = require("core/transac_config");
const logger_1 = require("lib/core/logger");
const path_1 = require("path");
const typedi_1 = require("typedi");
const file_1 = require("utils/file");
let ConfigGenService = class ConfigGenService {
    constructor(fastStore, redisPubsub, config) {
        this.fastStore = fastStore;
        this.redisPubsub = redisPubsub;
        this.config = config;
    }
    async init(debug) {
        logger_1.logger.info('Generating config files');
        await this.generateConfig(debug);
        logger_1.logger.info('Config files generated');
        logger_1.logger.info('Init pubsub');
        this.redisPubsub.init();
        this.redisPubsub.initConfigPrepare();
        logger_1.logger.info('Completed init pubsub');
        logger_1.logger.info('Publishing config request');
        await this.fastStore.publish('config:request', '');
        logger_1.logger.info('Config request published');
        logger_1.logger.info('Waiting for config done');
        await this.redisPubsub.initConfigDone();
        logger_1.logger.info('Config done');
        await (0, file_1.flushFileCaches)();
    }
    async generateConfig(debug) {
        await (0, file_1.writeFileCache)((0, path_1.join)(this.config.env.dirs.transacConfig, this.config.env.files.appConfig), transac_config_1.appConfig);
        await (0, file_1.writeFileCache)((0, path_1.join)(this.config.env.dirs.transacConfig, this.config.env.files.coreConfig), transac_config_1.coreConfig.replace('{{DEBUG_VALUE}}', debug ? '2' : '0'));
        await (0, file_1.writeFileCache)((0, path_1.join)(this.config.env.dirs.transacConfig, this.config.env.files.databaseConfig), transac_config_1.databaseConfig);
        await (0, file_1.writeFileCache)((0, path_1.join)(this.config.env.dirs.transacConfig, this.config.env.files.databaseVarsConfig), transac_config_1.databaseVars);
    }
};
exports.ConfigGenService = ConfigGenService;
exports.ConfigGenService = ConfigGenService = tslib_1.__decorate([
    (0, typedi_1.Service)('config-gen'),
    tslib_1.__param(0, (0, typedi_1.Inject)('fast-store')),
    tslib_1.__param(1, (0, typedi_1.Inject)('redis-pubsub')),
    tslib_1.__param(2, (0, typedi_1.Inject)('config')),
    tslib_1.__metadata("design:paramtypes", [Object, Object, typeof (_a = typeof config_schema_1.ConfigSchema !== "undefined" && config_schema_1.ConfigSchema) === "function" ? _a : Object])
], ConfigGenService);
//# sourceMappingURL=config_gen_service.js.map