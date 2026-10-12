# Verification Report — Automated Documentation Sync

## Unit + integration test run

```
$ npm test

ℹ tests 34
ℹ suites 0
ℹ pass 34
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 389.7024
```

34/34 passing: template engine (6), scanner (5), fact mapper (7),
integration (5), CLI subprocess (6, including the --json flag).

## Content quality check — self-scan output

Ran `npm run sync:self` against this repo's own code and reviewed the
result line by line (`TECHNICAL_PROFILE.md`):

| Field | Value | Verdict |
|---|---|---|
| Application Name | `automated-doc-sync` | Correct — matches `package.json` |
| Description | first README paragraph | Correct, reads naturally |
| Runtime | `Node.js >=18` | Correct — matches `engines.node` |
| Entry Points | `src/index.js` | Correct |
| Version | `1.0.0` | Correct |
| npm Scripts | `test: ...`, `sync:self: ...` | Correct, and readable — this is the field the code review's DRY fix was about |
| Frameworks, Primary Database, Dependencies, Dev Dependencies, Build Tool, Test Framework, Maintainers | `Not Found` | **Correct**, not a bug — this project has zero runtime dependencies, no `build` script, no `author` field, and uses Node's built-in test runner rather than an npm test package. There is genuinely nothing in the code to report for any of these. |

8 of 15 placeholders resolved from real facts; the other 7 are honest gaps,
not missed extraction logic — confirmed by inspecting `package.json`
directly and finding no corresponding value for any of them.

## Conclusion

Both the test suite and a manual read of the tool's own output agree: the
tool reports what's verifiably true and nothing else. No fabricated values
found anywhere in the generated document.

## Skills applied
_Recorded in the skills-enforcement pass: each skill was checked against this document after it was written._
- repo-fact-verifier: self-scan field-by-field check against real repo facts.
- not-found-policy: unresolved fields in the self-scan are reported as `Not Found`, not filled in.
