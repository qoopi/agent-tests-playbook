---
name: plan
description: Turn an exploration handoff into a test plan: criteria, flow model, paths, ordered tests, risks. Used by test-analyst after explore.
user-invocable: false
---

# plan

From `exploration.md` to `plan.md` in the shape of `${CLAUDE_PLUGIN_ROOT}/templates/handoffs/plan.md`. Formats and rules: `${CLAUDE_PLUGIN_ROOT}/rules/acceptance-criteria.md` and `${CLAUDE_PLUGIN_ROOT}/rules/planning.md`. Every open question counts as answered by its recommendation until the human replaces it; what rests on a recommendation is listed under Depends on answers.

## Steps

1. **Criteria.** One criterion per observable outcome of every in-scope behaviour, one table row each with the fields of the criterion format. For each input list its partitions: valid, invalid, empty, boundary with the limit and both neighbours, over-long and unicode for free text. Limits live outside fields too: counts of 0, 1 and the maximum, first and last position in a list. Each partition becomes a criterion or a one-line reason. Each negative criterion is invalid in exactly one input, so a failure names its cause. Done when every behaviour has a criterion and every partition has a criterion or a reason.

2. **Model.** One Mermaid flowchart per flow, built only from the locator map and the flows walked. Refused moves are self-edges. Where state survives navigation, such as a cart, pairs of consecutive actions are edges: add then remove, add then go back. Done when every node and edge points at a snapshot or a map row.

3. **Paths.** Every edge once, every branch both ways. Match paths and criteria in both directions: a path without a criterion is a gap question with a recommended answer; a criterion without a reachable path is marked not verifiable with the reason. Done when every path has a criterion or a gap line.

4. **Tests.** One T per path in the plan entry format. Variations of one path are cases of one parametrized test, with the technique named: partition, boundary, decision table, or error guessing for cases intuition added. When accounts multiply the flows, plan the pairs that matter and put the rest under Later. Level tag by planning rule 9, `@smoke` for a test proving a required criterion, `@regression` for the rest; the area tag from the project `CLAUDE.md`. Order by risk and value: login and checkout at the top of their level; within a level, boundary above negative above happy. Name one existing spec the new ones should look like. Done when every T carries every line of the plan entry format and its Reuse and Create lines name real paths.

5. **Size.** The brief's budget is a count of tests for this round. Tests past it go under Later with the reason, edge paths first. Done when the tests in order are within the budget.

6. **Risks and dependencies.** Every risk names its mitigation: the test that covers it, what the writer must do, or accepted. Every unconfirmed assumption is a risk. Depends on answers lists each T or AC that changes when a question is answered against its recommendation. The Out of scope section names what nobody asked for and would otherwise be assumed: performance, accessibility, other browsers, security, third-party boundaries such as email or an external redirect. Done when `plan.md` has every section of the template, at most 100 lines outside Tests in order and Later, and every AC has a T or a Later line. The cap never decides how many tests are planned; the budget does.
