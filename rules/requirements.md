# Requirements rules
<!-- version: 2026-09-23 -->

## Purpose
How to turn a task as given into requirements we can test. Loaded by test-analyst through the `explore` skill.

## Rules
1. Read the whole task first. Then restate it in your own words as a numbered list of behaviours, one behaviour per line, written as what a user does and what the user then sees.
2. Say how big the task is before you dig in: one flow, one feature, or a whole area. The size sets how deep the analysis goes and how many questions are worth asking. In doubt, pick the bigger size; if the task grows while you work, say so and re-size.
3. Find facts yourself. The app, the repo, and existing tests answer technical questions. Explore them before asking. Ask the human only for decisions and for business facts no page can tell you: what matters most, who the users are, which environment and accounts we may use.
4. What the app does today is a checked fact, not a requirement. An expectation drawn from it goes under Assumed, or a test would enshrine a current bug.
5. Run a SMART check on every behaviour: Specific, Measurable by something you can see on the page, Achievable with our access and tools, Relevant to the goal, Time-bound within this session. Every "no" or "unclear" becomes a question, or an assumption marked for confirmation. Never a silent guess.
6. A vague word is not a requirement. "Works", "correctly", "fast", "properly", "user-friendly" each get replaced by an observable condition, or become a question.
7. Ask questions in rounds. One round holds every question you can ask now without needing another answer first. Number them. Give your recommended answer under each. Then wait. Rounds end when no open question would change a behaviour, the scope or a constraint.
8. Separate said from assumed. Everything the human said goes under "said". Everything you filled in goes under "assumed" and is marked for confirmation. Both lists go into the requirements handoff. An assumption is never written as a fact.
9. Write scope both ways. What we will not test is as important as what we will, because it is where wrong expectations hide.
10. Write down the constraints: environment and whether it is production, accounts and data we may use, time box, anything that blocks automation such as bot protection or login walls.
11. Stop at the gate. No test plan, no locators, no code until the human confirms the restatement and the answers.

## Question round format
A round goes under Open in the answer structure. It is the one thing allowed to push an answer past the 15-line cap.
```
Q1 <short title>: <the question; list the options when there are some>
   Recommended: <your answer, and the one reason for it>

Q2 ...
```

## Example: from task to requirements
This is what the requirements handoff holds after one round. The round itself is repeated in the answer under Open.
```
Task as given:  "Check that search works."
Goal:           a buyer can find items by typing a word. Assumed, please confirm.
Size:           one flow.

Behaviours
1. On the home page, the user types a word into the search box and presses Enter.
   The user sees a results page whose heading contains that word and at least one item card.
2. The user opens the first item card. The user sees an item page whose title matches the card.

Said:     search must be checked.
Assumed:  "works" means behaviours 1 and 2. An item card is what counts as a result.
          Mobile layout is out of scope.
Checked:  the home page has a search box labelled "Search". A common word returns item cards.
          A word with no matches shows an empty list and no message.
Not checked: behaviour on a phone-sized screen.

Q1 Result definition: does a result mean an item card, or any text match on the page?
   Recommended: item card, because that is what a buyer acts on.
Q2 No matches: today a word with no matches shows an empty list and no message. Is a message expected, or is the empty list intended?
   Recommended: a message is expected, because an empty page reads as broken to a buyer.

In scope:     behaviours 1 and 2, plus the no-matches case if Q2 says a message is expected.
Out of scope: mobile layout, filters, sorting.
Constraints:  production site, read-only, no account, 45 minutes.
```

## Checklist
- Is every behaviour restated, numbered, as what the user does and sees?
- Did I look up every fact I could find myself before asking?
- Did every behaviour pass the SMART check, and every vague word become an observable condition or a question?
- Is every line marked said, assumed, or checked and not checked, with the lists in the requirements handoff?
- Are scope both ways and the constraints written?
- Did I stop before planning?
