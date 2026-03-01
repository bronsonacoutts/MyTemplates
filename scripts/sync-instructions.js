#!/usr/bin/env node
/**
 * sync-instructions.js
 *
 * Reads agent-instructions.md from the repository root and writes its content
 * to .github/copilot-instructions.md, ensuring both files are identical.
 *
 * Usage: node scripts/sync-instructions.js
 * Or via npm: npm run sync-instructions
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SOURCE = resolve(ROOT, 'agent-instructions.md');
const DEST = resolve(ROOT, '.github', 'copilot-instructions.md');

function main() {
  // Verify source exists
  if (!existsSync(SOURCE)) {
    console.error(`❌ Source file not found: ${SOURCE}`);
    process.exit(1);
  }

  let sourceContent;
  try {
    sourceContent = readFileSync(SOURCE, 'utf8');
  } catch (err) {
    console.error(`❌ Failed to read source file: ${err.message}`);
    process.exit(1);
  }

  // Write to destination
  try {
    writeFileSync(DEST, sourceContent, 'utf8');
    console.log(`✅ Synced: agent-instructions.md → .github/copilot-instructions.md`);
  } catch (err) {
    console.error(`❌ Failed to write destination file: ${err.message}`);
    process.exit(1);
  }

  // Verify both files match
  let destContent;
  try {
    destContent = readFileSync(DEST, 'utf8');
  } catch (err) {
    console.error(`❌ Failed to verify destination file: ${err.message}`);
    process.exit(1);
  }

  if (sourceContent !== destContent) {
    console.error('❌ Verification failed: files do not match after sync.');
    process.exit(1);
  }

  console.log('✅ Verification passed: both files are identical.');
}

main();
