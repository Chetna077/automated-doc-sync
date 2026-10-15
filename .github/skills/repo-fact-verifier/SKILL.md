---
name: repo-fact-verifier
description: Verifies a candidate fact for a {{Placeholder}} against package.json and README.md in the scanned repo before it is accepted. Use when adding or reviewing scanner.js and factMapper.js changes.
---
# Repo Fact Verifier
Authoritative sources: parsed `package.json` fields, `README.md` content, and the presence of files on disk.
- Confirm the value matches the source byte-for-byte after trimming.
- Broken JSON or missing file → the fact is absent → `Not Found`.
- Record the source file in the verification report for each accepted fact.
