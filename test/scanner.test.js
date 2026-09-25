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

test('scanRepo finds the fixture repo\'s entry point', () => {
  const facts = scanRepo(FIXTURE_REPO);
  assert.equal(facts.entryPoint, 'src/index.js');
});

test('scanRepo returns nulls, not errors, for a repo with nothing to scan', () => {
  const emptyRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-empty-'));
  const facts = scanRepo(emptyRepo);
  assert.equal(facts.pkg, null);
  assert.equal(facts.readmeSummary, null);
  assert.equal(facts.entryPoint, null);
});

test('scanRepo degrades to pkg: null on malformed package.json instead of throwing', () => {
  assert.doesNotThrow(() => scanRepo(BROKEN_JSON_REPO));
  const facts = scanRepo(BROKEN_JSON_REPO);
  assert.equal(facts.pkg, null);
});
