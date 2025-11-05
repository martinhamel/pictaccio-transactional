"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushFileCaches = flushFileCaches;
exports.readFileCache = readFileCache;
exports.writeFileCache = writeFileCache;
const promises_1 = require("fs/promises");
const logger_1 = require("lib/core/logger");
const FLUSH_CACHE_DURATION = 5000;
const cachedFiles = new Map;
const flushTimers = [];
async function flushFileCaches() {
    logger_1.logger.info('Flushing file caches');
    for (const timer of flushTimers) {
        clearTimeout(timer);
    }
    for (const [filePath, content] of cachedFiles) {
        const file = await (0, promises_1.open)(filePath, 'w');
        await file.writeFile(content);
        await file.sync();
        await file.close();
    }
    cachedFiles.clear();
}
async function readFileCache(filePath) {
    if (cachedFiles.has(filePath)) {
        return cachedFiles.get(filePath);
    }
    const file = await (0, promises_1.open)(filePath, 'r');
    await file.sync();
    const content = await file.readFile('utf-8');
    await file.close();
    cachedFiles.set(filePath, content);
    return content;
}
async function writeFileCache(filePath, content) {
    cachedFiles.set(filePath, content);
    flushTimers.push(setTimeout(async () => {
        const file = await (0, promises_1.open)(filePath, 'w');
        await file.writeFile(content);
        await file.sync();
        await file.close();
        cachedFiles.delete(filePath);
    }, FLUSH_CACHE_DURATION));
}
//# sourceMappingURL=file.js.map