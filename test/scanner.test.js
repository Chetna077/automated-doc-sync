'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { scanRepo } = require('../src/scanner');

const FIXTURE_REPO = path.join(__dirname, 'fixtures', 'sample-repo');
const BROKEN_JSON_REPO = path.join(__dirname, 'fixtures', 'broken-json-repo');

test('scanRepo reads package.json fields from a real repo', () => {
  const facts = scanRepo(FIXTURE_REPO);
  assert.equal(facts.pkg.name, 'sample-service');
  assert.equal(facts.pkg.version, '0.3.1');
  assert.deepEqual(facts.pkg.dependencies, { express: '^4.18.2', pg: '^8.11.0' });
});

test('scanRepo reads the README\'s first paragraph, skipping the heading', () => {
  const facts = scanRepo(FIXTURE_REPO);
  assert.match(facts.readmeSummary, /Sample Service is a tiny demo API/);
  assert.doesNotMatch(facts.readmeSummary, /^# /);
});

test('scanRepo finds entrypoints only from the approved ordered allowlist', () => {
  const facts = scanRepo(FIXTURE_REPO);
  assert.equal(facts.entryPoint, 'src/index.js');
  const { ENTRY_POINT_CANDIDATES } = require('../src/scanner');
  assert.deepEqual(ENTRY_POINT_CANDIDATES, [
    'backend/src/server.js', 'src/index.js', 'index.js', 'server.js', 'app.js',
  ]);

  for (const candidate of ENTRY_POINT_CANDIDATES) {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-entrypoint-'));
    const candidatePath = path.join(repo, candidate);
    fs.mkdirSync(path.dirname(candidatePath), { recursive: true });
    fs.writeFileSync(candidatePath, 'invalid JavaScript; never read or executed');
    assert.equal(scanRepo(repo).entryPoint, candidate);
  }

  const repoWithAllCandidates = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-entrypoint-'));
  for (const candidate of ENTRY_POINT_CANDIDATES) {
    const candidatePath = path.join(repoWithAllCandidates, candidate);
    fs.mkdirSync(path.dirname(candidatePath), { recursive: true });
    fs.writeFileSync(candidatePath, 'never read or executed');
  }
  assert.equal(scanRepo(repoWithAllCandidates).entryPoint, ENTRY_POINT_CANDIDATES[0]);
});

test('scanRepo returns nulls, not errors, for a repo with nothing to scan', () => {
  const emptyRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-empty-'));
  const facts = scanRepo(emptyRepo);
  assert.equal(facts.pkg, null);
  assert.equal(facts.readmeSummary, null);
  assert.equal(facts.entryPoint, null);

  const unapproved = path.join(emptyRepo, 'deep', 'src', 'main.js');
  fs.mkdirSync(path.dirname(unapproved), { recursive: true });
  fs.writeFileSync(unapproved, 'not an approved candidate');
  assert.equal(scanRepo(emptyRepo).entryPoint, null);

  fs.mkdirSync(path.join(emptyRepo, 'README.md'));
  assert.equal(scanRepo(emptyRepo).readmeSummary, null);
});

test('scanRepo degrades to pkg: null on malformed package.json instead of throwing', () => {
  assert.doesNotThrow(() => scanRepo(BROKEN_JSON_REPO));
  const facts = scanRepo(BROKEN_JSON_REPO);
  assert.equal(facts.pkg, null);
});
