import React, { useState } from "react";
import { Text, Box, useInput } from "ink";
import { isInteractive } from "../src/utils/tty.js";
import type { StoryExport } from "../src";

/**
 * A simple counter component that increments on keypress
 */
const Counter = () => {
  const [count, setCount] = useState(0);

  if (isInteractive()) {
    useInput((input, key) => {
      if (input === "+") {
        setCount((prev) => prev + 1);
      } else if (input === "-") {
        setCount((prev) => Math.max(0, prev - 1));
      }
    });
  }

  return (
    <Box flexDirection="column">
      <Text>Press + to increment, - to decrement</Text>
      <Text>Count: {count}</Text>
      {!isInteractive() && (
        <Text color="yellow">
          (Interactive input disabled in non-TTY environment)
        </Text>
      )}
    </Box>
  );
};

const formatKeyInfo = (keyInfo: Record<string, any>) => {
  const keys = Object.entries(keyInfo)
    .filter(([key, active]) => active)
    .map(([key, active]) => `${key}: ${active}`)
    .join(", ");
  return keys;
};

/**
 * A component that shows key press feedback
 */
const KeyPressFeedback = () => {
  const [input, setInput] = useState<string>("");
  const [keyInfo, setKeyInfo] = useState<Record<string, any>>({});

  if (isInteractive()) {
    useInput((inputChar, key) => {
      setInput(inputChar || "none");
      setKeyInfo(key);
    });
  }

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text>Press any key to see its information</Text>
      <Text>Input: {input}</Text>
      <Text>Key: {formatKeyInfo(keyInfo)}</Text>
      {!isInteractive() && (
        <Text color="yellow">
          (Interactive input disabled in non-TTY environment)
        </Text>
      )}
    </Box>
  );
};

/**
 * A component that simulates a simple menu
 */
const SimpleMenu = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = ["Home", "Projects", "About", "Contact"];

  if (isInteractive()) {
    useInput((_, key) => {
      if (key.upArrow) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (key.downArrow) {
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
      }
    });
  }

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text>Use up/down arrows to navigate</Text>
      {items.map((item, index) => (
        <Text key={item} color={index === selectedIndex ? "green" : undefined}>
          {index === selectedIndex ? "> " : "  "}
          {item}
        </Text>
      ))}
      {!isInteractive() && (
        <Text color="yellow">
          (Interactive input disabled in non-TTY environment)
        </Text>
      )}
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
      id: "counter",
      title: "Counter",
      component: <Counter />,
      description:
        "An interactive counter that can be incremented and decremented",
    },
    {
      id: "key-press-feedback",
      title: "Key Press Feedback",
      component: <KeyPressFeedback />,
      description: "Demonstrates capturing and displaying key presses",
    },
    {
      id: "simple-menu",
      title: "Simple Menu",
      component: <SimpleMenu />,
      description: "A simple interactive menu using arrow keys for navigation",
    },
  ],

  // Optional metadata
  meta: {
    group: "Complex Examples",
    order: 2,
  },
};

// Default export for the story file
export default storyExport;
