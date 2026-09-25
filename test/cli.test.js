'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const CLI = path.join(__dirname, '..', 'src', 'index.js');
const FIXTURE_REPO = path.join(__dirname, 'fixtures', 'sample-repo');
const TEMPLATE = path.join(__dirname, '..', 'templates', 'technical-app-manifest.md');

test('CLI with no arguments prints usage and exits non-zero', () => {
  const result = spawnSync(process.execPath, [CLI], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Usage: doc-sync/);
});

test('CLI given real arguments runs end-to-end and reports a field count', () => {
  const outputPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-cli-')), 'PROFILE.md');
  const result = spawnSync(process.execPath, [CLI, FIXTURE_REPO, TEMPLATE, outputPath], { encoding: 'utf8' });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /\d+ \/ \d+ fields found\. Wrote/);
  assert.ok(fs.existsSync(outputPath));
});

test('CLI given a nonexistent repo path exits non-zero with a clear message', () => {
  const outputPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-cli-')), 'PROFILE.md');
  const result = spawnSync(process.execPath, [CLI, '/no/such/repo', TEMPLATE, outputPath], { encoding: 'utf8' });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Repo not found/);
});
