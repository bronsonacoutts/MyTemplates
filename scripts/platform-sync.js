#!/usr/bin/env node

/**
 * Platform Sync Script for Monorepo Parity
 * Ensures platform-specific changes (web, mobile) are kept in sync
 */

const { execSync } = require('child_process');

const tasks = [
  { name: 'Web Build', command: 'npm run build --workspace=web' },
  { name: 'Mobile Type Check', command: 'npm run type-check --workspace=mobile' },
];

console.log('🔄 Running platform sync checks...\n');

let allPassed = true;

for (const task of tasks) {
  try {
    console.log(`▶️  ${task.name}...`);
    execSync(task.command, { stdio: 'inherit' });
    console.log(`✅ ${task.name} passed\n`);
  } catch (error) {
    console.error(`❌ ${task.name} failed\n`);
    allPassed = false;
    // Continue checking other tasks
  }
}

if (!allPassed) {
  console.error('\n❌ Platform sync failed. Fix the errors above.');
  process.exit(1);
}

console.log('✅ All platform sync checks passed!');
process.exit(0);
