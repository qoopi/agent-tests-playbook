# Review: <slug>, round <n>

Written by test-reviewer. Format: rules/reviewing.md finding format, under 40 lines.

Gates: <typecheck, lint, tests with counts>

## Plan axis
<one line per gap between plan and code, or "matches">

## Rules axis
<file>:L<n> <BLOCKER | MAJOR | MINOR | NIT> <what is wrong>. <what replaces it>.

## Can each test fail
<T<n>: the change to the app that breaks its Then, one line each>

## Questions
<Q: <file:L> chosen because <reason>; intended? one per line, or none>

## Declined to judge
<one line per behaviour set aside as outside the plan or a deliberate choice, with the reason; or none>

## Checked
<when nothing was found: what was read and run, so the silence can be trusted>

Verdict: <SHIP | FIX FIRST>. <n> blocker, <n> major, <n> minor, <n> nit.
