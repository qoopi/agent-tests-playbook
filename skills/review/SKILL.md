---
name: review
description: Review new tests and page objects against the plan and the rules with a fresh context; findings by severity and a verdict. Used by test-reviewer.
user-invocable: false
---

# review

A read of the diff by someone who did not write it, ending in `review.md` in the shape of `${CLAUDE_PLUGIN_ROOT}/templates/handoffs/review.md`. Rules, finding format and severities: `${CLAUDE_PLUGIN_ROOT}/rules/reviewing.md`. The reviewer reads and runs gates; the tree stays as it was found.

## Steps

1. **Pin the diff.** `git status --porcelain` and `git diff --stat`, plus every untracked file the report's Changes line names. Files listed in the brief's `tree-before.txt` were changed before this task: they are outside the review and named as such in one line. An empty diff, or another file outside the plan's Create and Reuse lists and `src/fixtures/test.ts`, stops the review with that one line. Done when the file list heads `review.md`.

2. **The promise.** One sentence, written from `plan.md` alone: which T ids, which area, what they prove. Done when it is the first line after the file list.

3. **Gates.** `bun run check`, then `bun run test:all`: one Gates line with the counts. A flaky count above zero is MAJOR; a skipped count above zero is a finding. What a tool reported appears there once and never again as a finding. Done when the line is written.

4. **Plan axis.** For every T write its Then and each Must not from the plan, open its spec and tick each against the Assert block. An unticked line is a gap quoting the plan line next to the assertion that fails to prove it. Then the other way: every test in the diff carries a plan id. Two checks per test: the expected value comes from `src/data`, the plan or an element read before the action, never from the element under assertion or the app's own computation, which is a false green and a BLOCKER; a whole-page screenshot or aria snapshot standing in for the Then is a gap naming the targeted assertion that replaces it. Done when every T is ticked or has a gap line.

5. **Rules axis.** Done when every added line was read and every hit below is accounted for.
   - Grep the added lines for hiding places: `\bif\b|try|catch|isVisible\(|count\(|toBeTruthy|toBeDefined|\.first\(|\.skip|fixme|test\.fail|eslint-disable|waitForTimeout|configure\(|page\.route\(|serial`. Every hit gets a line: a finding citing the rule by file and number, or `checked, fine because <reason>`.
   - Trace every locator in the diff to the locator map; no source is a BLOCKER.
   - Flake bait is MAJOR: module-level state, serial mode, wall-clock time, real network the plan did not name.
   - A line the project endorses, in `CLAUDE.md`, the plan, an answered question, or an Assumed line with its reason, becomes `Q: <file:L> chosen because <reason>; intended?` under Questions, counted apart from the verdict. A finding with no rule to cite is a judgement call and at most NIT.

6. **Can each test fail.** For every test name the change to the app that breaks its Then. A test that would still pass is a false green and a BLOCKER. Done when every T has its line.

7. **Report.** The finding format from the rules, under 40 lines: Gates, plan axis, rules axis, can-each-test-fail lines, Declined to judge with one line per behaviour set aside and why, Checked when nothing was found, and the verdict with four counts naming the worst issue per axis. SHIP only with zero BLOCKER and zero MAJOR open. On a second read, a BLOCKER or MAJOR marked fixed is re-read at the new line with the rerun output the writer named; "should be fixed" reopens it. Done when `review.md` passes the review check of the door that briefed you.
