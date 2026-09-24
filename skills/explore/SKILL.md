---
name: explore
description: Explore a web application through the Playwright test MCP server and write the exploration handoff: behaviours as observed, open questions, locator map. Used by test-analyst for a task and for a coverage report.
user-invocable: false
---

# explore

Read-only exploration of the target, as the brief's account, ending in `exploration.md` in the shape of `${CLAUDE_PLUGIN_ROOT}/templates/handoffs/exploration.md`. Rules: `${CLAUDE_PLUGIN_ROOT}/rules/requirements.md`, `${CLAUDE_PLUGIN_ROOT}/rules/automation.md` rules 10 and 11, `${CLAUDE_PLUGIN_ROOT}/rules/environment.md`. Two modes: **task** mode explores the behaviours of one task; **coverage** mode, described at the end, explores an area for gaps.

## Tools
- `planner_setup_page` with `seedFile: tests/seed.spec.ts`, once, first. It runs the seed and pauses on the page a logged-in user lands on; its output is the first snapshot. A status other than paused is a failed setup: stop and report it.
- `browser_snapshot` reads the page; `browser_find` searches it. A screenshot only for what a snapshot cannot show, such as layout or an image.
- `browser_navigate` takes an absolute URL; the base is the URL of the paused page. `browser_click`, `browser_type`, `browser_select_option`, `browser_hover`, `browser_press_key`, `browser_check` act. Every call's `intent` is the step in the user's words, "Open the cart", so the tool log reads as the flow.
- `browser_wait_for` the text the next page must show, after every navigation or page-changing click, then snapshot. A snapshot taken mid-load maps the old page.
- `browser_handle_dialog` answers a browser alert, confirm or prompt; the dialog's text is a fact for the log, and nothing else works until it is answered.
- `browser_generate_locator` on a ref gives the locator for the map; `browser_evaluate` on a ref reads the test id attribute named in `playwright.config.ts` and, with `document.querySelectorAll`, its match count.

## Reading a snapshot
A line is `- <role> "<name>" [ref=eN]`, with state markers `[active] [checked] [disabled] [expanded] [selected] [level=N]` and `/url:` under links. Role and name go into the map row verbatim; a marker is a state fact. A `generic [cursor=pointer]` line is clickable but has no role or name: map it as a last-tier candidate whose attributes must be read, never as a role locator. Six lines with the same name mean a list: the row says `many` and names the scoping parent.

## Steps

1. **Charter.** Before the first action write one line at the top of the handoff: "Explore <pages or flows> as <account> to learn <what the handoff must answer>", and the budget from the brief as a count of browser actions. Record the state the seed left: URL, cart or badge counts, account. Done when the charter names every behaviour of the brief.

2. **Map each page once.** On arrival: wait for its text, snapshot, then enumerate before acting: every button, link with its URL, textbox, combobox, checkbox, with name and count. Pick the readiness signal, a level-1 heading or the one element only this page has. Open each menu or overlay, list its items under the opener, record how it was closed. Done when every interactive element on the page has a map row with source `snapshot` and a uniqueness value.

3. **Walk each behaviour.** Breadth first: every page the charter names once, then depth on the behaviours. After every action, diff the new snapshot against the last and append one line to `exploration-log.md`: step number, action, what changed, and a tag `pass`, `fail`, `investigate` or `note`. For every button, compare the result with what its label promises; a mismatch is a finding under Open with steps, never a requirement. Validation is probed the read-only way of automation rule 10: a form submitted empty or with one invalid field, to read its message. A surprise gets `investigate`, its reproduction steps, and is left until the charter is done and budget remains. Done when every behaviour in the brief was observed once and every step of it has a map row, or is marked not reachable with the reason.

4. **Questions.** Sort every open point into two piles: **research**, which a page or a run answers, and is answered before the handoff; **decide**, which only the human can. Only the second pile becomes a Q line: the question, the recommended answer with its one reason, and the log step that raised it. Behaviour observed with no specification goes under Assumed as "observed on <environment> on <date>", and its question asks whether it is intended, naming the oracle it fails: the product's own pattern elsewhere, the label's claim, a user's expectation, standard control behaviour. Done when every Q has evidence and a recommendation.

5. **Handoff.** Fill every section of the template within its cap: 80 lines outside the locator map, the map one row per element. Behaviours are numbered perform-then-see lines. Flows walked is one line per flow, the steps as a chain; the step detail stays in `exploration-log.md`. What was not observed is `not checked`, never a pass. Credentials appear by variable name only. Done when the handoff passes the exploration check of the door that briefed you.

## Stop conditions
A 403 or a challenge page, an action that would write on production, a seed that does not pause, or the budget spent: stop, write the handoff with what was reached, and report.

## Coverage mode
The brief names an area, not a task. Start from the project's area tags and the specs under `tests/<area>/`: write the territory first, one row per area with its existing specs, depth explored and risk, where risk is probability times impact times frequency, so login, checkout and totals rank first. Explore untested high-risk areas in that order. Count branches, not pages: each control state, a sort option, a checkbox on and off, a field empty and filled, an error and a success message, is a branch, and a page visited with branches untried is a gap. A path no user can reach is dead, not a gap. Exclusions, such as third-party pages and footer links, are listed so the table is not padded. The handoff is `coverage.md` in the shape of `${CLAUDE_PLUGIN_ROOT}/templates/handoffs/coverage.md`: the territory, the gap table sorted by risk, dead paths and exclusions, the questions, the map and the debrief.
