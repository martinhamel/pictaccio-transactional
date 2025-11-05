export declare class LoaderState {
    private readonly _offers;
    private _waitingOnOffers;
    constructor();
    offer(offerName: string, callback: (...args: any[]) => unknown): void;
    request(valueName: string, ...args: unknown[]): Promise<any>;
}
