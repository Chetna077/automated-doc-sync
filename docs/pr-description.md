# SCRUM-1: Automated Documentation Sync CLI + Copilot agentic pipeline

## Summary
Adds a zero-dependency Node.js CLI that fills `{{Placeholder}}` templates from facts verified in a real repo and writes `Not Found` for anything unverifiable. Delivered through a GitHub Copilot agentic SDLC pipeline (agents, prompt, instructions, skills, hooks, MCP) with a human approval at every stage.

## Changes Made
- `src/templateEngine.js`, `scanner.js`, `factMapper.js`, `index.js` — the four-module CLI incl. `--json` flag.
- `test/*.test.js` + fixtures — 34 tests incl. Not Found and broken-JSON edge cases.
- `.github/agents/*` (7, RISE format, with handoff buttons so a human approves each stage), `.github/prompts/run-pipeline.prompt.md` — pipeline driven by `conductor`.
- `.github/copilot-instructions.md`, `.github/instructions/*`, `.github/skills/*` (5 skills; every document ends with a `## Skills applied` section) — guardrails.
- `.github/hooks/*` — before: secret guard; after: doc-drift check; stop: run tests and block documents missing `## Skills applied`.
- `.vscode/mcp.json` — Atlassian + GitHub MCP servers; `config/app-profile.yml` — app facts.
- `docs/` — requirements, architecture, design-review, impl-plan, code-review, verification-report, trace-log, handoff, demo-flow.
- `CHANGELOG.md`, `.github/workflows/ci.yml` (also validates skill wiring).
- `src/index.js` + `test/overwrite-guard.test.js` — refuses to write over the template (found by the review agent, fixed with a test).
- `src/scanner.js` — unreadable or missing README and `package.json` give `Not Found` instead of crashing; entrypoint lookup is an ordered, existence-only allowlist (SCRUM-1 pipeline run, approved at each stage).
- `.github/hooks/hooks.json` + `scripts/run-hook.js` — Copilot hook format; launcher works on Windows and never blocks on a broken hook.
- `test/hooks.test.js` — proves the secret-guard hook blocks a staged token, the skills validator passes, the launcher never blocks on a broken hook, and hooks.json is in the Copilot hook format.

## Test Evidence
```
$ npm test
ℹ tests 34   ℹ pass 34   ℹ fail 0
```
Details: `docs/verification-report.md`. Self-scan: 8 of 15 placeholders resolved from real facts; 7 honest `Not Found`.

## Pipeline Evidence
SCRUM-1 ran through the Copilot `conductor` with human approval at intake, requirements, architecture, design review, plan and implementation. The code review and verification entries were written afterwards by Claude (the Copilot session timed out) and are marked in `docs/trace-log.md`.

## Known Limitations
- Only `package.json` and `README.md` facts are supported; others render `Not Found`.
- GitHub MCP needs a token entered at first start.
- No live Jira/Confluence write in CI.

## Reviewer Checklist
- [ ] `npm test` passes locally (expect 34/34)
- [ ] `npm run sync:self` produces `TECHNICAL_PROFILE.md`
- [ ] No secrets in the diff (hook `secret-guard.sh` clean)
- [ ] `docs/` matches the code (hook `doc-drift-check.sh` clean)
- [ ] Not Found cases covered by tests

## Skills applied
- pr-description-writer: five required sections in order, written only from facts checked in `docs/verification-report.md`.
- repo-fact-verifier: test counts, field counts, file counts and error messages were verified against the repository before being written here.
