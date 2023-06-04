import { NetworkCookie } from './NetworkCookie';
import type { RequestExtraInfo, ResponseExtraInfo } from './ExtraInfoBuilder';
import type { Header, Param, QueryString } from 'har-format';
import type Protocol from 'devtools-protocol';
export interface ContentData {
    error?: string;
    text?: string;
    encoding?: string;
}
export declare enum WebSocketFrameType {
    REQUEST = "request",
    RESPONSE = "response",
    ERROR = "error"
}
export interface WebSocket {
    type: WebSocketFrameType;
    data: string;
    time: Protocol.Network.MonotonicTime;
    opcode: number;
    mask: boolean;
}
export interface EventSourceMessage {
    time: number;
    eventName: string;
    eventId: string;
    data: string;
}
export declare class NetworkRequest {
    private _requestId;
    readonly documentURL: string;
    readonly loaderId: Protocol.Network.LoaderId;
    readonly initiator?: Protocol.Network.Initiator | undefined;
    readonly frameId: Protocol.Page.FrameId;
    private _contentData?;
    private _wallIssueTime;
    private _requestHeaderValues;
    private _responseHeaderValues;
    private _parsedQueryParameters?;
    private _currentPriority?;
    private _requestFormData;
    private _formParametersPromise?;
    private _signedExchangeInfo?;
    get signedExchangeInfo(): Protocol.Network.SignedExchangeInfo | undefined;
    set signedExchangeInfo(info: Protocol.Network.SignedExchangeInfo | undefined);
    private _hasExtraResponseInfo;
    get hasExtraResponseInfo(): boolean;
    set hasExtraResponseInfo(value: boolean);
    private _hasExtraRequestInfo;
    get hasExtraRequestInfo(): boolean;
    set hasExtraRequestInfo(value: boolean);
    private _connectionId;
    get connectionId(): string;
    set connectionId(value: string);
    private _protocol;
    get protocol(): string;
    set protocol(value: string);
    private _requestTime;
    get requestTime(): number;
    set requestTime(value: number);
    private _requestMethod;
    get requestMethod(): string;
    set requestMethod(value: string);
    private _statusText;
    get statusText(): string;
    set statusText(value: string);
    private _parsedURL;
    get parsedURL(): URL;
    private _url;
    get url(): string;
    set url(value: string);
    private _remoteAddress;
    get remoteAddress(): string;
    private _startTime;
    get startTime(): Protocol.Network.MonotonicTime;
    private _issueTime;
    get issueTime(): Protocol.Network.MonotonicTime;
    private _endTime;
    get endTime(): number;
    set endTime(x: number);
    private _responseReceivedTime;
    get responseReceivedTime(): number;
    set responseReceivedTime(value: number);
    private _resourceSize;
    get resourceSize(): number;
    set resourceSize(value: number);
    private _transferSize;
    get transferSize(): number;
    set transferSize(value: number);
    private _timing?;
    get timing(): Protocol.Network.ResourceTiming | undefined;
    set timing(timingInfo: Protocol.Network.ResourceTiming | undefined);
    private _mimeType?;
    get mimeType(): string | undefined;
    set mimeType(value: string | undefined);
    private _resourceType;
    get resourceType(): Protocol.Network.ResourceType;
    set resourceType(resourceType: Protocol.Network.ResourceType);
    private _redirectSource?;
    get redirectSource(): NetworkRequest | undefined;
    set redirectSource(originatingRequest: NetworkRequest | undefined);
    private _requestHeaders;
    get requestHeaders(): Header[];
    set requestHeaders(headers: Header[]);
    private _requestCookies?;
    get requestCookies(): NetworkCookie[] | undefined;
    get contentLength(): number;
    private _requestHeadersText;
    get requestHeadersText(): string;
    set requestHeadersText(text: string);
    private _connectionReused;
    get connectionReused(): boolean;
    set connectionReused(value: boolean);
    private _responseHeaders;
    get responseHeaders(): Header[];
    set responseHeaders(value: Header[]);
    private _responseHeadersText;
    get responseHeadersText(): string;
    set responseHeadersText(value: string);
    private _responseCookies?;
    get responseCookies(): NetworkCookie[] | undefined;
    private _queryString?;
    get queryString(): string | undefined;
    private _initialPriority?;
    get initialPriority(): Protocol.Network.ResourcePriority | undefined;
    set initialPriority(priority: Protocol.Network.ResourcePriority | undefined);
    private _eventSourceMessages;
    get eventSourceMessages(): EventSourceMessage[];
    private _frames;
    get frames(): WebSocket[];
    private _statusCode;
    get statusCode(): number;
    set statusCode(value: number);
    get requestId(): Protocol.Network.RequestId;
    get requestHttpVersion(): string;
    get queryParameters(): QueryString[] | undefined;
    get requestContentType(): string | undefined;
    get priority(): Protocol.Network.ResourcePriority | undefined;
    set priority(priority: Protocol.Network.ResourcePriority | undefined);
    constructor(_requestId: Protocol.Network.RequestId, url: string, documentURL: string, loaderId: Protocol.Network.LoaderId, initiator?: Protocol.Network.Initiator | undefined, frameId?: Protocol.Page.FrameId);
    waitForCompletion(): Promise<void>;
    isBlob(): boolean;
    setRemoteAddress(ip: string, port: number): void;
    setIssueTime(monotonicTime: Protocol.Network.MonotonicTime, wallTime: Protocol.Network.TimeSinceEpoch): void;
    increaseTransferSize(value: number): void;
    requestFormData(): Promise<string | undefined>;
    setRequestFormData(data: string | Promise<string | undefined>): void;
    getWallTime(monotonicTime: Protocol.Network.MonotonicTime): number;
    formParameters(): Promise<Param[]>;
    responseHttpVersion(): string;
    setContentData(data: Promise<Protocol.Network.GetResponseBodyResponse>): void;
    contentData(): Promise<ContentData> | undefined;
    addProtocolFrameError(errorMessage: string, time: Protocol.Network.MonotonicTime): void;
    addProtocolFrame(response: Protocol.Network.WebSocketFrame, time: Protocol.Network.MonotonicTime, sent: boolean): void;
    addEventSourceMessage(time: number, eventName: string, eventId: string, data: string): void;
    markAsRedirect(redirectCount: number): void;
    addExtraRequestInfo(extraRequestInfo: RequestExtraInfo): void;
    addExtraResponseInfo(extraResponseInfo: ResponseExtraInfo): void;
    responseHeaderValue(headerName: string): string | undefined;
    private parseFormParameters;
    private parseMultipartFormDataParameters;
    private addFrame;
    private requestHeaderValue;
    private getFilteredProtocolName;
    private parseParameters;
    private computeHeaderValue;
}
