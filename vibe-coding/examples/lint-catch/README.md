# Example: ESLint Catches Unsafe AI Output

> A walkthrough showing how the repo's lint guardrails catch common AI mistakes.

## Scenario

A developer asks Copilot to add a string formatting utility. The AI generates code
that works but violates the repo's strict TypeScript and ESLint rules.

## What the AI generated

```typescript
// src/utils/format.ts — AI-generated (raw output)

export default function formatName(first: any, last: any) {
  console.log("formatting name")
  let result = first + " " + last
  return result
}
```

## What the guardrails caught

Running `npm run validate` flags **5 issues** before the code can be committed:

```text
$ npm run lint

src/utils/format.ts
  1:1   error  Prefer named exports over default exports    import/no-default-export
  1:35  error  Unexpected any. Use unknown instead           @typescript-eslint/no-explicit-any
  1:47  error  Unexpected any. Use unknown instead           @typescript-eslint/no-explicit-any
  2:3   error  Unexpected console statement                  no-console
  3:3   error  'result' is never reassigned. Use 'const'     prefer-const

✖ 5 problems (5 errors, 0 warnings)

$ npm run type-check
# Also flags the `any` types under strict mode
```

The pre-commit hook (`husky` + `lint-staged`) would have blocked the commit entirely.

## Fixed version

```typescript
// src/utils/format.ts — after human review and corrections

/**
 * Formats a full name from first and last name parts.
 *
 * @param first - The given name.
 * @param last - The family name.
 * @returns The formatted full name.
 *
 * @example
 * const name = formatName('Grace', 'Hopper');
 * // => 'Grace Hopper'
 */
export function formatName(first: string, last: string): string {
  return `${first} ${last}`;
}
```

## What changed and why

| AI output | Issue | Fix |
|---|---|---|
| `export default function` | Named exports preferred for refactoring safety | `export function` |
| `any` parameter types | Strict mode forbids `any` | `string` |
| `console.log` | No console in production code | Removed |
| `let result` | Never reassigned | Inlined with template literal |
| No JSDoc | All exports require JSDoc | Added full JSDoc block |

## Takeaway

The repo's lint + type-check pipeline caught every issue in under 5 seconds.
The developer didn't need to memorise the rules — `npm run validate` enforced them
automatically. This is what makes vibe coding safe: the guardrails are always on.

## Related files

- ESLint config: `.eslintrc.cjs`
- TypeScript strict mode: [tsconfig.json](../../tsconfig.json)
- Pre-commit hook: runs `lint-staged` via Husky
- AI change checklist: [vibe-coding/guardrails/ai-change-checklist.md](../guardrails/ai-change-checklist.md)
