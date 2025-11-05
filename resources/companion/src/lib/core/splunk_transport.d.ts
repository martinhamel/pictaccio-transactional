import TransportStream, { TransportStreamOptions } from 'winston-transport';
interface SplunkTransportOptions extends TransportStreamOptions {
    host: string;
    port: number;
    token: string;
}
export declare class SplunkTransport extends TransportStream {
    private readonly _agent;
    private readonly _auth;
    private _buffer;
    private _options;
    constructor(options: SplunkTransportOptions);
    log(info: any, callback: any): void;
    private _flush;
    private _normalizeSplunkValue;
    private _normalizeSplunkObject;
    private _startFlushIntervalLoop;
}
export {};
