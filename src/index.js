#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { parseTemplate, renderTemplate } = require('./templateEngine');
const { scanRepo } = require('./scanner');
const { mapFacts } = require('./factMapper');

function today() {
  return new Date().toISOString().slice(0, 10);
}

function run(repoPath, templatePath, outputPath) {
  if (!fs.existsSync(repoPath)) {
    throw new Error(`Repo not found: ${repoPath}`);
  }
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const templateText = fs.readFileSync(templatePath, 'utf8');
  const { text, placeholders } = parseTemplate(templateText);

  const facts = scanRepo(repoPath);
  const values = { ...mapFacts(facts, placeholders), Last_Synced: today() };

  const rendered = renderTemplate(text, values);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, rendered, 'utf8');

  const foundCount = placeholders.filter((name) => values[name] !== undefined).length;
  return { placeholders, foundCount, rendered };
}

function main(argv) {
  const [repoPath, templatePath, outputPath] = argv;
  if (!repoPath || !templatePath || !outputPath) {
    console.error('Usage: doc-sync <repoPath> <templatePath> <outputPath>');
    process.exitCode = 1;
    return;
  }

  const { placeholders, foundCount } = run(
    path.resolve(repoPath),
    path.resolve(templatePath),
    path.resolve(outputPath),
  );
  console.log(`${foundCount} / ${placeholders.length} fields found. Wrote ${outputPath}`);
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}

module.exports = { run };
