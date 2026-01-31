/**
 * Vitest Setup File
 * 
 * This file enforces no-network rules and sets up mocking for unit tests.
 */

import { beforeAll, beforeEach, vi } from 'vitest';

/**
 * Prevent all network requests in unit tests
 * This ensures tests are isolated and don't depend on external services
 */
beforeAll(() => {
  // Mock fetch to prevent network calls
  global.fetch = vi.fn(() =>
    Promise.reject(new Error('Network requests are not allowed in unit tests. Use mocks instead.'))
  );

  // Mock XMLHttpRequest
  class MockXMLHttpRequest {
    open() {
      throw new Error('Network requests are not allowed in unit tests. Use mocks instead.');
    }
  }
  global.XMLHttpRequest = MockXMLHttpRequest as any;
});

beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * Mocking Guidelines:
 * 
 * 1. Use vi.mock() to mock external modules
 * 2. Use vi.fn() to create mock functions
 * 3. Use vi.spyOn() to spy on existing methods
 * 4. Always clear mocks in beforeEach
 * 5. Never make real network calls - mock all external dependencies
 * 
 * Example:
 * ```ts
 * import { vi } from 'vitest';
 * 
 * vi.mock('./api', () => ({
 *   fetchUser: vi.fn(() => Promise.resolve({ id: 1, name: 'Test' }))
 * }));
 * ```
 */
