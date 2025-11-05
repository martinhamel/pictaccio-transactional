import { EventEmitter } from 'events';
export interface CollectionItem {
    file: string;
    obj?: any;
    parent?: string;
    imported: boolean;
    instance?: any;
}
export interface CollectionOptions {
    filter: RegExp;
    factory?: (file: string) => any;
}
export declare class Collection extends EventEmitter {
    private _directory;
    private _options;
    private _collection;
    constructor(_directory: string | string[], _options: CollectionOptions);
    each(): Generator<CollectionItem>;
    execEach(callable: (item: any) => void): void;
    importAll(): Promise<void>;
    private _loadCollection;
}
