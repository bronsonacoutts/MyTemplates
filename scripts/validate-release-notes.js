#!/usr/bin/env node

/**
 * Release Notes Validation Script
 * Ensures release notes exist and follow the required format
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RELEASE_NOTES_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'RELEASE_NOTES.md'
);

try {
  // Check if release notes file exists
  if (!existsSync(RELEASE_NOTES_PATH)) {
    console.warn('⚠️  RELEASE_NOTES.md not found. Create one for the next release.');
    process.exit(0); // Don't fail, just warn
  }

  const content = readFileSync(RELEASE_NOTES_PATH, 'utf-8');

  // Check for required sections
  const requiredSections = ['## Changes', '## Breaking Changes'];
  const missingSections = requiredSections.filter((section) => !content.includes(section));

  if (missingSections.length > 0) {
    console.error(`
❌ Release notes validation failed!

Missing required sections:
${missingSections.map((s) => `  - ${s}`).join('\n')}

Please ensure RELEASE_NOTES.md contains:
  - ## Changes (list of changes)
  - ## Breaking Changes (or "None" if no breaking changes)
`);
    process.exit(1);
  }

  // Check for version header (e.g., # v1.2.3)
  if (!/^#\s+v?\d+\.\d+\.\d+/m.test(content)) {
    console.warn('⚠️  Release notes should start with a version header (e.g., # v1.2.3)');
  }

  console.log('✅ Release notes validation passed');
  process.exit(0);
} catch (error) {
  console.error('Error validating release notes:', error.message);
  process.exit(1);
}
