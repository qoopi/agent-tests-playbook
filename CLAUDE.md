# agent-tests-playbook

A Claude Code plugin that turns a Claude session into a test automation team for Playwright + TypeScript projects: doors the human types, agents that explore, plan, write, review and debug, and the rules they follow. This file tells an agent what is here and how to use or maintain it.

## Two ways a session meets this repo
- As a plugin inside a test project. The project's CLAUDE.md makes that session the master session; the skills, agents and rules here are its toolbox. See "Using the playbook from a project".
- Opened directly, as now. Then the session maintains the playbook. See "Maintaining the playbook".

## Layout
```
.claude-plugin/plugin.json   plugin manifest
rules/                       source of truth for how we work; one topic per file
skills/<door>/SKILL.md       doors the human types: init-project, add-tests, fix-tests, explore-product
skills/<step>/SKILL.md       steps agents and the master run: bootstrap, explore, plan, write, verify, review, debug
agents/<role>.md             test-analyst, test-writer, test-reviewer, test-debugger
templates/project/           the typical Playwright project, copied by /init-project; owns .mcp.json and .claude/settings.json
templates/handoffs/          the documents agents and the master pass each other, one fixed shape each
```

## How the pieces fit
- Rules say what good work is. Skills say how: which tool, in which order, what done looks like. Agents do the work. Handoffs carry results.
- A door is run by the master session. It briefs an agent with `templates/handoffs/brief.md`, runs it through the Agent tool as `agent-tests-playbook:<role>`, and checks the returned handoff against its template before using it. The master runs the mechanical gates itself and stops for the human only at the gates the door names.
- An agent starts by reading its rules and its skills by path under `${CLAUDE_PLUGIN_ROOT}`, then the brief's files. Rules are never copied into an agent; the rule file is the only copy.
- An agent cannot ask the human. Its questions go into its handoff with a recommended answer, and the master carries them to the human at the next gate.
- Everything about one task lives in the project's `.claude/work/<slug>/`, gitignored: the task as given, every brief, every handoff. Drop the folder, the task is gone.
- The `playwright-test` MCP server belongs to the project: `templates/project/.mcp.json` starts it, so it works with or without the plugin, and its tools are `mcp__playwright-test__*` for every agent.

## Using the playbook from a project
1. Load the plugin: `claude --plugin-dir /path/to/agent-tests-playbook`, or install it from its marketplace entry.
2. In an empty folder run `/init-project`. It asks a short questionnaire, copies `templates/project/`, fills the project's CLAUDE.md, proves the project runs and pushes the scaffold.
3. Then type a door: `/add-tests <task>`, `/fix-tests`, `/explore-product [area]`. Each says where it stops for a human. Shipping is a sentence; its steps are in the project's CLAUDE.md.

## Maintaining the playbook
Rules
- `rules/` is the single source of truth. Change a rule there first; its Purpose line names the skills and agents that load it.
- Every rules file carries a `<!-- version: YYYY-MM-DD -->` marker. Bump it on every change.
- A rule is one imperative line, with its reason in the line when the reason changes behaviour. No Why or Sources sections.

Skills and agents
- Frontmatter follows the Claude Code docs. Doors set `disable-model-invocation: true`; steps set `user-invocable: false` and keep a model-facing description. Skills are written with Matt Pocock's writing-for-agents skill: steps ending on a checkable done condition, reference in a sibling file, positive phrasing, no cache of what the environment already says.
- A door names the rules it loads, the agent it briefs, the handoff it expects and where it stops. A step skill names its input, its output and its done conditions.
- An agent names the rules and skills it reads at start, its tools, what it may change, and how it finishes.
- Keep nesting at most three levels deep. Prefer one more file over one more folder.

Templates
- `templates/project/` must stay runnable on its own: install, `check` and the smoke test pass with only `TEST_ENV`, `BASE_URL_<NAME>` and the account variables set. Every output lands under `.playwright/`.
- A change to `templates/handoffs/` means updating the agent that writes the handoff and the door check that reads it.

Content policy
- Nothing project-specific or site-specific lives here. Those belong to the project's CLAUDE.md, `.env` and `.claude/work/`.
- No secrets, no credentials, no customer data, not even as examples.
- Third-party material we distilled from is under `../reference-skills/selected/`; `SOURCES.md` says what each skill drew from. Nothing is copied verbatim.

## Testing a change to the playbook
1. Create a scratch project folder and run `/init-project` from a session started with `--plugin-dir` pointing here.
2. Run `/add-tests` against a public site with read-only flows.
3. A change is good when the door completes, every gate stops where it should, and no agent asks a question the brief should have answered.
