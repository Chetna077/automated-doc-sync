# Architecture - SCRUM-1

## Overview

The approved scope is a local Node.js CLI that converts a placeholder-based Markdown template into a technical profile using only explicitly permitted facts from a repository checkout. The architecture separates argument and file orchestration, repository reading, placeholder-to-fact decisions, and rendering. Unverifiable values resolve to the literal `Not Found`; the CLI does not infer facts or call remote services. These boundaries implement requirements FR-1 through FR-5 and NFR-1 through NFR-2. Module names and descriptions below follow `config/app-profile.yml`.

## Components and Responsibilities

| Component | Responsibility | Inputs and outputs |
|---|---|---|
| CLI orchestration - `src/index.js` | Accept repo, template, output paths and optional `--json`; coordinate validation and the pipeline; write the output and emit either the summary or structured JSON. Prevent overwriting the template when paths resolve to the same file. | CLI arguments -> output Markdown plus stdout result, or an error result. |
| Repository scanner - `src/scanner.js` | Read `package.json` and `README.md` for facts. For `Entry_Points`, existence-check only the ordered root-relative list `backend/src/server.js`, `src/index.js`, `index.js`, `server.js`, `app.js`; report only the first existing path, or `Not Found` if none exists. Never read or execute candidate contents, inspect any other filenames, or walk directories. Do not infer facts. | Repository path -> raw facts, with missing or invalid source facts represented as unavailable. |
| Fact mapper - `src/factMapper.js` | Match requested template placeholders to explicit verified facts. Do not derive values from placeholder names or conventions; unresolved facts map to `Not Found`. | Raw facts and placeholder names -> mapped values. |
| Template engine - `src/templateEngine.js` | Identify placeholder tokens and render the Markdown template using mapped values, retaining the complete rendered document for file output and JSON result. | Template text and mapped values -> token list and rendered Markdown. |

The module boundaries are intentionally one-way: CLI orchestration coordinates the work; the scanner reads repository facts; the mapper decides which observed facts support each token; the template engine renders text. This keeps filesystem access out of the mapping/rendering responsibilities and gives each requirement a clear architectural owner.

## Data Flow

1. The CLI receives `<repoPath> <templatePath> <outputPath> [--json]` and checks required arguments and template/output path collision (FR-5).
2. The template engine identifies tokens in the Markdown template; the scanner reads only permitted local repository sources (FR-1, FR-2).
3. The fact mapper pairs tokens with supported observations. Missing, malformed, unreadable, unsupported, or unknown facts remain unverified and become the exact `Not Found` value (FR-3).
4. The template engine renders the Markdown. The CLI writes the output file and reports the found/total count in plain mode, or returns the rendered document and counts in the requested JSON object (FR-1, FR-4).
5. The self-sync command uses the same local pipeline with the configured template and output paths (FR-6). No remote system participates in runtime flow (NFR-1).

## Technology Choices

- **JavaScript on Node.js >=18:** use the runtime specified in `config/app-profile.yml` (NFR-2).
- **Node built-ins, zero runtime dependencies:** local filesystem and path handling are sufficient for the configured CLI; do not add runtime packages (NFR-1, NFR-2).
- **Markdown template and local file output:** keeps generated content reviewable and within the approved local-only scope (FR-1).
- **Structured JSON as an optional CLI presentation:** provides machine-readable status and rendered content without changing the Markdown file deliverable (FR-4).
- **Explicit source and mapping boundary:** observed inputs are distinguished from mapping policy; unavailable evidence is represented as `Not Found`, not guessed (FR-2, FR-3).

## Risks

| Risk | Impact | Architectural mitigation / verification |
|---|---|---|
| An unsupported or absent value is guessed or presented as fact. | Misleading technical documentation. | Keep source allowlist and explicit mapping boundary; default every unsupported value to `Not Found` (FR-2, FR-3; verify against AC-2 and AC-6). |
| A malformed optional source terminates a run unexpectedly. | No profile is produced for otherwise usable repository inputs. | Treat missing/invalid package metadata as unavailable facts; verify the no-crash behavior in AC-6. Failures reading permitted fact sources yield unavailable facts and the `Not Found` fallback; failures reading the template or writing the output remain operational errors to report. |
| Output path aliases the template input. | The input template could be destroyed. | Reject equal resolved paths before writing (FR-5; verify AC-5). |
| JSON and plain output diverge or fail to reflect the rendered document. | Automation receives misleading status or content. | Have the CLI report the same rendered result and counts that are written to the output (FR-1, FR-4; verify AC-1 and AC-3). |
| Runtime behavior or dependencies drift from the supported baseline. | Installation/runtime surprises or non-reproducible verification. | Keep runtime dependencies at zero and Node >=18; validate with the documented test command and AC-8 (NFR-2, NFR-3). |

## Skills applied

- not-found-policy: Checked that the architecture keeps only observed local facts, disallows inference, and directs missing, malformed, unreadable, or unsupported facts to the exact `Not Found` fallback.
