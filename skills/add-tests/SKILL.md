---
name: add-tests
description: Add verified Playwright tests for a task. Explore, plan, write, review; the human decides twice.
disable-model-invocation: true
argument-hint: "<task text, a file path, or nothing>"
---

# add-tests

The master session runs this door. Agents explore, plan, write and review; the master briefs them, checks their handoffs, runs the gates and stops for the human at two gates: after the plan and at the end. Message formats and the handoff checks are in [`reference.md`](reference.md). Everything about the task lives in `.claude/work/<slug>/`; drop the folder, the task is gone.

Load `${CLAUDE_PLUGIN_ROOT}/rules/general.md` first: every message to the human follows its answer structure.

## Steps

1. **Intake.** The task is `$ARGUMENTS`: text as given, or a path whose file is the task. With nothing given, ask one question in the intake format of `reference.md` and wait. Choose a slug of two to four words in kebab-case, create `.claude/work/<slug>/` and write `task.md`: the task verbatim, with the source path on the first line when it came from a file. Write `tree-before.txt` from `git status --porcelain`: what was already changed or untracked before this task. Done when `task.md` reads exactly as the human gave it and `tree-before.txt` exists.

2. **Bootstrap.** Invoke `agent-tests-playbook:bootstrap`. Done when its readiness table has no red row. A red row is reported in the answer structure and the door stops there.

3. **Explore and plan.** Fill `${CLAUDE_PLUGIN_ROOT}/templates/handoffs/brief.md` into `brief-analyst.md`: read `task.md`, the project `CLAUDE.md`, `src/pages/`, `src/data/`, `tests/`; mode `task`; deliverables `exploration.md` and `plan.md`; done lines and budget from `reference.md`; environment from the project facts. Run the Agent tool with `subagent_type: agent-tests-playbook:test-analyst` and the prompt `Read and execute .claude/work/<slug>/brief-analyst.md`. Check both handoffs with the exploration and plan checks. A failed check goes back once as `brief-analyst-2.md` naming the failed lines; a second failure stops the door in the answer structure. Done when both handoffs pass.

4. **Gate one: requirements and plan.** Write `gate-plan.md` in the gate-one format and show it to the human. Stop. On `go`, write the recommended answers under Said in `exploration.md`. On answers, write them under Said; when one differs from its recommendation, or the human changes a row, re-brief the analyst with mode `plan only`, show the changed rows, and stop again. Done when the human said go on the plan as last shown.

5. **Write.** Fill the brief into `brief-writer.md`: read `plan.md` and the locator map in `exploration.md`, then the Reuse files; mode `round 1`; deliverables `report.md` and the files in the plan's Create list; may change only those files, the Reuse files and the fixture; done lines and budget from `reference.md`. Run `agent-tests-playbook:test-writer`. Check `report.md` with the report check; a failed check goes back once as `brief-writer-2.md`, a second failure stops the door. Done when the report passes.

6. **Gates.** Run `bun run check`, then `bun run test:all`, and read both outputs. A red gate goes back to the writer once as `brief-writer-<n>.md` carrying the exact error lines, its answer is `report-<n>.md`, then both run again. Done when both are green after the last change to the tree. A second red stops the door: report it in the answer structure with the error lines.

7. **Review.** Fill the brief into `brief-reviewer.md`: read `plan.md`, `exploration.md`, `report.md`, `tree-before.txt` and the diff, `git status --short` plus `git diff` plus every untracked file the report lists; deliverable `review.md`. Run `agent-tests-playbook:test-reviewer`. On FIX FIRST, brief the writer with `review.md` as `brief-writer-<n>.md`, mode `round <n>`; its `report-<n>.md` answers every finding; then brief the reviewer again as `brief-reviewer-<n>.md` for a second read, its verdict in `review-<n>.md`. Two rounds at most. Done when the verdict is SHIP, or two rounds are spent and the open findings are listed for gate two.

8. **Gate two: done card.** Write `done.md` in the gate-two format and show it. Stop. The door closes here; commit, push and ship happen on the human's word through the project `CLAUDE.md`. Done when the card is shown.
