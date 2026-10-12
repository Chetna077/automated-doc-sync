# Requirements — Automated Documentation Sync

## User story

As an engineering team, we want a tool that keeps a repository's technical
profile documentation in sync with the actual codebase, so that the doc
never goes stale and nobody has to manually re-check `package.json` every
time someone asks "what does this service actually run on?".

## Clarifying questions (Copilot Chat session)

**Copilot:** Should this write directly to Confluence/GitHub, or just produce
a file?

**Answer:** Just a file for now (`TECHNICAL_PROFILE.md`), committed alongside
the code. Publishing it somewhere else is a follow-up, not this capstone.

**Copilot:** What happens when a fact isn't in the code at all — e.g.
"Service Owner" or "On-Call Rotation"? Those aren't things a scanner can
read from source.

**Answer:** Mark it `Not Found`. Never guess. This is the one rule the whole
tool exists to enforce — a stale or fabricated doc is worse than an honest
gap.

**Copilot:** Does it need to hit the GitHub REST API to scan a repo, or can
it work on a local checkout?

**Answer:** Local checkout. Most real usage is "run this as part of CI on
the repo you're already in" — no token, no network call, no rate limits.

**Copilot:** One target repo, or should it be reusable against any repo?

**Answer:** Reusable. Take a repo path and a template path as arguments.
We'll demo it against its own repo, but it shouldn't be hardcoded to that.

## Functional requirements

1. **FR1 — Template-driven output.** The tool reads a Markdown template
   containing `{{Placeholder}}` tokens and produces an output document with
   every token replaced.
2. **FR2 — Repo scanning.** Given a local repository path, the tool reads
   `package.json`, the first descriptive paragraph in `README.md`, and a
   documented list of candidate entry-point files. It does not recursively
   crawl the repository or inspect arbitrary files.
3. **FR3 — Strict fact extraction.** Every value written to the output must
   be traceable to something read from the repo. If a placeholder has no
   corresponding fact, its value is the literal string `Not Found` — never
   an inferred or default value. Unknown placeholders and known placeholders
   whose facts are absent follow the same rule.
4. **FR4 — Stable re-run.** With the same repository, template, and current
   date, repeated runs produce byte-identical output. Changes to repository
   facts update the corresponding rendered values; the `Last_Synced` field
   reflects the current UTC date.
5. **FR5 — CLI interface.** The CLI accepts
   `doc-sync <repoPath> <templatePath> <outputPath>` and an optional `--json`
   flag. It writes the rendered Markdown to the requested output path and
   reports success or a clear error; JSON mode emits a structured result
   while preserving the Markdown output file.

## Non-functional requirements

1. **NFR1 — No network calls.** Everything operates on the local filesystem.
2. **NFR2 — No new runtime dependencies.** Node's built-in `fs`/`path` only —
   this is a small, auditable tool, not a reason to pull in a parsing
   framework.
3. **NFR3 — Deterministic.** The same repository state, template, and UTC
    date produce the same document. Apart from the explicit `Last_Synced`
    date, output contains no timestamps or non-deterministic ordering.
4. **NFR4 — Testable without a real GitHub repo.** All scanning logic is
   tested against a small fixture repo checked into `test/fixtures/`, not
   against this project's own (moving) source tree.

## Acceptance criteria

- A valid repository and template produce a Markdown file at the requested
   output path, with every template token replaced.
- A fact that is absent, unsupported, or not explicitly discoverable is
   rendered as `Not Found`; the tool does not guess.
- Repeated runs on the same inputs and UTC date produce identical output.
- Missing repository or template paths produce a non-zero exit status and a
   clear error; JSON mode returns a structured error instead of a plain-text
   message.
- The tool works using local files only and does not require credentials or
   network access.

## Out of scope

- Publishing to Confluence, GitHub Wiki, or any remote system.
- Scanning multiple repos in one run.
- Anything requiring a GitHub token or API call.

## Skills applied
_Recorded in the skills-enforcement pass: each skill was checked against this document after it was written._
- jira-story-readiness: user story and acceptance criteria present; Not Found behaviour stated as a requirement.
- not-found-policy: out-of-scope list confirms no guessing and no remote calls.
