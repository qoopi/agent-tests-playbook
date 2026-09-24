# Exploration: <slug>

Written by test-analyst. At most 80 lines outside the locator map. The step log goes to `exploration-log.md` beside this file, one line per action; nobody reads it unless a question points at a step.

## Task as given
<verbatim, or the path of task.md>

## Goal and size
Goal:   <one line; marked Assumed when the task did not say>
Size:   one flow | one feature | one area

## Environment
Target:       <url>
Environment:  <production | staging | pr>, <read-only | writes allowed>
Account:      <role, by variable name>
Known blocks: <challenge, login wall, rate limit, or none>

## Behaviours
<numbered: what the user does and what the user then sees, one line each>

## Said and assumed
Said:     <what the task or the human stated>
Assumed:  <what the analyst filled in, one line each>

## Checked
<one line per fact, marked `checked` with where it was seen, or `not checked`>

## Open questions
Q<n> <title>: <the question>. Recommended: <answer, one reason>. Evidence: log step <n>.
<or "none">

## Scope
In scope:     <behaviours by number>
Out of scope: <what is deliberately not tested, with the reason>
Constraints:  <environment, accounts, data, budget, blocks>

## Flows walked
<one line per flow: the steps as a chain, `open cart -> remove item -> badge gone`, and where it ended>

## Locator map
Test id attribute: <from playwright.config.ts>
Page | element | locator | source | unique
<page> | <name> | <locator as it will be written> | snapshot | yes | no | many, scoped by <parent>
Readiness signal per page: <page>: <locator>
Frames: <element inside an iframe, with the frame locator, or none>
