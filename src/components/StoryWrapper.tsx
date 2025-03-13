import React from "react";
import { Box, Text } from "ink";
import type { StoryWrapperProps } from "../types.js";

/**
 * StoryWrapper - Wraps a story with consistent styling
 *
 * Provides a bordered container with a title for each story
 */
export function StoryWrapper({
  title,
  children,
  description,
}: StoryWrapperProps) {
  return (
    <Box flexDirection="column" marginBottom={2}>
      <Text bold underline color="yellow">
        {title}
      </Text>

      {description && (
        <Box marginY={1}>
          <Text dimColor>{description}</Text>
        </Box>
      )}

      <Box flexDirection="column" borderStyle="single" borderColor="gray">
        {children}
      </Box>
    </Box>
  );
}
