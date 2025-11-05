import { open } from 'fs/promises';
import { logger } from 'lib/core/logger';

const FLUSH_CACHE_DURATION = 5000;

const cachedFiles = new Map<string, string>;
const flushTimers: NodeJS.Timeout[] = [];

export async function flushFileCaches(): Promise<void> {
    logger.info('Flushing file caches');

    for (const timer of flushTimers) {
        clearTimeout(timer);
    }

    for (const [filePath, content] of cachedFiles) {
        const file = await open(filePath, 'w');

        await file.writeFile(content);
        await file.sync();

        await file.close();
    }

    cachedFiles.clear();
}

export async function readFileCache(filePath: string): Promise<string> {
    if (cachedFiles.has(filePath)) {
        return cachedFiles.get(filePath);
    }

    const file = await open(filePath, 'r');

    await file.sync();
    const content = await file.readFile('utf-8');
    await file.close();

    cachedFiles.set(filePath, content);

    return content;
}

export async function writeFileCache(filePath: string, content: string): Promise<void> {
    cachedFiles.set(filePath, content);

    flushTimers.push(setTimeout(async () => {
        const file = await open(filePath, 'w');

        await file.writeFile(content);
        await file.sync();

        await file.close();

        cachedFiles.delete(filePath);
    }, FLUSH_CACHE_DURATION));
}
