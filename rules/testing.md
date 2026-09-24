# Testing rules
<!-- version: 2026-09-24 -->

## Purpose
How one test is designed so that it proves one criterion, fails for the right reason, and runs alone. Playwright mechanics are in automation rules; TypeScript style is in coding rules. Loaded by test-writer, test-reviewer and test-debugger.

## Rules
1. One test proves one criterion. Above the test, one comment line: a sentence in words saying what the test proves, then the trace `Plan T<n>, criterion AC-<n>`. Paths and techniques stay in the plan. The title is the criterion's title: a sentence about what the user sees, never about what the code does.
2. Every test body has exactly three labelled blocks as comments, not `test.step` calls: `// Arrange`, `// Act`, `// Assert`, mirroring Given, When, Then, and nothing else in the label. Two criteria on one path are two tests that share their Arrange, never a second Act in one test. Arrange ends when the page is in the Given state; an action in Arrange that opens another page is followed by that page's `expectLoaded()`. Act is the one action.
3. Assert with Playwright's retrying assertions, the Then and every Must not. A plain assertion is the exception, only when no retrying matcher or `expect.poll` can express the check; then wait for the state first, with the action's own wait or the locator's `waitFor()`, and assert after.
4. When a Then has several independent parts, use `expect.soft` for each, so one run reports all of them.
5. Name the break before writing. Say which change to the app would make this test fail. If you cannot name one, the test checks nothing: redesign it around something the user sees.
6. Expected values come from the plan's data, or are read from another element before the action. Never from the element you are about to assert on, because then the test agrees with whatever the page shows.
7. Assert what the user sees: text, visibility, count, URL, enabled state. Not CSS classes, not network calls, not internal state, unless the criterion is about them.
8. Every test is independent: it reaches its Given by itself from a fresh page, uses its own data, and passes alone and in parallel with every other test. A test that creates data removes it in its fixture's teardown.
9. Ordering is allowed in one case only: when the app itself makes a step depend on an earlier test's result, such as a record that cannot be created twice. Then that describe block runs serial, with a comment saying why. Nothing else may run in order.
10. Parametrize wherever two tests would differ only in data: one test in a loop over a typed array from `src/data`, each case with its own title built from a unique case name, and the same criterion id. A different path is a different test, never a case.
11. Data that changes per visit is asserted by shape: at least one, matches a pattern, equals what was read a step earlier. Never an exact number or text that the site changes on its own. Page copy is asserted with `toContainText` or a pattern; exact full text only when the criterion fixes the wording.
12. Every test carries one level tag from the plan, `@smoke` for the PR gate or `@regression` for the full run, plus the grouping tags the plan names, if the project uses any.
13. No logic in a test: no if, no try/catch, no early return, no loop except the parametrization loop. A test that needs a branch is two tests.

## Test skeleton
```ts
// <what the test proves, one sentence>. Plan T<n>, criterion AC-<n>.
test('<criterion title>', { tag: '@smoke' }, async ({ <page fixtures> }) => {
  // Arrange
  // Act
  // Assert
});
```

## Example: from plan to test
T1 and T2 from the planning example. Page objects and fixtures come from the automation rules.
```ts
// src/data/search-cases.ts
type SearchCase = { name: string; word: string };

export const searchWord = 'watch';
export const searchCases = [
  { name: 'a category word', word: searchWord },
] as const satisfies readonly SearchCase[];
```
```ts
// tests/search/search.spec.ts
import { test, expect } from '../../src/fixtures/test';
import { searchCases, searchWord } from '../../src/data/search-cases';

// A matching word shows item cards, one case per kind of word. Plan T1, criterion AC-1.
for (const c of searchCases) {
  test(`search shows item cards for ${c.name}`, { tag: '@smoke' }, async ({ page, homePage, resultsPage }) => {
    // Arrange
    await homePage.open();
    // Act
    await homePage.search(c.word);
    // Assert
    await expect.soft(page).toHaveURL(new RegExp(resultsPage.path));
    await expect.soft(resultsPage.heading).toContainText(c.word);
    await expect.soft(resultsPage.itemCards.first()).toBeVisible();
  });
}

// The first card opens the item page that belongs to it. Plan T2, criterion AC-2.
test('opening the first card shows its item page', { tag: '@smoke' }, async ({ context, homePage, resultsPage, itemPage }) => {
  // Arrange
  await homePage.open();
  await homePage.search(searchWord);
  await resultsPage.expectLoaded();
  const expectedTitle = await resultsPage.itemCards.first().getByRole('heading').innerText();
  // Act
  await resultsPage.openFirstItem();
  // Assert
  await expect(itemPage.title).toHaveText(expectedTitle);
  await expect.poll(() => context.pages().length).toBe(1);
});
```
Why T1 asserts softly: its Then has three parts, and one run should report every part that fails.
Why T1 is a loop with one entry: the plan lists one word today. A second word is one more line in the data file, not a new test.
Why Arrange is one line: `open()` navigates, closes the cookie banner and waits for readiness, so after it the page is in the Given state.
Why T2 reads the title before the click: the item page must match the card, and the card is a different element read before the action. Reading the item page's own title and asserting it equals itself would pass on any page.

## Checklist
- Does each test prove exactly one criterion, including its Must not, with a readable comment line that ends in its plan trace?
- Can I name the change to the app that would make this test fail?
- Is the test independent: own Given, own data, passes alone and in parallel, serial only where the app forces it and a comment says so?
- Do expected values come from the plan's data or from another element read before the action?
- Is data that changes per visit asserted by shape?
- Is there any if, try/catch, early return or loop beyond the parametrization loop?
