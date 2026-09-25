# Implementation Plan — Automated Documentation Sync

Ordered by dependency. Nothing here is parallelizable in practice since it's
one person working through it, but the ordering matters for anyone else
picking this up mid-way.

1. **`templateEngine.js`** — `parseTemplate` and `renderTemplate`.
   No dependency on anything else in the project. Fully testable on its own
   with hand-written strings, no filesystem or fixture repo needed.

2. **`templates/technical-app-manifest.md`** — the actual template file,
   reusing the same seven-section structure (Executive Summary, System
   Architecture & Tech Stack, Integration & Dependencies, Technical
   Configuration, Quality & Compliance, Documentation & Resources,
   Deployment Status) already proven out in the EliteA capstone.
   Depends on (1) only in the sense that the placeholder syntax has to match
   what `parseTemplate` expects.

3. **`test/fixtures/sample-repo/`** — a small, fake repo (its own
   `package.json`, `README.md`, a `src/index.js`) with known, hand-picked
   values. Blocks step 4 — you can't write a meaningful scanner test without
   something to scan that isn't a moving target.

4. **`scanner.js`** — `scanRepo`. Depends on (3) for its tests. Implemented
   and tested against the fixture repo, not against this project's own
   source tree.

5. **`factMapper.js`** — `mapFacts`. Depends on (2) for the real placeholder
   names it needs rules for, and (4) for the shape of `facts` it receives.
   This is the biggest single piece of actual "business logic."

6. **`index.js`** — wires (1), (4), and (5) together behind the CLI. Blocked
   until all three exist; there's nothing to wire before then.

7. **Integration test** — run the real CLI end-to-end against the fixture
   repo and the real template, assert on the rendered output. Depends on
   everything above existing and working in isolation first.

8. **CI workflow** — `npm test` on push/PR. Trivial once (7) passes locally;
   no reason to wire this up earlier and watch it fail on unfinished code.

9. **Self-scan demo** — run the finished tool against *this* repo and commit
   the result as `TECHNICAL_PROFILE.md`, so the README can point at a real,
   live example instead of just describing one.

## Not blocked, but deferred

- Publishing the output anywhere other than a local file (out of scope per
  `requirements.md`).
- A recursive/glob-based entry-point search (accepted limitation, see
  `design-review.md` finding #6).
