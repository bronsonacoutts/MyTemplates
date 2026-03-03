# Example: AI adds a utility function safely

End-to-end walkthrough showing how AI-generated code passes through the repo's guardrails.

---

## Scenario

You ask Copilot to create a `slugify` utility that converts a string to a URL-safe slug.

## Step 1 — Use the prompt template

Paste the [add-feature prompt](../../vibe-coding/prompts/add-feature.md) into your AI tool
with these placeholders filled in:

> **Module:** `src/utils/slugify.ts`
> **Behaviour:** Convert an arbitrary string to a lowercase, hyphen-separated,
> URL-safe slug. Strip non-alphanumeric characters.
> Trim leading/trailing hyphens. Collapse consecutive hyphens.
> **Edge cases:** Empty string → empty string. Already-slugified input → unchanged.
> Unicode accented characters → stripped (not transliterated).

## Step 2 — AI generates the code

### `src/utils/slugify.ts` (AI output)

```typescript
/**
 * Convert a string to a URL-safe slug.
 *
 * @param input - The string to slugify.
 * @returns A lowercase, hyphen-separated slug.
 *
 * @example
 * slugify('Hello World!') // 'hello-world'
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
```

### `test/utils/slugify.test.ts` (AI output)

```typescript
import { describe, expect, it } from 'vitest';
import { slugify } from '../../src/utils/slugify';

describe('slugify', () => {
  it('should convert a simple string to a slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should strip non-alphanumeric characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('should collapse consecutive hyphens', () => {
    expect(slugify('foo---bar')).toBe('foo-bar');
  });

  it('should trim leading and trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello');
  });

  it('should return an empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });

  it('should leave an already-slugified string unchanged', () => {
    expect(slugify('already-a-slug')).toBe('already-a-slug');
  });

  it('should strip unicode accented characters', () => {
    expect(slugify('café résumé')).toBe('caf-rsum');
  });
});
```

## Step 3 — Run validation

```bash
npm run validate
```

### What the guardrails check

| Guardrail         | Result   | Why                                                  |
| ----------------- | -------- | ---------------------------------------------------- |
| ESLint            | **Pass** | No `any`, no `console.log`, proper imports           |
| TypeScript strict | **Pass** | Return type is explicit `string`, parameter is typed |
| Vitest            | **Pass** | All 7 tests pass, no network calls involved          |
| Coverage          | **Pass** | New function is fully covered                        |
| JSDoc             | **Pass** | `@param`, `@returns`, and `@example` present         |

## Step 4 — Walk the checklist

Open [ai-change-checklist.md](../../vibe-coding/guardrails/ai-change-checklist.md):

- [x] I can explain every line of the generated code
- [x] No `any` types or `@ts-ignore` comments
- [x] No hardcoded secrets or credentials
- [x] All new functions have JSDoc with `@param` and `@returns`
- [x] Unit tests cover the happy path and at least one edge case
- [x] Tests do not make real network calls
- [x] `npm run validate` passes
- [x] I have reviewed the diff, not just the AI summary
- [x] No new dependencies were introduced
- [x] Changes are limited to the stated scope
- [x] Commit message follows conventional commits

## Step 5 — Commit and PR

```bash
git add src/utils/slugify.ts test/utils/slugify.test.ts
git commit -m "feat(utils): add slugify utility"
git push
```

The PR template's AI-Assisted Changes section:

> **Were any changes AI-assisted?** Yes
> **Tool used:** GitHub Copilot
> **Prompt used:** add-feature template with slugify spec
> **Areas touched by AI:** `src/utils/slugify.ts`, `test/utils/slugify.test.ts`

---

## Key takeaway

The AI output was clean in this case — but the guardrails verified it automatically.
If the AI had used `any`, skipped JSDoc, or left a `console.log`, the validation
would have failed _before_ the code left your machine.
