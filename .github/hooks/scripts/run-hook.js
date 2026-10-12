#!/usr/bin/env node
'use strict';
// Cross-platform launcher for the hook scripts.
// Why: on Windows the word "bash" can point to a broken WSL stub, which made the before-hook error
// and block every tool call. This launcher finds Git Bash, runs the .sh script, and passes its exit
// code through (exit 2 still means "block"). If no bash exists at all it warns and lets the work continue.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const [script, ...args] = process.argv.slice(2);
if (!script) { console.error('run-hook: usage: node run-hook.js <script.sh> [args]'); process.exit(0); }

function findBash() {
  if (process.platform !== 'win32') return 'bash';
  const roots = [process.env.ProgramFiles, process.env['ProgramFiles(x86)'],
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs')].filter(Boolean);
  for (const r of roots) {
    for (const rel of ['Git/bin/bash.exe', 'Git/usr/bin/bash.exe']) {
      const p = path.join(r, rel);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

const bash = findBash();
if (!bash) { console.error('run-hook: Git Bash not found, skipping ' + script + '. Install Git for Windows.'); process.exit(0); }

const scriptPath = path.resolve(__dirname, script);
if (!fs.existsSync(scriptPath)) { console.error('run-hook: script not found, skipping: ' + script); process.exit(0); }
const r = spawnSync(bash, [scriptPath, ...args], { stdio: 'inherit', cwd: process.cwd() });
if (r.error) { console.error('run-hook: could not start bash: ' + r.error.message); process.exit(0); }
// Only exit 2 means "block". Any other failure is a hook problem, not a reason to stop the agent.
if (r.status !== 0 && r.status !== 2) { console.error('run-hook: ' + script + ' exited with ' + r.status + ', ignoring.'); process.exit(0); }
process.exit(r.status === null ? 0 : r.status);
