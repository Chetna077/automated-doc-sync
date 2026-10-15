#!/usr/bin/env bash
# Blocks when staged changes contain secret-shaped strings.
set -uo pipefail
PATTERN='(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)'
MATCHES=$(git diff --cached -U0 2>/dev/null | grep -E "$PATTERN" || true)
if [ -n "$MATCHES" ]; then
  echo "secret-guard: possible secret in staged changes. Remove it before committing." >&2
  echo "$MATCHES" >&2
  exit 2
fi
echo "secret-guard: clean."
exit 0
