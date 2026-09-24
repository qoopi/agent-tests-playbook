# Reviewing rules
<!-- version: 2026-09-23 -->

## Purpose
How test code is reviewed by someone who did not write it, and how findings are received. Loaded by test-reviewer through the `review` skill; rule 10 by test-writer.

## Rules
1. The reviewer starts with a fresh context: the plan, the locator map, the rules and the code. Never the writer's conversation. A reviewer who knows what the writer meant reads what they meant, not what they wrote.
2. Run the gates first: typecheck, lint, test run. Report each as one line, the test run with passed, failed, skipped and flaky counts; any flaky count is MAJOR, any skipped count is a finding. Do not repeat what a tool already reported.
3. Read the plan before the code. For every planned test find its spec, then check that the Assert block proves the criterion's Then and every Must not. Then go the other way: every test in the code has a plan id.
4. Review on two axes and report them apart. Plan axis: does the code prove what the plan promised, nothing missing, nothing extra. Rules axis: does the code follow the rules files. A gap on the plan axis is FIX FIRST on its own. A negative case the plan never asked for is a plan defect reported to the human, not a finding against the writer.
5. For every test, name the change to the app that would break its criterion's Then. A test that would still pass after that change is a false green and a BLOCKER, even when it passes today.
6. Look inside every hiding place: try/catch, if, a promise `.catch()`, an `isVisible()` or `count()` result fed into a condition, `toBeTruthy` or `toBeDefined` on a locator, `.first()` on an element the plan treats as unique, skip, fixme, `test.fail`, any lint-disable, a raw locator without its reason comment, a regex made broad enough to always match, a plain assertion where a retrying one exists, a timeout or retry in code or in `describe.configure`. Each one is a finding.
7. Trace every locator to the locator map. A locator with no source is a BLOCKER.
8. One line per finding: `file:L<n> SEVERITY what is wrong. What replaces it.` Severity by consequence, as defined below.
9. End with a verdict, SHIP or FIX FIRST, and the counts per severity. Under 40 lines. When nothing is found, list what was checked so the silence can be trusted.
10. Receiving findings: verify each one against the code before acting. Fix it, or decline it in one line with the reason. Never agree to be polite, never fix by weakening a test, and ask about every unclear finding before fixing any.
11. After the writer answers, findings marked fixed at BLOCKER or MAJOR get a second read by the reviewer. A BLOCKER still open after two rounds goes to the human.

## Finding format
```
Gates: typecheck <clean|n errors>, lint <clean|n errors>, tests <n passed, n failed, n skipped, n flaky>

Plan axis
<one line per gap between plan and code, or "matches">

Rules axis
<file>:L<n> <BLOCKER|MAJOR|MINOR|NIT> <what is wrong>. <what replaces it>.

Verdict: <SHIP|FIX FIRST>. <n> blocker, <n> major, <n> minor, <n> nit.
```

## Severity
```
BLOCKER  a false green, an invented locator, a write against production, a change outside scope
MAJOR    a flakiness source, a rule broken in a way that changes behaviour
MINOR    a rule broken in a way that does not change behaviour
NIT      taste
```

## Example: a review of the search tests
```
Gates: typecheck clean, lint clean, tests 4 passed, 0 failed, 0 skipped, 0 flaky

Plan axis
T1 does not prove AC-1: its Assert checks that the heading is visible, not that it contains the word, so a wrong results page passes. T2 and T3 match their criteria.

Rules axis
tests/search/search.spec.ts:L31 BLOCKER try/catch around T3's no-results assertion: the test cannot fail. Remove it.
src/pages/search-results.page.ts:L9 BLOCKER locator not in the map: getByTestId('result-card'). Use results.itemCards from the map, or snapshot the page and add the entry.
src/pages/home.page.ts:L14 MINOR search() asserts the results heading; assertions belong in tests. Move it to the spec.

Verdict: FIX FIRST. 2 blocker, 0 major, 1 minor, 0 nit.
```
Receiving it, the writer answers each finding in one line: fixed, with the new line number, or declined, with the reason.

## Checklist
- Did I read the plan first and check every test against its criterion, in both directions?
- For every test, can I name the change to the app that makes it fail?
- Is every locator in the locator map, every changed file inside the plan's Create and Reuse lists, and no test aimed at production?
- Did I look inside every try/catch, if, `.catch()`, condition on a page read, skip, fixme, lint-disable and `.first()`?
- Is every finding one line with file, line, severity, what and fix, and is there a verdict with counts?
