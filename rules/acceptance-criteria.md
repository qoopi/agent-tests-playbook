# Acceptance criteria rules
<!-- version: 2026-09-24 -->

## Purpose
How to write and check acceptance criteria so that a test can be built from each one without asking anything. Criteria go into the test plan handoff, before the flow model. Loaded by test-analyst through the `plan` skill.

## Rules
1. One criterion per observable outcome. Each criterion has an id and names the behaviour it comes from. Every in-scope behaviour gets at least one criterion.
2. Write every criterion as Given, When, Then. Given is the starting state including data. When is one action. Then is what the user sees. Two actions means two criteria. The three parts become the Arrange, Act and Assert blocks of the test; the words differ because criteria are read by people who do not read code.
3. Then must be something you can look at on the page: a text, an element, a URL, a count, a state. "Works", "correctly", "properly", "fast", "secure" are not outcomes. If you cannot name what you would look at, it is not a criterion yet.
4. Every positive criterion gets a negative or edge partner: empty input, nothing found, invalid value, a boundary, no permission or logged out. List each input's partitions, valid, invalid, empty, boundary, and give each a criterion or a written reason, because a missing negative case is the most common gap.
5. Add Must not when a wrong side effect matters: data created, page left, error shown, request sent.
6. Name the data exactly: the word typed, the value entered. Data that changes per visit, such as prices, counts and auction state, is described by shape, never by value. Credentials and personal data are named by reference to the account in the constraints, never by value.
7. Criteria stand alone. Each starts from its own Given. None depends on another criterion having run.
8. Set priority by risk and user value, not by position in the list: required, important, optional.
9. Say how each criterion is checked: automated is the default; manual or not verifiable need the reason, such as no account or production write. A criterion the writer cannot build comes back marked revised with the constraint; the Then is never weakened.
10. Two readers must agree on pass or fail from the text alone. If you can imagine a debate, rewrite.

## Criterion format
In the plan handoff a criterion is one table row with these fields, in this order. The block below shows the same fields spread out, for reading.
```
AC-<n>   <short observable title>                 behaviour <n> | priority <required|important|optional>
Given    <starting state, with data>
When     <one action>
Then     <what the user sees, checkable>
Must not <side effect that must not happen>       only when it matters
Verify   automated | manual: <reason> | not verifiable: <reason>
Partner  AC-<n> | skipped: <reason>                 on positive criteria
```

## Example: from behaviours to criteria
Continues the requirements example after the human answered Q1 item card and Q2 a message is expected.
```
AC-1     Search shows item cards for a matching word    behaviour 1 | required
Given    the home page is open and the cookie banner is closed
When     the user submits "watch" in the search box
Then     the URL contains "/search", the page heading contains "watch",
         and at least one item card is visible
Verify   automated
Partner  AC-3

AC-2     Opening the first card shows its item page      behaviour 2 | required
Given    a results page for "watch" is open with at least one item card
When     the user clicks the first item card
Then     an item page opens whose title equals the title shown on that card
Must not open a new tab or window
Verify   automated
Partner  skipped: a card without an item page cannot be produced on a read-only site

AC-3     Search for a word with no matches says so       behaviour 1 | important
Given    the home page is open and the cookie banner is closed
When     the user submits "zzqxv" in the search box
Then     the results page shows a message containing "No results" and zero item cards
         message wording assumed, none exists on the site today; confirm
Verify   automated

Partitions of the search word: matching, AC-1; no match, AC-3; empty box: no criterion yet, asked as Q3.

Rewritten during review:
Before:  "AC-1 Search works correctly."
Why:     no Given, more than one possible When, and "correctly" is not something you can look at.
After:   AC-1 above.
```

## Checklist
- Does every criterion name its behaviour, and does every in-scope behaviour have a criterion?
- Is every Then something you can look at on the page?
- Does every positive criterion have a negative or edge partner, or a written reason why not?
- Is the data named exactly, or by shape when it changes per visit?
- Does every criterion start from its own Given?
- Would two readers agree on pass or fail from the text alone?
- Is every When one action, and does every criterion carry a priority and a Verify line?
