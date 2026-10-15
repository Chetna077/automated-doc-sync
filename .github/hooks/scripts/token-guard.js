#!/usr/bin/env node
'use strict';
// preToolUse hook (Copilot): saves tokens by denying wasteful tool calls.
//  1. Reads of lockfiles, node_modules, .git, binaries and minified files.
//  2. Large unbounded file reads.
//  3. Atlassian (Jira/Confluence) writes with payloads over 8,000 characters.
// A denial is printed as JSON on stdout. Any problem with the input allows the call:
// this hook must never block work because of its own error. Disable with TOKEN_SAVER=off.
const fs = require('node:fs');

const WRITE = /(create|edit|update|add|transition|delete)/i;

function parseArgs(raw) {
  if (raw && typeof raw === 'object') return raw;
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

function check(input, env = process.env) {
  if (env.TOKEN_SAVER === 'off' || !input) return null;
  const name = String(input.toolName || input.tool_name || '');
  const args = parseArgs(input.toolArgs !== undefined ? input.toolArgs : input.tool_input);

  if (/atlassian/i.test(name) && WRITE.test(name)) {
    const max = Number(env.TOKEN_SAVER_MAX_WRITE_CHARS) || 8000;
    const size = JSON.stringify(args).length;
    if (size > max) return `${name} payload is ${size} characters (about ${Math.round(size / 4)} tokens). Send only the changed field or one short comment, under ${max} characters.`;
    return null;
  }

  if (/^(view|read|read_file|cat)$/i.test(name)) {
    const p = String(args.path || args.file_path || args.filePath || '').replace(/\\/g, '/');
    if (!p) return null;
    if (/(^|\/)(node_modules|\.git|coverage)(\/|$)/.test(p)) return `${p} is vendored/generated content. Search it for the exact symbol instead.`;
    if (/(package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$/i.test(p)) return `${p} is a lockfile. Search for the specific package instead.`;
    if (/\.(docx|xlsx|pptx|zip|gz|tar|tgz|exe|dll|min\.js|min\.css|map|png|jpe?g|gif|bmp|webp|ico|pdf|mp4|mov)$/i.test(p)) return `${p} is a binary or minified file that cannot be read usefully as text.`;
    if (args.view_range || args.offset !== undefined || args.limit !== undefined) return null;
    let size;
    try { size = fs.statSync(p).size; } catch { return null; }
    const max = Number(env.TOKEN_SAVER_MAX_BYTES) || 100000;
    if (size > max) return `${p} is ${size} bytes (about ${Math.round(size / 4)} tokens). Read a line range instead of the whole file.`;
  }
  return null;
}

if (require.main === module) {
  let raw = '';
  process.stdin.on('data', (c) => (raw += c));
  process.stdin.on('end', () => {
    try {
      const reason = check(JSON.parse(raw));
      if (reason) process.stdout.write(JSON.stringify({ permissionDecision: 'deny', permissionDecisionReason: `Blocked (token-saver): ${reason}` }));
    } catch { /* never block on our own error */ }
    process.exit(0);
  });
} else {
  module.exports = { check };
}
