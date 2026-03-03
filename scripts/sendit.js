#!/usr/bin/env node

/**
 * Sendit Script - Quick PR creation helper
 * Usage: npm run sendit [optional-message]
 */

import { execSync } from 'node:child_process';

const commitMessage = process.argv.slice(2).join(' ') || 'Quick update';

try {
  // Stage all changes
  console.log('📦 Staging changes...');
  execSync('git add .', { stdio: 'inherit' });

  // Commit
  console.log(`💾 Committing: "${commitMessage}"`);
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

  // Push
  console.log('🚀 Pushing to remote...');
  execSync('git push', { stdio: 'inherit' });

  console.log('✅ Done! Your changes are pushed.');
  console.log('\n💡 Tip: Create a PR on GitHub to merge your changes.');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
