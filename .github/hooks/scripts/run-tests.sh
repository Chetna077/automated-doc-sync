#!/usr/bin/env bash
# Runs the suite when the agent session stops; prints a one-line result.
if npm test --silent >/tmp/doc-sync-test.log 2>&1; then
  echo "run-tests: PASS ($(grep -E '^# pass' /tmp/doc-sync-test.log))"
else
  echo "run-tests: FAIL - see output below" >&2
  tail -30 /tmp/doc-sync-test.log >&2
  exit 1
fi
