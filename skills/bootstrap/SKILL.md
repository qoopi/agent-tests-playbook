---
name: bootstrap
description: Prove a test project runs. Use at the start of every door, after a config change, and when the human asks whether the project is healthy.
---

# bootstrap

Every door starts here. Load `${CLAUDE_PLUGIN_ROOT}/rules/environment.md` first. The result is a readiness table; a red row stops the door.

## Steps

1. **Package manager.** The lockfile names it. Done when one is found; none found stops here, the project is not initialised.

2. **Install.** Dependencies from the lockfile, `bun install --frozen-lockfile`, `npm ci` or `pnpm install --frozen-lockfile`, then the browsers listed in the `BROWSERS` map of `playwright.config.ts`. Then the MCP output folder: `mkdir -p .playwright/mcp` and, when `.playwright-mcp` is absent, `ln -s .playwright/mcp .playwright-mcp`, because Playwright's browser tools write to that fixed name and the link keeps every output under `.playwright/`. Done when both commands exit 0 and `.playwright-mcp` resolves to `.playwright/mcp`.

3. **Gates.** `check` from `package.json`, then `test:smoke`. When `.env` is missing or incomplete, the config's own error line is the report. Done when both exit 0 after the last change to the tree. A red gate stops here with the exact error line.

4. **MCP.** Call the `playwright-test` server's `test_list`. Done when it lists the smoke test and, when the project has a login, the setup test. A missing server means the `.mcp.json` server did not start: report the command it runs.

5. **Readiness.** One table, then stop. Red is an error line, a failed count above 0, or not reachable.
   ```
   Check     Command                        Result
   manager   lockfile                       bun | npm | pnpm
   install   <pm> install, locked           exit 0 | <error line>
   browsers  <pm>x playwright install ...   exit 0 | <error line>
   check     <pm> run check                 clean | <error line>
   smoke     <pm> run test:smoke            <n> passed, <n> failed | <error line>
   mcp       test_list                      <n> tests listed | not reachable
   ```
