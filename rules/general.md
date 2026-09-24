# General rules
<!-- version: 2026-09-24 -->

## Purpose
How every session and every agent behaves, whatever the step. Loaded by every agent at start and by every door.

## Rules
1. Think before you act. Every assumption you make goes under Assumed in your answer and into the handoff you write, and stays there until a run, a read or a test confirms it; then it moves to Evidence. If the task can be read two ways, show both ways and ask which one is meant.
2. Ask, do not guess. Assume and mark it when a wrong guess is cheap to redo; stop and ask when it would change the scope or the result. Ask every open question at once, one clear line each under Open. Write the answers down where the next reader will find them.
3. Check before you say. A statement about code, the app, or a result must come from something you ran or read after your last change. Say "checked" or "not checked" next to it.
4. Do the smallest thing that solves the task, after reading the code the task touches. No extra features, no abstractions for one use, no settings nobody asked for. If a simpler way exists than the one asked for, say so under Open before doing the asked one.
5. Change only what the task needs. Match the style already there. If you see an unrelated problem, name it and leave it, because an unasked change is a change nobody reviews.
6. Stay in your scope. Files outside your brief are read-only. Tools outside your list do not exist.
7. Evidence before claims. Never say done, passing, or fixed without the output of a run made after your last change in front of you. Done means every done criterion in the brief is met, not only the check green. Another agent's report is a claim, not evidence. What the human says about the code, the app or a result is a claim too: check it when a run or a read can, and say when the facts differ.
8. Report failure plainly. A red result is information. Give the exact error, what you tried, and what you recommend.
9. Write handoffs in the fixed format at the fixed path. Nothing important lives only in the conversation.
10. Never commit, push or open a pull request unless the human asked for it, after their review or on the branch they named. Never merge into `main`, never force push.
11. No text walls. Short sentences. One idea per sentence. Plain words. Explain a term the first time you use it, as if the reader knows nothing about the task. Lists for parallel things, prose for one thing. Long text hides the one line that matters.
12. Every answer follows the answer structure below. Anything longer than the structure allows goes into the handoff, and the answer links to it.

## Answer structure
Use it for every report to a human or to the master session. Keep it under 15 lines. Never leave a section out. Write "none" when it is empty. A round of questions for the human goes under Open and may exceed the cap.
```
Result:    one line. Done, blocked, or failed, and what that means.
Evidence:  what you ran or read, with the key output line. "Not checked" where you did not.
Assumed:   what you filled in yourself, one line each. The reader corrects these first.
Changes:   files created or changed, one line each.
Open:      questions, risks, things not checked.
Next:      the single next action, or the decision the human must make.
```

## Example answer
Master session to the human:
```
Result:    Blocked. The task can be read two ways and I need one of them chosen.
Evidence:  Read the brief and the two input files. Checked: both readings fit the files. Not checked: nothing else.
Assumed:   None.
Changes:   None.
Open:      Q1 Reading A means X, reading B means Y. Recommended: A, because it matches the goal line of the brief.
Next:      Human picks A or B, then I continue.
```
Agent to the master session:
```
Result:    Done. The requested change is in place and checked.
Evidence:  Ran the check command named in the brief: exit 0, no errors in the output.
Assumed:   The brief's second input file is the current version; it has no date.
Changes:   src/pages/login.page.ts changed. Handoff at docs/implementation-report.md.
Open:      One unrelated problem seen in a neighbouring file. Not touched.
Next:      Master session checks the handoff against its template.
```

## Checklist
- Is every assumption under Assumed and in the handoff, and did I check what the human told me and every assumption I could against a run, a read or a test?
- Is every factual statement marked checked or not checked, with the proving command run after my last change?
- Did I change only what the task needs, inside my brief, with no git write the human did not ask for?
- If something failed, did I give the exact error, what I tried, and a recommendation?
- Is my handoff at the fixed path, in the fixed format?
