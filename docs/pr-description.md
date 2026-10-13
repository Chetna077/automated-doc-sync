# SCRUM-1: Automated Documentation Sync CLI + Copilot agentic pipeline

## Summary
Adds a zero-dependency Node.js CLI that fills `{{Placeholder}}` templates from facts verified in a real repository (`package.json`, `README.md` and known entrypoint files) and writes the exact text `Not Found` for anything it cannot verify. The work was delivered through a GitHub Copilot agentic SDLC pipeline (agents, prompt, instructions, skills, hooks, MCP) with a human approval at every stage.

## Changes Made
- `src/templateEngine.js`, `scanner.js`, `factMapper.js`, `index.js`: the four-module CLI, including the `--json` flag.
- `src/scanner.js` (SCRUM-1): a missing or unreadable README or `package.json` returns no fact, so the field renders `Not Found` instead of crashing. Entrypoint lookup is an ordered, existence-only allowlist: `backend/src/server.js`, `src/index.js`, `index.js`, `server.js`, `app.js`.
- `src/index.js` and `test/overwrite-guard.test.js`: the tool refuses to write over its own template.
- `test/*.test.js` and fixtures: 34 tests, including Not Found, broken-JSON, unreadable-README and entrypoint-priority cases.
- `.github/agents/*` (7, RISE format, with handoff buttons so a human approves each stage) and `.github/prompts/run-pipeline.prompt.md`.
- `.github/copilot-instructions.md`, `.github/instructions/*` (3) and `.github/skills/*` (5). SDLC documents end with a `## Skills applied` section.
- `.github/hooks/hooks.json` in the Copilot hook format, plus `scripts/run-hook.js`, a launcher that works on Windows and never blocks on a broken hook. Hooks: before = secret guard, after = doc-drift check, stop = run tests and check `## Skills applied`, session start = validate skills.
- `.vscode/mcp.json`: Atlassian (v2 endpoint) and GitHub MCP servers. `config/app-profile.yml`: app facts.
- `docs/`: requirements, architecture, design review, implementation plan, code review, verification report, trace log, handoff, demo flow.
- `CHANGELOG.md` and `.github/workflows/ci.yml` (CI also validates skill wiring).

## Test Evidence
```
$ npm test
# tests 34
# pass 34
# fail 0
# skipped 0
$ npm run sync:self
8 / 15 fields found. Wrote TECHNICAL_PROFILE.md
```
Details and the list of facts checked: `docs/verification-report.md`. Review findings: `docs/code-review.md`.

## Known Limitations
- Only `package.json`, `README.md` and the five known entrypoint files are read. Other facts render `Not Found` (7 of the 15 fields in the self-scan).
- The wording of the missing-template and missing-repo errors is not fixed by the requirements (DR-4). The JSON error shape is limited to the minimum in AC-4 (DR-2).
- Without Git Bash installed, the hook launcher skips the hooks with a warning, so the secret guard is off on that machine (R-2).
- `doc-drift-check.sh` uses GNU `find -printf`, so it does not work on macOS (R-4).
- GitHub MCP needs a token entered at first start. No live Jira or Confluence write runs in CI.

## Reviewer Checklist
- [ ] `npm test` passes locally (expect 34 of 34, 0 skipped)
- [ ] `npm run sync:self` reports 8 / 15 fields found
- [ ] No secrets in the diff (`secret-guard.sh` clean)
- [ ] `docs/` matches the code (`doc-drift-check.sh` clean)
- [ ] Every SDLC document ends with `## Skills applied`
- [ ] Not Found cases are covered by tests
- [ ] `docs/trace-log.md` sign-offs match the approvals you saw

## Skills applied
- pr-description-writer: five required sections in order, written only from facts checked in `docs/verification-report.md`.
- repo-fact-verifier: test counts, field counts, file counts and error messages were verified against the repository before being written here.
