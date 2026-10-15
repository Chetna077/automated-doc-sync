'use strict';
// Proves the hooks really work: the before hook blocks a staged secret, and the skills validator passes.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const guard = path.join(root, '.github/hooks/scripts/secret-guard.sh');
const validator = path.join(root, '.github/hooks/scripts/validate-skills.sh');
// Find bash the same way the hook launcher does. On Windows a bare 'bash' can be a broken WSL stub.
const BASH = require('../.github/hooks/scripts/run-hook.js').findBash();
const hasBash = Boolean(BASH) && spawnSync(BASH, ['-c', 'true']).status === 0;

function git(cwd, ...args) { return spawnSync('git', args, { cwd, encoding: 'utf8' }); }

test('before hook blocks a staged secret (exit 2) and passes when clean', { skip: !hasBash }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hook-'));
  git(dir, 'init');
  fs.writeFileSync(path.join(dir, 'ok.txt'), 'hello\n');
  git(dir, 'add', 'ok.txt');
  assert.strictEqual(spawnSync(BASH, [guard], { cwd: dir }).status, 0);
  fs.writeFileSync(path.join(dir, 'leak.txt'), 'token=ghp_' + 'a'.repeat(36) + '\n');
  git(dir, 'add', 'leak.txt');
  const blocked = spawnSync(BASH, [guard], { cwd: dir, encoding: 'utf8' });
  assert.strictEqual(blocked.status, 2);
  assert.match(blocked.stderr, /possible secret/);
});

test('every skill an agent references exists and has valid frontmatter', { skip: !hasBash }, () => {
  const r = spawnSync(BASH, [validator, '.github'], { cwd: root, encoding: 'utf8' });
  assert.strictEqual(r.status, 0, r.stdout + r.stderr);
});

test('launcher passes exit 2 through and never blocks on a broken or missing hook', { skip: !hasBash }, () => {
  const run = path.join(root, '.github/hooks/scripts/run-hook.js');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hook-'));
  git(dir, 'init');
  fs.writeFileSync(path.join(dir, 'leak.txt'), 'token=ghp_' + 'a'.repeat(36) + '\n');
  git(dir, 'add', 'leak.txt');
  assert.strictEqual(spawnSync('node', [run, 'secret-guard.sh'], { cwd: dir }).status, 2);
  assert.strictEqual(spawnSync('node', [run, 'does-not-exist.sh'], { cwd: dir }).status, 0);
});

test('hooks.json uses the Copilot hook format (version 1, camelCase events, bash and powershell)', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(root, '.github/hooks/hooks.json'), 'utf8'));
  assert.strictEqual(cfg.version, 1);
  for (const ev of ['preToolUse', 'postToolUse', 'agentStop', 'sessionStart']) {
    assert.ok(Array.isArray(cfg.hooks[ev]) && cfg.hooks[ev].length > 0, ev);
    for (const h of cfg.hooks[ev]) { assert.ok(h.bash && h.powershell, ev + ' needs bash and powershell'); }
  }
});
