#!/usr/bin/env node

// @ts-check

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const GLOBAL_SOURCE = resolve(ROOT, 'packs', 'ai-agent-instructions', 'global-instructions.md');
const LOCAL_OVERRIDE = resolve(ROOT, 'agent-instructions.local.md');
const AGENT_DEST = resolve(ROOT, 'agent-instructions.md');
const COPILOT_DEST = resolve(ROOT, '.github', 'copilot-instructions.md');

const GENERATED_HEADER = `# AI Agent & Copilot Instructions

> IMPORTANT: This file is generated from \`packs/ai-agent-instructions/global-instructions.md\` and \`agent-instructions.local.md\`.
> Edit those source files and run \`npm run sync-instructions\`.
> \`agent-instructions.md\` and \`.github/copilot-instructions.md\` must remain identical.
`;

function toErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * @param {string} filePath
 * @param {string} label
 * @returns {string}
 */
function readRequiredFile(filePath, label) {
  if (!existsSync(filePath)) {
    console.error(`❌ ${label} not found: ${filePath}`);
    process.exit(1);
  }

  try {
    return readFileSync(filePath, 'utf8').trim();
  } catch (err) {
    console.error(`❌ Failed to read ${label}: ${toErrorMessage(err)}`);
    process.exit(1);
  }
}

/**
 * @returns {string}
 */
function buildInstructions() {
  const globalContent = readRequiredFile(GLOBAL_SOURCE, 'global instructions source');
  const localContent = readRequiredFile(LOCAL_OVERRIDE, 'local instruction override');

  return `${GENERATED_HEADER}\n\n${globalContent}\n\n${localContent}\n`;
}

/**
 * @param {string} destination
 * @param {string} content
 * @param {string} label
 */
function writeAndVerify(destination, content, label) {
  try {
    writeFileSync(destination, content, 'utf8');
  } catch (err) {
    console.error(`❌ Failed to write ${label}: ${toErrorMessage(err)}`);
    process.exit(1);
  }

  try {
    const writtenContent = readFileSync(destination, 'utf8');
    if (writtenContent !== content) {
      console.error(`❌ Verification failed: ${label} does not match generated content.`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Failed to verify ${label}: ${toErrorMessage(err)}`);
    process.exit(1);
  }
}

function main() {
  const generatedContent = buildInstructions();

  writeAndVerify(AGENT_DEST, generatedContent, 'agent-instructions.md');
  writeAndVerify(COPILOT_DEST, generatedContent, '.github/copilot-instructions.md');

  console.log(
    '✅ Synced generated instructions from packs/ai-agent-instructions/global-instructions.md and agent-instructions.local.md'
  );
  console.log(
    '✅ Verification passed: agent-instructions.md and .github/copilot-instructions.md are identical.'
  );
}

main();
