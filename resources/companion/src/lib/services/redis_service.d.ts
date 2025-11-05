import { ConfigSchema } from 'core/config_schema';
import { FastStoreInterface } from "../../core/fast_store_interface";
export declare class RedisService implements FastStoreInterface {
    private _config;
    private _client;
    private readonly _readyPromise;
    constructor(_config: ConfigSchema);
    del(key: string | string[]): Promise<void>;
    expire(key: string, seconds: number): Promise<void>;
    get(key: string): Promise<string>;
    mget(keys: string[]): Promise<string[]>;
    publish(topic: string, value: string): Promise<void>;
    ready(): Promise<void>;
    scan(pattern?: string): Promise<any>;
    scanIterator(pattern?: string): AsyncIterable<string>;
    set(key: string, value: string, expire?: number): Promise<void>;
    subscribe(topic: string, callback: (value: string) => void): Promise<void>;
}
