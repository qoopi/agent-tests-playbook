# Debug: <slug>

Written by test-debugger. Format: rules/debugging.md report entry format.

## Run
Source:   <local run | CI run <id> artifact>
Command:  <what was run to reproduce>
Result:   <n failed of n, n flaky>

## Per test
<one report entry per failing test: cause, evidence with two markers, change, result>

## Bugs
<numbered, ready to file: steps, expected from the criterion, actual with evidence, frequency out of ten, base URL and browser, harm; or none>

## Evidence table
<gate rows and prove-it-can-fail lines in the verification format, for every changed test>

## Quarantined
<test title, owner, reason, expiry; or none>

## Answer
Result:    <one line>
Evidence:  <runs after the last change>
Assumed:   <or none>
Changes:   <files, one per line>
Open:      <or none>
Next:      <the single next action>
