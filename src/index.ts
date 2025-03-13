/**
 * ink-storybook - A storybook-like library for Ink terminal applications
 *
 * Main exports for the library
 */

// Core components
export { StoryWrapper } from "./components/StoryWrapper.js";
export { KeyboardControls } from "./components/KeyboardControls.js";
export { Sidebar } from "./components/Sidebar.js";
export { StorybookApp } from "./runtime/StorybookApp.js";

// Configuration
export { defaultConfig } from "./config/loadConfig.js";

// Types
export type {
  Story,
  StoryExport,
  StoryFile,
  StoryWrapperProps,
  KeyboardControlsProps,
  SidebarProps,
  StorybookAppProps,
  StorybookConfig,
} from "./types.js";

// Don't export hooks directly as they are part of the internal implementation
// Users will use the higher-level components instead
