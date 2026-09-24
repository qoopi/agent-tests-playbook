# Delivery rules
<!-- version: 2026-09-23 -->

## Purpose
What must hold whenever work reaches the repository or CI, in any project. The project's own conventions, branch names, commit format, PR body, which tags run where, live in the project's `CLAUDE.md` under Ship and Git flow. Read by the master session when the human asks to commit, push or ship.

## Rules
1. Git writes happen when the human asks for them: after their review, or on the development branch they named. The gates ended green on the tree being pushed; if tracked files changed after that run, they run again first.
2. Commits add named files, never everything. Before committing, the staged diff is checked: no `.env`, no auth state file, no secret value; the variable names in `.env.example` are the search terms.
3. `main` is protected. Never force push, never rewrite shared history. Reset, stash, clean, discard and branch deletion happen only when the human asks. Merging into `main` is a human click, never an agent action.
4. A pull request carries its evidence: what it covers by plan id, the verification table, the open risks. A PR without evidence is not ready for review.
5. CI is a gate with published evidence: the PR check must pass before merge, the report and the traces of failures are uploaded, and a failure with no artifact is a CI bug to fix first.
6. A red CI is debugged from its artifact with the debugging rules, never by re-running until green. Two fix rounds, then stop and report.
7. A test is quarantined only after debugging classified its cause and two fix rounds are spent, with an owner, a reason and an expiry, listed under risks in the plan and still running outside the gate. Never a silent skip.
8. Secrets reach CI from the repository's secret store, referenced by name. Never in a workflow file, never in a log, never in an artifact: the setup project records no trace, and the auth state stays outside uploaded paths.

## Checklist
- Did the human ask for this git write, and did the gates end green on this exact tree?
- Is anything staged that is a secret, an `.env` file, an auth state file or an ignored path?
- Does the PR carry plan ids, the evidence table and risks?
- Is there any force push, merge into `main` or history rewrite by an agent?
- Does CI publish the report and traces on failure?
- Did the required check end green, or was the red debugged from its artifact within two rounds and reported?
