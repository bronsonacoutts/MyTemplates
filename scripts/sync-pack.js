#!/usr/bin/env node

// @ts-check

/**
 * Sync Pack Script
 * Syncs a shared pack from the MyTemplates hub to a target directory.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'catalog', 'templates.json');

function printUsage() {
  console.log(`
Usage: node scripts/sync-pack.js <pack-id> <target-dir> [--dry-run]

Arguments:
  pack-id     The ID of the pack to sync (e.g., pack.github-governance)
  target-dir  The destination directory to sync the pack into

Options:
  --dry-run   Preview changes without modifying the target directory
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

function syncPack() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const isDryRun = args.includes('--dry-run');
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

  console.log(`🔄 Syncing pack '${packId}'`);
  console.log(`📂 Source: ${sourceDir}`);
  console.log(`📂 Target: ${targetDir}`);
  if (isDryRun) {
    console.log(`⚠️  DRY RUN: No files will be modified.`);
  }

  const sourceFiles = collectFiles(sourceDir);
  let syncedCount = 0;

  for (const file of sourceFiles) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    const targetFileDir = path.dirname(targetPath);

    if (fs.existsSync(targetPath)) {
      const sourceContent = fs.readFileSync(sourcePath);
      const targetContent = fs.readFileSync(targetPath);

      if (sourceContent.equals(targetContent)) {
        // Files are identical, skip
        continue;
      }
    }

    console.log(`  📝 ${isDryRun ? '[Preview]' : ''} Syncing: ${file}`);

    if (!isDryRun) {
      if (!fs.existsSync(targetFileDir)) {
        fs.mkdirSync(targetFileDir, { recursive: true });
      }
      fs.copyFileSync(sourcePath, targetPath);
    }

    syncedCount++;
  }

  if (syncedCount === 0) {
    console.log(`✅ Target is already in sync with pack '${packId}'.`);
  } else {
    console.log(`✅ Synced ${syncedCount} file(s).`);
  }
}

syncPack();
