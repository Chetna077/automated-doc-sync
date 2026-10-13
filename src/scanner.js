'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Root-relative allowlist; priority is part of the Entry_Points contract.
const ENTRY_POINT_CANDIDATES = [
  'backend/src/server.js',
  'src/index.js',
  'index.js',
  'server.js',
  'app.js',
];

function readPackageJson(repoPath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(repoPath, 'package.json'), 'utf8'));
  } catch {
    // Missing, unreadable, and malformed metadata is unavailable, not fatal.
    return null;
  }
}

function readReadmeSummary(repoPath) {
  let lines;
  try {
    lines = fs.readFileSync(path.join(repoPath, 'README.md'), 'utf8').split(/\r?\n/);
  } catch {
    // A missing or unreadable README provides no descriptive fact.
    return null;
  }

  const paragraph = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('```')) {
      continue;
    }
    if (trimmed === '') {
      if (paragraph.length > 0) break;
      continue;
    }
    paragraph.push(trimmed);
  }
  return paragraph.length > 0 ? paragraph.join(' ') : null;
}

function findEntryPoint(repoPath) {
  for (const candidate of ENTRY_POINT_CANDIDATES) {
    // Deliberately check only existence: candidate source is never opened or run.
    if (fs.existsSync(path.join(repoPath, candidate))) {
      return candidate;
    }
  }
  return null;
}

/** Reads only permitted local sources and returns observed facts or nulls. */
function scanRepo(repoPath) {
  return {
    pkg: readPackageJson(repoPath),
    readmeSummary: readReadmeSummary(repoPath),
    entryPoint: findEntryPoint(repoPath),
  };
}

module.exports = { scanRepo, ENTRY_POINT_CANDIDATES };
