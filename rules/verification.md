# Verification rules
<!-- version: 2026-09-23 -->

## Purpose
What "done" means for test code and how it is proven before anyone reviews it. Loaded by test-writer and test-debugger through the `verify` skill; the master session runs the gates itself.

## Rules
1. Nothing is done without fresh evidence: the command run after your last change, its whole output read, the exit code checked. An earlier run, or "should pass", counts as not run.
2. Prove first, then the gates, because restoring an assertion is a change: typecheck, lint, the full test run, in that order, all after the last change. Lint is green with zero errors; each warning must be a raw locator with its reason comment. Stop at the first red and fix its cause, or name it with its cause class when debugging says it stays red.
3. Prove every new or changed test can fail: break the positive, retrying assertion that proves its Then, never a Must not, run it alone, watch it fail on that assertion, restore it, run it three times, watch it pass every time. A test with several assertions is proven on its Then. Record the failing line.
4. A test that passed only on a rerun has failed. Flakiness goes to debugging, not to a retry. Every run of the same command is listed next to the first.
5. The evidence for "done" is a table: gate, command, result, and the prove-it-can-fail line per test. No table, not done.
6. An agent's success report is not evidence. Read the diff and run the gates yourself.
7. Nothing goes green by relaxing: no wait, retry, skip, disable, broader assertion. A gate made green that way is red.
8. Stop words: "should", "probably", "seems to", "looks good". When one appears in your own report, go and run the command instead.
9. Three separate hands: the writer proves each test can fail, the master session runs the gates, the reviewer reads with a fresh context. None of them signs off for another.
10. Done means: gates green, or a red test named in the table with its cause class and its bug; zero skipped and no `test.fail`; every new or changed test proven to fail once; no lint-disable, every lint warning a raw locator with its reason; plan statuses updated; every reviewer finding answered.

## Evidence table format
```
Gate        Command             Result
typecheck   bun run typecheck   clean | <n> errors
lint        bun run lint        <n> errors, <n> warnings, each warning a raw locator with reason
tests       bun run test        <n> passed, <n> failed, <n> skipped, <n> flaky, runs <n>
red         <spec>: <test title>   cause <class>   bug <ref> | none

Prove it can fail
T<n>  broke <Then assertion> -> <bad value>   failed <n>/<n> cases at <spec>:L<n>   restored: passed 3/3
```

## Example: the search tests, verified
```
Gate        Command             Result
typecheck   bun run typecheck   clean
lint        bun run lint        0 errors, 1 warning: sortSelect raw locator, reason present
tests       bun run test        4 passed, 0 failed, 0 skipped, 0 flaky, runs 1   T1, T2, T3 and the template smoke test
red         none

Prove it can fail
T1  broke toBeVisible on itemCards.first() -> toBeHidden   failed 1/1 cases at search.spec.ts:L21   restored: passed 3/3
T2  broke toHaveText(expectedTitle) -> '__nope__'          failed 1/1 cases at search.spec.ts:L36   restored: passed 3/3
T3  broke toContainText('No results') -> '__nope__'        failed 1/1 cases at search.spec.ts:L48   restored: passed 3/3
```

## Checklist
- Did I run every gate after my last change and read the whole output?
- Did every new or changed test fail once on the assertion that proves its Then, and pass three times after restore?
- Did any test pass only on a retry?
- Did I make anything green by relaxing a test?
- Is the evidence table in my report?
- Did I read the diff and run the gates myself, instead of taking a report?
- Is skipped zero, and is every red test named with its cause class?
