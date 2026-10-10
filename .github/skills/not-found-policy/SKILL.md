---
name: not-found-policy
description: Enforces the rule that any placeholder value that cannot be traced to a real file or command output must be the literal text "Not Found". Use when writing or reviewing factMapper logic, tests, or generated profiles.
---
# Not Found Policy
1. A value is valid only if it was read directly from a file on disk or from real command output.
2. No inference from naming, timestamps, or other repos.
3. Missing, empty, malformed or unreadable source → `Not Found`. Never throw for this.
4. Tests must cover the happy path AND at least one `Not Found` case per placeholder.
