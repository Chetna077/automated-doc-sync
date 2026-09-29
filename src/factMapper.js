'use strict';

const DATABASE_PACKAGES = [
  ['pg', 'PostgreSQL'],
  ['mysql2', 'MySQL'],
  ['mysql', 'MySQL'],
  ['mongoose', 'MongoDB'],
  ['mongodb', 'MongoDB'],
  ['sqlite3', 'SQLite'],
  ['better-sqlite3', 'SQLite'],
];

const FRAMEWORK_PACKAGES = [
  ['express', 'Express'],
  ['fastify', 'Fastify'],
  ['koa', 'Koa'],
  ['react', 'React'],
  ['next', 'Next.js'],
];

function findKnownPackage(dependencies, table) {
  if (!dependencies) {
    return null;
  }
  const found = table
    .filter(([pkgName]) => Object.prototype.hasOwnProperty.call(dependencies, pkgName))
    .map(([, label]) => label);
  return found.length > 0 ? [...new Set(found)].join(', ') : null;
}

function allDependencyNames(pkg) {
  if (!pkg) {
    return null;
  }
  return { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
}

function formatKeyValueList(obj, separator) {
  if (!obj) {
    return null;
  }
  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return null;
  }
  return entries.map(([key, value]) => `${key}${separator}${value}`).join(', ');
}

// One entry per placeholder. Deliberately explicit and repetitive — see
// docs/architecture.md for why this isn't a generic reflection-based
// lookup. A rule that finds nothing returns null, which mapFacts turns
// into an absent key so renderTemplate falls back to "Not Found".
const RULES = {
  App_Name: (facts) => facts.pkg?.name ?? null,
  Description: (facts) => facts.readmeSummary ?? null,
  Runtime: (facts) => (facts.pkg?.engines?.node ? `Node.js ${facts.pkg.engines.node}` : null),
  Frameworks: (facts) => findKnownPackage(allDependencyNames(facts.pkg), FRAMEWORK_PACKAGES),
  Primary_Database: (facts) => findKnownPackage(allDependencyNames(facts.pkg), DATABASE_PACKAGES),
  Entry_Points: (facts) => facts.entryPoint ?? null,
  Dependencies: (facts) => formatKeyValueList(facts.pkg?.dependencies, '@'),
  Dev_Dependencies: (facts) => formatKeyValueList(facts.pkg?.devDependencies, '@'),
  Build_Tool: (facts) => (facts.pkg?.scripts?.build ? `npm run build (${facts.pkg.scripts.build})` : null),
  Scripts: (facts) => formatKeyValueList(facts.pkg?.scripts, ': '),
  Test_Framework: (facts) => {
    const deps = allDependencyNames(facts.pkg);
    if (!deps) return null;
    const known = ['mocha', 'jest', 'ava', 'vitest', 'playwright', '@playwright/test'];
    const found = known.filter((name) => Object.prototype.hasOwnProperty.call(deps, name));
    return found.length > 0 ? found.join(', ') : null;
  },
  Readme_Summary: (facts) => facts.readmeSummary ?? null,
  Maintainers: (facts) => facts.pkg?.author ?? null,
  Version: (facts) => facts.pkg?.version ?? null,
};

/**
 * Resolves every requested placeholder against facts using the RULES
 * table above. A placeholder with no rule, or a rule that returns
 * null/undefined, is left out of the result entirely — renderTemplate
 * is what turns "missing key" into the literal "Not Found" string, so
 * that behaviour lives in exactly one place.
 */
function mapFacts(facts, placeholders) {
  const values = {};
  for (const name of placeholders) {
    const rule = RULES[name];
    const value = rule ? rule(facts) : null;
    if (value !== null && value !== undefined) {
      values[name] = value;
    }
  }
  return values;
}

module.exports = { mapFacts, RULES };
