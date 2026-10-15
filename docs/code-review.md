# Code Review — SCRUM-1

**Phase:** Review
**Scope:** Current implementation and tests against [`requirements.md`](requirements.md); worktree had no pre-existing changes at review start.
**Review date:** 2026-10-13

The approved follow-up fixes for C-1, C-2, C-3, and S-1 are implemented with regression tests. Line references below point to the current repository state.

## Correctness

- **Finding C-1 — Special placeholder names can crash or fabricate a value. Severity: medium. Disposition: fixed.** `mapFacts` now accepts only own `RULES` keys, and `renderTemplate` treats inherited names as absent (`src/factMapper.js`, `src/templateEngine.js`). Regression coverage exercises `__proto__`, `constructor`, and `toString`, requiring each to render as `Not Found` (`test/factMapper.test.js`).
- **Finding C-2 — Empty metadata is counted as found although rendered as `Not Found`. Severity: low. Disposition: fixed.** `mapFacts` omits empty and whitespace-only strings, the renderer uses the same blank-value fallback, and `run` excludes blank values from `foundCount` (`src/factMapper.js`, `src/templateEngine.js`, `src/index.js`). The integration regression verifies empty package name and whitespace-only author render as `Not Found` and yield `foundCount === 0` (`test/integration.test.js`).
- **Finding C-3 — A directory at an entrypoint candidate path is reported as an entrypoint. Severity: low. Disposition: fixed.** The scanner now uses `statSync().isFile()` without reading candidate contents, continuing through the allowlist when a candidate is not a regular file (`src/scanner.js`). Regression coverage verifies a directory named `backend/src/server.js` is skipped in favor of the next regular candidate (`test/scanner.test.js`).

## Security

- **Finding S-1 — Template overwrite protection is bypassable when output is another hard link to the template. Severity: medium. Disposition: fixed.** `run` now compares the device and inode of existing paths after the resolved-path check, refusing to write through a hard link or symlink to the template (`src/index.js`). Regression coverage creates a hard link and confirms both paths retain the original contents after the refusal (`test/overwrite-guard.test.js`). No shell interpolation or network calls were found in the reviewed application modules (`src/index.js`, `src/scanner.js`, `src/factMapper.js`, `src/templateEngine.js`).

## Error Handling

- **No finding. Severity: low. Disposition: accepted risk / no change.** Missing or malformed package metadata and unreadable README input degrade to unavailable facts (`src/scanner.js:15-45`); invalid repo/template paths produce clear errors (`src/index.js:14-26`). Tests exercise malformed package metadata, empty repositories, an unreadable README represented by a directory, missing repo/template paths, and JSON CLI errors (`test/scanner.test.js:51-71`, `test/integration.test.js:58-63`, `test/cli.test.js:42-68`). Operational read/write exceptions are caught at the CLI boundary and emitted as a message or JSON error (`src/index.js:71-81`).

## Test Coverage

- **No finding. Severity: low. Disposition: accepted risk / no change.** `npm test` passed **39 tests, 0 failures, 0 skipped**. Test coverage includes successful CLI and integration paths (`test/cli.test.js`, `test/integration.test.js`), missing/unsupported facts, malformed package data, literal `Not Found` fallbacks, and regression cases for C-1, C-2, C-3, and S-1 (`test/factMapper.test.js`, `test/scanner.test.js`, `test/overwrite-guard.test.js`).

## Code Clarity

- **No finding. Severity: low. Disposition: accepted risk / no change.** The implementation keeps scanning, fact mapping, rendering, and CLI orchestration in separate modules (`src/scanner.js:58-67`, `src/factMapper.js:76-95`, `src/templateEngine.js:5-35`, `src/index.js:14-84`); intent and the ordered entrypoint policy are documented in code comments.

## DRY

- **No finding. Severity: low. Disposition: accepted risk / no change.** Dependency/script list formatting is shared through `formatKeyValueList` (`src/factMapper.js:38-47`), while `RULES` remains explicit per the documented mapping contract (`src/factMapper.js:49-74`). The two README-derived fields intentionally reuse the same scanned fact (`src/factMapper.js:55, 71`); no material duplicated logic warrants abstraction in this scope.

## Dependency Safety

- **Finding D-1 — Dependency audit could not run against a lockfile. Severity: low. Disposition: accepted risk.** `npm audit` exited with `ENOLOCK` because the repository has no `package-lock.json` or `npm-shrinkwrap.json`. `package.json` declares no `dependencies` or `devDependencies` and requires Node.js `>=18`, so there are no declared third-party packages in the manifest to flag (`package.json:1-17`). The audit result is **inconclusive**, not a clean vulnerability audit; rerun if a dependency lockfile is introduced.

## Fix status

- C-1, C-2, C-3 and S-1: fixed, each with a regression test (approved by Chetna on 2026-10-13).
- Found during verification and fixed: the found-count read inherited properties, so `{{constructor}}` counted as found (`src/index.js`).
- D-1: accepted. Test result after fixes: 40 tests, 40 pass.

## Known Limitations

- D-1: `npm audit` cannot assess a dependency tree without a lockfile; the current manifest declares no external packages.

## Skills applied

- code-review-checklist: Reviewed correctness, security, error handling, test coverage, code clarity, DRY, and dependency safety; documented concrete findings and dispositions above, ran `npm test` and `npm audit`.
- not-found-policy: Checked mapper, renderer, tests, and requirement that missing, unsupported, malformed, or unreadable facts become literal `Not Found`; confirmed shared fallback coverage and identified C-1 as an unsupported-placeholder exception.
- not-found-policy (approved fixes): verified prototype-property placeholders and empty metadata now render as `Not Found`; added focused regression coverage.