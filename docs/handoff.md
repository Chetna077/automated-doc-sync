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


## SCRUM-1 Build Result (2026-11-02)

- The scoped CLI implementation was checked against the approved plan. The four application modules already satisfy the agreed source allowlist, ordered existence-only entrypoint checks, exact `Not Found` fallback, local-only behavior, JSON success output, and template overwrite guard; no application-module changes were needed.
- Strengthened the existing CLI integration test to exercise malformed `package.json`: process exits 0, reports 0 / 1 fields found, and writes `Not Found` for the unavailable field. Suite remains exactly 40 tests.
- `npm test`: 40 tests, 40 passed, 0 failed, 0 skipped.
- `npm run sync:self`: `8 / 15 fields found. Wrote TECHNICAL_PROFILE.md`. Generated profile Last Synced date updated to 2026-11-02.
- Local-only build verification; no Jira, Confluence, GitHub, PR, or commit writes.

## Skills applied

- not-found-policy: Verified unavailable/malformed package facts render as the exact `Not Found` value and are not counted as found; the strengthened CLI test covers the malformed JSON case.
- repo-fact-verifier: Checked scanner/mapping behavior against test fixtures; package facts match `package.json`, README summary comes from `README.md`, and entrypoint tests enforce the approved ordered existence-only candidates without reading/executing candidate contents.
