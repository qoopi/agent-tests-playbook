---
name: verify
description: Prove a new or changed Playwright test is trustworthy: it fails when its assertion breaks, the gates are green, the evidence table is filled. Used by test-writer and test-debugger after every code change.
user-invocable: false
---

# verify

The proof that closes a writing or debugging brief. Rules and formats: `${CLAUDE_PLUGIN_ROOT}/rules/verification.md`. Output: the evidence table inside `report.md` or `debug.md`.

## Steps

1. **Pin the diff.** `git status --porcelain` and `git diff --stat`, untracked files included. Every changed or new file is in the brief's May change list and in your Changes line; a file outside the list is reported under Open before any gate runs. Done when the file list and the Changes line match.

2. **Prove each test can fail.** For every new or changed test, alone: run it green; break the positive retrying assertion that proves its Then with a wrong value, never a Must not; run it, watch it fail on that line; restore it; run it three times. Record the prove-it-can-fail line in the format of the verification rules. Done when every test has its line.

3. **Gates, in order, after the last change.** `bun run check`, which is typecheck, lint and format, then `bun run test:all`, which admits every level tag. Lint is green with zero errors, and every warning is a raw locator with its reason comment on the line above. Stop at the first red: fix its cause with one change per run, or name it with its cause class from `${CLAUDE_PLUGIN_ROOT}/rules/debugging.md`. A test that passed only on a rerun counts as failed. Done when all three are green after the last change, or a red is named with its cause.

4. **Grep the added lines.** `git diff -U0` plus the untracked files, added lines only, for `waitForTimeout|setTimeout|test\.setTimeout|retries|describe\.configure|locator\(|xpath=|css=|networkidle|\.skip|fixme|test\.fail|eslint-disable|console\.log` and for every variable name in `.env.example`. Every hit is a line under Open, or `reason present` for a raw locator with its comment. Done when every hit is accounted for.

5. **Evidence table.** The gate rows, check as one row and tests as one, one prove-it-can-fail line per test, then one closing line: `READY`, or `NOT READY` with a numbered list of what blocks. Re-read the brief's done lines and tick each against a line of evidence. Done when the table is in the handoff and every done line is ticked or listed under NOT READY.
