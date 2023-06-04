import type { RecordOptions, SaveOptions } from './Plugin';
declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            saveHar(options?: Partial<SaveOptions>): Chainable<Subject>;
            recordHar(options?: Partial<RecordOptions>): Chainable<Subject>;
            disposeOfHar(): Chainable<Subject>;
            recordHarConsole(options?: Partial<RecordOptions>): Chainable<Subject>;
            removeConsole(): Chainable<Subject>;
            saveConsole(options?: Partial<SaveOptions>): Chainable<Subject>;
        }
    }
}
export declare const install: (on: Cypress.PluginEvents) => void;
export declare const enableExperimentalLifecycle: (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => void;
/**
 * Function has been deprecated. Use {@link install} instead as follows:
 * ```diff
 * setupNodeEvents(on) {
 *   install(on);
 * -  // bind to the event we care about
 * -  on('before:browser:launch', (browser = {}, launchOptions) => {
 * -    ensureBrowserFlags(browser, launchOptions);
 * -    return launchOptions;
 * -  });
 * }
 * ```
 * In case of any issues please refer to {@link https://github.com/cypress-io/cypress/issues/5240}
 */
export declare const ensureBrowserFlags: (browser: Cypress.Browser, launchOptions: Cypress.BrowserLaunchOptions) => void;
export type { SaveOptions, RecordOptions } from './Plugin';
