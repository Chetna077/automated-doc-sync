# Provenance - which tool did what (automated-doc-sync, SCRUM-1)

This page records, step by step, which tool produced each part of this project and where the evidence is.
It is a plain record, written 2 Nov 2026. Commit counts are as of that date.

## Who did what

| Part | Tool used | Human approval | Evidence |
|---|---|---|---|
| Original CLI (template engine, scanner, fact mapper, CLI) and the first requirements, architecture, design review, plan and tests | Built earlier (Sep to Oct 2026) with Claude assistance | Chetna Deshwal reviewed each stage | `git log`; 38 of 39 commits carry `Co-Authored-By: Claude`, which the organization requires |
| Copilot layer: 7 agents, prompt, instructions, 5 skills, hooks, MCP config | Built with Claude assistance, in GitHub Copilot's file formats (`.github/`, `.vscode/mcp.json`) | Chetna Deshwal reviewed each change | `.github/`, `docs/trace-log.md` |
| SCRUM-1 pipeline run on 2 Nov 2026: intake questions, requirements, architecture, design review, plan, build, review, verify, PR text | GitHub Copilot Chat, agent mode, `/run-pipeline SCRUM-1` (conductor and stage agents) | Chetna Deshwal answered the clarifying questions and approved each stage | `docs/`, the added regression test in `test/cli.test.js`, `.github/hooks/token-usage.log` (tool calls recorded by the after-hook) |
| PR #1 title and body | GitHub Copilot, run in its terminal with the GitHub CLI (`gh pr edit`), after Chetna Deshwal approved the command | Chetna Deshwal reviewed the title and body, ticked 6 of 6 checklist boxes and merged | PR #1, merge commit `23167e1`; CI run #12 on `main` passed |
| Jira SCRUM-1 status move to Done, its comment, and the description with tables | GitHub Copilot Chat through the Atlassian MCP | Chetna Deshwal approved each write | Jira history for SCRUM-1 |
| Commit `5eee8b0` (MCP config) | Committed and pushed by GitHub Copilot with approval | Chetna Deshwal approved | `Co-authored-by: Copilot` in the commit message |

## Why the PR was updated with the GitHub CLI

In this account Copilot's GitHub MCP server listed read-only tools (list, get, search), so it could not edit a pull request. The MCP config was changed to the full-toolset endpoint, and Copilot then used the GitHub CLI for the one PR update. Everything else went through Copilot's own tools.

## Keeping the numbers current

`docs/verification-report.md` carries a marker `<!-- test-count: N -->`. CI runs `scripts/check-doc-counts.js`, which runs `npm test` and fails if the real total differs from the marker. Update the marker and the report together after any change to the tests.
