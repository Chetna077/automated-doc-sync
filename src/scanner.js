'use strict';

const fs = require('fs');
const path = require('path');

// Known candidate entry points, checked in order. Not exhaustive by design —
// see docs/design-review.md finding #6 for why this isn't a recursive walk.
const ENTRY_POINT_CANDIDATES = [
  'backend/src/server.js',
  'src/index.js',
  'index.js',
  'server.js',
  'app.js',
];

function readPackageJson(repoPath) {
  const pkgPath = path.join(repoPath, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch {
    // Malformed package.json is treated the same as a missing one — every
    // fact that would have come from it is simply absent, not a crash.
    return null;
  }
}

function readReadmeSummary(repoPath) {
  const readmePath = path.join(repoPath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    return null;
  }

  const lines = fs.readFileSync(readmePath, 'utf8').split(/\r?\n/);
  const paragraph = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('```')) {
      continue;
    }
    if (trimmed === '') {
      if (paragraph.length > 0) {
        break;
      }
      continue;
    }
    paragraph.push(trimmed);
  }

  return paragraph.length > 0 ? paragraph.join(' ') : null;
}

function findEntryPoint(repoPath) {
  for (const candidate of ENTRY_POINT_CANDIDATES) {
    if (fs.existsSync(path.join(repoPath, candidate))) {
      return candidate;
    }
  }
  return null;
}

/**
 * Reads a local repository and returns a plain facts object. Knows nothing
 * about any template — it just reports what's actually on disk. Missing
 * files are represented as null, never thrown as errors.
 */
function scanRepo(repoPath) {
  return {
    pkg: readPackageJson(repoPath),
    readmeSummary: readReadmeSummary(repoPath),
    entryPoint: findEntryPoint(repoPath),
  };
}

module.exports = { scanRepo, ENTRY_POINT_CANDIDATES };
