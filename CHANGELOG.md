# Changelog

## [Unreleased]
- SCRUM-1: scanner treats an unreadable or missing README and package.json as `Not Found` instead of crashing.
- SCRUM-1: entrypoint lookup is an ordered, existence-only allowlist (backend/src/server.js, src/index.js, index.js, server.js, app.js).
- SCRUM-1 review fixes: prototype-name placeholders, empty metadata, directory entrypoints and hard-link overwrite are handled, each with a regression test.
- Hooks now use the Copilot hook format with a launcher that works on Windows and never blocks on a broken hook.
- Added SDLC documents for SCRUM-1 (requirements, architecture, design review, implementation plan, code review, verification).
- Added Copilot agentic pipeline: agents, prompts, instructions, skills, hooks, MCP config.
