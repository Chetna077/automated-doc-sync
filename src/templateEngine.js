'use strict';

const PLACEHOLDER_PATTERN = /\{\{([A-Za-z0-9_]+)\}\}/g;

/**
 * Finds every {{Placeholder}} in a template and returns the placeholder
 * names in first-seen order, with duplicates collapsed.
 */
function parseTemplate(text) {
  const seen = new Set();
  const placeholders = [];

  for (const match of text.matchAll(PLACEHOLDER_PATTERN)) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      placeholders.push(name);
    }
  }

  return { text, placeholders };
}

/**
 * Replaces every {{Placeholder}} occurrence with values[name]. A
 * placeholder with no matching key (or an explicitly undefined/null value)
 * renders as the literal string "Not Found" rather than being left in
 * place or throwing.
 */
function renderTemplate(text, values) {
  return text.replace(PLACEHOLDER_PATTERN, (_match, name) => {
    const value = values[name];
    return value === undefined || value === null || value === '' ? 'Not Found' : String(value);
  });
}

module.exports = { parseTemplate, renderTemplate };
