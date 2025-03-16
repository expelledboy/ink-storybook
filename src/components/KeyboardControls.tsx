import React from "react";
import { Box, Text } from "ink";
import type { KeyboardControlsProps } from "../types.js";

/**
 * KeyboardControls - Displays a footer with keyboard navigation instructions
 *
 * Renders a consistent set of keyboard controls to help users navigate through stories
 * Users can press Ctrl+C to exit (standard terminal behavior)
 */
export const KeyboardControls: React.FC<KeyboardControlsProps> = (keys) => {
  // Define each control with its keys and action description
  type Control = {
    keys: string;
    action: string;
  };

  const controls: Control[] = [
    { keys: keys.nextKeys, action: "Next story" },
    { keys: keys.prevKeys, action: "Previous story" },
    { keys: keys.nextFileKeys, action: "Next file" },
    { keys: keys.prevFileKeys, action: "Previous file" },
    { keys: "ctrl+c", action: "Exit" },
  ];

  return (
    <Box marginTop={1} flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Keyboard Controls
        </Text>
      </Box>
      {controls.map((control, index) => (
        <Box key={index} marginRight={2}>
          <Text>
            <Text bold color="cyan">
              {control.keys}
            </Text>
            <Text> {control.action}</Text>
          </Text>
        </Box>
      ))}
    </Box>
  );
};
