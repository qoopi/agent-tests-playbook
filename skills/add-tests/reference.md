# add-tests reference

Formats for the human and the checks for each handoff. The master reads this when a step names it.

## Intake question
```
What should the tests cover? A sentence, a ticket text, or the path of a file that holds it.
<when a coverage report exists under .claude/work/*/coverage.md: "Or one of these gaps from the last coverage report:" and its top three gap lines>
```

## Budgets for briefs
Analyst: 80 browser actions. Plan: at most 8 tests in this round, the rest under Later. Writer: the plan's tests, two rounds at most.

## Done lines for briefs
Analyst
- Every behaviour in the task was walked on the page, or is marked not reachable with the reason.
- Every locator in the map was seen in a snapshot of this run, with source and uniqueness recorded.
- Every in-scope behaviour has a criterion; every criterion has a test id or a Later line.
- Every open question carries a recommended answer; the plan follows the recommendations and lists what depends on them.

Writer
- Every T in the plan is done, or blocked with the reason in Plan status.
- `bun run check` exit 0 after the last change.
- The new tests pass alone and inside `bun run test:all`.
- Every new test was proven to fail on its Then assertion and restored; the evidence table holds the line.

Reviewer
- Every T checked on the plan axis and the rules axis, in both directions.
- Every locator in the diff traced to the locator map.
- For every test, the change to the app that breaks its Then is named.

## Handoff checks
A handoff passes when every section of its template is present, no `<placeholder>` text remains, and:
- exploration: at most 80 lines outside the locator map; every locator row has a source and a uniqueness value; the Environment block is filled; Open questions is a Q list or "none"; `exploration-log.md` exists beside it.
- plan: at most 100 lines outside Tests in order and Later; every T names an AC; every AC has a T or a Later line; Depends on answers lists a Q or "none".
- report: the Answer has all six lines; the evidence table has the four gate rows and one prove-it-can-fail line per new T; Plan status names every T.
- review: Gates line present; a verdict with four counts; every finding line has file, line and severity.

## Gate one: requirements and plan
```
Result:    Plan ready for <slug>. <n> tests, <n> open questions.
Evidence:  Analyst walked <n> flows on <target>; locator map has <n> entries from snapshots.

Requirements as understood
<behaviours, numbered, one line each>

Assumed
<one line each, or none>

Open questions
Q1 <title>: <question>
   Recommended: <answer, one reason>
<or "none">

Plan
| id | test | tag | proves |
| T1 | <title> | @smoke @<area> | AC-1 |

Risks: <one line, or none>
Next:      Reply "go", or answer questions by number, or name a row to change.
```

## Gate two: done card
```
Result:    Done for <slug>. <n> tests added, review <SHIP | FIX FIRST with n open>.
Evidence:  <the evidence table from the last report, verbatim>
Assumed:   <assumptions still unconfirmed, or none>
Changes:   <files created or changed, one per line>
Open:      <open review findings, blocked tests, risks; or none>
Next:      Review the files. To ship: say commit, push or ship and name the release branch.
```
