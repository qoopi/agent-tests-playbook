# Plan: <slug>

Written by test-analyst. At most 100 lines outside the Tests in order and Later sections, which hold every planned test in full. Formats: rules/acceptance-criteria.md and rules/planning.md.

## Criteria
id | title | behaviour | priority | Given | When | Then | Must not | Verify | Partner
<one row per criterion; every in-scope behaviour has one>

## Flow model
<one Mermaid flowchart per flow, nodes and edges seen in the locator map>

## Paths
<P<n> lines with their criterion, or "gap" with the question it raised>

## Tests in order
Order: <one line with the reason>
<T<n> blocks in the plan entry format>

## Out of scope
<what nobody asked for and would otherwise be assumed: performance, accessibility, other browsers, security, third-party boundaries>

## Later
<paths left out, with the reason; or none>

## Depends on answers
<T<n> or AC-<n> that changes if Q<n> is answered against the recommendation; or none>

## Risks
<flakiness sources, data that others can change, not verifiable criteria; or none>
