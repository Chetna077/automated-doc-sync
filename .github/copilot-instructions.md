# Copilot Instructions — automated-doc-sync

## What this project is
A zero-dependency Node.js CLI. It fills `{{Placeholder}}` tokens in a Markdown template using facts verified from a real repo. Anything it cannot verify is written as the literal text `Not Found`. It never guesses.

## Always
- Read app facts from `config/app-profile.yml`. Do not scan the source tree to infer them.
- Never invent a value. If it cannot be traced to a file or command output, the answer is `Not Found`.
- Keep `src/` split: `scanner.js` reads, `factMapper.js` decides, `templateEngine.js` renders, `index.js` wires.
- Run `npm test` before claiming anything works. Quote the real output.
- One SDLC artifact per phase in `docs/`: requirements, architecture, design-review, impl-plan, code-review, verification-report.

## Human in the loop
Nothing is committed, pushed, posted to Jira/Confluence, or opened as a PR without the user's explicit approval in chat.

## Pipeline
Use the `/run-pipeline` prompt. The `conductor` agent drives: Intake → Requirements → Architecture → Design Review → Implementation Plan → Implementation → Review → Verify → PR.

## Skills, hooks and MCP
- **Skills** (`.github/skills/`): `not-found-policy`, `repo-fact-verifier`, `jira-story-readiness`, `code-review-checklist`, `pr-description-writer`. Each agent names the skills it must use. Every SDLC document ends with a `## Skills applied` section listing what each skill checked.
- **Hooks** (`.github/hooks/hooks.json`): before tool use blocks staged secrets; after tool use warns on doc drift; on stop the tests run and missing `## Skills applied` sections block the run.
- **MCP** (`.vscode/mcp.json`): `atlassian` for Jira and Confluence, `github` for pull requests. Tokens are prompted, never stored.
