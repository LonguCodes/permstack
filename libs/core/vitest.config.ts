import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: __dirname,
  test: {
    globals: true,
    environment: 'node',
    include: ['e2e/**/*'],
    passWithNoTests: true,
    watch: false
  },
});
