# automated-doc-sync

A small CLI that keeps a repository's technical profile documentation in
sync with its actual code. Point it at a repo and a template, and it fills
in every placeholder it can verify from the code — and marks anything it
can't verify as `Not Found` rather than guessing.

Built as a capstone exercise in running a full AI-assisted SDLC: every
phase — requirements, architecture, design review, implementation plan,
code review, and verification — has a real artifact under `docs/`.

## Quick start

```
npm test
npm run sync:self
```

`npm run sync:self` runs the tool against this repo and writes
[`TECHNICAL_PROFILE.md`](TECHNICAL_PROFILE.md) — a live example of its own
output.

## Usage

```
node src/index.js <repoPath> <templatePath> <outputPath>
```

- `repoPath` — a local path to the repository to scan.
- `templatePath` — a Markdown file containing `{{Placeholder}}` tokens (see
  [`templates/technical-app-manifest.md`](templates/technical-app-manifest.md)
  for the one this project ships with).
- `outputPath` — where to write the rendered document.

## How it decides what's real

The scanner only reads `package.json`, `README.md`, and a short list of
known entry-point filenames — nothing is inferred from file names, folder
conventions, or guesswork. If a placeholder has no matching fact, the
output says `Not Found`, in the document, not silently or as a warning
buried in a log. See [`docs/requirements.md`](docs/requirements.md) for why
that rule exists and [`docs/architecture.md`](docs/architecture.md) for how
the four modules split the work.

## Project layout

```
src/              templateEngine.js, scanner.js, factMapper.js, index.js
templates/        the placeholder-driven Markdown template
test/             unit + CLI + integration tests, plus fixtures/
docs/             requirements, architecture, design review, plan, code
                  review, verification report — one file per SDLC phase
```

## Deliverable → SDLC phase map

| Phase | Artifact |
|---|---|
| Requirements | [docs/requirements.md](docs/requirements.md) |
| Architecture | [docs/architecture.md](docs/architecture.md) |
| Design Review | [docs/design-review.md](docs/design-review.md) |
| Implementation Plan | [docs/impl-plan.md](docs/impl-plan.md) |
| Implementation | `src/`, `templates/` |
| Code Review | [docs/code-review.md](docs/code-review.md) |
| Verify | [docs/verification-report.md](docs/verification-report.md) |
| PR | opened against `main`, see repository Pull Requests tab |
| Demo walkthrough | [docs/demo-flow.md](docs/demo-flow.md) |
