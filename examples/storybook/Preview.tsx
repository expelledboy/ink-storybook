import React, { ReactNode } from "react";
import { Box, Text } from "ink";

interface PreviewProps {
  /** Story content to render */
  children: ReactNode;

  /** Title of the story */
  title: string;

  /** Optional description of the story */
  description?: string;
}

/**
 * Custom Preview component for wrapping stories
 *
 * This is a simple example of how users can customize the story preview
 */
export function Preview({ children, title, description }: PreviewProps) {
  return (
    <Box flexDirection="column" marginBottom={2}>
      <Box marginBottom={1}>
        <Text color="white">{title}</Text>
      </Box>

      {description && (
        <Box marginBottom={1} paddingX={1}>
          <Text italic color="blue">
            {">"} {description}
          </Text>
        </Box>
      )}

      <Box borderStyle="round" paddingX={2} paddingY={1} borderColor="yellow">
        {children}
      </Box>

      <Box marginTop={1} paddingX={1}>
        <Text dimColor>This is a custom preview component</Text>
      </Box>
    </Box>
  );
}
