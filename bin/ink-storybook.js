#!/usr/bin/env node

// This is a simple wrapper to ensure the CLI works correctly with npx
// when the package uses ES modules
import("../dist/cli/index.js").catch((err) => {
  console.error("Failed to start ink-storybook:", err);
  process.exit(1);
});
