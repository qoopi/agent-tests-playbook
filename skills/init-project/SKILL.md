---
name: init-project
description: Set up a new Playwright + TypeScript test project from the playbook template through a short questionnaire.
disable-model-invocation: true
argument-hint: "[project name]"
---

# /init-project

Turn an empty folder into a runnable test project with the playbook wired in. This skill is a door: the human types it, and the session runs every step itself. Load `${CLAUDE_PLUGIN_ROOT}/rules/general.md` and `${CLAUDE_PLUGIN_ROOT}/rules/environment.md` first. It ends with the human's review, the scaffold push and a done card.

## Steps

1. **Preflight.** Run `bun --version`, `node --version`, `git --version`, `gh auth status`, and list the folder. Done when all four answer and the folder lists nothing but editor folders such as `.idea` and, when present, an `.env` file, which step 5 has the human check. Otherwise stop and name what is missing; adopting a project with files is not supported yet.

2. **Questionnaire.** Read `questions.md` in this folder and run it as it says: round 1, the facts, the frontier, round 2. `$ARGUMENTS`, when given, answers D1. Done when every R, D and F row is given, defaulted, derived, skipped or looked up.

3. **Settle.** Show the settled view from `questions.md`: three tables, every row with its source. Done when the human confirmed it, with their edits applied.

4. **Generate.** Copy `${CLAUDE_PLUGIN_ROOT}/templates/project/` into the folder, then fill it from the settled table:
   - `CLAUDE.md` and `README.md`: every `{{R<n>...}}`, `{{D<n>...}}` or `{{F<n>...}}` placeholder names its row. The Ship and Git flow sections follow D2, and every branch name in them is one D2 or R5 names.
   - Code and workflow files: every setting the questionnaire can change carries a comment `init-project: <setting name>` on the line above, the name as the questionnaire row calls it. Set each from the table.
   - `package.json`: `name` from D1, one `test:<tag>` script per grouping tag from D9.
   - `.claude/settings.json`: `additionalDirectories` holds F6, the plugin root, so agents may read the playbook's rules and skills.
   - Accounts from R3: one variable per role in `.env.example`, `src/data/users.ts` and the `env` block of `run-tests.yml`; `LOGIN` true in the config. With `none`: remove `tests/setup/`, `src/helpers/credentials.ts`, `src/data/users.ts` and every `TEST_USER_*` line; `LOGIN` stays false.
   Done when a search for `{{R`, `{{D` and `{{F` in the folder, `node_modules` excluded, returns nothing, and every `init-project:` line matches the table.

5. **Secrets.** Show the human the content of `.env` to create: `TEST_ENV` from D5, one `BASE_URL_<NAME>` line per environment from R2, and the account variables from R3 with the usernames filled and the password empty. The session never writes, reads or lists `.env`; a deny rule blocks it. Then tell the human, in these words or shorter:
   - Create `.env` in the project folder with that content and fill the password with an editor, never by pasting it into this chat.
   - `.env.example` is committed and lists the variable names with empty values. Copy it to `.env` on any new machine.
   - `.env` is gitignored and read by `playwright.config.ts` alone.
   - To run against another environment, change `TEST_ENV`; every environment's URL is already there.
   - CI gets the same names from the repository's secrets and variables.
   With an `.env` already in the folder, the human compares it with the shown content and confirms or edits it. Done when the human says the file is in place.

6. **Login page.** Only when R3 named accounts. Take an accessibility snapshot of the base URL with a short Playwright script, `page.locator('body').ariaSnapshot()` plus the test id attributes on the form; the MCP server's browser tools answer only after a planner setup, so they are not used here. Read the username field, the password field and the submit button from the snapshot. Write `src/pages/login.page.ts` from those and a page object for the page R3's after-login state names, register both in `src/fixtures/test.ts`, make `tests/setup/auth.setup.ts` log in through the login page and assert the after-login state R3 gave, and make `tests/seed.spec.ts` open the after-login page. Done when the setup spec has no locator the snapshot did not show, its assertion is the R3 line, and the seed opens the after-login page. Step 7 proves it.

7. **Bootstrap.** Invoke the `bootstrap` skill. Done when its readiness table has no red row. A red row stops here with its error line.

8. **Show and review.** Show the folder tree with one line per folder, the scripts from `package.json` with one line what each is for, and the door table and ship sentence from the generated `CLAUDE.md`. Done when the human says go. An edit request goes back to step 4 for that change and through step 7 again.

9. **Scaffold push.** Only what R4 asked for. `git init -b <R5>`; add the files from the tree by name; read the staged diff for staged env files, anything under `.playwright/`, and values assigned to the names in `.env.example`, a hit stops here; commit `chore: scaffold test project`.
   - `create remote`: `gh repo create --source=. --push` under the owner and visibility from R4.
   - `existing remote`: add it as `origin`, fetch, rebase onto `origin/<R5>`, push.
   - `local only`: stop after the commit.
   With a remote, then: one ruleset from D4 through `gh api repos/{owner}/{repo}/rulesets`; `gh variable set` for every `vars.` name the workflow files read, values from the settled table; one `gh secret set <NAME>` line printed per `secrets.` name, for the human to run in their own terminal with the value typed there; when `gh secret list` shows every name, one manual run, `gh workflow run nightly.yml` then `gh run watch`.
   Done when `git log` shows the commit, `gh repo view` shows it on the remote, the ruleset exists, `gh variable list` and `gh secret list` show every name from the workflows, and the manual run is green.

10. **Done card.** One message: project name and repo link; the environment table with write policy; accounts by role; browsers, tags and workers; the commands; the protected branches and what CI runs when, with the artifacts; the readiness table and the CI run result; and the first thing to type next, `/add-tests <task>`. The generated `README.md` holds the same facts in its fixed shape: what is tested and how, the tech stack, the folder structure, how to set up, run, add, fix, explore and ship, the environments and accounts, git and CI. Done when the card is shown.

11. **Edits while the door is open.** A change the human asks for after the push is still scaffolding: verify it with step 7, add by name, commit, pause the ruleset with `gh api -X PUT .../rulesets/{id} -f enforcement=disabled`, push to `<R5>`, set enforcement back to `active`. Done when the ruleset reads `active` and the remote head is the new commit. The door closes when the human types the next door; from then on `<R5>` changes only through pull requests.
