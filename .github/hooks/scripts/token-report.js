#!/usr/bin/env node
'use strict';
// postToolUse hook (Copilot): the "after" half of token saving.
// Copilot hooks cannot rewrite a tool result, so this hook measures it instead:
// it estimates the tokens in each result (characters / 4), warns when one is large,
// flags images and base64 data, and appends one line per call to .github/hooks/token-usage.log.
// It never blocks and never fails. Disable with TOKEN_SAVER=off.
const fs = require('node:fs');
const path = require('node:path');

const WARN_CHARS = 6000;

function resultText(input) {
  const r = input.toolResult !== undefined ? input.toolResult : input.tool_response;
  if (typeof r === 'string') return r;
  if (r && typeof r.textResultForLlm === 'string') return r.textResultForLlm;
  try { return JSON.stringify(r || ''); } catch { return ''; }
}

function report(input, env = process.env) {
  if (env.TOKEN_SAVER === 'off' || !input) return null;
  const name = String(input.toolName || input.tool_name || 'unknown');
  const text = resultText(input);
  const tokens = Math.round(text.length / 4);
  const flags = [];
  if (text.length > WARN_CHARS) flags.push('large');
  if (/data:[a-z]+\/[a-z0-9.+-]+;base64,|[A-Za-z0-9+/=]{2000,}/i.test(text)) flags.push('embedded-data');
  if (/avatarUrls?"|"iconUrl"/.test(text)) flags.push('avatar-noise');
  return { name, tokens, flags };
}

if (require.main === module) {
  let raw = '';
  process.stdin.on('data', (c) => (raw += c));
  process.stdin.on('end', () => {
    try {
      const r = report(JSON.parse(raw));
      if (r) {
        const line = `${new Date().toISOString()} ${r.name} ~${r.tokens} tokens${r.flags.length ? ' [' + r.flags.join(',') + ']' : ''}`;
        fs.appendFileSync(path.join(__dirname, '..', 'token-usage.log'), line + '\n');
        if (r.flags.length) process.stderr.write(`token-report: ${line}. Next time request fewer fields or a smaller range.\n`);
      }
    } catch { /* never fail the agent */ }
    process.exit(0);
  });
} else {
  module.exports = { report };
}
