# Design Review - SCRUM-1

## Findings (risk, gap, severity)

| ID | Finding | Severity | Review result |
|---|---|---|---|
| DR-1 | The initial architecture's risk table left behavior for non-package source read failures as pending, although approved FR-3 requires unreadable facts to resolve to `Not Found`. This created inconsistent error semantics for source facts versus operational I/O. | Medium | Corrected the architecture wording: permitted fact-source read failures make the affected facts unavailable and render as `Not Found`; template-read and output-write failures remain operational errors. |
| DR-2 | AC-4 calls for a JSON error when required CLI arguments are missing but does not specify the error object's exact shape or whether errors are emitted to stdout or stderr. | Low | Keep unspecified; do not invent a schema in the design. Implementation should remain machine-readable and meet the minimum approved AC; a more specific contract is [pending] if callers need it. |
| DR-3 | FR-2 names the source categories but does not enumerate the exact known entrypoint filenames or define how multiple candidates are selected. | Medium | Source allowlist and selection policy must be explicit and testable before implementation; do not infer candidates from repository layout. Resolved by user clarification: root-relative priority is `backend/src/server.js`, `src/index.js`, `index.js`, `server.js`, `app.js`; existence-check only, report first existing path, never read or execute it, no walking/other names, and otherwise `Not Found`. |
| DR-4 | AC-1 assumes valid repository/template/output paths, while error behavior for a missing/unreadable repository directory or template is not stated in the approved acceptance criteria. | Medium | Treat these as operational errors rather than missing facts, but the precise user-facing message is [pending]. No new message text is specified. |
| DR-5 | AC-2 gives a broad Not Found rule but does not explicitly require per-placeholder negative-path coverage; the not-found-policy skill expects a Not Found case per placeholder. | Medium | Test design must include a verified Not Found case for each placeholder, alongside successful fact extraction; track this as a verification requirement. |
| DR-6 | AC-7 fixes self-sync output at 8 / 15 fields. If repository facts or the manifest change, this expectation could drift. | Low | Preserve the explicitly approved baseline for this story and verify it against the self-sync result; any changed count needs user-approved requirements revision, not a silent adjustment. |

## Decisions Agreed

- Keep the product local-only, with no network calls, remote publishing, or credential requirement (NFR-1; approved intake).
- Use only explicitly permitted repository sources; all unsupported or unavailable facts are the literal `Not Found`, never inferred (FR-2 and FR-3).
- Maintain the approved CLI contract, JSON success fields, template overwrite protection, and self-sync expectation (FR-1, FR-4, FR-5, FR-6; AC-1 through AC-8).
- Do not invent a JSON error schema, entrypoint candidate list, or specific missing-template error message where the approved requirements do not define one; retain those gaps as [pending].

## Architecture Changes Made

- Updated `docs/architecture.md` to remove the pending behavior for permitted fact-source read failures and distinguish it from template-read/output-write failures. Source read failure now follows FR-3 and the Not Found policy; template and output I/O failures remain operational errors.
- No other architecture changes made. DR-3 is resolved by the approved user clarification and now recorded in requirements and architecture. DR-2/DR-4 remain intentionally limited to the approved minimum; their unspecified details must not be filled by assumptions.

## Skills applied

- not-found-policy: Checked for consistency between FR-3 and the architecture's handling of missing, malformed, and unreadable fact sources; identified DR-1 and aligned the architecture with the exact `Not Found` rule.
- repo-fact-verifier: not applicable because this design review does not validate individual generated facts against repository files; no facts were inferred or added.
- code-review-checklist: not applicable because this phase reviews design artifacts, not implementation code; the seven-area code review is reserved for the later review stage.
