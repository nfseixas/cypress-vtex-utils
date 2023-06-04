import { StringUtils } from './utils/StringUtils';
import type { RecordOptions, SaveOptions } from './Plugin';

Cypress.Commands.add(
  'recordHar',
  (options?: Partial<RecordOptions>): Cypress.Chainable =>
    cy.task('recordHar', {
      content: true,
      includeBlobs: true,
      rootDir: StringUtils.dirname(Cypress.spec.absolute),
      ...options,
      excludePaths: options?.excludePaths?.map(x =>
        StringUtils.toRegexSource(x)
      ),
      includeHosts: options?.includeHosts?.map(x =>
        StringUtils.toRegexSource(x)
      )
    })
);

Cypress.Commands.add(
  'recordHarConsole',
  (options?: Partial<RecordOptions>): Cypress.Chainable =>
    cy.task('recordHarConsole', {
      content: true,
      includeBlobs: true,
      rootDir: StringUtils.dirname(Cypress.spec.absolute),
      ...options,
      excludePaths: options?.excludePaths?.map(x =>
        StringUtils.toRegexSource(x)
      ),
      includeHosts: options?.includeHosts?.map(x =>
        StringUtils.toRegexSource(x)
      )
    })
);

Cypress.Commands.add(
  'saveHar',
  (options?: Partial<SaveOptions>): Cypress.Chainable => {
    const fallbackFileName = Cypress.spec.name;
    const outDir = (Cypress.env('hars_folders') as string) ?? './';

    return cy.task('saveHar', {
      outDir,
      ...options,
      fileName: StringUtils.normalizeName(
        options?.fileName ?? fallbackFileName,
        !options?.fileName ? { ext: '.har' } : undefined
      )
    });
  }
);

Cypress.Commands.add(
  'disposeOfHar',
  (): Cypress.Chainable => cy.task('disposeOfHar')
);

Cypress.Commands.add(
  'saveConsole',
  (options?: Partial<SaveOptions>): Cypress.Chainable => {
    const fallbackFileName = Cypress.spec.name;
    const outDir = (Cypress.env('hars_folders') as string) ?? './';

    return cy.task('saveConsole', {
      outDir,
      ...options,
      fileNameConsole: StringUtils.normalizeName(
        options?.fileName ?? fallbackFileName,
        !options?.fileName ? { ext: '.txt' } : undefined
      )
    });
  }
);