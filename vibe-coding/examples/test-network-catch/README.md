# Example: Test Harness Blocks Network Call

> A walkthrough showing how the no-network test harness catches AI-generated code
> that accidentally makes real HTTP requests.

## Scenario

A developer asks an AI to write a user service with tests. The AI generates the
service correctly but writes a test that calls the real API instead of mocking it.

## What the AI generated

```typescript
// src/services/user-service.ts — AI-generated (correct)

export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getUser(id: string): Promise<User> {
  const response = await fetch(`https://api.example.com/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return response.json() as Promise<User>;
}
```

```typescript
// test/services/user-service.test.ts — AI-generated (BROKEN)

import { describe, it, expect } from 'vitest';
import { getUser } from '../../src/services/user-service.js';

describe('getUser', () => {
  it('should fetch a user by ID', async () => {
    // BUG: This calls the real API!
    const user = await getUser('123');
    expect(user).toHaveProperty('name');
  });
});
```

## What the guardrails caught

Running `npm test` fails immediately:

```text
$ npm test

 FAIL  test/services/user-service.test.ts > getUser > should fetch a user by ID
Error: Network requests are not allowed in unit tests. Use mocks instead.
    at test/setup.ts:13:5
```

The global test setup in [test/setup.ts](../../test/setup.ts) replaces `fetch` with a
stub that throws when called. The test never reaches the real network.

## Fixed version

```typescript
// test/services/user-service.test.ts — after human review

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUser } from '../../src/services/user-service.js';

// Mock fetch at the module level
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('getUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a user for a valid ID', async () => {
    const fakeUser = { id: '123', name: 'Grace Hopper', email: 'grace@example.com' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(fakeUser),
    });

    const user = await getUser('123');
    expect(user).toEqual(fakeUser);
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users/123');
  });

  it('should throw when the API returns an error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(getUser('999')).rejects.toThrow('Failed to fetch user: 404');
  });
});
```

## What changed and why

| AI output | Issue | Fix |
|---|---|---|
| No mock for `fetch` | Real network call blocked by `test/setup.ts` | Added `vi.fn()` mock for `fetch` |
| Single happy-path test | Doesn't cover error scenarios | Added 404 error-path test |
| No assertion on call args | Doesn't verify the correct URL was called | Added `toHaveBeenCalledWith` |

## Takeaway

The no-network harness in `test/setup.ts` is the single most effective guardrail for
vibe coding. AI tools frequently generate tests that call real APIs because their training
data includes integration tests. This repo's setup catches that instantly — no flaky tests,
no surprise network traffic, no leaked credentials in test logs.

## Related files

- No-network guard: [test/setup.ts](../../test/setup.ts)
- Vitest config: [vitest.config.ts](../../vitest.config.ts)
- Example pattern: [examples/no-network-unit-tests.md](../../examples/no-network-unit-tests.md)
- AI change checklist: [vibe-coding/guardrails/ai-change-checklist.md](../guardrails/ai-change-checklist.md)
