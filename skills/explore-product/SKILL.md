---
name: explore-product
description: Map what the product does and what the tests already cover, and report the gaps worth testing next; the human decides once.
disable-model-invocation: true
argument-hint: "[area, or nothing for the whole product]"
---

# explore-product

The master session runs this door. The analyst explores in coverage mode; the master briefs, checks the report and stops once, at the done card. Everything lives in `.claude/work/<slug>/`. Load `${CLAUDE_PLUGIN_ROOT}/rules/general.md` first.

## Steps

1. **Intake.** `$ARGUMENTS` names one area tag from the project `CLAUDE.md`, or nothing for every area. Slug `coverage-<area>` or `coverage-all`. Write `task.md` with the areas in scope. Done when `task.md` names each area tag in scope.

2. **Bootstrap.** Invoke `agent-tests-playbook:bootstrap`. Done when its readiness table has no red row.

3. **Explore for gaps.** Fill `${CLAUDE_PLUGIN_ROOT}/templates/handoffs/brief.md` into `brief-analyst.md`: read `task.md`, the project `CLAUDE.md`, every spec under `tests/`, `src/pages/`; mode `coverage`; deliverable `coverage.md` in the shape of `${CLAUDE_PLUGIN_ROOT}/templates/handoffs/coverage.md`; budget 80 browser actions per area; done lines: the territory table has one row per area in scope, every page visited has its map rows, every gap row carries a risk and a candidate criterion title, exclusions are listed. Run `agent-tests-playbook:test-analyst` with the prompt `Read and execute .claude/work/<slug>/brief-analyst.md`. Check `coverage.md`: every template section present, every gap row with all five columns. A failed check goes back once as `brief-analyst-2.md`; a second failure stops the door. Done when `coverage.md` passes.

4. **Done card.** Write `done.md` and show it: the territory table; the gap table sorted by risk, top ten; open questions with recommendations; and the next line: `type /add-tests <gap title> for the gap you pick`. Stop.
