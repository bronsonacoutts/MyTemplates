#!/usr/bin/env node

// @ts-check

/**
 * Detect Drift Script
 * Detects drift between a shared pack from the MyTemplates hub and a target directory.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'catalog', 'templates.json');

function printUsage() {
  console.log(`
Usage: node scripts/detect-drift.js <pack-id> <target-dir>

Arguments:
  pack-id     The ID of the pack to check for drift (e.g., pack.github-governance)
  target-dir  The destination directory that contains the synced pack

Options:
  --help      Show this help message
`);
}

/**
 * @typedef {Object} PackEntry
 * @property {string} id
 * @property {string} type
 * @property {string} [path]
 */

/**
 * @typedef {Object} Catalog
 * @property {PackEntry[]} entries
 */

/**
 * @returns {Catalog}
 */
function readCatalog() {
  try {
    const raw = fs.readFileSync(CATALOG_PATH, 'utf8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return /** @type {Catalog} */ (JSON.parse(raw));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to read catalog at ${CATALOG_PATH}:`, message);
    process.exit(1);
  }
}

/**
 * @param {Catalog} catalog
 * @param {string} packId
 * @returns {PackEntry}
 */
function getPack(catalog, packId) {
  const pack = catalog.entries.find(
    (/** @type {PackEntry} */ entry) => entry.id === packId && entry.type === 'pack'
  );
  if (!pack) {
    console.error(`❌ Pack not found in catalog: ${packId}`);
    process.exit(1);
  }
  if (!pack.path) {
    console.error(`❌ Pack ${packId} does not have a defined 'path' in the catalog.`);
    process.exit(1);
  }
  return pack;
}

/**
 * @param {string} dir
 * @param {string} [baseDir=dir]
 * @returns {string[]}
 */
function collectFiles(dir, baseDir = dir) {
  /** @type {string[]} */
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(collectFiles(fullPath, baseDir));
    } else {
      files.push(path.relative(baseDir, fullPath));
    }
  }

  return files;
}

function detectDrift() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const positionalArgs = args.filter((arg) => !arg.startsWith('--'));

  if (positionalArgs.length !== 2) {
    console.error('❌ Error: Missing required arguments.');
    printUsage();
    process.exit(1);
  }

  const [packId, targetDirArg] = positionalArgs;
  const targetDir = path.resolve(process.cwd(), targetDirArg);

  const catalog = readCatalog();
  const pack = getPack(catalog, packId);
  const sourceDir = path.resolve(ROOT, pack.path);

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source directory does not exist: ${sourceDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Target directory does not exist: ${targetDir}`);
    process.exit(1);
  }

  console.log(`🔍 Checking for drift in pack '${packId}'`);
  console.log(`📂 Source: ${sourceDir}`);
  console.log(`📂 Target: ${targetDir}`);

  const sourceFiles = collectFiles(sourceDir);
  let driftCount = 0;

  for (const file of sourceFiles) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (!fs.existsSync(targetPath)) {
      console.log(`  ❌ Missing in target: ${file}`);
      driftCount++;
      continue;
    }

    const sourceContent = fs.readFileSync(sourcePath);
    const targetContent = fs.readFileSync(targetPath);

    if (!sourceContent.equals(targetContent)) {
      console.log(`  ⚠️  Content drift: ${file}`);
      driftCount++;
    }
  }

  if (driftCount === 0) {
    console.log(`✅ No drift detected for pack '${packId}'. Target is in sync.`);
  } else {
    console.error(`❌ Drift detected in ${driftCount} file(s).`);
    process.exit(1);
  }
}

detectDrift();
