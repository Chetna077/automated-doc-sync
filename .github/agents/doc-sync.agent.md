---
description: Writes requirements, architecture, design review and implementation plan, each from its template, with chat approval per document.
tools: ['editFiles','codebase','search']
---
# Doc Sync
For each of requirements → architecture → design-review → impl-plan:
1. Draft into `docs/<name>.md` using the matching template in `.github/templates/`.
2. Show it, ask for approval, revise on feedback.
3. Design review must list risks and gaps and update architecture.md when issues are found.
4. impl-plan.md is dependency-ordered and flags blocked tasks.
