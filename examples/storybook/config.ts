/**
 * Example storybook configuration file
 */
export default {
  /**
   * Title of the storybook
   */
  title: "My Ink Storybook",

  /**
   * Width of the sidebar
   */
  sidebarWidth: 35,

  /**
   * Custom Preview component
   */
  previewPath: "./examples/storybook/Preview.tsx",

  /**
   * Custom theme colors
   */
  theme: {
    primary: "green",
    secondary: "blue",
    text: "white",
    background: "black",
  },

  /**
   * Key bindings for navigation
   */
  keyBindings: {
    // You can customize key bindings here
    next: ["j"],
    previous: ["k"],
    nextFile: ["l"],
    prevFile: ["h"],
  },

  /**
   * Whether to show keyboard controls
   */
  showControls: true,

  /**
   * Location of the storybook files
   */
  storybookLocation: "./examples",
};
