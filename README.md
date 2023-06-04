# cypress-vtex-utils

## Install

To install the plugin as development dependency, run the following command:

```bash
$ npm i cypress-vtex-utils
```
## Setting Up the Plugin

To use the plugin, you'll need to update the `cypress/plugins/index.js` file as follows:

```js
const { defineConfig } = require('cypress');
const { install } = require('cypress-vtex-utils');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      install(on);
    }
  }
});
```

> ✴ `setupNodeEvents` can be defined in either the e2e or component configuration

> ⚠ Please note that the `setupNodeEvents` does not support multiple `on` event listeners without overwriting previously defined listeners. To work around this issue, you can either call the `install` function at the end of the `setupNodeEvents` function, or use the deprecated `ensureBrowserFlags` as follows:
>
> ```js
> const { defineConfig } = require('cypress');
> const {
>   install,
>   ensureBrowserFlags
> } = require('cypress-vtex-utils');
>
> module.exports = defineConfig({
>   e2e: {
>     setupNodeEvents(on) {
>       install(on);
>       on('before:browser:launch', (browser = {}, launchOptions) => {
>         ensureBrowserFlags(browser, launchOptions);
>         return launchOptions;
>       });
>     }
>   }
> });
> ```
>
> For more information, see [this GitHub issue](https://github.com/cypress-io/cypress/issues/5240).

Next, add the following line to your `cypress/support/index.js` file to register commands that perform the manipulation with a HAR file:

```js
require('cypress-vtex-utils');
```

> ✴ Starting from Cypress version 10.0.0, `supportFile` is set to look for the following file: `cypress/support/e2e.js` by default.

## Generating a HAR File

To generate a HAR file, you'll need to include the following code in your test file(s):

```js
describe('my tests', () => {
  before(() => {
    // start recording
    cy.recordHarConsole();
  });

  after(() => {
    // save the HAR file
    cy.saveHar();
    // save the Console file
    cy.saveConsole();
  });
});
```

By default, the plugin will save the generated HAR file to the root of your project with a file name that includes the current spec's name (e.g. `{specName}.har`).

You can also specify a different destination folder for the generated HAR file by setting the `CYPRESS_HARS_FOLDERS` environment variable or the `hars_folders` field in the `env` object in your Cypress config file:

```json
{
  "env": {
    "hars_folders": "cypress/hars"
  }
}
```

Alternatively, you can pass the `hars_folders` variable in the CLI using the `--env` option:

```bash
$ cypress run --browser chrome --env hars_folders=cypress/hars
```

Finally, to start running your tests, use the following command:

```bash
$ cypress run --browser chrome
```

> 🚧 Currently, only Chrome family browsers are supported. But this plugin also works with Electron, you just need to set the remote-debugging-port option when you launch Cypress as follows:
>
> ```bash
> $ ELECTRON_EXTRA_LAUNCH_ARGS=--remote-debugging-port=9222 cypress run --browser electron
> ```
>
> Please refer to the [Electron documentation](https://www.electronjs.org/docs/latest/api/command-line-switches#--remote-debugging-portport) and the [Cypress documentation](https://docs.cypress.io/api/plugins/browser-launch-api#Modify-Electron-app-switches) for more information on how to properly configure this switch.

## Commands

The plugin provides two main commands for work with HTTP Archive (HAR) files in your Cypress tests: `recordHarConsole`, `saveHar` and `saveConsole`.

### recordHarConsole

Starts recording network logs. All network requests made during the browser session will be recorded.

Here's an example of how to use the `recordHarConsole` command:

```js
cy.recordHarConsole();
```

> ⚠ The maximum size of a single resource that can be preserved is 10MB. If you need to receive a larger response body, you should adjust the `maxResourceBufferSize` and `maxTotalBufferSize` accordingly:
>
> ```js
> cy.recordHarConsole({
>   maxTotalBufferSize: 1024 ** 3,
>   maxResourceBufferSize: 100 * 1024 ** 2
> });
> ```
>
> However, note that the resource buffer size cannot be greater than 256MB due to [the limit](https://source.chromium.org/chromium/chromium/src/+/main:content/browser/devtools/devtools_http_handler.cc;l=90?aq=kSendBufferSizeForDevTools&ss=chromium) for WebSocket connections in Chrome.

You can set the `content` boolean flag to `false` to skip loading `content` field in the HAR.

```js
cy.recordHarConsole({ content: false });
```

To include only requests on specific hosts, you can pass an array of patterns specifying a list of hosts using the `includeHosts` for which to record requests:

```js
cy.recordHarConsole({ includeHosts: [/.*\.execute-api\.eu-west-1\.amazonaws\.com/] });
```

To exclude some requests, you can pass an array of patterns specifying a list of paths using the `excludePaths` to be excluded from the logs:

```js
cy.recordHarConsole({ excludePaths: [/^\/login/, /logout$/] });
```

You can also pass an array of MIME types for which to record requests:

```js
cy.recordHarConsole({ includeMimes: ['application/json'] });
```

This will record only requests with a MIME type of `application/json`.

To exclude requests based on their status code, you can use the `minStatusCodeToInclude` field.

For example, to only include requests that have a status code of 400 or greater, you can pass the `minStatusCodeToInclude` option as follows:

```js
cy.recordHarConsole({ minStatusCodeToInclude: 400 });
```

> ✴ As of version 6, this option will be removed. Use `excludeStatusCodes` instead.

Alternatively, you can have more granular control over the requests to exclude by passing an array of status codes you want to exclude from the recorded HAR file.

```js
cy.recordHarConsole({ excludeStatusCodes: [200, 201, 204] });
```

> ⚠ Please note that both options `minStatusCodeToInclude` and `excludeStatusCodes` are mutually exclusive.

By default, when you use `recordHarConsole` command, it will include the blob requests in the recorded HAR file. However, those requests only make sense when they are used on the same page they were created. To exclude the blob requests from the recorded HAR file, set the `includeBlobs` to false as follows:

```js
cy.recordHarConsole({ includeBlobs: false });
```

> ✴ As of version 6, this flag will be disabled by default.

You can specify the `filter` option as a path to a module that exports a function (it can be sync or async) to filter out unwanted entries from the HAR. The function should take an [Entry object](http://www.softwareishard.com/blog/har-12-spec/#entries) as a parameter and return a boolean indicating whether the entry should be included in the final HAR or not.

Here's an example of how to use the `filter` option:

```js
cy.recordHarConsole({ filter: '../support/include-password.ts' });
```

And here's an example of what the `include-password.ts` filter module might look like:

```ts
import { Entry } from 'har-format';

export default async (entry: Entry) => {
  try {
    return /\"password":/.test(entry.request.postData.text ?? '');
  } catch {
    return false;
  }
};
```

In this example, the `filter` function will only exclude entries in the HAR where the request body contains a JSON object with a password field.

You can also modify the entries before saving the HAR by using the `transform` option. This option should be set to a path to a module that exports a function, similar to the filter option, to change the Entry object as desired.

```js
cy.recordHarConsole({ transform: '../support/remove-sensitive-data.ts' });
```

Here's a simple example of what the `remove-sensitive-data.ts` module might look like:

```ts
import { Entry } from 'har-format';

const PASSWORD_REGEXP = /("password":\s*")\w+("\s*)/;

export default async (entry: Entry) => {
  try {
    // Remove sensitive information from the request body
    if (entry.request.postData?.text) {
      entry.request.postData.text = entry.request.postData.text.replace(
        PASSWORD_REGEXP,
        '$1***$2'
      );
    }

    return entry;
  } catch {
    return entry;
  }
};
```

The function should take an Entry object as a parameter and return the modified.

In this example, the transform function will replace any occurrences of password with `***` in the request body of each entry.

> ✴ The plugin also supports files with `.js`, `.mjs` and `.cjs` extensions.

By default, the path is relative to the spec folder. But by providing a `rootDir` it will look for the module in the provided directory:

```js
cy.recordHarConsole({
  filter: 'cypress/support/include-password.ts',
  rootDir: Cypress.config('projectRoot')
});
```

### saveHar

Stops recording and saves all requests that have occurred since `recordHarConsole` was run to a HAR file. By default, the file is saved to the root of the project with a file name that includes the current spec's name (e.g. `{specName}.har`).

```js
cy.saveHar();
```

You can pass a file name to change the default naming behavior.

```js
cy.saveHar({ fileName: 'example.com.har' });
```

You can customize a destination folder overriding any previous settings:

```js
cy.saveHar({ outDir: './hars' });
```

You can also pass the `waitForIdle` option to wait for all pending requests to complete before saving the HAR file:

```js
cy.saveHar({ waitForIdle: true });
```

This option is false by default. When set to true, the plugin will monitor the count of pending requests and wait for it to reach zero before proceeding with saving the HAR file. This ensures that all responses have been received and the data in the file is complete and accurate.

Additionally, you can pass the `maxWaitDuration` option to specify the maximum time to wait for the pending requests to complete:

```js
cy.saveHar({ waitForIdle: true, maxWaitDuration: 20000 });
```

The `maxWaitDuration` option is set to 5000 milliseconds by default, meaning it will wait for 5 seconds until all pending requests have completed.

You can also pass the `minIdleDuration` option to specify the minimum duration in milliseconds to wait for the network idle during the `maxWaitDuration` time. The network is idle if there are no pending requests during this time.

```js
cy.saveHar({ waitForIdle: true, minIdleDuration: 1000 });
```

The `minIdleDuration` option is set to 100 milliseconds by default.

### disposeOfHar

Stops the ongoing recording of network requests and disposes of the recorded logs, which will be not saved to a HAR file.

You may use this command if you have started recording network logs with `recordHar` command, but you decide to refuse to save the recorded logs to a HAR file.
Here's an example of how you might use this command to dispose of the HAR:

```js
describe('my tests', () => {
  beforeEach(() => {
    // start recording
    cy.recordHar();
  });

  afterEach(function () {
    const { state } = this.currentTest;
    if (state === 'passed') {
      // decide not to save the recorded logs
      cy.disposeOfHar();
    }
  });
});
```

## Example Usage

To generate a HAR file during your tests, you'll need to include the `recordHarConsole` and `saveHar` commands in your test file(s). Here's an example of how you might use these commands in a test:

```js
describe('my tests', () => {
  before(() => {
    // start recording
    cy.recordHarConsole();
  });

  after(() => {
    // save the HAR file
    cy.saveHar();
    cy.saveConsole();
  });
});
```

You can also generate a HAR file only for Chrome browser sessions, if it is not interactive run, and only if the test has failed:

```js
describe('my tests', () => {
  beforeEach(() => {
    const isInteractive = Cypress.config('isInteractive');
    const isChrome = Cypress.browser.name === 'chrome';
    if (!isInteractive && isChrome) {
      cy.recordHarConsole();
    }
  });

  afterEach(function () {
    const { state } = this.currentTest;
    const isInteractive = Cypress.config('isInteractive');
    const isChrome = Cypress.browser.name === 'chrome';
    if (!isInteractive && isChrome && state !== 'passed') {
      cy.saveHar();
    }
  });
});
```

If you're using Cypress version 6.2.0 or higher, you can set up hooks in a single step, eliminating the need to define them in each spec file. To do this, you need to call `enableExperimentalLifecycle` in addition to `install` as shown below:

```js
const { defineConfig } = require('cypress');
const {
  install,
  enableExperimentalLifecycle
} = require('cypress-vtex-utils');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      install(on);
      enableExperimentalLifecycle(on, config);
    }
  }
});
```

> ⚠ Please note, to utilize this experimental mechanism for setting up lifecycle, you must either disable the interactive mode or enable the "experimentalInteractiveRunEvents" feature. For more details, see the documentation: https://docs.cypress.io/guides/references/experiments#Configuration
