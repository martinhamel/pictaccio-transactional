export declare function flushFileCaches(): Promise<void>;
export declare function readFileCache(filePath: string): Promise<string>;
export declare function writeFileCache(filePath: string, content: string): Promise<void>;
