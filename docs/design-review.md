# Design Review — Automated Documentation Sync

Reviewer: Copilot Chat, acting as senior reviewer over `architecture.md`.
Author: on the hook for addressing or consciously rejecting each finding.

## Findings

| # | Risk / gap | Severity | Resolution |
|---|---|---|---|
| 1 | `scanRepo` reads `package.json` with `JSON.parse`. A repo with a hand-edited, syntactically broken `package.json` will throw and crash the whole run instead of degrading to `Not Found`. | High | Wrap the parse in try/catch; on failure, treat every `package.json`-derived fact as absent rather than aborting. |
| 2 | NFR3 says output is deterministic, but the template includes a "Last Synced" timestamp. As written, that makes every run's output different, which breaks the "same repo state in, same document out" test from FR4. | Medium | Not a bug — the requirement already carved this out as the one deliberate exception. Made explicit in `requirements.md` and handled in tests by comparing everything **except** the Last Synced line. |
| 3 | `mapFacts` was drafted as a generic "reflect over facts and fuzzy-match placeholder names" function. Reviewer flagged this as the kind of cleverness that's hard to debug when a placeholder resolves to the wrong value for a non-obvious reason. | Medium | Rejected the generic version. Replaced with an explicit table: one entry per placeholder, one line of code to compute it. Slightly more typing, trivially debuggable — you can point at the exact line that produced a wrong answer. |
| 4 | No handling for a template or repo path that doesn't exist. | Medium | `index.js` checks both paths up front and exits with a clear, specific message (`Template not found: <path>`, `Repo not found: <path>`) rather than letting an `ENOENT` bubble up from deep inside the scanner. |
| 5 | If the same `{{Token}}` appears more than once in the template, does it get replaced consistently everywhere? | Low | Yes by construction — `renderTemplate` does a global replace per unique token, not a single first-match replace. Added a test for a template with a repeated placeholder to lock this in. |
| 6 | `scanRepo` walks a fixed, short list of entry-point candidates (`src/index.js`, `backend/src/server.js`, etc.) rather than the whole tree. Reviewer asked: what if a repo's real entry point isn't on that list? | Low, accepted | Correct, and intentional — see NFR2 (no dependency on a real filesystem walker/glob library) and the requirement to stay fast on large repos. The candidate list is easy to extend later; it's not meant to be exhaustive on day one. Documented as a known limitation rather than solved with a recursive walk. |

## Outcome

`architecture.md` was updated after finding #1 and #3: the scanner section
now states explicitly that a malformed `package.json` degrades to missing
facts instead of throwing, and the fact-mapper section explains why the
lookup-table approach was kept over a generic one.

No blocking issues. Proceeding to implementation planning.
