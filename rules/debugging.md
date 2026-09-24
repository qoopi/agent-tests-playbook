# Debugging rules
<!-- version: 2026-09-23 -->

## Purpose
How a failing or flaky test is taken to its cause and fixed there, or reported as a bug. Loaded by test-debugger through the `debug` skill.

## Rules
1. No fix before the cause. Read the whole error, then the trace: the failing action, the console, the network. A stack trace alone is not evidence.
2. Reproduce with a tight loop and trace on: run only the failing test until it fails the same way. A test that fails sometimes gets ten repeated runs alone; if all ten are green, run the suite at the configured workers before classifying, because green alone and red in the suite is an ordering or data cause.
3. Classify before touching anything, with two independent markers, into one of the four cause classes below. Fewer than two markers, or markers pointing at different classes, means no change: report the candidate classes and the one run that would decide.
4. Test cause: fix the locator in priority order and confirm with a snapshot; fix the race by asserting the state before the action; fix the expectation by shape when the plan allows it; fix a collision between our own tests with own data and teardown. Then run the whole spec again.
5. Product cause: the test stays red and its assertion stays as it is. Write the bug: steps, expected from the criterion, actual with the evidence, how often out of ten runs, base URL and browser, and the harm a user sees.
6. Environment or data cause: stop and report with the evidence. Running again until green is not a fix.
7. Never: a wait, a retry, a per-test timeout, a skip, a fixme, a try/catch, a broader regex, a weaker assertion, a lint-disable. Each hides the cause and returns later.
8. One change per run. Change one thing, run, read, then the next. Two changes at once teach nothing. After three changes that did not fix it, discard them, reclassify from the evidence and report.
9. Confirm the fix the way a new test is proven: break the assertion, see it fail there, restore it, see it pass. An intermittent failure's fix is proven by the same ten runs, alone and inside the suite, with retries off.
10. Report per test: cause class, the two markers, the change with file and line, the result. App bugs listed apart, ready to file. Every probe, pause or log added while investigating is removed before the report.

## Cause classes
```
test         wrong locator; a race in the test, when the app behaves at human speed; a wrong expectation; two of our tests colliding
product      an uncaught page error; a 5xx from the app's own backend; behaviour that contradicts the plan; a race in the app seen at human speed, such as one request fired twice or stale data after a change
environment  403 or a challenge page; network; an action that ran close to its timeout, which may also be a test race: compare its timing across the ten runs
data         state the debugger cannot own: a test account or record changed, expired or deleted by someone else
```

## Report entry format
```
<spec file>: <test title>
Cause     test | product | environment | data
Evidence  <marker 1>; <marker 2>
Change    <file>:L<n> <what> | none
Result    <n> runs green | still red, bug written
```

## Example: two failures from one run
```
tests/search/search.spec.ts: search shows item cards for a category word
Cause     test
Evidence  trace: toBeVisible timed out; the first article matched is an empty lazy-load slot with zero size in a "Recently viewed" strip, per the trace's DOM snapshot; snapshot: articles exist in that strip and in the results region
Change    src/pages/search-results.page.ts:L9 scoped itemCards to getByRole('region', { name: 'Results' })
Result    10 runs green

tests/search/search.spec.ts: search for a word with no matches says so
Cause     product
Evidence  snapshot: zero item cards and no message element on the results page; network: the search request returned 200 with an empty list, so the app had the data and rendered nothing
Change    none
Result    still red, bug written

Bugs
1. No-results page shows nothing. Steps: search "zzqxv". Expected per AC-3: a no-results message and zero cards. Actual: zero cards and no message, 10 of 10 runs, base URL from .env, Chromium. Harm: a buyer cannot tell a failed search from an empty catalogue. Evidence: trace and snapshot in .playwright/test-results/.
```

## Checklist
- Did I read the trace, console and network before proposing anything?
- Did I reproduce the failure the same way, ten times when it was intermittent?
- Do two independent markers support the cause class?
- Did I change one thing per run?
- Is there any wait, retry, skip, try/catch or weakened assertion in my change?
- Did I break the assertion after the fix and see it fail there?
- Did every product-classed test stay red with a bug entry?
