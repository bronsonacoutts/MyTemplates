#!/usr/bin/env node

// @ts-check

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const STATE_DIRECTORY = resolve(ROOT, '.git', '.mytemplates');
const STATE_PATH = resolve(STATE_DIRECTORY, 'local-validation.json');
const STATUS_TRAILER = 'Local-Validation';
const CHECKS_TRAILER = 'Local-Validation-Checks';
const SOURCE_TRAILER = 'Local-Validation-Source';

/**
 * @typedef {{ checks: string[]; source: string; createdAt: string }} ValidationState
 */

/**
 * @param {unknown} error
 * @returns {string}
 */
function toErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * @param {string} value
 * @returns {string[]}
 */
export function normaliseChecks(value) {
  return value
    .split(',')
    .map((check) => check.trim())
    .filter(Boolean)
    .sort();
}

/**
 * @param {string} message
 * @returns {{ passed: boolean; checks: string[]; source: string | null }}
 */
export function parseValidationTrailers(message) {
  const lines = message.split(/\r?\n/);
  const statusLine = lines.find((line) => line.startsWith(`${STATUS_TRAILER}:`)) ?? '';
  const checksLine = lines.find((line) => line.startsWith(`${CHECKS_TRAILER}:`)) ?? '';
  const sourceLine = lines.find((line) => line.startsWith(`${SOURCE_TRAILER}:`)) ?? '';

  const passed = statusLine.split(':').slice(1).join(':').trim().toLowerCase() === 'passed';
  const checks = checksLine ? normaliseChecks(checksLine.split(':').slice(1).join(':')) : [];
  const source = sourceLine ? sourceLine.split(':').slice(1).join(':').trim() : null;

  return { passed, checks, source };
}

/**
 * @param {string[]} checks
 * @param {string} source
 * @returns {string}
 */
export function buildValidationTrailers(checks, source) {
  const normalisedChecks = [...checks].sort().join(', ');

  return [
    `${STATUS_TRAILER}: passed`,
    `${CHECKS_TRAILER}: ${normalisedChecks}`,
    `${SOURCE_TRAILER}: ${source}`,
  ].join('\n');
}

/**
 * @returns {ValidationState | null}
 */
function readState() {
  if (!existsSync(STATE_PATH)) {
    return null;
  }

  const rawState = /** @type {unknown} */ (JSON.parse(readFileSync(STATE_PATH, 'utf8')));

  if (
    rawState &&
    typeof rawState === 'object' &&
    'checks' in rawState &&
    Array.isArray(rawState.checks) &&
    rawState.checks.every((check) => typeof check === 'string') &&
    'source' in rawState &&
    typeof rawState.source === 'string' &&
    'createdAt' in rawState &&
    typeof rawState.createdAt === 'string'
  ) {
    return {
      checks: rawState.checks,
      source: rawState.source,
      createdAt: rawState.createdAt,
    };
  }

  throw new Error(`Invalid local validation state in ${STATE_PATH}`);
}

/**
 * @param {ValidationState} state
 */
function writeState(state) {
  mkdirSync(STATE_DIRECTORY, { recursive: true });
  writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

function clearState() {
  if (existsSync(STATE_PATH)) {
    rmSync(STATE_PATH);
  }
}

/**
 * @param {string | undefined} sha
 * @returns {string}
 */
function readCommitMessage(sha) {
  const target = sha?.trim() ? sha.trim() : 'HEAD';
  const safeTarget = target.replace(/"/g, '');

  return execSync(`git show -s --format=%B "${safeTarget}"`, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/**
 * @param {string} messageFilePath
 */
function attachSignal(messageFilePath) {
  const state = readState();

  if (!state) {
    console.log('ℹ️ No local validation state found. Leaving commit message unchanged.');
    return;
  }

  const originalMessage = readFileSync(messageFilePath, 'utf8').trimEnd();
  const existingSignal = parseValidationTrailers(originalMessage);

  if (existingSignal.passed) {
    clearState();
    console.log('ℹ️ Commit message already contains a local validation signal.');
    return;
  }

  const signalBlock = buildValidationTrailers(state.checks, state.source);
  const nextMessage = `${originalMessage}\n\n${signalBlock}\n`;
  writeFileSync(messageFilePath, nextMessage, 'utf8');
  clearState();

  console.log('✅ Added local validation trailers to the commit message.');
}

/**
 * @param {string[]} requiredChecks
 * @param {string | undefined} sha
 * @returns {boolean}
 */
function inspectSignal(requiredChecks, sha) {
  const message = readCommitMessage(sha);
  const signal = parseValidationTrailers(message);

  if (!signal.passed) {
    console.log('ℹ️ No passing local validation signal found on the target commit.');
    return false;
  }

  const missingChecks = requiredChecks.filter((check) => !signal.checks.includes(check));

  if (missingChecks.length > 0) {
    console.log(
      `ℹ️ Local validation signal is present, but it does not cover: ${missingChecks.join(', ')}`
    );
    return false;
  }

  console.log(
    `✅ Local validation signal covers: ${
      requiredChecks.length > 0 ? requiredChecks.join(', ') : signal.checks.join(', ')
    }`
  );
  return true;
}

function main() {
  const [command, ...args] = process.argv.slice(2);

  try {
    switch (command) {
      case 'clear': {
        clearState();
        console.log('✅ Cleared pending local validation state.');
        return;
      }
      case 'mark': {
        const checksArgument = args[0] ?? '';
        const source = args[1] ?? 'husky-pre-commit';
        const checks = normaliseChecks(checksArgument);

        if (checks.length === 0) {
          console.error('❌ mark requires a comma-separated checks argument.');
          process.exit(1);
        }

        writeState({
          checks,
          source,
          createdAt: new Date().toISOString(),
        });
        console.log(`✅ Recorded local validation state for: ${checks.join(', ')}`);
        return;
      }
      case 'attach': {
        const messageFilePath = args[0];

        if (!messageFilePath) {
          console.error('❌ attach requires the commit message file path.');
          process.exit(1);
        }

        attachSignal(messageFilePath);
        return;
      }
      case 'inspect': {
        const checksArgument = args[0] ?? '';
        const sha = args[1];
        const requiredChecks = checksArgument ? normaliseChecks(checksArgument) : [];
        process.exit(inspectSignal(requiredChecks, sha) ? 0 : 1);
        return;
      }
      default:
        console.error(
          '❌ Unknown command. Use one of: clear, mark <checks> [source], attach <message-file>, inspect <checks> [sha]'
        );
        process.exit(1);
        return;
    }
  } catch (error) {
    console.error(`❌ ${toErrorMessage(error)}`);
    process.exit(1);
  }
}

const isEntrypoint =
  process.argv[1] !== undefined && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isEntrypoint) {
  main();
}
