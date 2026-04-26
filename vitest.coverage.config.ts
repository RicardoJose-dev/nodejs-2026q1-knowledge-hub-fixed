import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    maxWorkers: 1,
    environment: 'node',
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text'],
      lines: 90,
      branches: 85,
      statements: 90,
      functions: 90,
      checkCoverage: true,
    },
  },
});
