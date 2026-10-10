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
