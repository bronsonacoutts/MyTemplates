import { describe, expect, it } from 'vitest';

/**
 * Sample unit test demonstrating the testing structure
 */
describe('Sample Unit Tests', () => {
  it('should perform basic arithmetic', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const greeting = 'Hello, World!';
    expect(greeting).toContain('World');
  });

  it('should work with arrays', () => {
    const items = [1, 2, 3];
    expect(items).toHaveLength(3);
    expect(items).toContain(2);
  });

  it('should handle async operations', async () => {
    const mockAsyncOperation = () => Promise.resolve('success');
    const result = await mockAsyncOperation();
    expect(result).toBe('success');
  });
});
