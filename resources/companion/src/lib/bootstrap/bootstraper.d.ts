import { LoaderInterface } from 'lib/bootstrap/loader_interface';
import { LoaderState } from 'lib/bootstrap/loader_state';
export declare const loaderState: LoaderState;
export declare class Bootstraper {
    private _loaders;
    constructor(loaders: LoaderInterface[]);
    run(): Promise<any>;
    private _runInSequence;
}
