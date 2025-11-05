import { ConfigSchema } from 'core/config_schema';
import { FastStoreInterface } from 'core/fast_store_interface';
export declare class RedisPubsubService {
    private fastStore;
    private config;
    private _configDonePromise;
    private _configDoneResolve;
    private _configMutex;
    constructor(fastStore: FastStoreInterface, config: ConfigSchema);
    init(): void;
    initConfigPrepare(): void;
    initConfigDone(): Promise<void>;
    private _listenAppIntegrationsUpdates;
    private _listenBackgroundUpdates;
    private _listenConfigDone;
    private _listenConfiguredLanguagesUpdates;
    private _listenStoreConfigurationUpdates;
    private _listenStoreCustomizationUpdates;
    private _listenStoreNotifyEmailsUpdates;
    private _listenStoreShutdownUpdates;
}
