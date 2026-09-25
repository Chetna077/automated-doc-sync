# Architecture — Automated Documentation Sync

## Overview

Four small, single-purpose modules chained together by the CLI entry point.
No class hierarchy, no plugin system — the whole point of this tool is that
someone can read `src/` in five minutes and trust what it's doing.

```
templatePath ──┐
               ▼
        parseTemplate()  ──► { text, placeholders: ["App_Name", "Tech_Stack", ...] }
                                        │
repoPath ──────┐                       │
               ▼                       ▼
          scanRepo()   ──►  facts   mapFacts()  ──►  { App_Name: "...", Tech_Stack: "Not Found", ... }
        (reads package.json,                                  │
         README.md, test config,                              ▼
         entry-point files)                              renderTemplate()
                                                                │
                                                                ▼
                                                        outputPath (Markdown)
```

## Components

### `templateEngine.js`
- `parseTemplate(text)` — finds every `{{Token}}` in the template, returns
  the raw text plus the ordered, de-duplicated list of token names.
- `renderTemplate(text, values)` — substitutes each `{{Token}}` with
  `values[Token]`, or the literal string `Not Found` if the key is absent
  from `values` altogether. Rendering never throws on a missing key — that
  case is the tool's whole reason for existing, not an error condition.

### `scanner.js`
- `scanRepo(repoPath)` — reads what's actually on disk and returns a plain
  `facts` object: parsed `package.json` fields (name, engines, dependencies,
  devDependencies, scripts), whether a `README.md` exists and its first
  paragraph, and which of a short list of known entry-point files exist
  (`src/index.js`, `backend/src/server.js`, etc.). It does not know anything
  about the template — it just reports what it found.
- Missing files are not errors. A repo without a `README.md` just yields
  `facts.readme = null`; the caller decides what that means for a given
  placeholder.
- A `package.json` that exists but fails to parse (invalid JSON) is treated
  the same as a missing one: every fact that would have come from it is
  simply absent. The scanner never throws because a file it read wasn't
  well-formed — that's exactly the kind of thing this tool should report as
  `Not Found`, not crash on.

### `factMapper.js`
- `mapFacts(facts, placeholders)` — the only place that knows how a template
  placeholder name (e.g. `Primary_Database`) maps to raw scanner output
  (e.g. "does `package.json` list `sqlite3`, `pg`, `mongoose`, ...?"). Each
  placeholder has its own small extraction rule; a placeholder with no rule,
  or a rule that finds nothing, resolves to `Not Found`.
- This is deliberately the ugliest, most repetitive-looking file in the
  project. An earlier draft tried to make this generic — fuzzy-matching
  placeholder names against `facts` by reflection — and it was rejected in
  review (`design-review.md`) precisely because a wrong answer gave no clue
  which rule produced it. Fact-to-placeholder mapping is a lookup table by
  nature, one line per placeholder, not an abstraction problem.

### `index.js`
- The CLI entry point. Reads the three positional args, wires the three
  functions above together, writes the result to `outputPath`, and prints a
  one-line summary (`X / Y fields found`) to stdout. No other logic lives
  here.

## Data flow

1. `parseTemplate` gives us the *shape* we need to fill (the placeholder
   list) — independent of any specific repo.
2. `scanRepo` gives us the *facts* — independent of any specific template.
3. `mapFacts` is the only step that couples the two: for each placeholder,
   look up its extraction rule and apply it to `facts`.
4. `renderTemplate` does pure string substitution — it has no opinion about
   where a value came from.

## Why this shape

Keeping "read the repo" and "decide what a placeholder means" as two
separate modules means the scanner can be reused if we ever add a second
template with a different placeholder set, and the mapping table can be
unit-tested against a fixed `facts` object without touching the filesystem
at all.
