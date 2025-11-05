declare class Logger {
    private readonly _logger;
    constructor(logFilePath: string);
    debug(message: string, extended?: any): void;
    error(message: string, extended?: any): void;
    info(message: string, extended?: any): void;
    warn(message: string, extended?: any): void;
    private _log;
}
export declare const logger: Logger;
export {};
