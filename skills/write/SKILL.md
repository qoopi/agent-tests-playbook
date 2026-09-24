---
name: write
description: Implement a test plan as Playwright page objects and specs, one test at a time, walking each step live through the test MCP server before writing it. Used by test-writer.
user-invocable: false
---

# write

From `plan.md` and the locator map to code on the working tree and `report.md` in the shape of `${CLAUDE_PLUGIN_ROOT}/templates/handoffs/report.md`. Rules: `${CLAUDE_PLUGIN_ROOT}/rules/coding.md`, `${CLAUDE_PLUGIN_ROOT}/rules/automation.md`, `${CLAUDE_PLUGIN_ROOT}/rules/testing.md`. The unit of work is one test, end to end; the next test starts when the previous one is proven.

## Tools
- `generator_setup_page` once per test, with `plan` set to that test's steps from `plan.md`, `seedFile: tests/seed.spec.ts` and the project name. It starts the browser where the seed ends and empties the journal.
- `browser_*` actions with the plan step's own words as `intent`; actions, inputs and verifications are journaled, snapshots are not, so snapshot freely between steps. A call that errored leaves no entry: snapshot, fix, redo the step.
- `browser_handle_dialog` answers a browser alert the app raises; the written test handles it with `page.once('dialog', ...)` from a page-object action.
- `browser_verify_text_visible`, `browser_verify_element_visible`, `browser_verify_value`, `browser_verify_list_visible` for every Then, so the expected value was seen on the real page before it becomes an assertion.
- `generator_read_log` once after the last step: the journal holds one code block per step with the locator Playwright chose. `browser_generate_locator` for an element the snapshot shows without role or name.
- `browser_evaluate` reads attributes during the walk only; the written test reads the page through locators and retrying assertions, automation rule 4.
- Runs go through `bun run test:all <spec>`, which admits every level tag, with `-g "<exact title>"` for one test, `--repeat-each 3` for the three runs, and `--workers 4` once per new spec to expose races between its own cases. `test_run` produces no report or trace, so it gives the evidence table nothing to cite.

## Steps

1. **Read.** `plan.md`, the locator map, the existing spec the plan names as prior art, every file under Reuse, `src/fixtures/test.ts` and `src/data/`. Done when you can name, for the first T, which page objects exist, which fields they lack, and which data file holds its values.

2. **Walk one test live.** `generator_setup_page` for T<n>, then each plan step as one tool call, each Then as one verify call. Done when the log holds every step and every Then with its code.

3. **Page objects.** Each logged locator becomes a `readonly` field on the page it belongs to, checked against the map's uniqueness first; a component gets one root field and derives every child from it; a list is narrowed with `.filter({ has })` or `.filter({ hasText })` rather than an index. Each logged action run becomes one intent method; `expectLoaded()` asserts the readiness signal from the map. New page objects get a fixture in `src/fixtures/test.ts`. Done when the spec can be written with fixture calls only, no inline locator.

4. **Data.** Values the test types and expects live in `src/data`: one typed record, invalid cases derived by spreading it with one field changed, a unique case name per row. Done when the spec has no literal that the plan's Data line names.

5. **Spec.** The test skeleton from the testing rules: the criterion line, the tag from the plan, Arrange to the Given, one Act, retrying assertions for the Then and each Must not, `expect.soft` per independent part. Before a count or text on a list that loads, assert its container visible, so a failure names the missing list rather than a wrong number. Done when the test reads complete on its own.

6. **Prove this test.** Run `verify` step 2 for this one test: green alone, red on its Then, restored, three green runs. A break that still passes means the expected value came from the asserted element: move the read before the Act and prove again. A locator timeout on the break means it hit Arrange: redo the break on the Then. Done when the prove-it-can-fail line exists. Then back to step 2 for the next T.

7. **Close.** When every T is done or blocked with its reason, invoke `verify` in full for the whole diff and write `report.md`: the answer, plan status per T, the evidence table, findings answered when this is a later round. Done when `report.md` passes the report check of the door that briefed you.
