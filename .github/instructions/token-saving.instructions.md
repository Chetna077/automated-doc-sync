---
applyTo: "**"
---
# Token saving

- Jira: request only the fields the stage needs (summary, description, acceptance criteria, status, labels). Never fetch comments, changelog, attachments or avatars unless the stage needs them.
- Confluence: fetch one page by id; do not list whole spaces.
- Files: read line ranges or search. Never read lockfiles, `node_modules`, binaries or whole large files.
- Writes to Jira or Confluence: send only the changed field or one short comment, under 8,000 characters, after the human approves.
- The `token-guard.js` preToolUse hook denies calls that break these rules. Set `TOKEN_SAVER=off` to disable it.
- Never fetch or attach images, screenshots, PDFs or base64 data through Jira, Confluence or GitHub tools. Link to them or describe them in one line. The hook denies image and PDF reads and any write with embedded data over the size limit.
