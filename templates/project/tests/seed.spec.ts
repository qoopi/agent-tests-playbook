import { test } from '../src/fixtures/test';

// Seed for the playwright-test MCP server: planner_setup_page runs it and pauses at the end, with
// the same fixtures, hermetic mode and auth state as every test. Tagged @smoke so every profile
// admits it and CI proves the planner's starting point on every run.
test('the home page loads for the session account', { tag: '@smoke' }, async ({ page, homePage }) => {
  await page.goto(homePage.path);
  await homePage.expectLoaded();
});
