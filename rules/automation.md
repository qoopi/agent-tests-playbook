# Automation rules
<!-- version: 2026-09-23 -->

## Purpose
How Playwright is used: locators, waiting, fixtures, configuration, and how the app is explored so locators are real. Loaded by test-analyst, test-writer, test-reviewer and test-debugger.

## Rules
1. Locator priority: `getByRole` with a name, then `getByLabel`, `getByPlaceholder`, `getByText` with `exact`, `getByTestId`, and last CSS or XPath, only where nothing above can reach the element. The linter warns on every raw locator, so each one shows in the lint output; the line above it carries a comment with the reason. A role name is a substring match; add `exact: true` when the map shows another name that contains it.
2. Every locator comes from the locator map or from a snapshot taken in this session. No invented test ids, no guessed names. The map records each locator's source and whether it is unique.
3. A locator used for an action or a single-element assertion must resolve to one element; scope it with a parent locator or `.filter({ hasText })`. A list locator matches many by design. `.first()` is allowed inside a visibility assertion as the "at least one" check, and for an action only when "the first one" is the behaviour under test.
4. Let Playwright wait. Actions auto-wait; assertions retry. Never `waitForTimeout`, never `waitForLoadState('networkidle')`, never `waitForSelector`, never a polling loop. `locator.waitFor()` only before a plain assertion that has no retrying form. When a page re-renders after navigation or a filter, assert the new state before acting on it, so the action hits the new element and a failure names the real cause.
5. Timeouts, retries, workers, parallelism and reporters live in `playwright.config.ts` only. No per-test timeout, no `test.slow()`, no retries in code. A test that seems to need more has a problem the plan must record as a risk.
6. The config sets the defaults everybody relies on: fully parallel, retries only on CI, `forbidOnly` on CI, trace on first retry, screenshot on failure, workers capped for external sites, base URL read from `.env` by the config itself.
7. Serial mode is the one allowed ordering: `test.describe.configure({ mode: 'serial' })` on a single describe block with the reason from the testing rules. Never project-wide.
8. Every page object has a fixture in `src/fixtures/test.ts`. Specs import `test` and `expect` from there, never from `@playwright/test`. Anything with setup and teardown, such as auth state, is a fixture too.
9. Every page object's `expectLoaded()` asserts one element that proves this is the right page, taken from the locator map's readiness signal.
10. Exploration is read-only: never register, bid, buy or submit a form that creates data; log in only with the test account named in the brief, and stay read-only after. Stop on a 403 or a challenge page.
11. Exploration records evidence: snapshot over screenshot; how each overlay was closed; for each element its role and name, uniqueness and page, and the frame when it sits inside an iframe; for each flow what changed after every step. For an element with no role or name, record the attributes read with `browser_evaluate` and the match count, because the snapshot shows neither ids nor classes.

## Locator decision
```
role + name -> label -> placeholder -> text (exact) -> test id -> css or xpath + a comment with the reason
matches several? -> scope with a parent locator or .filter({ hasText }); .first() only when the behaviour says "the first"
css or xpath, when used -> anchored on an attribute or normalize-space() text; never positional, never an index, never a styling class
xpath only for a relation css cannot express, such as an ancestor; it does not pierce shadow DOM
```

## Example: locators, fixtures, the serial exception
```ts
// fields from the locator map: home.searchBox, results.itemCards, results.sortSelect
readonly searchBox = this.page.getByRole('searchbox', { name: 'Search' });
readonly itemCards = this.page.getByRole('region', { name: 'Results' }).getByRole('article');
// raw locator: no label or accessible name; name attribute read with browser_evaluate
readonly sortSelect = this.page.locator('select[name="sort"]');
```
```ts
// XPath, the last tier: an ancestor relation css cannot express, and the kind never to write
// raw locator: the card has no role, and css cannot select an ancestor
readonly soldOutCard = this.page.getByText('Sold out', { exact: true }).locator('xpath=ancestor::*[@data-card][1]');
this.page.locator('xpath=//div[3]/ul/li[2]/a'); // never: a positional path breaks on any layout change
```
```ts
// src/fixtures/test.ts
import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { SearchResultsPage } from '../pages/search-results.page';
import { ItemPage } from '../pages/item.page';

type Pages = { homePage: HomePage; resultsPage: SearchResultsPage; itemPage: ItemPage };

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  resultsPage: async ({ page }, use) => { await use(new SearchResultsPage(page)); },
  itemPage: async ({ page }, use) => { await use(new ItemPage(page)); },
});
export { expect };
```
```ts
// tests/bidding/place-bid.spec.ts
test.describe('placing a bid', () => {
  // serial: on staging the app allows one bid per account per item, so the second test needs the first
  test.describe.configure({ mode: 'serial' });
  // tests
});
```
```ts
// Rule 4 in one case: the list re-renders after a filter, so assert a state only the new render has
await resultsPage.applyFilter(filterName);
await expect(resultsPage.activeFilter).toHaveText(filterName);
await resultsPage.openFirstItem();
```

## Checklist
- Does every locator come from the locator map or a snapshot, in priority order, with a reason comment on any CSS or XPath locator?
- Does every locator used for an action or a single-element assertion resolve to one element?
- Is there any `waitForTimeout`, `networkidle`, `waitForSelector`, polling loop, per-test timeout or retry in code?
- After a navigation or re-render, is a state only the new render has asserted before the next action?
- Is serial mode used on one describe block with its reason, never project-wide?
- Did exploration stay read-only and record source and uniqueness for every locator?
