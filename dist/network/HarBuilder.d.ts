import type { Entry, Har } from 'har-format';
export declare class HarBuilder {
    private readonly entries;
    constructor(entries: Entry[]);
    build(): Har;
}
