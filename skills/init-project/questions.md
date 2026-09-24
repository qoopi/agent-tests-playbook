# Questionnaire for /init-project

## How it runs
- The R, D and F ids are the script's own labels, used by the template markers; the human never sees them. Round 1 shows its questions in order; round 2 shows its rows numbered 1 to n in the order displayed, and the human's `except` numbers refer to those; the settled view shows names only.
- Round 1, one message: the five questions nothing can proceed without. Wait for every answer, then look up the facts.
- Resolve the frontier before round 2. A row marked `derived from` takes its value from that answer and is shown as settled with its source. A row marked `skip when` disappears while its condition holds. A row marked `reworded from` is asked with the names from that answer.
- Round 2, one message: the open rows, grouped as below and numbered 1 to n as displayed. The human answers one of:
  - `defaults`: every open row takes its default.
  - `defaults except 2, 9`: those rows are asked one per message, the rest take defaults.
  - `all`: every open row is asked, one per message, in dependency order.
- One row at a time uses the four-line form under "Asking one question".

## Round 1: must answer
```
R1  What are we testing? Give me the site's URL, the path to its code on this machine, or both.
R2  Which environments exist? One line each: name, URL, and whether it is production.
    Example: pr https://pr.example.com no / staging https://staging.example.com no / prod https://example.com yes
R3  Is there a login? Say none, or list the accounts by role with their usernames, for example
    "session standard_user, locked locked_out_user", one password shared by all roles, and what the page
    shows right after a successful login, for example "the URL contains /inventory". You fill the password later.
R4  Where does the code live? Say one of:
    - local only: a git repo here, no remote
    - create remote: I create a GitHub repo for it, say owner and public or private
    - existing remote <link>: you already have one, give me its link
R5  Which name does your main branch use? [master, git's own default]   skipped with an existing remote: F3
```

## Facts, looked up after round 1
```
F1  Test id attribute     count of data-testid, data-test and data-cy on the first screen of R1's URL; F5 wins when both exist
F2  Local workers         half the physical cores
F3  Remote facts          existing remote: name, owner, visibility, main branch; it must be empty or hold only a README, otherwise stop, adopting is not supported
F4  Site reachable        one request to R1's URL; no answer or a challenge page stops the questionnaire here. A gate, never a row
F5  Local repo facts      local path: package manager from the lockfile, test id attribute from the markup, existing tests
F6  Plugin root           the absolute path of this plugin, `${CLAUDE_PLUGIN_ROOT}`; the project's settings list it so agents may read rules and skills without a prompt
F7  Tool versions         Playwright and TypeScript major versions from the template's package.json, for the README's tech stack table
```

## Round 2: open rows, grouped
```
Git
D1   Project name                         the folder name                                       derived from F3 with an existing remote
D2   Git flow                             GitHub flow: <R5> protected, short branches type/topic, pull request, squash merge
D3   Commits and merges                   conventional "<type>(<scope>): <what>", blank line, "Plan: T1, T2" when tests are added; squash
                                                                                                derived from D2 with GitHub flow; reworded from D2 with a custom flow
D4   Protected branches                   <R5>, and every release pattern from D2: pull request required, the `check` and `smoke / tests` checks required, no force push, no deletion
                                                                                                derived from D2; skip when R4 is local only
Environments
D5   Local environment                    the first non-production name from R2                 derived from R2 with one environment
D8   Tags per environment                 pull request environment @smoke; staging-like @smoke and @regression; production @smoke
                                                                                                reworded from R2; one line with one environment
D10  Hermetic mode                        yes on the pull request environment: only the base URL host is reached
                                                                                                reworded from R2; skip when the only environment is production
Runtime
F1   Test id attribute                    read from the page, never asked
D6   Package manager                      bun; Playwright runs under node                       derived from F5 with a local repo
D7   Browsers                             chromium only; add any of firefox, webkit, iphone, android; the config lists exactly the answer
D9   Grouping tags                        none; each one named gets a test:<tag> script
D11  Retries on CI                        1, isolated retry; failOnFlakyTests and forbidOnly on skip when R4 is local only
D12  Workers on CI                        2; local is F2                                        skip when R4 is local only
D13  Locale, timezone, viewport           en-US, UTC, 1280x720 at scale 1
D16  Timeouts                             test 30 s; assertion 5 s; action 10 s; navigation 15 s; whole run 20 min on CI, none locally
D14  Reporters                            list and html; on CI github and junit, read by dorny/test-reporter into a per-test report on each job's summary
                                                                                                CI part skip when R4 is local only
Tooling
D15  Typecheck, lint, prettier,           the template files, shown on request; a change is an edit to that file at generate
     ignored paths, scripts
```

## Asking one question
Four lines, then wait.
```
<id> <title>.
What it decides: <one sentence, what changes in the project>.
Answer with: <the shape of the answer, options listed>.
Default: <the default, and one reason when it helps>.
```
Example, for D8 after R2 named pr, staging and prod:
```
D8 Which tags run on each environment?
What it decides: the tag filter of each profile in the config; `bun run test` on a profile runs only tests carrying those tags.
Answer with: a tag expression per environment name from R2.
Default: pr @smoke; staging @smoke and @regression; prod @smoke.
```
Example, for D3 after the human described their own flow in D2:
```
D3 Your flow is main → features/<name> → releases/<name> → main. How are commits written, and how do branches merge?
What it decides: the commit format the ship steps use, and the merge style of each pull request.
Answer with: a commit format, and a merge style per step of the flow.
Default: conventional commits with a Plan line, for example

    test(search): add smoke tests for item search and no-results

    Plan: T1, T2, T3

  features/* squash into releases/*; releases/* merge into main with a merge commit.
```

## Settled view
Shown before anything is generated: three small tables, each with one line saying what it covers, columns Item, Answer, Source, no ids. Facts are not rows: a fact appears as the source of the row it settled, and F4 never appears. Source is one of given, default, derived from <row>, skipped: <condition>, fact: <what was read>.
```
Target and access: what we test, where, and who logs in.
  R1 under test | R2 environments | R3 login | R4 where the code lives | R5 main branch

Git and CI: how changes reach the main branch and what runs on GitHub.
  D2 git flow | D3 commits and merges | D4 protected branches | D11 retries on CI | D12 workers on CI | D14 reporters

Runtime and tooling: how tests run on a machine.
  D1 project name | D5 local environment | D8 tags per environment | D10 hermetic mode | F1 test id attribute | D6 package manager | D7 browsers | D9 grouping tags | D12 workers locally | D13 locale, timezone, viewport | D16 timeouts | D15 tooling files
```
Under each table, two or three sentences in plain words, no ids, saying what those answers become: for the first, the target, the accounts and what the human does by hand; for the second, what gets pushed where and what CI runs; for the third, how a run behaves on a machine. Then the question: confirm, or name a row to change.
