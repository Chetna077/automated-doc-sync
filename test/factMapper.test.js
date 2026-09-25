'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mapFacts } = require('../src/factMapper');

const SAMPLE_FACTS = {
  pkg: {
    name: 'sample-service',
    version: '0.3.1',
    author: 'Sample Team <team@example.com>',
    engines: { node: '>=18' },
    scripts: { start: 'node src/index.js', test: 'mocha' },
    dependencies: { express: '^4.18.2', pg: '^8.11.0' },
    devDependencies: { mocha: '^10.2.0' },
  },
  readmeSummary: 'Sample Service is a tiny demo API.',
  entryPoint: 'src/index.js',
};

test('mapFacts resolves fields that have a matching fact', () => {
  const values = mapFacts(SAMPLE_FACTS, ['App_Name', 'Version', 'Entry_Points']);
  assert.equal(values.App_Name, 'sample-service');
  assert.equal(values.Version, '0.3.1');
  assert.equal(values.Entry_Points, 'src/index.js');
});

test('mapFacts recognizes a known framework and database from dependencies', () => {
  const values = mapFacts(SAMPLE_FACTS, ['Frameworks', 'Primary_Database']);
  assert.equal(values.Frameworks, 'Express');
  assert.equal(values.Primary_Database, 'PostgreSQL');
});

test('mapFacts formats Scripts as name: command, not name@version', () => {
  const values = mapFacts(SAMPLE_FACTS, ['Scripts']);
  assert.equal(values.Scripts, 'start: node src/index.js, test: mocha');
});

test('mapFacts detects a known test framework from devDependencies', () => {
  const values = mapFacts(SAMPLE_FACTS, ['Test_Framework']);
  assert.equal(values.Test_Framework, 'mocha');
});

test('mapFacts omits a placeholder with no rule instead of guessing', () => {
  const values = mapFacts(SAMPLE_FACTS, ['Something_Nobody_Defined']);
  assert.equal(Object.prototype.hasOwnProperty.call(values, 'Something_Nobody_Defined'), false);
});

test('mapFacts omits a placeholder whose rule finds nothing in these facts', () => {
  // The fixture has no "build" script, so Build_Tool must not be invented.
  const values = mapFacts(SAMPLE_FACTS, ['Build_Tool']);
  assert.equal(Object.prototype.hasOwnProperty.call(values, 'Build_Tool'), false);
});

test('mapFacts handles a facts object with a null pkg without throwing', () => {
  const values = mapFacts({ pkg: null, readmeSummary: null, entryPoint: null }, [
    'App_Name',
    'Frameworks',
    'Primary_Database',
  ]);
  assert.deepEqual(values, {});
});
