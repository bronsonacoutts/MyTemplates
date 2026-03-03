# Example: AI-generated test caught by no-network harness

End-to-end walkthrough showing how the test harness stops AI-generated code from making real HTTP calls.

---

## Scenario

You ask ChatGPT to write tests for a `fetchUser` function that calls an external API.

## Step 1 — The function under test

### `src/services/user-service.ts`

```typescript
import type { User } from '../types';

/**
 * Fetch a user by ID from the external API.
 *
 * @param id - The user's UUID.
 * @returns The user object.
 * @throws {Error} When the API returns a non-OK response.
 */
export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`https://api.example.com/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return response.json() as Promise<User>;
}
```

## Step 2 — AI generates tests (first attempt)

ChatGPT produces this test file:

### `test/services/user-service.test.ts` (AI output — UNSAFE)

```typescript
import { describe, expect, it } from 'vitest';
import { fetchUser } from '../../src/services/user-service';

describe('fetchUser', () => {
  it('should return user data', async () => {
    // ❌ This calls the REAL API
    const user = await fetchUser('550e8400-e29b-41d4-a716-446655440000');
    expect(user).toBeDefined();
    expect(user.id).toBe('550e8400-e29b-41d4-a716-446655440000');
  });
});
```

## Step 3 — Run the tests

```bash
npm test
```

### What happens

The test **fails immediately** with:

```text
Error: Network requests are not allowed in unit tests.
Use vi.mock() to mock network dependencies.
Attempted URL: https://api.example.com/users/550e8400-e29b-41d4-a716-446655440000
```

This error comes from [test/setup.ts](../../test/setup.ts), which globally replaces
`fetch` and `XMLHttpRequest` with stubs that throw. The AI did not know about this
harness and generated a test that calls the real endpoint.

### Why this matters

- Real API calls make tests **flaky** (network timeouts, rate limits, API changes).
- Real calls leak **test intent** to third parties.
- Real calls can have **side effects** (creating records, triggering webhooks).
- CI environments often have **no outbound network access**.

## Step 4 — Fix using the AI tool

Feed the error back to ChatGPT with this follow-up:

> The test failed because `test/setup.ts` blocks network calls. Rewrite the test
> using `vi.mock()` to mock `fetch`. The mock should return a resolved `Response`
> with JSON body
> `{ id: '550e8400-e29b-41d4-a716-446655440000', name: 'Test User' }`.

### `test/services/user-service.test.ts` (AI output — FIXED)

```typescript
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchUser } from '../../src/services/user-service';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('fetchUser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return user data when API responds with 200', async () => {
    const mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Test User',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    const user = await fetchUser('550e8400-e29b-41d4-a716-446655440000');

    expect(user).toEqual(mockUser);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/users/550e8400-e29b-41d4-a716-446655440000',
    );
  });

  it('should throw when API responds with non-OK status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(
      fetchUser('nonexistent-id'),
    ).rejects.toThrow('Failed to fetch user: 404');
  });
});
```

## Step 5 — Run validation again

```bash
npm run validate
```

| Guardrail | Result | Why |
|---|---|---|
| No-network harness | **Pass** | `fetch` is mocked via `vi.stubGlobal`, no real calls |
| ESLint | **Pass** | Proper imports, no `any`, no console |
| TypeScript strict | **Pass** | All types inferred correctly |
| Coverage | **Pass** | Both happy path and error path covered |

## Step 6 — Walk the checklist and commit

The [AI change checklist](../../vibe-coding/guardrails/ai-change-checklist.md) passes. Commit:

```bash
git add test/services/user-service.test.ts
git commit -m "test(user-service): add unit tests with mocked fetch"
```

---

## Key takeaway

The no-network harness turned a **silent correctness bug** (tests passing because a real
API happened to be up) into a **loud, immediate failure**. The AI's first attempt was
wrong, but the guardrail caught it before it could reach CI or production. Feeding the
error back to the AI produced a correct, isolated test on the second attempt.
