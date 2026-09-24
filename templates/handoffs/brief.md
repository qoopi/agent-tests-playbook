# Brief: <agent> for <slug>

Written by the master session. One brief, one agent. The agent reads nothing outside this list.

Task:        <one sentence: what to deliver, for which task>
Mode:        <task | coverage | plan only | round <n>>
Work folder: .claude/work/<slug>/
Read first:  <files in order, one per line, each with why it matters>
Deliverables: <handoff path> in the shape of <template path>, one per line
Done when:   <one checkable line per criterion; the agent's Result line says which are met>
Environment: target <url>, <production | staging | pr>, account <role or none>, writes <allowed | none>
May change:  <files or folders the agent may create or edit; everything else is read-only>
Budget:      <a count: browser actions, tests, or rounds, from the door's reference>
Assumed:     <what the master filled in for the agent, one line each, or none>
