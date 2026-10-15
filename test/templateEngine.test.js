'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseTemplate, renderTemplate } = require('../src/templateEngine');

test('parseTemplate finds placeholders in first-seen order, deduplicated', () => {
  const { placeholders } = parseTemplate('{{B}} then {{A}} then {{B}} again');
  assert.deepEqual(placeholders, ['B', 'A']);
});

test('parseTemplate returns an empty list for a template with no placeholders', () => {
  const { placeholders } = parseTemplate('nothing to see here');
  assert.deepEqual(placeholders, []);
});

test('renderTemplate substitutes a present value', () => {
  const out = renderTemplate('Name: {{Name}}', { Name: 'Sample Service' });
  assert.equal(out, 'Name: Sample Service');
});

test('renderTemplate falls back to "Not Found" for a missing key', () => {
  const out = renderTemplate('Owner: {{Owner}}', {});
  assert.equal(out, 'Owner: Not Found');
});

test('renderTemplate falls back to "Not Found" for null, undefined, and empty string', () => {
  const out = renderTemplate('{{A}}|{{B}}|{{C}}', { A: null, B: undefined, C: '' });
  assert.equal(out, 'Not Found|Not Found|Not Found');
});

test('renderTemplate replaces every occurrence of a repeated placeholder', () => {
  const out = renderTemplate('{{X}} and {{X}} again', { X: 'value' });
  assert.equal(out, 'value and value again');
});
