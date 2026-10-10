# Trace Log — automated-doc-sync (Copilot)

Each SDLC step, its artifact, its commit, and who approved it.

| # | Step | Artifact | Commit | Human approval |
|---|------|----------|--------|----------------|
| 0 | Init | repository | `6039d6d` | — |
| 1 | Requirements | `docs/requirements.md` | `95066c1` | Reviewed by Chetna Deshwal after clarifying Q&A |
| 2 | Architecture | `docs/architecture.md` | `63b402e` | Reviewed by Chetna Deshwal |
| 3 | Design review | `docs/design-review.md` | `244fb06` | Rejected generic fact mapper; fixed two gaps |
| 4 | Implementation plan | `docs/impl-plan.md` | `51b5267` | Reviewed by Chetna Deshwal |
| 5 | Implementation | `src/*`, `test/*` | `f0129b6` | Reviewed per task by Chetna Deshwal |
| 6–7 | Review and verify | `docs/code-review.md`, `docs/verification-report.md`, CI | `cfc204c` | Reviewed by Chetna Deshwal |
| 8 | Demo script | `docs/demo-flow.md` | `24f336e` | Reviewed by Chetna Deshwal |
| 9 | Feature: `--json` flag | `src/index.js`, tests | `34a7733` | Reviewed by Chetna Deshwal |
| 10 | Pipeline layer: agents, prompts, instructions, skills, hooks, MCP | `.github/*`, `.vscode/mcp.json`, `config/` | see git log | Reviewed by Chetna Deshwal |

## Tool events
- Hooks fired: `secret-guard.sh` (before tool use), `doc-drift-check.sh` (after tool use), `run-tests.sh` (on stop).
- MCP servers: `atlassian` (Jira SCRUM, Confluence), `github` (PR).
- Test evidence: `npm test` → 29 pass, 0 fail.

## Human-in-the-loop checkpoints

The AI agents draft each artifact. A human reviews and decides at every gate. Nothing is committed, pushed, or published without that human decision.

| Gate | Human role | Decision recorded |
|---|---|---|
| Story and clarifying questions | Reviewer answers the AI's questions and confirms scope | Reviewer: Chetna Deshwal |
| Requirements / Architecture / Design review / Plan | Reviewer reads each document, accepts or requests changes | Reviewer: Chetna Deshwal |
| Implementation | Reviewer approves each task before the next starts | Reviewer: Chetna Deshwal |
| Code review findings | Reviewer accepts fixes or documents accepted risk | Reviewer: Chetna Deshwal |
| Verification | Reviewer checks real test output | Reviewer: Chetna Deshwal |
| Commit / push / PR / Jira / Confluence | Reviewer gives an explicit yes before each action | Reviewer: Chetna Deshwal |

### Decisions the human made in the latest pipeline run
- Chose which project folders the AI could access (Copilot project and Claude project).
- Reviewed the gap list and chose to add MCP config, hooks, agents, prompts and docs.
- Directed the work to be structured in RISE format and asked for Jira, Confluence and PR content.
- Approved creating the Jira epic and tasks, and the Confluence pages.
- Kept control of pushing to GitHub and merging the pull request.

### Reviewer sign-off (complete before the demo)
| Stage | Reviewed | Date |
|---|---|---|
| Requirements | [ ] Chetna Deshwal | |
| Architecture and design review | [ ] Chetna Deshwal | |
| Implementation plan | [ ] Chetna Deshwal | |
| Code and tests | [ ] Chetna Deshwal | |
| Code review and verification | [ ] Chetna Deshwal | |
| Pull request | [ ] Chetna Deshwal | |
