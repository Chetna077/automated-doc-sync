# Requirements - SCRUM-1

## Story

As a developer or tech lead, I want a local CLI to fill a project's technical profile from verified repository facts, so that documentation takes less time to maintain and is less likely to be stale or incorrect. The CLI may use only `package.json`, `README.md`, and known entrypoint files; it must render any unverifiable fact as the exact text `Not Found` and must never guess. This scope and behavior are based on the approved SCRUM-1 intake.

## Functional Requirements

- **FR-1 - Render a template to a local output file.** Accept `<repoPath> <templatePath> <outputPath>` and replace the template's `{{Placeholder}}` tokens with the resolved values. On success, write Markdown to the requested output path, print `<found> / <total> fields found. Wrote <outputPath>`, and exit 0. (Acceptance criteria: AC-1; configured CLI command in `config/app-profile.yml`; CLI wiring in `src/index.js`; rendering module in `src/templateEngine.js`.)
- **FR-2 - Read only permitted local sources.** Resolve facts only from `package.json` and `README.md`, plus existence-only checks of these root-relative entrypoint candidates in priority order: `backend/src/server.js`, `src/index.js`, `index.js`, `server.js`, `app.js`. Select only the first existing candidate as `Entry_Points`; if none exists, the value is exactly `Not Found`. Never read or execute candidate contents, inspect other filenames, or walk directories. Do not infer facts from naming or conventions. (`src/scanner.js`; approved user clarification.)
- **FR-3 - Represent absent or unverifiable facts honestly.** For missing, malformed, unreadable, or unsupported facts, render the exact value `Not Found`; a missing or invalid `package.json` must not crash the CLI, and the command exits 0 with affected fields marked `Not Found`. (Acceptance criteria: AC-2, AC-6; `src/factMapper.js` is the configured mapping module.)
- **FR-4 - Provide structured JSON output.** When `--json` is supplied, emit one JSON object with `status`, `outputPath`, `fields: { found, total }`, and the rendered `document`. (Acceptance criterion: AC-3; `src/index.js` is the configured CLI wiring module.)
- **FR-5 - Validate required arguments and protect the template input.** If any of the three required arguments is missing, print usage and exit 1; in JSON mode return a JSON error. If template and output resolve to the same path, do not write, report `Output path must differ from the template path: <templatePath>`, and exit 1. (Acceptance criteria: AC-4, AC-5; path-protection rule in `.github/instructions/security.instructions.md`; `src/index.js` is the configured CLI wiring module.)
- **FR-6 - Support the documented self-sync workflow.** `npm run sync:self` must generate `TECHNICAL_PROFILE.md` with 8 of 15 fields found. (Acceptance criterion: AC-7; command is configured in `config/app-profile.yml`.)

## Non-Functional Requirements

- **NFR-1 - Local-only operation.** Application operation must not require network access, credentials, or remote service calls. (Approved intake scope; local CLI command in `config/app-profile.yml`.)
- **NFR-2 - No runtime dependencies; supported runtime.** Keep runtime dependencies at zero and support Node.js >=18. (`config/app-profile.yml`.)
- **NFR-3 - Verifiable behavior.** `npm test` must complete with 34 tests passing and zero failures as stated in the approved intake; all SDLC documents must include a `## Skills applied` section. (Acceptance criterion: AC-8; test command in `config/app-profile.yml`; documentation rule in `.github/instructions/docs.instructions.md`.)

## Open Questions

- None identified from the approved intake. No implementation or external publishing authorization is implied by this requirements approval.

## Traceability

Jira: [SCRUM-1](https://chetnadeshwal24.atlassian.net/browse/SCRUM-1) - Confluence: Not Found (no Confluence source was provided or required for intake).

### Acceptance Criteria

- **AC-1:** With valid repository, Markdown template, and output paths, write the rendered output and print `<found> / <total> fields found. Wrote <outputPath>`; exit 0.
- **AC-2:** Package and README facts come only from `package.json` and `README.md`. `Entry_Points` is only the first existing candidate in the approved priority list (`backend/src/server.js`, `src/index.js`, `index.js`, `server.js`, `app.js`), checked for existence only; candidate contents are never read or executed. No candidate or any other unverifiable fact is exactly `Not Found`.
- **AC-3:** `--json` emits one object shaped as `{status, outputPath, fields: {found, total}, document}`.
- **AC-4:** Missing any required argument prints usage and exits 1; `--json` returns a JSON error.
- **AC-5:** Identical template and output paths are rejected with `Output path must differ from the template path: <templatePath>`; the template is not overwritten and the CLI exits 1.
- **AC-6:** Missing or invalid `package.json` does not crash; affected fields are `Not Found`, and the CLI exits 0.
- **AC-7:** `npm run sync:self` generates `TECHNICAL_PROFILE.md` with 8 / 15 fields found.
- **AC-8:** `npm test` passes 34 tests with 0 failures; the project has no runtime dependencies and requires Node.js >=18.

## Skills applied

- not-found-policy: Confirmed that absent, malformed, unreadable, or unsupported facts must resolve to the literal `Not Found`, with no inference; recorded that requirement in FR-2 and FR-3.
- repo-fact-verifier: not applicable because this requirements-only phase does not add or accept implementation facts; app facts were taken from `config/app-profile.yml`, and behavior from the approved intake.
