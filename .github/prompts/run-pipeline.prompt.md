---
description: Kick off the full agentic SDLC for one story (Requirements → Architecture → Design Review → Plan → Build → Review → Verify → PR).
agent: conductor
argument-hint: "[SCRUM-<number>] or leave blank to browse the backlog"
---
# Run the Pipeline

## Before you start
- `config/app-profile.yml` must be filled in. The pipeline reads app facts from it and never scans source to guess.
- MCP servers in `.vscode/mcp.json` must be started (Atlassian, GitHub).

## How to use
- Pass a story id like `SCRUM-1`, or leave blank to browse the Jira backlog.
- The story may also live in a Confluence page or a Word doc.

## What runs
1. **Conductor** drives every stage.
2. **Intake** reads the story and asks clarifying questions.
3. **Doc Sync** writes requirements, architecture, design review, implementation plan into `docs/`, each with chat approval.
4. **Build → Review → Verify → Publish** finish the job: code and tests, seven-area review, test and doc verification, PR with changelog, Jira and Confluence updates.

Nothing is committed, posted or published without your explicit okay.

Story: ${input:story:SCRUM-1}
