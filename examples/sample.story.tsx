import React from "react";
import { Text, Box } from "ink";
import type { StoryExport } from "../src";

/**
 * A simple component that renders text
 */
const SimpleText = () => <Text>This is a simple text component</Text>;

/**
 * A component with colored text
 */
const ColoredText = () => (
  <Box flexDirection="column">
    <Text color="green">Green text</Text>
    <Text color="red">Red text</Text>
    <Text color="blue">Blue text</Text>
  </Box>
);

/**
 * A component with a box layout
 */
const BoxLayout = () => (
  <Box flexDirection="column">
    <Box marginBottom={1}>
      <Box marginRight={2} borderStyle="single" paddingX={1}>
        <Text>Box 1</Text>
      </Box>
      <Box borderStyle="single" paddingX={1}>
        <Text>Box 2</Text>
      </Box>
    </Box>
    <Box borderStyle="double" paddingX={2} paddingY={1}>
      <Text>Box 3</Text>
    </Box>
  </Box>
);

/**
 * Export the stories
 */
const storyExport: StoryExport = {
  // Collection of stories for this file
  stories: [
    {
      id: "simple-text",
      title: "Simple Text",
      component: <SimpleText />,
      description: "A basic example showing simple text rendering",
    },
    {
      id: "colored-text",
      title: "Colored Text",
      component: <ColoredText />,
      description: "Shows how to render text in different colors",
    },
    {
      id: "box-layout",
      title: "Box Layout",
      component: <BoxLayout />,
      description: "Demonstrates different box layouts and borders",
    },
  ],

  // Optional metadata
  meta: {
    group: "Simple Examples",
    order: 1,
  },
};

// Default export for the story file
export default storyExport;
