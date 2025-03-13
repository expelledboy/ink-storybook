import fs from "fs";
import { pathToFileURL } from "url";

/**
 * Default storybook configuration
 */
export const defaultConfig = {
  /**
   * Title of the storybook
   */
  title: "Ink Storybook",

  /**
   * Width of the sidebar
   */
  sidebarWidth: 30,

  /**
   * Custom Preview component
   * Path should be relative to the project root
   */
  previewPath: "storybook/Preview.tsx",

  /**
   * Theme colors
   */
  theme: {
    primary: "blue",
    secondary: "yellow",
    text: "white",
    background: "black",
  },

  /**
   * Whether to show keyboard controls
   */
  showControls: true,

  /**
   * Key bindings for navigation
   *
   * Using arrow keys for navigation:
   * - Up/Down: Navigate between stories
   * - Shift+Up/Down: Navigate between files
   */
  keyBindings: {
    next: ["shift+down"],
    previous: ["shift+up"],
    nextFile: ["down"],
    prevFile: ["up"],
  },

  /**
   * Location of the storybook files
   */
  storybookLocation: "./stories",
};

/**
 * StoryBook configuration type
 */
export type StorybookConfig = typeof defaultConfig;

/**
 * Load configuration from a file
 *
 * @param configPath - Path to the configuration file
 * @returns The merged configuration
 */
export async function loadConfigFile(
  configPath: string
): Promise<StorybookConfig> {
  try {
    // Check if file exists
    if (!fs.existsSync(configPath)) {
      console.log(`No config file found at ${configPath}, using defaults.`);
      return defaultConfig;
    }

    // Use dynamic import for ES modules compatibility
    const configModule = await import(pathToFileURL(configPath).href);
    const userConfig = configModule.default || configModule;

    // Merge with defaults
    return {
      ...defaultConfig,
      ...userConfig,
      // Deep merge theme
      theme: {
        ...defaultConfig.theme,
        ...(userConfig.theme || {}),
      },
      // Deep merge key bindings
      keyBindings: {
        ...defaultConfig.keyBindings,
        ...(userConfig.keyBindings || {}),
      },
    };
  } catch (error) {
    console.error(`Error loading config from ${configPath}:`, error);
    return defaultConfig;
  }
}
