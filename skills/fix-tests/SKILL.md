---
name: fix-tests
description: Take a red run, local or on CI, to its cause. Ends with the cause fixed and proven, or a bug written; the human decides once.
disable-model-invocation: true
argument-hint: "[CI run id or URL, a spec path, or nothing for the last local run]"
---

# fix-tests

The master session runs this door. The debugger finds the cause; the master gathers the run, briefs, checks the handoff, runs the gates and stops for the human once, at the done card. Everything lives in `.claude/work/<slug>/`. Load `${CLAUDE_PLUGIN_ROOT}/rules/general.md` first.

## Steps

1. **Intake.** `$ARGUMENTS` names a CI run by id or URL, a spec path, or nothing. Slug: `fix-<run id>` for CI, `fix-<spec name>` for a spec, `fix-<date>` for nothing. Write `run.md`: for CI, the failing lines from `gh run view <id> --log-failed` and the artifacts from `gh run download <id> -D .claude/work/<slug>/artifacts`; otherwise the output of `bun run test:all`, or of `bun run test:all <spec>`. Done when `run.md` lists every failing test with its spec, title and error line, and where its trace is.

2. **Bootstrap.** Invoke `agent-tests-playbook:bootstrap`. Done when its readiness table has no red row other than the failing tests.

3. **Debug.** Fill `${CLAUDE_PLUGIN_ROOT}/templates/handoffs/brief.md` into `brief-debugger.md`: read `run.md`, each failing spec, its page objects, `src/data/`, and the plan entry from `.claude/work/*/plan.md` when one names the test; mode `round 1`; deliverable `debug.md`; may change the failing specs, their page objects and `src/data/`; budget two rounds; done lines: every failing test has an entry with a cause class and two markers, every test-class entry has one change proven by `verify`, every product-class entry has a bug, every environment or data entry stops with evidence. Run the Agent tool with `subagent_type: agent-tests-playbook:test-debugger` and the prompt `Read and execute .claude/work/<slug>/brief-debugger.md`. Check `debug.md`: every template section present, one entry per failing test, an evidence table when a file changed. A failed check goes back once as `brief-debugger-2.md`; a second failure stops the door. Done when `debug.md` passes.

4. **Gates.** `bun run check`, then `bun run test:all`, both outputs read. A red gate that is not a product-classed test goes back once as `brief-debugger-2.md` with the error lines; a second red stops the door in the answer structure. Done when both are green, or every red test is product-classed with its bug.

5. **Done card.** Write `done.md` and show it: per test its cause, change and result; bugs ready to file, verbatim from `debug.md`; anything quarantined with its expiry; the evidence table; Changes; and the next line: the fix ships through the project `CLAUDE.md` on the human's word, a product bug goes to the tracker. Stop.
