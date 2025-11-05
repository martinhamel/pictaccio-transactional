type ReleaseFunction = () => void;
export declare class Mutex {
    private _queue;
    private _isLocked;
    acquire(): Promise<ReleaseFunction>;
    runExclusive<T>(callback: () => Promise<T>): Promise<T>;
    private _dispatch;
    private _buildRelease;
}
export {};
