import { NetworkRequest } from './NetworkRequest';
import type { Entry } from 'har-format';
export declare class EntryBuilder {
    private readonly request;
    constructor(request: NetworkRequest);
    build(): Promise<Entry>;
    private getResponseBodySize;
    private getResponseCompression;
    private toMilliseconds;
    private buildRequest;
    private buildResponse;
    private buildContent;
    private buildTimings;
    private leastNonNegative;
    private buildPostData;
    private buildRequestURL;
    private buildCookies;
    private buildCookie;
    private requestBodySize;
}
