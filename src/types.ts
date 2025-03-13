/**
 * Core types for the ink-storybook library
 */
import type { ReactNode } from "react";
import type { StorybookConfig as ConfigType } from "./config/loadConfig.js";

// Re-export the StorybookConfig type
export type StorybookConfig = ConfigType;

// Key bindings for the storybook
export type KeyBindings = StorybookConfig["keyBindings"];

/**
 * Represents a single story in the storybook
 */
export interface Story {
  /**
   * Unique identifier for the story
   */
  id: string;

  /**
   * Display title for the story
   */
  title: string;

  /**
   * The React component to render
   */
  component: ReactNode;

  /**
   * Optional description of the story
   */
  description?: string;
}

/**
 * A collection of stories, typically from a single file
 */
export interface StoryFile {
  /**
   * File path relative to the project root
   */
  filePath: string;

  /**
   * Filename without extension (used for display)
   */
  name: string;

  /**
   * Stories contained in this file
   */
  stories: Story[];

  /**
   * Optional metadata for organization
   */
  meta?: {
    /**
     * Group or category for the story file
     */
    group?: string;

    /**
     * Order to display the story file in the sidebar
     */
    order?: number;
  };
}

/**
 * Props for the main Storybook component
 */
export interface StorybookProps {
  /**
   * List of stories to display
   */
  stories: Story[];

  /**
   * Title of the storybook
   * @default "Storybook"
   */
  title?: string;

  /**
   * Description shown below the title
   */
  description?: string;

  /**
   * Custom key bindings for various actions
   */
  keyBindings?: KeyBindings;

  /**
   * Custom keyboard controls to display in the help section
   */
  customControls?: Record<string, string>;

  /**
   * Width of the story container
   * @default 70
   */
  width?: number;
}

/**
 * Props for the StoryWrapper component
 */
export interface StoryWrapperProps {
  /**
   * Title of the story
   */
  title: string;

  /**
   * Story content to render
   */
  children: ReactNode;

  /**
   * Width of the story container
   * @default 70
   */
  width?: number;

  /**
   * Description of the story, if any
   */
  description?: string;
}

/**
 * Props for the KeyboardControls component
 */
export interface KeyboardControlsProps {
  /** Keys for navigating to the next story */
  nextKeys?: string;
  /** Keys for navigating to the previous story */
  prevKeys?: string;
  /** Keys for navigating to the next file */
  nextFileKeys?: string;
  /** Keys for navigating to the previous file */
  prevFileKeys?: string;
  /** Whether to show controls */
  showControls?: boolean;
}

/**
 * Props for the Sidebar component
 */
export interface SidebarProps {
  /**
   * Array of story files
   */
  storyFiles: StoryFile[];

  /**
   * Currently active file index
   */
  activeFileIndex: number;

  /**
   * Currently active story index
   */
  activeStoryIndex: number;

  /**
   * Callback when a story is selected
   */
  onSelectStory: (fileIndex: number, storyIndex: number) => void;

  /**
   * Width of the sidebar
   */
  width?: number;

  /**
   * Theme colors
   */
  theme?: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };

  /**
   * Key bindings for the sidebar
   */
  keybindings?: KeyBindings;

  /**
   * Whether to show the controls
   */
  showControls?: boolean;
}

/**
 * Default export type for story files
 */
export interface StoryExport {
  /**
   * Default export should be an object with a stories property
   */
  stories: Story[];

  /**
   * Optional metadata for the story file
   */
  meta?: {
    /**
     * Group or category for the story file
     */
    group?: string;

    /**
     * Order to display the story file in the sidebar
     */
    order?: number;
  };
}

/**
 * Props for the StorybookApp component
 */
export interface StorybookAppProps {
  /**
   * Array of story file paths to load
   */
  storyFiles: string[];

  /**
   * Storybook configuration
   */
  config: StorybookConfig;
}
