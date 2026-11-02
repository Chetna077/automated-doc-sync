# SCRUM-1: Verified-fact CLI and approved pipeline scope

## Summary
This change documents and validates SCRUM-1's local, dependency-free technical-profile CLI contract: facts come only from the approved local sources, and unverifiable values render as `Not Found`. The latest build adds a CLI regression test for malformed `package.json`; the existing application modules already met the approved behavior, so no production-module edits were needed in this run.

## Changes Made
- `docs/requirements.md`, `docs/architecture.md`, `docs/design-review.md`, `docs/impl-plan.md` - record the approved requirements, architecture boundaries, resolved scope, and dependency-ordered plan.
- `test/cli.test.js` - exercise malformed `package.json` through the CLI; assert exit 0, 0 / 1 fields found, and literal `Not Found` output.
- `TECHNICAL_PROFILE.md` - refreshed self-sync output for the verification date.
- `docs/handoff.md`, `docs/code-review.md`, `docs/verification-report.md` - record build, seven-area review, verification evidence, limitations, and skill evidence.
- `CHANGELOG.md` - proposed Unreleased entry for the clarified scope, regression coverage, and refreshed verification evidence.

## Test Evidence
`npm test` (real output summary):
```
> automated-doc-sync@1.0.0 test
> node --test test/*.test.js

# tests 40
# pass 40
# fail 0
# cancelled 0
# skipped 0
# todo 0
```

`npm run sync:self` output: `8 / 15 fields found. Wrote TECHNICAL_PROFILE.md`. Full per-field source checks: `docs/verification-report.md`.

## Known Limitations
- `npm audit` was inconclusive (ENOLOCK): no lockfile exists; the manifest declares no runtime or development dependencies.
- Facts unsupported by the approved sources remain `Not Found`; only `package.json`, `README.md`, and existence-only checks of the five ordered entrypoint candidates are in scope. No network, remote calls, or unapproved Jira/Confluence/GitHub/PR/commit actions are included.
- Other invalid/missing path behavior and unspecified JSON-error details remain outside the approved contract.

## Reviewer Checklist
- [ ] `npm test` passes locally (40 passed, 0 failed, 0 skipped)
- [ ] `npm run sync:self` reports 8 / 15 fields found
- [ ] No secrets in the diff
- [ ] `docs/` aligns with the approved scope and implementation
- [ ] Not Found and malformed package cases are covered
- [ ] External writes and commits remain pending separate explicit approval

## Skills applied

- pr-description-writer: Checked all five required PR sections and grounded changes, test evidence, and limitations in the reviewed local artifacts; prepared a proposal only, not a posted PR.
