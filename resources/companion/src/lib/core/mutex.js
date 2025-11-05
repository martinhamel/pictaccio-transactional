"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
class Mutex {
    constructor() {
        this._queue = [];
        this._isLocked = false;
    }
    acquire() {
        return new Promise((resolve) => {
            this._queue.push({ resolve });
            this._dispatch();
        });
    }
    async runExclusive(callback) {
        const release = await this.acquire();
        try {
            return await callback();
        }
        finally {
            release();
        }
    }
    _dispatch() {
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
    _buildRelease() {
        return () => {
            this._isLocked = false;
            this._dispatch();
        };
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=mutex.js.map