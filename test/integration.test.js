'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { run } = require('../src/index');

const FIXTURE_REPO = path.join(__dirname, 'fixtures', 'sample-repo');
const TEMPLATE = path.join(__dirname, '..', 'templates', 'technical-app-manifest.md');

function stripLastSynced(text) {
  return text.replace(/\*\*Last Synced:\*\* .*/g, '**Last Synced:** [stripped]');
}

test('CLI end-to-end: real values are filled in from the fixture repo', () => {
  const outputPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-out-')), 'PROFILE.md');
  const { rendered, foundCount, placeholders } = run(FIXTURE_REPO, TEMPLATE, outputPath);

  assert.ok(fs.existsSync(outputPath), 'output file should be written');
  assert.match(rendered, /sample-service/);
  assert.match(rendered, /Node\.js >=18/);
  assert.match(rendered, /Express/);
  assert.match(rendered, /PostgreSQL/);
  assert.match(rendered, /src\/index\.js/);
  assert.ok(foundCount > 0 && foundCount < placeholders.length, 'expected a mix of found and Not Found fields');
});

test('CLI end-to-end: a field genuinely absent from the repo is marked Not Found, never guessed', () => {
  const outputPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-out-')), 'PROFILE.md');
  const { rendered } = run(FIXTURE_REPO, TEMPLATE, outputPath);

  // The fixture repo has no "build" script in package.json.
  assert.match(rendered, /\*\*Build Tool:\*\* Not Found/);
});

test('CLI is deterministic run-to-run, aside from the Last Synced line', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-out-'));
  const first = run(FIXTURE_REPO, TEMPLATE, path.join(dir, 'first.md'));
  const second = run(FIXTURE_REPO, TEMPLATE, path.join(dir, 'second.md'));

  assert.equal(stripLastSynced(first.rendered), stripLastSynced(second.rendered));
});

test('run() throws a clear error for a repo path that does not exist', () => {
  const outputPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-out-')), 'PROFILE.md');
  assert.throws(() => run('/no/such/repo', TEMPLATE, outputPath), /Repo not found/);
});

test('run() throws a clear error for a template path that does not exist', () => {
  const outputPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-out-')), 'PROFILE.md');
  assert.throws(() => run(FIXTURE_REPO, '/no/such/template.md', outputPath), /Template not found/);
});
