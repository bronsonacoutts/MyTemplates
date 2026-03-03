#!/usr/bin/env node

/**
 * Branch Validation Script
 * Ensures branch names follow conventional naming patterns
 */

import { execSync } from 'node:child_process';

const VALID_PATTERNS = [
  /^feature\/.+/,
  /^fix\/.+/,
  /^hotfix\/.+/,
  /^release\/.+/,
  /^chore\/.+/,
  /^docs\/.+/,
  /^refactor\/.+/,
  /^test\/.+/,
  /^copilot\/.+/,
  /^codex\/.+/,
  /^main$/,
  /^develop$/,
  /^staging$/,
];

try {
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();

  const isValid = VALID_PATTERNS.some((pattern) => pattern.test(currentBranch));

  if (!isValid) {
    console.error(`
❌ Invalid branch name: "${currentBranch}"

Branch names must follow one of these patterns:
  - feature/<description>
  - fix/<description>
  - hotfix/<description>
  - release/<version>
  - chore/<description>
  - docs/<description>
  - refactor/<description>
  - test/<description>
  - copilot/<description>
  - main
  - develop
  - staging

Example: feature/add-user-authentication
`);
    process.exit(1);
  }

  console.log(`✅ Branch name "${currentBranch}" is valid`);
  process.exit(0);
} catch (error) {
  console.error('Error validating branch name:', error.message);
  process.exit(1);
}
