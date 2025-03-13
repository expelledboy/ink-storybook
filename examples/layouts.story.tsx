import React from "react";
import { Text, Box } from "ink";
import type { StoryExport } from "../src";

/**
 * A grid layout example
 */
const GridLayout = () => {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Box width={20} borderStyle="single" paddingX={1} marginRight={1}>
          <Text>Cell 1,1</Text>
        </Box>
        <Box width={20} borderStyle="single" paddingX={1}>
          <Text>Cell 1,2</Text>
        </Box>
      </Box>
      <Box>
        <Box width={20} borderStyle="single" paddingX={1} marginRight={1}>
          <Text>Cell 2,1</Text>
        </Box>
        <Box width={20} borderStyle="single" paddingX={1}>
          <Text>Cell 2,2</Text>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * A card layout example
 */
const CardLayout = () => {
  return (
    <Box flexDirection="column">
      <Box
        borderStyle="round"
        borderColor="green"
        paddingX={2}
        paddingY={1}
        marginBottom={1}
        width={40}
      >
        <Box flexDirection="column">
          <Text bold>Card Title</Text>
          <Text>This is a card with rounded borders</Text>
        </Box>
      </Box>

      <Box
        borderStyle="classic"
        borderColor="blue"
        paddingX={2}
        paddingY={1}
        width={40}
      >
        <Box flexDirection="column">
          <Text bold>Another Card</Text>
          <Text>A different style of card with classic borders</Text>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * A sidebar layout example
 */
const SidebarLayout = () => {
  return (
    <Box>
      {/* Sidebar */}
      <Box
        width={15}
        height={10}
        borderStyle="single"
        flexDirection="column"
        paddingX={1}
        marginRight={1}
      >
        <Text bold>Sidebar</Text>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </Box>

      {/* Main content */}
      <Box
        flexGrow={1}
        height={10}
        borderStyle="single"
        flexDirection="column"
        paddingX={1}
      >
        <Text bold>Main Content</Text>
        <Text>This is the main content area of the layout.</Text>
        <Text>It demonstrates a simple sidebar + content layout.</Text>
      </Box>
    </Box>
  );
};

/**
 * Export the stories
 */
const storyExport: StoryExport = {
  // Collection of stories for this file
  stories: [
    {
      id: "grid-layout",
      title: "Grid Layout",
      component: <GridLayout />,
      description: "Demonstrates a simple grid layout with cells",
    },
    {
      id: "card-layout",
      title: "Card Layout",
      component: <CardLayout />,
      description: "Shows different card layouts and styles",
    },
    {
      id: "sidebar-layout",
      title: "Sidebar Layout",
      component: <SidebarLayout />,
      description: "A common sidebar + main content layout pattern",
    },
  ],

  // Optional metadata
  meta: {
    group: "Complex Examples",
    order: 3,
  },
};

// Default export for the story file
export default storyExport;
