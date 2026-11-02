---
applyTo: "**/*.js"
---
- Plain Node.js built-ins only (`fs`, `path`, `child_process`). No new runtime dependencies.
- "Data legitimately missing" returns a `Not Found` value, not an exception. Throw only for fatal input problems (missing template, missing repo path).
- Function names should make comments unnecessary. Comment only the non-obvious "why".
- Every behavior change needs a test, including the "Not Found" edge cases.
