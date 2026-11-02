# Verification Report - SCRUM-1

<!-- test-count: 40 -->

## Result

**PASS** - verification meets the approved test and self-sync criteria. No external systems or publishing actions were used.

## Commands and real results

- `npm test` - tests 40; pass 40; fail 0; cancelled 0; skipped 0; todo 0.
- `npm run sync:self` - `8 / 15 fields found. Wrote TECHNICAL_PROFILE.md`.
- Template comparison - 17 placeholder occurrences, 15 distinct fields; unresolved placeholder tokens in the generated profile: 0. Found count is by distinct field.
- Runtime and dependency check - `node --version`: v24.19.0; `package.json` engine: `>=18`; no `dependencies` or `devDependencies` keys.

## Generated field verification

Each value was checked against the exact permitted local source. Unsupported or absent values remain the literal Not Found.

| Field | Generated value | Verification source | Verdict |
|---|---|---|---|
| App_Name | automated-doc-sync | package.json / name | Pass - exact match |
| Description | A small CLI that keeps a repository's technical profile documentation in sync with its actual code. Point it at a repo and a template, and it fills in every placeholder it can verify from the code — and marks anything it can't verify as `Not Found` rather than guessing. | README.md / first content paragraph | Pass - matches after trimming and joining paragraph lines |
| Runtime | Node.js >=18 | package.json / engines.node | Pass - exact match |
| Frameworks | Not Found | package.json / dependencies and devDependencies | Pass - no recognized framework package entries |
| Primary_Database | Not Found | package.json / dependencies and devDependencies | Pass - no recognized database package entries |
| Entry_Points | src/index.js | On-disk existence check of approved ordered candidates | Pass - first existing regular-file candidate; contents not read |
| Dependencies | Not Found | package.json / dependencies | Pass - field absent |
| Dev_Dependencies | Not Found | package.json / devDependencies | Pass - field absent |
| Build_Tool | Not Found | package.json / scripts.build | Pass - field absent |
| Scripts | test: node --test test/*.test.js, sync:self: node src/index.js . templates/technical-app-manifest.md TECHNICAL_PROFILE.md | package.json / scripts | Pass - exact match |
| Test_Framework | Not Found | package.json / dependencies and devDependencies | Pass - no recognized test-framework package entry |
| Readme_Summary | A small CLI that keeps a repository's technical profile documentation in sync with its actual code. Point it at a repo and a template, and it fills in every placeholder it can verify from the code — and marks anything it can't verify as `Not Found` rather than guessing. | README.md / first content paragraph | Pass - matches after trimming and joining paragraph lines |
| Maintainers | Not Found | package.json / author | Pass - field absent |
| Version | 1.0.0 | package.json / version | Pass - exact match |
| Last_Synced | 2026-11-02 | Local date inserted by the CLI | Pass - generated sync date, not treated as a repository fact |

## Scope and limitations

- Source policy: read only package.json and README.md; check existence only for the five approved entrypoint candidates in priority order, without reading or executing candidate contents. No network or remote calls are involved.
- Missing or unsupported facts are Not Found; no unresolved template placeholders remain.
- This verification does not infer behavior for other missing/invalid paths and grants no approval for Jira, Confluence, GitHub, PR, commit, or publish actions.

## Skills applied

- repo-fact-verifier: Checked each generated profile value against package.json, README.md, approved on-disk entrypoint existence checks, or the local sync date; absent facts remain Not Found. The table records the source and verdict for all 15 distinct fields.
