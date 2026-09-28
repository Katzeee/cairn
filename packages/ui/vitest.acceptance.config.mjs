import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    fileParallelism: false,
    globalSetup: ["./tests/editor/support/setup.mjs"],
    include: ["tests/editor/editor.acceptance.test.mjs"],
    pool: "forks",
    testTimeout: 120_000,
  },
});
