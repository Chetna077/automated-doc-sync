# Orchestrator (automated-doc-sync)

Entry point: `/run-pipeline` (`.github/prompts/run-pipeline.prompt.md`) starts the `conductor` agent (`.github/agents/conductor.agent.md`), which is the orchestrator.

## Order of work
1. intake: reads the Jira story through Atlassian MCP, writes `docs/requirements.md`.
2. doc-sync: architecture, design review and implementation plan documents.
3. build: code and tests.
4. review, 5. verify: findings and a real test run.
6. publish: PR description, changelog, CI result through GitHub MCP.

## Rules
- A human approves every stage through the handoff buttons. Nothing is committed, pushed or posted without a clear yes.
- Every document ends with a `## Skills applied` section.
- Token saving: follow `.github/instructions/token-saving.instructions.md`. The `token-guard.js` hook enforces it.
- Pull request ownership: the dev agent owns the pull request and fixes review comments on the same branch.
