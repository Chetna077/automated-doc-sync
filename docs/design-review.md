# Design Review - SCRUM-1

## Findings (risk, gap, severity)

| ID | Finding | Severity | Review result |
|---|---|---|---|
| DR-1 | AC-4 requires a JSON error for missing required arguments, but does not define the exact error-object schema or output stream. | Low | Accepted specification gap. Keep the error machine-readable and include usage information as required; do not invent a schema or expand the approved contract without clarification. |
| DR-2 | Behavior for invalid or missing paths beyond the explicitly stated required-argument, same-template/output, and missing/invalid `package.json` cases is not defined. | Low | Resolved by intake clarification: those other cases are out of scope. Do not silently add behavioral requirements. Treat template read/output write failures as operational errors as already stated in the architecture, without inventing exact messages. |
| DR-3 | AC-8 specifies exactly 40 passing tests. A fixed count can become brittle as test coverage changes, and must not be met by omitting meaningful coverage. | Medium | Accepted as the explicit story requirement. Keep the full relevant suite meaningful and report the real test output; any change to the required count needs a requirements revision and approval. |
| DR-4 | Entry-point discovery could expand into repository scanning or accidental reads of candidate contents if implementation boundaries drift. | Medium | Architecture and requirements explicitly constrain candidates to the five ordered paths, existence checks only, no candidate reads/execution, no directory walking, and `Not Found` when none exists. Preserve these as testable guardrails. |
| DR-5 | The requested supporting `.github` and `docs/` changes could be mistaken for permission to publish externally. | Low | Resolved by approved scope: local repository artifacts only; no Jira, Confluence, GitHub posting, PR opening, or commits without separate explicit approval. |

## Decisions Agreed

- Preserve the approved scope: `src/index.js`, `src/scanner.js`, `src/factMapper.js`, `src/templateEngine.js`, `--json`, exactly 40 passing tests, self-sync generation of `TECHNICAL_PROFILE.md` with 8 of 15 fields, `.github` agents/skills/hooks, and `docs/` artifacts.
- Preserve exclusions: no network or remote calls; no source reads beyond `package.json`, `README.md`, and the existence-only checks of the five named entrypoint candidates; no new runtime dependency; no publishing or Jira/PR writes without explicit approval.
- Missing required CLI arguments print usage and exit 1, with a JSON error in `--json` mode. Identical resolved template/output paths are rejected before writing and exit 1. Missing or invalid `package.json` does not crash and yields `Not Found` for affected facts with exit 0. Other invalid/missing path behavior is out of scope.
- Keep unverifiable facts as the exact `Not Found` string. Do not infer repository facts, read entrypoint contents, or expand the allowlist.
- Do not invent a JSON error schema or exact operational error messages where the approved criteria leave them unspecified.

## Architecture Changes Made

- No new architecture changes are required by this review. `docs/architecture.md` already captures the approved source allowlist and existence-only entrypoint checks, the `Not Found` fallback, local-only flow, same-path protection, out-of-scope path cases, and the 40-test / 8-of-15 self-sync verification baseline.
- All findings are either bounded accepted specification gaps or guardrails already addressed by the approved requirements and architecture; none blocks proceeding to the implementation plan.

## Skills applied

- not-found-policy: Checked that the design keeps unverifiable facts at the exact `Not Found` value and does not permit inference or entrypoint-content reads; confirmed the allowlist and fallback are explicit.
- code-review-checklist: not applicable because this is a design review, not the implementation review stage; the seven-area code review is reserved for that later gate.
