import { ConfigSchema } from 'core/config_schema';
import { type FastStoreInterface } from 'core/fast_store_interface';
import { type RedisPubsubService } from 'services/redis_pubsub_service';
export declare class ConfigGenService {
    private fastStore;
    private redisPubsub;
    private config;
    constructor(fastStore: FastStoreInterface, redisPubsub: RedisPubsubService, config: ConfigSchema);
    init(debug: boolean): Promise<void>;
    generateConfig(debug: boolean): Promise<void>;
}
