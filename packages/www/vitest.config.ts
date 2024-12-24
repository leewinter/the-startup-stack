/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Path to setup file that runs before your tests.
    setupFiles: ['./tests/setup-test-env.ts'],
    // Path to your test files.
    include: ['./tests/integration/*.test.ts'],
  },
})
