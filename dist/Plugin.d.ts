/// <reference types="cypress" />
import { Logger } from './utils/Logger';
import { FileManager } from './utils/FileManager';
import type { HarExporterFactory, HarExporterOptions, NetworkObserverOptions, ObserverFactory } from './network';
import type { ConnectionFactory, NetworkOptions } from './cdp';
export interface SaveOptions {
    fileName?: string;
    fileNameConsole?: string;
    outDir: string;
    waitForIdle?: boolean;
    minIdleDuration?: number;
    maxWaitDuration?: number;
}
export declare type RecordOptions = NetworkObserverOptions & HarExporterOptions & NetworkOptions;
export declare class Plugin {
    private readonly logger;
    private readonly fileManager;
    private readonly connectionFactory;
    private readonly observerFactory;
    private readonly exporterFactory;
    private exporter?;
    private networkObservable?;
    private addr?;
    private _connection?;
    constructor(logger: Logger, fileManager: FileManager, connectionFactory: ConnectionFactory, observerFactory: ObserverFactory, exporterFactory: HarExporterFactory);
    ensureBrowserFlags(browser: Cypress.Browser, args: string[]): string[];
    recordHar(options: RecordOptions): Promise<void>;
    recordHarConsole(options: RecordOptions): Promise<void>;
    saveHar(options: SaveOptions): Promise<void>;
    disposeOfHar(): Promise<void>;
    removeConsole(options: SaveOptions): Promise<void>;
    saveConsole(options: SaveOptions): Promise<void>;
    private parseElectronSwitches;
    private buildHar;
    private waitForNetworkIdle;
    private listenNetworkEvents;
    private closeConnection;
    private isSupportedBrowser;
    private ensureRdpAddrArgs;
    private extractAddrFromArgs;
    private findAndParseIfPossible;
    private logEntry;
    private logConsole;
}
