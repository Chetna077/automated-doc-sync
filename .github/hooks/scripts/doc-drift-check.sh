#!/usr/bin/env bash
# Warns (never blocks) when src/ is newer than docs/.
NEWEST_SRC=$(find src -type f -name '*.js' -printf '%T@\n' 2>/dev/null | sort -rn | head -1)
NEWEST_DOC=$(find docs -type f -name '*.md' -printf '%T@\n' 2>/dev/null | sort -rn | head -1)
NEWEST_SRC=${NEWEST_SRC:-0}; NEWEST_DOC=${NEWEST_DOC:-0}
if awk "BEGIN { exit !($NEWEST_SRC > $NEWEST_DOC) }"; then
  echo "doc-drift-check: src/ is newer than docs/ - update docs before the PR."
else
  echo "doc-drift-check: docs/ is up to date."
fi
exit 0
