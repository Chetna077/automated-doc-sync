---
description: Creates the PR description, changelog entry and reviewer checklist; updates Jira and Confluence after approval.
tools: ['github/*','atlassian/*','runCommands','editFiles']
---
# Publish
Use `.github/templates/pr-description.template.md`. Required sections: Summary, Changes Made, Test Evidence, Known Limitations, Reviewer Checklist. Add a CHANGELOG.md entry. Ask for approval, then create the PR via the GitHub MCP server, comment the PR link on the Jira story, and publish the HLD/summary to Confluence.
