'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { run } = require('../src/index');

test('run refuses to write over the template file', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-'));
  const template = path.join(dir, 'template.md');
  fs.writeFileSync(template, 'Name: {{App_Name}}\n');
  assert.throws(() => run(dir, template, template), /must differ from the template path/);
  assert.strictEqual(fs.readFileSync(template, 'utf8'), 'Name: {{App_Name}}\n');
});

test('run refuses to write through a hard link to the template file', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-sync-hardlink-'));
  const template = path.join(dir, 'template.md');
  const output = path.join(dir, 'output.md');
  const original = 'Name: {{App_Name}}\n';
  fs.writeFileSync(template, original);
  fs.linkSync(template, output);

  assert.throws(() => run(dir, template, output), /must differ from the template path/);
  assert.strictEqual(fs.readFileSync(template, 'utf8'), original);
  assert.strictEqual(fs.readFileSync(output, 'utf8'), original);
});
