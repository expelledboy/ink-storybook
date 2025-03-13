#!/usr/bin/env tsx
/**
 * TypeScript execution entry point for ink-storybook
 *
 * Usage:
 *   npx tsx @expelledboy/ink-storybook/ts -s examples
 */

// Set environment variables for TypeScript support
process.env.NODE_NO_WARNINGS = "1"; // Suppress experimental warnings
process.env.INK_STORYBOOK_TS_MODE = "1"; // Let the CLI know it should use TSX for story imports

// Import and run the CLI directly
import "../src/cli/index.ts";
