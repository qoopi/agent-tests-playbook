# {{D1.name}}

End-to-end tests for {{R1.product}}, written in Playwright and TypeScript. Tests describe what a user does and sees, one criterion per test, through page objects that hold every locator. The project is driven by the `agent-tests-playbook` plugin: a Claude Code session in this folder is the master session, `CLAUDE.md` is its charter, and the doors below add, fix and explore tests with you at the gates.

## Tech stack

| Tool                                                       | Role                                                                      |
| ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| Playwright {{F7.playwright}}                               | test runner, browsers, tracing, reports                                   |
| TypeScript {{F7.typescript}}, strict                       | page objects, fixtures, data, specs                                       |
| {{D6.name}}                                                | package manager and script runner; tests run under Node                   |
| ESLint with typescript-eslint and eslint-plugin-playwright | type-aware lint; raw locators warn, waits and skips error                 |
| Prettier                                                   | formatting, checked in the gate                                           |
| dotenv                                                     | `.env` into `playwright.config.ts`, the only place that reads it          |
| GitHub Actions                                             | `pr.yml` on pull requests, `nightly.yml` on schedule and release branches |
| Playwright test MCP server                                 | the browser the agents explore and debug with, started from `.mcp.json`   |
| agent-tests-playbook                                       | doors, agents and rules for the session                                   |

Browsers: {{D7.browsers}}. Test id attribute: `{{F1.attribute}}`.

## Folder structure

```
.claude/settings.json      permissions for the session; .claude/work/<task>/ holds a task's briefs and handoffs, gitignored
.github/workflows/         pr.yml, nightly.yml, run-tests.yml
src/pages/                 one class per page: locator fields, action methods, expectLoaded()
src/components/            parts shared by pages, one class each
src/fixtures/test.ts       the only import for specs: page fixtures, hermetic mode
src/helpers/               pure functions
src/data/                  typed data: users by role, the words tests type and expect
tests/setup/               the login, once per run, saved to .playwright/auth/
tests/smoke/               the site answers
tests/<area>/              one folder per area tag, one spec per flow
tests/seed.spec.ts         where the agents' browser starts: a logged-in user on the landing page
playwright.config.ts       environments, tags, login, browsers, runner: every timeout and reporter lives here
.env.example               the variable names; .env holds the values and is never committed
.playwright/               every output: report, traces, results, the saved session
```

## How to

**Set up.** `{{D6.install}}`, then copy `.env.example` to `.env` and fill it: `TEST_ENV`, one `BASE_URL_<NAME>` per environment, the account variables. Values never enter the repo.

**Run tests.**

| Want                           | Type                                                                    |
| ------------------------------ | ----------------------------------------------------------------------- |
| typecheck, lint and formatting | `{{D6.run}} check`                                                      |
| the current environment's tags | `{{D6.run}} test`                                                       |
| every level tag                | `{{D6.run}} test:all`                                                   |
| one level                      | `{{D6.run}} test:smoke`, `{{D6.run}} test:regression`                   |
| one area                       | {{D9.readme_scripts}}                                                   |
| one spec or one test           | `{{D6.run}} test:all tests/<area>/<spec>.ts -g "<test title>"`          |
| watch it                       | `{{D6.run}} test:headed`, `{{D6.run}} test:ui`, `{{D6.run}} test:debug` |
| the last report                | `{{D6.run}} report`                                                     |

Any script takes Playwright flags after it. The scripts set `TAGS`; a `--grep` on the command line is combined with the environment's tags, so use the scripts to choose tags.

**Add, fix, explore.** Start Claude Code here with the plugin, `claude --plugin-dir <path to agent-tests-playbook>`, then type a door:

| Door                       | Type it when                   | You decide                           |
| -------------------------- | ------------------------------ | ------------------------------------ |
| `/add-tests <task>`        | a task needs tests             | after the plan, and on the done card |
| `/fix-tests [run or spec]` | a run is red, locally or on CI | on the done card                     |
| `/explore-product [area]`  | coverage is unknown            | on the done card                     |

**Ship.** Say the tests are reviewed and ask to commit, push or ship; the session follows the Ship steps of `CLAUDE.md`: gates, `feature/<name>` branch, commit with plan ids, pull request with the evidence table, CI watched.

**Environments and accounts.**

| environment | URL variable | production | writes |
| ----------- | ------------ | ---------- | ------ |
{{R2.readme_rows}}

Accounts: {{R3.readme_accounts}}.

## Git and CI

- Flow: {{D2.readme_flow}}.
- Protected: {{D4.readme_protection}}.
- `pr.yml` on pull requests: a `check` job and a `smoke` job on the pull request environment. `nightly.yml` on schedule: `smoke`, `regression` and `quarantine` jobs on the nightly environment. Every test job runs through `run-tests.yml`: a per-test report in the job summary, the HTML report as an artifact, traces when it failed.
