import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'build', 'test/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        'dist/',
        'build/',
        '**/*.test.ts',
        '**/*.config.{ts,js}',
        '**/types.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    // Ensure no network calls in unit tests
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
