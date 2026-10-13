# Verification Report — SCRUM-1

## Verification scope

Verified the generated `TECHNICAL_PROFILE.md` against the authoritative
repository sources `package.json`, `README.md`, and the presence of the
allowlisted entrypoint file. Missing or unsupported facts remain exactly
`Not Found`.

## Repository fact check

| Profile field | Generated value | Authoritative source | Result |
|---|---|---|---|
| Application Name | `automated-doc-sync` | `package.json` → `name` | Exact match after trimming |
| Description | First README paragraph | `README.md` → first paragraph | Matches paragraph text after line whitespace is trimmed and joined |
| Runtime | `Node.js >=18` | `package.json` → `engines.node` (`>=18`) | Matches mapped format |
| Entry Points | `src/index.js` | `src/index.js` file exists; first existing allowlisted candidate | Verified from file presence |
| Dependencies | `Not Found` | `package.json` → `dependencies` absent | Correctly absent |
| Dev Dependencies | `Not Found` | `package.json` → `devDependencies` absent | Correctly absent |
| Build Tool | `Not Found` | `package.json` → `scripts.build` absent | Correctly absent |
| npm Scripts | `test: node --test test/*.test.js, sync:self: node src/index.js . templates/technical-app-manifest.md TECHNICAL_PROFILE.md` | `package.json` → `scripts` | Commands match after trimming |
| Frameworks | `Not Found` | `package.json` dependencies/devDependencies; no recognized framework package | Correctly absent |
| Primary Database | `Not Found` | `package.json` dependencies/devDependencies; no recognized database package | Correctly absent |
| Test Framework | `Not Found` | `package.json` dependencies/devDependencies; no recognized third-party test framework | Correctly absent |
| Maintainers | `Not Found` | `package.json` → `author` absent | Correctly absent |
| Version | `1.0.0` | `package.json` → `version` | Exact match after trimming |
| README | First README paragraph | `README.md` → first paragraph | Matches paragraph text after line whitespace is trimmed and joined |
| Last Synced | `2026-10-13` | Generated at sync time by `src/index.js` | Present; dynamic value |

The self-sync command resolved 8 of the template's 15 placeholders. The
remaining seven are correctly marked `Not Found`; no profile value was
accepted based on inference from naming or convention.

## Regression checks for approved review fixes

- Unsupported prototype-property placeholders render as `Not Found`.
- Empty and whitespace-only package metadata renders as `Not Found` and is not
  counted as found.
- Directories named like entrypoint candidates are skipped.
- Writing to a hard link of the template is refused without changing either
  path's contents.

## Test evidence

Command: `npm test`

```
ℹ tests 40
ℹ suites 0
ℹ pass 40
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

Self-sync command: `npm run sync:self`

```
8 / 15 fields found. Wrote TECHNICAL_PROFILE.md
```

## Conclusion

The generated profile is consistent with the current repository facts.
Missing or unsupported information is represented as `Not Found`, and the
full test suite passes.

## Skills applied

- repo-fact-verifier: checked each accepted profile value against `package.json`, `README.md`, or allowlisted file presence and recorded its source above.
- not-found-policy: confirmed unavailable and unsupported facts remain exactly `Not Found`; regression checks cover missing and blank metadata.
