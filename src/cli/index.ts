#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import { parseArgs } from "node:util";
import { render } from "ink";
import React from "react";
import { StorybookApp } from "../runtime/StorybookApp.js";
import { loadConfigFile } from "../config/loadConfig.js";
import { pathToFileURL } from "node:url";

// Register tsx
import "tsx";

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

// Find story files in the specified directory
function findStoryFiles(dir: string): string[] {
  const storyFiles: string[] = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Recursively search in directories
      storyFiles.push(...findStoryFiles(itemPath));
    } else if (
      (stat.isFile() && item.endsWith(".story.tsx")) ||
      item.endsWith(".story.jsx") ||
      item.endsWith(".story.js")
    ) {
      storyFiles.push(itemPath);
    }
  });

  return storyFiles;
}

// Load story files
async function loadStoryFile(filePath: string): Promise<any> {
  try {
    // For ESM JavaScript files
    const fileUrl = pathToFileURL(filePath).href;

    try {
      const module = await import(fileUrl);
      return module.default;
    } catch (importError) {
      console.error(`Error importing story file ${filePath}:`, importError);

      // If we're in a CommonJS environment, try require as fallback
      if (typeof require !== "undefined") {
        return require(filePath).default;
      }

      return null;
    }
  } catch (error) {
    console.error(`Error loading story file ${filePath}:`, error);
    return null;
  }
}

// Find and run stories
async function run() {
  try {
    // Get config
    const config = await loadConfigFile(configPath);

    // Find story files
    const storyPattern = values.stories || config.storybookLocation || "src";

    console.log(`Looking for stories in: ${storyPattern}`);

    const files = findStoryFiles(storyPattern);

    if (files.length === 0) {
      console.log(
        "No story files found. Create files with .story.tsx extension."
      );
      process.exit(0);
    }

    console.log(`Found ${files.length} story files.`);

    // Render the Storybook app with the file paths
    render(
      React.createElement(StorybookApp, {
        storyFiles: files, // Pass the array of file paths
        config,
      })
    );
  } catch (err) {
    console.error("Failed to start ink-storybook:", err);
    process.exit(1);
  }
}

run();
