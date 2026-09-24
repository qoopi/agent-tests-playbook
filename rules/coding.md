# Coding rules
<!-- version: 2026-09-23 -->

## Purpose
How TypeScript is written in a test project: page objects, components, helpers, data. Test design is in testing rules; Playwright mechanics are in automation rules. Loaded by test-writer and test-reviewer through the `write` and `review` skills.

## Rules
1. Climb the ladder before writing anything. Is it needed at all? Does the repo already have it? Does Playwright already do it, such as waiting, retrying, matching? Does the standard library do it? Can it be one line? Only then write the minimum that works.
2. Page and component objects are classes, one per file. Helpers are pure functions: no module-level state, no caches, no browser state; anything with a lifecycle is a fixture. File names are kebab-case with a suffix: `search-results.page.ts`, `cookie-banner.component.ts`. Class names are PascalCase with the same suffix: `SearchResultsPage`, `CookieBannerComponent`.
3. A page object exposes elements as `readonly` locator fields, actions as `async` methods, and one readiness check, `expectLoaded()`. Nothing else is public. Tests call actions and assert on fields. Components follow the same shape and extend `BaseComponent`.
4. The readiness check is the only assertion allowed inside a page or component object. Actions return `Promise<void>`; the next page comes from its own fixture.
5. Keep modules deep: one user intent per method, hiding its mechanics. `open()` navigates, closes banners and waits for the readiness signal; a test never repeats those steps. Never two intents in one method.
6. The tsconfig is strict. Explicit types on every public method and exported function. Locals are inferred. No `any`; `unknown` plus narrowing for outside input. String literal unions instead of enums. Data arrays end with `as const satisfies readonly <Type>[]`.
7. No `as` casts and no non-null `!`; `as const` is not a cast. A cast hides a wrong type or wrong data; use a narrowing check, `?? ''`, or a method that returns the right type instead.
8. No abstraction nobody asked for: no base class beyond `BasePage` and `BaseComponent`, no generic utils file, no wrapper around Playwright, no new dependency without asking. Deletion over addition, boring over clever.
9. Await everything that returns a Promise: actions, reads, `expect`. Locator builders such as `getByRole` and `.filter` are synchronous and never awaited. Independent reads go in `Promise.all`. No `.then` chains.
10. No magic strings in tests. Words a test types and values it expects come from `src/data`; element text and URL paths live in the page object next to what they describe.
11. Comments are rare and short. Write one only where the code is hard to read on its own, and say in one line what the class, method or function does. No history, no decision logs, no explanations.
12. Three comments are required: the criterion line above each test, the reason above a serial describe block, and the reason line above a CSS or XPath locator. No lint-disable anywhere in the project.

## Example: the bases, a component, a page object and a helper
```ts
// src/components/base.component.ts
import { type Page } from '@playwright/test';

export abstract class BaseComponent {
  constructor(protected readonly page: Page) {}
}
```
```ts
// src/components/cookie-banner.component.ts
import { BaseComponent } from './base.component';

export class CookieBannerComponent extends BaseComponent {
  readonly acceptButton = this.page.getByRole('button', { name: 'Accept all' });

  async closeIfShown(): Promise<void> {
    if (await this.acceptButton.isVisible()) await this.acceptButton.click();
  }
}
```
```ts
// src/pages/base.page.ts
import { type Page } from '@playwright/test';
import { CookieBannerComponent } from '../components/cookie-banner.component';

export abstract class BasePage {
  abstract readonly path: string;
  private readonly cookieBanner: CookieBannerComponent;

  constructor(protected readonly page: Page) {
    this.cookieBanner = new CookieBannerComponent(page);
  }

  async open(): Promise<void> {
    await this.page.goto(this.path);
    await this.cookieBanner.closeIfShown();
    await this.expectLoaded();
  }

  abstract expectLoaded(): Promise<void>;
}
```
```ts
// src/pages/search-results.page.ts
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SearchResultsPage extends BasePage {
  readonly path = '/search';
  readonly heading = this.page.getByRole('heading', { level: 1 });
  readonly itemCards = this.page.getByRole('region', { name: 'Results' }).getByRole('article');
  readonly noResultsMessage = this.page.getByText('No results found', { exact: true });

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async openFirstItem(): Promise<void> {
    await this.itemCards.first().click();
  }
}
```
```ts
// src/helpers/price.ts
export function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}
```
```ts
// The ladder, rule 1, in one case
// Before: a helper that Playwright already provides
async function waitForVisible(locator: Locator): Promise<void> { /* polling loop */ }
// After: Playwright's own retrying assertion
await expect(locator).toBeVisible();
```

## Checklist
- Did I climb the ladder: does the repo, Playwright or the standard library already do this?
- Is every page or component a class in its own file, with locator fields, action methods and one readiness check, and nothing else public?
- Is `expectLoaded()` the only `expect` under `src/pages` and `src/components`?
- Do public methods and exported functions have explicit types, with no `any`, no `as` and no `!`?
- Did I add an abstraction, base class, dependency, helper or module-level state nobody asked for?
- Is everything that returns a Promise awaited?
