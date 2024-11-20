import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,         // Enable global test methods like describe, it
    environment: 'node', // or 'jsdom' or happy-dom
    setupFiles: './test/setup.ts', // Include setup file
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});

