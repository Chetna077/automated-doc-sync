'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { run } = require('../src/index');

const FIXTURE_REPO = path.join(__dirname, 'fixtures', 'sample-repo');
const BROKEN_JSON_REPO = path.join(__dirname, 'fixtures', 'broken-json-repo');
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

  const emptyRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-no-entrypoint-'));
  const narrowTemplate = path.join(emptyRepo, 'template.md');
  const generatedPath = path.join(emptyRepo, 'profile.md');
  fs.writeFileSync(narrowTemplate, 'Entry: {{Entry_Points}}');
  assert.equal(run(emptyRepo, narrowTemplate, generatedPath).rendered, 'Entry: Not Found');

  const brokenTemplate = path.join(emptyRepo, 'broken-template.md');
  fs.writeFileSync(brokenTemplate, 'Name: {{App_Name}} | Entry: {{Entry_Points}}');
  assert.equal(run(BROKEN_JSON_REPO, brokenTemplate, generatedPath).rendered,
    'Name: Not Found | Entry: Not Found');
});

test('run counts empty metadata as Not Found rather than found', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-empty-metadata-'));
  const template = path.join(repo, 'template.md');
  const output = path.join(repo, 'profile.md');
  fs.writeFileSync(path.join(repo, 'package.json'), JSON.stringify({
    name: '',
    author: '   ',
  }));
  fs.writeFileSync(template, 'Name: {{App_Name}} | Maintainers: {{Maintainers}}');

  const result = run(repo, template, output);
  assert.equal(result.rendered, 'Name: Not Found | Maintainers: Not Found');
  assert.equal(result.foundCount, 0);
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

test('special placeholder names render Not Found and are not counted as found', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-special-'));
  const template = path.join(dir, 'template.md');
  fs.writeFileSync(template, 'A={{__proto__}} B={{constructor}} C={{toString}}\n');
  const result = run(FIXTURE_REPO, template, path.join(dir, 'out.md'));
  assert.equal(result.rendered, 'A=Not Found B=Not Found C=Not Found\n');
  assert.equal(result.foundCount, 0);
});
