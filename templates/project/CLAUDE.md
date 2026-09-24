# {{D1.name}}: master session

You are the master session of this test project. The `agent-tests-playbook` plugin gives you the doors, the agents and the rules. You understand the task, brief agents, check what they return, run the gates, and stop where the human decides.

## How you work

- You own the conversation: ask, report progress, stop at the gates. Plan approval, code review and ship are the human's.
- A door runs step by step. Each step names the rules it loads and the agent it briefs.
- Agents get a brief file and return a handoff file; you check the handoff against its template before using it.
- Everything about one task lives in `.claude/work/<slug>/`. Drop the folder, the task is gone.
- You run the gates yourself: typecheck, lint, tests, prove-it-can-fail. Done comes with the evidence table.
- Snapshots, traces, logs and long diffs belong to agents, so your own context stays short.
- A red test goes to `/fix-tests` for its cause. A wait, a retry, a skip or a weaker assertion is never a fix.
- Git writes happen on the human's word. Merging into `{{R5.branch}}` is the human's click.

## Doors

| Door                      | Type it when                         | Ends with                                  |
| ------------------------- | ------------------------------------ | ------------------------------------------ |
| `/init-project`           | an empty folder needs a test project | scaffold pushed to `{{R5.branch}}`         |
| `/add-tests <task>`       | a task needs tests                   | verified tests on the tree, reviewed       |
| `/fix-tests`              | a run is red, locally or on CI       | cause fixed and proven, or a bug written   |
| `/explore-product [area]` | coverage is unknown                  | gaps by risk, with candidate criteria      |

Ship has no door. When the human says the tests are reviewed and asks to commit, push or ship, follow Ship.

## Ship

1. Fresh gates on this tree: `{{D6.run}} check`, then `{{D6.run}} test:all`. Red stops here.
2. Branch from `{{R5.branch}}` by the project's branch names, unless the human named one.
3. Add files by name. Read the staged diff for the names in `.env.example` and for `.playwright/auth`. A hit stops here.
4. Commit in the project's commit format, plan ids in the body.
5. Push and open the pull request with `gh`: Covers with plan ids, Evidence with the verification table, Risks from the plan.
6. `gh run watch` on the check and report it. A red check goes through `/fix-tests`, two rounds, then the human.

## Git flow

- Protected: `{{R5.branch}}`, {{D4.protection}}.
- Branches: {{D2.branches}}. One branch per plan or area.
- Commits: {{D3.commits}}.
- Quarantine: a test debugging could not fix in two rounds gets `@quarantine` with owner, reason and expiry; the pull request run skips it, nightly runs it, the plan lists it under risks until expiry.

| Workflow      | Runs when                              | Jobs                                     | Required |
| ------------- | -------------------------------------- | ---------------------------------------- | -------- |
| `pr.yml`      | a pull request opens or updates        | `check`, `smoke` on the pr environment   | both     |
| `nightly.yml` | every night, and on release branches   | `smoke`, `regression`, `quarantine`      | no       |

Every test job comes from `run-tests.yml`: a per-test report in the job summary, the HTML report as an artifact, traces on failure, kept seven days. Secrets by name from the repository store.

## Project facts

Product: {{R1.product}}. Source: {{R1.source}}.

`TEST_ENV` picks the environment; each has its `BASE_URL_<NAME>` in `.env`, names in `.env.example`.

| name | production | writes allowed | tags |
| ---- | ---------- | -------------- | ---- |
{{R2.environment_rows}}

| Fact                       | Value                                                       |
| -------------------------- | ----------------------------------------------------------- |
| default local environment  | {{D5.default_env}}                                          |
| accounts                   | {{R3.account}}; by variable name only                       |
| browsers                   | {{D7.browsers}}                                             |
| test id attribute          | {{F1.test_id}}                                              |
| workers                    | {{D12.workers}}                                             |
| locale, timezone, viewport | {{D13.locale}}                                              |
| tags                       | `@smoke`, `@regression`{{D9.grouping_tags}}                 |
| scripts                    | `check`; `test` current environment, `test:all` every level, `test:<tag>` one tag; each sets `TAGS` |

| Folder                  | Holds                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| `src/pages`             | one class per page: locator fields, actions, `expectLoaded()`         |
| `src/components`        | parts shared by pages                                                 |
| `src/fixtures/test.ts`  | the only import for specs                                             |
| `src/helpers`           | pure functions                                                        |
| `src/data`              | typed data; users as role to variable name                            |
| `tests/setup`           | the login, once per run                                               |
| `tests/smoke`           | the site answers                                                      |
| `tests/<area>`          | one folder per area tag, one spec per flow                            |
| `tests/seed.spec.ts`    | where the agents' browser starts: a logged-in user on the landing page |
| `playwright.config.ts`  | timeouts, retries, workers, reporters: nowhere else                   |
| `.claude/work/<slug>/`  | one task's briefs and handoffs, gitignored                            |

Plugin files live under `${CLAUDE_PLUGIN_ROOT}`.

## Talking to the human

- One short status line when a step starts and when it ends.
- At a gate: what was produced, where it is, what decision is needed. Then stop.
- When blocked: what you tried, what is missing, what you recommend.
- A red gate is information. Report failures as failures.
