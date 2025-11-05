import { ConfigSchema } from 'core/config_schema';
import { type FastStoreInterface } from 'core/fast_store_interface';
import { appConfig, coreConfig, databaseConfig, databaseVars } from 'core/transac_config';
import { logger } from 'lib/core/logger';
import { join } from 'path';
import { type RedisPubsubService } from 'services/redis_pubsub_service';
import { Inject, Service } from 'typedi';
import { flushFileCaches, writeFileCache } from 'utils/file';

@Service('config-gen')
export class ConfigGenService {
    constructor(@Inject('fast-store') private fastStore: FastStoreInterface,
                @Inject('redis-pubsub') private redisPubsub: RedisPubsubService,
                @Inject('config') private config: ConfigSchema) {
    }

    public async init(debug: boolean): Promise<void> {
        logger.info('Generating config files');
        await this.generateConfig(debug);
        logger.info('Config files generated');

        logger.info('Init pubsub');
        this.redisPubsub.init();
        this.redisPubsub.initConfigPrepare();
        logger.info('Completed init pubsub');

        logger.info('Publishing config request');
        await this.fastStore.publish('config:request', '');
        logger.info('Config request published');

        logger.info('Waiting for config done');
        await this.redisPubsub.initConfigDone();
        logger.info('Config done');

        await flushFileCaches();
    }

    public async generateConfig(debug: boolean): Promise<void> {
        await writeFileCache(
            join(this.config.env.dirs.transacConfig, this.config.env.files.appConfig), appConfig);
        await writeFileCache(
            join(this.config.env.dirs.transacConfig, this.config.env.files.coreConfig),
            coreConfig.replace('{{DEBUG_VALUE}}', debug ? '2' : '0'));
        await writeFileCache(
            join(this.config.env.dirs.transacConfig, this.config.env.files.databaseConfig), databaseConfig);
        await writeFileCache(
            join(this.config.env.dirs.transacConfig, this.config.env.files.databaseVarsConfig), databaseVars);
    }
}
