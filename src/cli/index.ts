#!/usr/bin/env node

// Register tsx
import "tsx";

import { parseArgs } from "node:util";
import { render } from "ink";
import React from "react";
import { StorybookApp } from "../runtime/StorybookApp.js";
import { loadConfigFile } from "../config/loadConfig.js";
import { StoryWrapper as DefaultStoryWrapper } from "../components/StoryWrapper.js";
import { ensureAbsolutePath } from "../utils/file.js";

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
    },
    stories: {
      type: "string",
      short: "s",
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
const defaultConfigPath = "storybook/config.ts";

// Find and run stories
async function run() {
  try {
    // Get config
    const config = await loadConfigFile(values.config || defaultConfigPath);

    const cliConfig = {
      ...config,
      storybookLocation: values.stories || config.storybookLocation,
    };

    const StoryWrapper =
      cliConfig.previewPath !== undefined
        ? await import(ensureAbsolutePath(cliConfig.previewPath)).then(
            (module) => {
              console.debug(module);

              if (!module.Preview) {
                throw new Error(
                  `Preview component not found in ${cliConfig.previewPath}`
                );
              }

              return module.Preview;
            }
          )
        : DefaultStoryWrapper;

    // Render the Storybook app with the file paths
    render(
      React.createElement(StorybookApp, {
        config: cliConfig,
        renderStoryWrapper: StoryWrapper,
      })
    );
  } catch (err) {
    console.error("Failed to start ink-storybook:", err);
    process.exit(1);
  }
}

run();
