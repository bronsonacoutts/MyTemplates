import { describe, expect, it } from 'vitest';

import {
  buildValidationTrailers,
  normaliseChecks,
  parseValidationTrailers,
} from '../../scripts/local-validation-signal.js';

describe('local-validation-signal', () => {
  it('normalises check names into a stable sorted list', () => {
    expect(normaliseChecks('test, lint, type-check, lint')).toEqual([
      'lint',
      'lint',
      'test',
      'type-check',
    ]);
  });

  it('builds and parses validation trailers', () => {
    const trailers = buildValidationTrailers(
      ['type-check', 'lint', 'validate:catalog', 'test'],
      'husky-pre-commit'
    );

    expect(parseValidationTrailers(`feat(ci): tighten automation\n\n${trailers}\n`)).toEqual({
      passed: true,
      checks: ['lint', 'test', 'type-check', 'validate:catalog'],
      source: 'husky-pre-commit',
    });
  });

  it('treats commits without trailers as unsigned', () => {
    expect(parseValidationTrailers('feat(ci): ordinary commit')).toEqual({
      passed: false,
      checks: [],
      source: null,
    });
  });
});
