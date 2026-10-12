# Architecture — Automated Documentation Generator

## Overview

The generator is a local Node.js CLI with a small, linear pipeline. It reads
a template and a repository checkout, maps explicitly supported repository
facts to template tokens, and writes a rendered Markdown file. The scanner
does not inspect arbitrary files, infer facts from naming conventions, or
make network requests. Missing or unsupported facts render as `Not Found`.

```text
repoPath ──► scanRepo() ──► facts ──────────────┐
                                                ▼
templatePath ──► parseTemplate() ──► tokens ──► mapFacts()
                                                │
                                      mapped values + UTC date
                                                ▼
                                          renderTemplate()
                                                │
                                                ▼
                                        outputPath (Markdown)
                                                │
                                    summary or JSON on stdout
```

The CLI in `src/index.js` coordinates these modules. The template parser and
fact mapper remain independent of filesystem access where possible, which
makes their rules straightforward to test.

## Components

### CLI orchestration — `src/index.js`

- Accepts repository, template, and output paths, with an optional `--json`
  flag. Relative paths are resolved from the current working directory.
- Checks that the repository and template paths exist, then calls the
  pipeline and creates the output directory when needed.
- Always writes Markdown to the requested output file. Default mode prints a
  field-count summary; JSON mode prints a structured success or error result
  to stdout.
- Converts operational errors into a non-zero process exit. JSON mode keeps
  errors machine-readable.

### Template processing — `src/templateEngine.js`

- `parseTemplate(text)` returns the template text and its ordered,
  de-duplicated `{{Token}}` names.
- `renderTemplate(text, values)` replaces every token using its mapped value.
  A missing value becomes the literal `Not Found`; an unsupported token is
  not treated as a fatal error.

### Repository scanning — `src/scanner.js`

- `scanRepo(repoPath)` returns raw facts independent of any particular
  template: parsed `package.json`, the first descriptive paragraph of
  `README.md`, and the first matching entry point from a fixed candidate
  list.
- The package data includes the fields used downstream, such as name,
  version, Node engine, dependencies, development dependencies, and scripts.
- Missing files and invalid `package.json` content produce absent facts.
  Other filesystem failures propagate to the CLI as errors.
- The scanner reads only these defined sources. It does not recursively walk
  the repository or execute project code.

### Fact mapping — `src/factMapper.js`

- `mapFacts(facts, placeholders)` applies a named rule for each supported
  placeholder. Rules explicitly map package metadata and README/entry-point
  facts to document values.
- Framework and database names are reported only when recognized package
  names are present in dependencies. Build information is based on the
  package's build script; no build is executed.
- An unknown token, absent source fact, or unsupported value has no mapped
  value, allowing the renderer to produce `Not Found` consistently.
- Rules are explicit rather than inferred from token names. This makes each
  generated claim traceable to a known input and keeps unsupported claims
  conservative.

## Data flow

1. The CLI resolves its input and output paths and verifies that the required
   input paths exist.
2. The template engine parses the template and returns the token list.
3. The scanner reads the bounded set of local repository inputs into a
   plain facts object.
4. The fact mapper resolves each requested token against its explicit rule.
   Missing facts remain unresolved; they are not filled with guesses.
5. The CLI adds the current UTC date for `Last_Synced`, and the renderer
   substitutes all template tokens.
6. The CLI writes the Markdown output and reports the result in the selected
   stdout format.

## Failure and missing-data behavior

| Condition | Behavior |
|---|---|
| Repository or template path does not exist | Non-zero exit with a clear error; structured error in JSON mode |
| `package.json` is absent or invalid JSON | Package-derived facts are absent and render as `Not Found` |
| README or recognized entry point is absent | Related facts are absent and render as `Not Found` |
| Template contains an unsupported token | Token renders as `Not Found`; generation continues |
| An operational filesystem error occurs | Error is reported and the process exits non-zero |

## Architectural decisions

- **Local-only inputs:** no remote service, API token, or network access is
  needed, so the tool can run against a checkout in CI.
- **Bounded scanning:** a fixed source list limits runtime and makes it easy
  to audit where generated claims came from. Broader language or framework
  support should add explicit scanners and mapping rules, not guesswork.
- **Explicit mapping:** the mapping table is the trust boundary between raw
  repository data and human-readable documentation. It favors traceability
  over automatic but potentially misleading inference.
- **Markdown file as the deliverable:** publishing is outside this system;
  the generated file can be reviewed and committed with the repository.
- **No runtime dependencies:** built-in Node.js filesystem and path APIs are
  sufficient for this bounded format and avoid adding parsing dependencies.

## Quality attributes

- **Determinism:** identical repository facts, template, and UTC date produce
  identical output. `Last_Synced` is the sole date-dependent field.
- **Testability:** parsing, mapping, scanning, CLI behavior, and end-to-end
  output can be verified independently; scanner tests use checked-in fixture
  repositories.
- **Auditability:** every emitted value follows a named mapping rule or the
  explicit `Not Found` fallback. Repository code is read as data and never
  executed.

## Skills applied
_Recorded in the skills-enforcement pass: each skill was checked against this document after it was written._
- repo-fact-verifier: facts come only from the scanner module, never from the template engine.
- not-found-policy: fact mapper returns `Not Found` when the scanner has no verified value.
