# agent-tests-playbook

A Claude Code plugin that turns one session into a test automation team for Playwright + TypeScript projects. You type a door; agents explore the product in a real browser, plan, write, review and debug; you decide at two gates; every test is proven to fail before it counts.

## What it does

| Door | Type it when | Ends with | You decide |
| --- | --- | --- | --- |
| `/init-project [name]` | an empty folder needs a test project | a runnable project pushed to `main`, CI green | the questionnaire, the settled view |
| `/add-tests <task>` | a task needs tests | verified tests on the working tree | after the plan; on the done card |
| `/fix-tests [run or spec]` | a run is red, locally or on CI | cause fixed and proven, or a bug written | on the done card |
| `/explore-product [area]` | coverage is unknown | a coverage report: gaps by risk, candidate criteria | on the done card |

Behind the doors:

- **Four agents**, each started with a brief file and finishing with a handoff file: `test-analyst` explores through the Playwright test MCP server and plans; `test-writer` implements one test at a time, walking each step live before writing it, and proves every test can fail; `test-reviewer` reads the diff with a fresh context against the plan and the rules; `test-debugger` takes a red test to its cause and never fixes it with a wait, a retry or a skip.
- **Twelve rules files**, the single source of truth for how work is done: requirements, acceptance criteria, planning, automation, coding, testing, verification, reviewing, debugging, delivery, environment, general. Agents read them at start.
- **Seven step skills** the agents and the master run: bootstrap, explore, plan, write, verify, review, debug. Each is a procedure with a checkable done condition per step.
- **A project template**: strict TypeScript, ESLint with the Playwright plugin, Prettier, one config with every timeout in one place, environments by `TEST_ENV`, a login setup with saved state, hermetic mode, tags, GitHub Actions with one job per test set and a per-test report.
- **Handoff templates** for brief, exploration, plan, report, review, debug and coverage, so every document between agents has one shape and the master can check it.

What the human sees: short cards in a fixed answer structure, questions with a recommended answer each, plan tables, an evidence table with one prove-it-can-fail line per test, and a review verdict with counts. Nothing is committed by an agent; ship happens on your word through the project's `CLAUDE.md`.

## How to

**Requirements.** Claude Code, Bun or npm, Node 22, `gh` logged in for `/init-project` with a remote. Playwright 1.63 or later for the test MCP server.

**Start a project.**

```
mkdir my-tests && cd my-tests
claude --plugin-dir /path/to/agent-tests-playbook
/agent-tests-playbook:init-project my-tests
```

Answer the questionnaire: five must-answer questions, then a table you can accept with `defaults`. The project is generated, proven locally, pushed, protected, and CI runs once.

**Add tests.**

```
cd my-tests
claude --plugin-dir /path/to/agent-tests-playbook
/agent-tests-playbook:add-tests search shows items for a matching word
```

Gate one shows the requirements as understood, the open questions with recommendations and the plan table; reply `go`, or answer by number, or name a row. The writer and the reviewer run alone. Gate two is the done card: files, evidence table, verdict. Say `ship into releases/<name>` when you have reviewed the files.

**Fix a red run.** `/agent-tests-playbook:fix-tests 35973231252` for a CI run id, a spec path, or nothing for the last local run.

**Find gaps.** `/agent-tests-playbook:explore-product cart` for one area, or nothing for the whole product; the report ends with the gap to type into `/add-tests` next.

**Run it without the human.** Every door runs in print mode and stops at its gates; resume by session id with the answer:

```
claude --plugin-dir /path/to/agent-tests-playbook -p "/agent-tests-playbook:add-tests <task>" --output-format json
claude -p "go" --resume <session_id>
```

**Maintain it.** `CLAUDE.md` in this repository explains the layout, how rules, skills, agents and templates fit, and what to update together.

## Layout

```
.claude-plugin/plugin.json   manifest
rules/                       how work is done, one topic per file
skills/                      doors (init-project, add-tests, fix-tests, explore-product) and steps (bootstrap, explore, plan, write, verify, review, debug)
agents/                      test-analyst, test-writer, test-reviewer, test-debugger
templates/project/           the project /init-project copies
templates/handoffs/          the documents agents pass each other
SOURCES.md                   what each skill was distilled from
```

## Sources

The rules and skills were distilled, not copied, from these bodies of work; `SOURCES.md` maps each skill to its sources.

- Playwright's own agent definitions, planner, generator and healer, shipped with `playwright` 1.63, and the Playwright documentation on locators, assertions, fixtures and reporters.
- Matt Pocock's skills: writing-for-agents, grill-me, what-to-test, to-spec, tdd, code-review, diagnosing-bugs, handoff.
- qaskills: playwright-agents, playwright-e2e, playwright-advance-e2e, playwright-locator-filter, playwright-test-step, test-plan-generation, risk-based-testing, istqb-test-design-techniques, boundary-value-generator, test-case-generator-user-stories, test-data-factory, exploratory-test-charter-generator, test-coverage-gap-finder, flaky-test-doctor, flaky-test-quarantine, self-healing-locators-strategy, bug-report-writing, pr-test-coverage-review.
- superpowers: verification-before-completion, systematic-debugging, requesting-code-review, receiving-code-review.
- currents.dev playwright-best-practices; ecc: verification-loop, click-path-audit, browser-qa; wshobson: code-review-excellence, debugging-strategies; jeffallan: playwright-expert, code-reviewer, debugging-wizard; anthropics: webapp-testing.
- The dorny/test-reporter action and Playwright's JUnit reporter for CI reports.

## Status

Version 0.1.0. `/init-project` and `/add-tests` have run end to end on a public demo shop; `/fix-tests` and `/explore-product` are written and not yet exercised.
