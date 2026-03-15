\# Project specific instructions



These rules apply only to this repository.



\## Setup



Install dependencies using pip install -r requirements.txt



\## Development



To run API use (must run from /backend folder):

uvicorn main:app --reload --port 8000



To run Expo app use (must run from /frontend folder):

npx expo start -w --port 8080



to run Python scripts use (must be done in /backend):

python -m <module\_path\_from\_backend>. example: python -m scripts.download\_recipets



\## Architecture



Project structure is split into frontend and backend and project files like .gitignore. Maintain the Architecture section when structural changes are made. If the section is empty, infer the current architecture from the repository and document it briefly and accurately, without inventing structure.




Architecture goes here.





\## Rules



UI components goes in src/components and they should be reuseable.

API calls goes through src/services/api.ts

For other coding changes, read the explanation in each folder and follow existing patterns. If placement is still unclear, choose the most consistent existing location and explain the choice.

Do not make changes to .db files

do not push new changes to GitHub without explicit permission. 





\## Workflow Orchestration



\### 1. Plan Mode Default

\- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)

\- If something goes sideways, STOP and re-plan immediately — don't keep pushing

\- Use plan mode for verification steps, not just building

\- Write detailed specs upfront to reduce ambiguity





\### 2. Self-Improvement Loop

\- After a meaningful correction from the user, update tasks/lessons.md with a concise note that           would prevent the same mistake in this repository.

\- Write rules for yourself that prevent the same mistake

\- Ruthlessly iterate on these lessons until mistake rate drops

\- Review lessons at session start for relevant project



\### 3. Verification Before Done

\- Never mark a task complete without proving it works

\- Diff behaviour between main and your changes when relevant

\- Run tests, check logs, demonstrate correctness



\### 4. Demand Elegance (Balanced)

\- For non-trivial changes: pause and ask "is there a more elegant way?"

\- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"

\- Skip this for simple, obvious fixes — don't over-engineer

\- Challenge your own work before presenting it





\## Task Management



When user prompts new changes:



1\. \*\*For non-trivial tasks, write a short plan to tasks/todo.md with checkable items.

For small tasks, keep the plan in the response unless the user asks for file-based tracking.

2\. \*\*Verify Plan\*\*: Check in before starting implementation

3\. \*\*Track Progress\*\*: Mark items complete as you go

4\. \*\*Explain Changes\*\*: High-level summary at each step

5\. \*\*Document Results\*\*: Add review section to `tasks/todo.md`

6\. \*\*Capture Lessons\*\*: Update `tasks/lessons.md` after corrections





\## Core Principles



\- \*\*Simplicity First\*\*: Make every change as simple as possible. Impact minimal code.

\- \*\*Minimal Impact\*\*: Changes should only touch what's necessary. Avoid introducing bugs.





\## Notes



Non-trivial task = work involving 3+ edits, architectural decisions, schema/API changes, cross-folder refactors, or unclear requirements.



