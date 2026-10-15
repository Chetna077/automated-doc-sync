# Handoff — automated-doc-sync (Copilot)

## State
- Branch: `feature/automated-doc-sync-mvp`. Tests: 40/40 passing. Zero runtime dependencies.
- Artifacts: requirements, architecture, design-review, impl-plan, code-review, verification-report, demo-flow, trace-log.

## How to run
```
npm test
npm run sync:self
node src/index.js <repoPath> <templatePath> <outputPath> [--json]
```
In VS Code Copilot Chat (Agent mode): run `/run-pipeline SCRUM-<n>`.

## Pipeline map
`.github/prompts/run-pipeline.prompt.md` → `conductor` → `intake` → `doc-sync` → `build` → `review` → `verify` → `publish`.
Guardrails: `.github/instructions/`, `.github/skills/`, `.github/hooks/`.

## Known limitations
- Only package.json and README.md facts are supported; everything else renders `Not Found`.
- 7 of 15 profile placeholders are `Not Found` for this repo by design.
- MCP needs a GitHub token entered at first start.

## Next
Merge the PR after review; consider live Jira/Confluence read of story input.

## Handoff buttons (human gates in Copilot)
Each stage agent ends with a handoff button (intake, doc-sync, build, review, verify, publish). `send: false` means the human reads the result and clicks to continue; the pipeline never advances on its own.
