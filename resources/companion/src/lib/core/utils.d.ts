export declare function createPromiseTimeout(msTimeout: number, promise: Promise<unknown>): Promise<unknown>;
export declare function formatPEMString(certificate: string): string;
export declare function getApiServerVersion(): Promise<string>;
export declare function getCurrentBranchName(): Promise<string>;
export declare function getCurrentGitTag(): Promise<string>;
