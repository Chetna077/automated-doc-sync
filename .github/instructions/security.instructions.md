---
applyTo: "src/**/*.js,test/**/*.js"
---
- No network calls in application code. All sources are local files and local `git`.
- Pass user paths to `child_process` as array arguments, never interpolated into a shell string.
- Never read, print, or store secrets or tokens.
- Never write to the template input path; refuse if input and output resolve to the same file.
