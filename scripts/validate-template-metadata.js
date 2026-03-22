#!/usr/bin/env node

// @ts-check

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @typedef {Record<string, unknown>} JsonObject
 */

/**
 * @typedef {{
 *   requireManifestReference?: boolean;
 * }} ValidateOptions
 */

/**
 * @typedef {'id' | 'name' | 'type' | 'status' | 'maturity' | 'audience' | 'stack' | 'summary' | 'path' | 'phase' | 'aiPolicy' | 'backlog'} ComparableField
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG_PATH = path.join(ROOT, 'catalog', 'templates.json');
const ALLOWED_TYPES = new Set(['template', 'pack']);
const ALLOWED_STATUSES = new Set(['present', 'planned']);
const ALLOWED_MATURITY = new Set(['planned', 'incubating', 'ready']);
const ALLOWED_PHASES = new Set(['phase-1', 'phase-2', 'phase-3', 'phase-4']);
const ID_PATTERN = /^(template|pack)\.[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;

/**
 * @param {unknown} value
 * @returns {value is JsonObject}
 */
function isJsonObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * @param {unknown} value
 * @returns {value is string[]}
 */
function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => isNonEmptyString(item));
}

/**
 * @param {unknown} value
 * @returns {value is ComparableField}
 */
function isComparableField(value) {
  return (
    value === 'id' ||
    value === 'name' ||
    value === 'type' ||
    value === 'status' ||
    value === 'maturity' ||
    value === 'audience' ||
    value === 'stack' ||
    value === 'summary' ||
    value === 'path' ||
    value === 'phase' ||
    value === 'backlog'
  );
}

/**
 * @param {string} relativePath
 * @returns {unknown}
 */
function readJson(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  const raw = readFileSync(absolutePath, 'utf8');

  try {
    return /** @type {unknown} */ (JSON.parse(raw));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${relativePath}: invalid JSON (${message})`);
  }
}

/**
 * @param {boolean} condition
 * @param {string} message
 * @param {string[]} errors
 */
function assert(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

/**
 * @param {unknown} value
 * @param {string} fieldName
 * @param {string[]} errors
 */
function validateString(value, fieldName, errors) {
  assert(isNonEmptyString(value), `${fieldName} must be a non-empty string`, errors);
}

/**
 * @param {unknown} value
 * @param {string} fieldName
 * @param {string[]} errors
 */
function validateStringArray(value, fieldName, errors) {
  assert(
    Array.isArray(value) && value.length > 0,
    `${fieldName} must be a non-empty array`,
    errors
  );

  if (!Array.isArray(value)) {
    return;
  }

  const seen = new Set();
  for (const item of value) {
    assert(isNonEmptyString(item), `${fieldName} must only contain non-empty strings`, errors);
    if (isNonEmptyString(item)) {
      assert(!seen.has(item), `${fieldName} must not contain duplicates`, errors);
      seen.add(item);
    }
  }
}

/**
 * @param {JsonObject} entry
 * @param {string[]} errors
 */
function validateBacklogPaths(entry, errors) {
  const backlog = entry.backlog;
  if (backlog === undefined) {
    return;
  }

  validateStringArray(backlog, 'backlog', errors);
  if (!isNonEmptyStringArray(backlog)) {
    return;
  }

  for (const backlogPath of backlog) {
    const absolutePath = path.join(ROOT, backlogPath);
    assert(
      backlogPath.startsWith('docs/migration/issues/'),
      `backlog path must live under docs/migration/issues/: ${backlogPath}`,
      errors
    );
    assert(backlogPath.endsWith('.md'), `backlog path must end in .md: ${backlogPath}`, errors);
    assert(existsSync(absolutePath), `backlog path does not exist: ${backlogPath}`, errors);
  }
}

/**
 * @param {JsonObject} entry
 * @param {string} label
 * @param {string[]} errors
 */
function validateAiPolicy(entry, label, errors) {
  const aiPolicy = entry.aiPolicy;
  if (aiPolicy === undefined) {
    return;
  }

  assert(isJsonObject(aiPolicy), `${label}.aiPolicy must be an object`, errors);
  if (!isJsonObject(aiPolicy)) {
    return;
  }

  validateString(aiPolicy.instructionsPack, `${label}.aiPolicy.instructionsPack`, errors);
  assert(
    isNonEmptyString(aiPolicy.instructionsPack) && aiPolicy.instructionsPack.startsWith('pack.'),
    `${label}.aiPolicy.instructionsPack must reference a pack id`,
    errors
  );

  validateString(aiPolicy.globalSource, `${label}.aiPolicy.globalSource`, errors);
  validateString(aiPolicy.localOverride, `${label}.aiPolicy.localOverride`, errors);
  validateStringArray(aiPolicy.mirrorFiles, `${label}.aiPolicy.mirrorFiles`, errors);
  validateString(aiPolicy.syncScript, `${label}.aiPolicy.syncScript`, errors);
  validateString(
    aiPolicy.promptInjectionDefense,
    `${label}.aiPolicy.promptInjectionDefense`,
    errors
  );

  if (isNonEmptyString(aiPolicy.globalSource)) {
    assert(
      existsSync(path.join(ROOT, aiPolicy.globalSource)),
      `${label}.aiPolicy.globalSource does not exist: ${aiPolicy.globalSource}`,
      errors
    );
  }

  if (isNonEmptyString(aiPolicy.syncScript)) {
    assert(
      existsSync(path.join(ROOT, aiPolicy.syncScript)),
      `${label}.aiPolicy.syncScript does not exist: ${aiPolicy.syncScript}`,
      errors
    );
  }

  if (isNonEmptyStringArray(aiPolicy.mirrorFiles)) {
    assert(
      aiPolicy.mirrorFiles.length >= 2,
      `${label}.aiPolicy.mirrorFiles must list at least two mirrored outputs`,
      errors
    );
  }

  assert(
    aiPolicy.promptInjectionDefense === 'required',
    `${label}.aiPolicy.promptInjectionDefense must be "required"`,
    errors
  );
}

/**
 * @param {string | undefined} schemaVersion
 * @param {JsonObject} entry
 * @returns {JsonObject}
 */
function withSchemaVersion(schemaVersion, entry) {
  return {
    ...entry,
    schemaVersion,
  };
}

/**
 * @param {JsonObject} entry
 * @param {string} label
 * @param {ValidateOptions} [options]
 * @returns {string[]}
 */
function validateEntry(entry, label, options = {}) {
  /** @type {string[]} */
  const errors = [];
  const { requireManifestReference = false } = options;

  validateString(entry.schemaVersion, `${label}.schemaVersion`, errors);
  assert(entry.schemaVersion === '1.0.0', `${label}.schemaVersion must be "1.0.0"`, errors);

  validateString(entry.id, `${label}.id`, errors);
  assert(
    isNonEmptyString(entry.id) && ID_PATTERN.test(entry.id),
    `${label}.id must use the pattern "type.slug"`,
    errors
  );

  validateString(entry.name, `${label}.name`, errors);

  validateString(entry.type, `${label}.type`, errors);
  assert(
    isNonEmptyString(entry.type) && ALLOWED_TYPES.has(entry.type),
    `${label}.type must be one of: ${Array.from(ALLOWED_TYPES).join(', ')}`,
    errors
  );

  validateString(entry.status, `${label}.status`, errors);
  assert(
    isNonEmptyString(entry.status) && ALLOWED_STATUSES.has(entry.status),
    `${label}.status must be one of: ${Array.from(ALLOWED_STATUSES).join(', ')}`,
    errors
  );

  validateString(entry.maturity, `${label}.maturity`, errors);
  assert(
    isNonEmptyString(entry.maturity) && ALLOWED_MATURITY.has(entry.maturity),
    `${label}.maturity must be one of: ${Array.from(ALLOWED_MATURITY).join(', ')}`,
    errors
  );

  validateStringArray(entry.audience, `${label}.audience`, errors);
  validateStringArray(entry.stack, `${label}.stack`, errors);
  validateString(entry.summary, `${label}.summary`, errors);

  if (entry.path !== undefined) {
    validateString(entry.path, `${label}.path`, errors);
    if (isNonEmptyString(entry.path)) {
      assert(
        existsSync(path.join(ROOT, entry.path)),
        `${label}.path does not exist: ${entry.path}`,
        errors
      );
    }
  }

  if (entry.manifest !== undefined) {
    validateString(entry.manifest, `${label}.manifest`, errors);
    if (isNonEmptyString(entry.manifest)) {
      assert(
        existsSync(path.join(ROOT, entry.manifest)),
        `${label}.manifest does not exist: ${entry.manifest}`,
        errors
      );
    }
  }

  if (entry.phase !== undefined) {
    validateString(entry.phase, `${label}.phase`, errors);
    assert(
      isNonEmptyString(entry.phase) && ALLOWED_PHASES.has(entry.phase),
      `${label}.phase must be one of: ${Array.from(ALLOWED_PHASES).join(', ')}`,
      errors
    );
  }

  if (entry.notes !== undefined) {
    validateString(entry.notes, `${label}.notes`, errors);
  }

  validateAiPolicy(entry, label, errors);
  validateBacklogPaths(entry, errors);

  if (entry.status === 'present') {
    assert(entry.path !== undefined, `${label}.path is required when status is present`, errors);
  }

  if (requireManifestReference && entry.type === 'template' && entry.status === 'present') {
    assert(
      entry.manifest !== undefined,
      `${label}.manifest is required for present templates`,
      errors
    );
  }

  return errors;
}

/**
 * @param {string} directory
 * @returns {string[]}
 */
function collectManifestPaths(directory) {
  /** @type {string[]} */
  const manifests = [];

  for (const item of readdirSync(directory)) {
    const absolutePath = path.join(directory, item);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      manifests.push(...collectManifestPaths(absolutePath));
      continue;
    }

    if (item === 'template.manifest.json') {
      const relativePath = path.relative(ROOT, absolutePath);
      manifests.push(relativePath.split(path.sep).join('/'));
    }
  }

  return manifests;
}

/**
 * @param {JsonObject} manifest
 * @param {JsonObject} catalogEntry
 * @param {ComparableField} fieldName
 * @param {string[]} errors
 */
function compareField(manifest, catalogEntry, fieldName, errors) {
  const manifestValue = JSON.stringify(manifest[fieldName]);
  const catalogValue = JSON.stringify(catalogEntry[fieldName]);

  assert(
    manifestValue === catalogValue,
    `manifest mismatch for ${String(catalogEntry.id)}: field "${fieldName}" differs between catalogue and manifest`,
    errors
  );
}

function main() {
  /** @type {string[]} */
  const errors = [];
  const catalogData = readJson(path.relative(ROOT, CATALOG_PATH));

  assert(isJsonObject(catalogData), 'catalog/templates.json must contain an object', errors);
  if (!isJsonObject(catalogData)) {
    printAndExit(errors);
    return;
  }

  const catalog = catalogData;
  assert(
    catalog.schemaVersion === '1.0.0',
    'catalog/templates.json schemaVersion must be "1.0.0"',
    errors
  );
  assert(
    catalog.manifestSchema === 'catalog/template-manifest.schema.json',
    'catalog/templates.json manifestSchema must point to catalog/template-manifest.schema.json',
    errors
  );

  const entries = catalog.entries;
  assert(
    Array.isArray(entries) && entries.length > 0,
    'catalog/templates.json entries must be a non-empty array',
    errors
  );

  if (!Array.isArray(entries)) {
    printAndExit(errors);
    return;
  }

  const schemaVersion = isNonEmptyString(catalog.schemaVersion) ? catalog.schemaVersion : undefined;
  const ids = new Set();
  const referencedManifestPaths = new Set();

  for (const [index, entryData] of entries.entries()) {
    const label = `catalog.entries[${index}]`;
    assert(isJsonObject(entryData), `${label} must be an object`, errors);
    if (!isJsonObject(entryData)) {
      continue;
    }

    const entry = withSchemaVersion(schemaVersion, entryData);
    errors.push(...validateEntry(entry, label, { requireManifestReference: true }));

    if (isNonEmptyString(entry.id)) {
      assert(!ids.has(entry.id), `duplicate catalogue id: ${entry.id}`, errors);
      ids.add(entry.id);
    }

    if (isNonEmptyString(entry.manifest)) {
      referencedManifestPaths.add(entry.manifest);
    }
  }

  for (const entryData of entries) {
    if (!isJsonObject(entryData)) {
      continue;
    }

    const entry = withSchemaVersion(schemaVersion, entryData);
    if (!isNonEmptyString(entry.manifest) || !existsSync(path.join(ROOT, entry.manifest))) {
      continue;
    }

    const manifestData = readJson(entry.manifest);
    assert(isJsonObject(manifestData), `${entry.manifest} must contain an object`, errors);
    if (!isJsonObject(manifestData)) {
      continue;
    }

    const manifest = manifestData;
    errors.push(...validateEntry(manifest, entry.manifest));

    /** @type {ComparableField[]} */
    const comparableFields = [
      'id',
      'name',
      'type',
      'status',
      'maturity',
      'audience',
      'stack',
      'summary',
      'path',
      'phase',
      'aiPolicy',
      'backlog',
    ];

    for (const fieldName of comparableFields) {
      if (isComparableField(fieldName)) {
        compareField(manifest, entry, fieldName, errors);
      }
    }
  }

  const discoveredManifests = collectManifestPaths(path.join(ROOT, 'templates'));
  for (const manifestPath of discoveredManifests) {
    assert(
      referencedManifestPaths.has(manifestPath),
      `manifest is not referenced by catalog/templates.json: ${manifestPath}`,
      errors
    );
  }

  printAndExit(errors);
}

/**
 * @param {string[]} errors
 */
function printAndExit(errors) {
  if (errors.length === 0) {
    console.log('✅ Template catalogue and manifest metadata validation passed');
    process.exit(0);
  }

  console.error('❌ Template catalogue validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

main();
