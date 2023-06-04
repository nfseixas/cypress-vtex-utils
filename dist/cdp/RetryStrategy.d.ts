export declare class RetryStrategy {
    private _times;
    private backoffTime;
    private readonly maximumBackoff;
    private readonly maxRetries;
    constructor(maxRetries?: number, initialBackoff?: number, maximumBackoff?: number);
    execute<T extends (...args: any[]) => unknown>(task: T): Promise<number>;
    private delay;
    private nextTime;
    private increaseBackoffTime;
}
