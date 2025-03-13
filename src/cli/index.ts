#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import { parseArgs } from "node:util";
import { render } from "ink";
import React from "react";
import { StorybookApp } from "../runtime/StorybookApp.js";
import { loadConfigFile } from "../config/loadConfig.js";

// Define CLI arguments
const { values } = parseArgs({
  options: {
    help: {
      type: "boolean",
      short: "h",
      default: false,
    },
    config: {
      type: "string",
      short: "c",
      default: "storybook/config.js",
    },
    stories: {
      type: "string",
      short: "s",
      default: "src",
    },
  },
});

// Show help
if (values.help) {
  console.log(`
    ink-storybook - A storybook for Ink terminal applications

    Usage
      $ ink-storybook [options]

    Options
      --stories, -s  Directory to search for story files (default: "src")
      --config, -c   Path to config file (default: "storybook/config.js")
      --help, -h     Show help
  `);
  process.exit(0);
}

// Default values
const cwd = process.cwd();
const storiesDir = values.stories || "src";
const configPath = values.config || "storybook/config.js";

// Find story files using native fs instead of glob
async function findStoryFiles(dir: string): Promise<string[]> {
  const storyFiles: string[] = [];

  async function scanDir(directory: string) {
    try {
      const files = await fs.promises.readdir(directory, {
        withFileTypes: true,
      });

      for (const file of files) {
        const fullPath = path.join(directory, file.name);

        if (file.isDirectory()) {
          // Recursively scan subdirectories
          await scanDir(fullPath);
        } else if (
          /\.story\.(tsx|jsx|ts|js)$/.test(file.name) &&
          !file.name.startsWith(".")
        ) {
          // Add matching story files
          storyFiles.push(fullPath);
        }
      }
    } catch (err) {
      console.warn(`Could not scan directory ${directory}:`, err);
    }
  }

  await scanDir(dir);
  return storyFiles;
}

// Find and run stories
(async () => {
  try {
    // Load config first
    const config = await loadConfigFile(path.resolve(cwd, configPath));

    // Merge cli args with config
    const mergedConfig = {
      ...config,
      storiesDir: values.stories || config.storybookLocation,
    };

    // Then find story files
    const storyPattern = path.join(cwd, storiesDir);
    console.log(`Looking for stories in: ${storyPattern}`);

    const files = await findStoryFiles(storyPattern);

    if (files.length === 0) {
      console.log(
        "No story files found. Create files with .story.tsx extension."
      );
      process.exit(1);
    }

    console.log(`Found ${files.length} story files.`);

    // Start the storybook app
    render(
      React.createElement(StorybookApp, {
        storyFiles: files,
        config: mergedConfig,
      })
    );
  } catch (err) {
    console.error("Error starting storybook:", err);
    process.exit(1);
  }
})();
