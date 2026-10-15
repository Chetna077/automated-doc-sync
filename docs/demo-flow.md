# Demo Flow

A live walkthrough for showing this to a reviewer, mapped to the capstone's
8 steps.

| Step | What to show | Where |
|---|---|---|
| 1. Requirements | Open it, point at the Copilot Q&A section — shows the scope was negotiated, not assumed. | [docs/requirements.md](requirements.md) |
| 2. Architecture | The four-module diagram. Say out loud: "scanner reads facts, mapper decides what they mean, engine just does string substitution." | [docs/architecture.md](architecture.md) |
| 3. Design Review | The findings table. Point at #1 and #3 — a real crash bug and a rejected "clever" design, both caught before code existed. | [docs/design-review.md](design-review.md) |
| 4. Implementation Plan | Dependency ordering — why the fixture repo had to exist before the scanner could be tested. | [docs/impl-plan.md](impl-plan.md) |
| 5. Implementation | `src/factMapper.js` — the RULES table. Deliberately boring/explicit; say why. | [src/](../src) |
| 6. Review | The checklist table. Point at the DRY finding — it's the same bug the design review didn't catch, found later, at a different layer. | [docs/code-review.md](code-review.md) |
| 7. Verify | Run it live: | see below |
| 8. PR | Open the real PR, walk through the 5 required sections. | [PR #1](https://github.com/Chetna077/automated-doc-sync/pull/1) |

## Live commands for step 7

```powershell
npm test
npm run sync:self
```

Then open `TECHNICAL_PROFILE.md` and point at two things in the same
screen: a real value (`Runtime: Node.js >=18`, pulled from `package.json`)
sitting right next to an honest `Not Found` (`Primary Database` — this repo
has none). That contrast is the entire point of the capstone.

## One-line pitch, if asked "why does this matter"

Stale documentation is a trust problem, not just an inconvenience — once
someone finds one wrong line, they stop trusting all of it. This tool
either tells you the truth or tells you it doesn't know; it never tells you
something false.
