type ReleaseFunction = () => void;
type QueueEntry = {resolve: (release: ReleaseFunction) => void};

export class Mutex {
    private _queue: QueueEntry[] = [];
    private _isLocked = false;

    public acquire(): Promise<ReleaseFunction> {
        return new Promise<ReleaseFunction>((resolve) => {
            this._queue.push({resolve});
            this._dispatch();
        });
    }

    public async runExclusive<T>(callback: () => Promise<T>): Promise<T> {
        const release = await this.acquire();

        try {
            return await callback();
        } finally {
            release();
        }
    }

    private _dispatch() {
        if (this._isLocked) {
            return;
        }

        const nextEntry = this._queue.shift();
        if (!nextEntry) {
            return;
        }

        this._isLocked = true;

        nextEntry.resolve(this._buildRelease());
    }

    private _buildRelease(): ReleaseFunction {
        return () => {
            this._isLocked = false;
            this._dispatch();
        };
    }
}
