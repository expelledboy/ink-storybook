import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import type { SidebarProps } from "../types.js";
import { KeyboardControls } from "./KeyboardControls.js";

/**
 * Sidebar - Displays a list of story files and their stories
 *
 * Provides navigation between different story files and stories
 * Organizes files by group if metadata is present
 */
export function Sidebar({
  storyFiles,
  activeFileIndex,
  activeStoryIndex,
  width = 30,
  theme = {
    primary: "blue",
    secondary: "yellow",
    text: "white",
    background: "black",
  },
  keybindings = {
    next: ["shift+down"],
    previous: ["shift+up"],
    nextFile: ["down"],
    prevFile: ["up"],
  },
  showControls = true,
  loading = false,
}: SidebarProps) {
  // Track delayed loading state to prevent flickering
  const [delayedLoading, setDelayedLoading] = useState(loading);

  // Add delay before clearing loading state
  useEffect(() => {
    if (loading) {
      // When loading starts, update immediately
      setDelayedLoading(true);
    } else {
      // When loading stops, delay by 200ms before clearing
      const timer = setTimeout(() => {
        setDelayedLoading(false);
      }, 500);

      // Clean up timer if component unmounts or loading changes again
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (storyFiles.length === 0) {
    return (
      <Box width={width} borderStyle="single" padding={1}>
        <Text>No story files found</Text>
      </Box>
    );
  }

  // Organize files by group
  const filesByGroup = new Map<string, number[]>();
  const ungroupedFiles: number[] = [];

  // Create a mapping of group name to file indices
  storyFiles.forEach((file, index) => {
    if (file.meta?.group) {
      const group = file.meta.group;
      if (!filesByGroup.has(group)) {
        filesByGroup.set(group, []);
      }
      filesByGroup.get(group)!.push(index);
    } else {
      ungroupedFiles.push(index);
    }
  });

  // Sort group names alphabetically
  const sortedGroups = Array.from(filesByGroup.keys()).sort();

  // Format keyboard controls display text
  const getKeyDisplayText = (keys: string[] | undefined): string => {
    if (!keys || keys.length === 0) return "";
    return keys[0].replace(/\+/g, "+");
  };

  const nextKeysDisplay = getKeyDisplayText(keybindings.next);
  const prevKeysDisplay = getKeyDisplayText(keybindings.previous);
  const nextFileKeysDisplay = getKeyDisplayText(keybindings.nextFile);
  const prevFileKeysDisplay = getKeyDisplayText(keybindings.prevFile);

  return (
    <Box
      width={width}
      height="100%"
      borderStyle="round"
      borderColor={theme.secondary}
      flexDirection="column"
      padding={1}
    >
      <Box marginBottom={1}>
        <Text bold color={theme.primary}>
          STORYBOOK FILES
        </Text>
        {delayedLoading && <Text color={theme.secondary}> R</Text>}
      </Box>

      {/* Display files grouped by category */}
      {sortedGroups.map((group) => (
        <Box key={group} flexDirection="column" marginBottom={1}>
          {/* Group header */}
          <Text bold color={theme.primary} underline>
            {group}
          </Text>

          {/* Files in this group */}
          {filesByGroup.get(group)!.map((fileIndex) => {
            const file = storyFiles[fileIndex];
            const isActiveFile = fileIndex === activeFileIndex;

            return (
              <Box
                key={file.filePath}
                flexDirection="column"
                marginLeft={1}
                marginTop={1}
              >
                {/* File name */}
                <Text bold color={isActiveFile ? theme.primary : theme.text}>
                  {isActiveFile ? "▼ " : "▶ "}
                  {file.name}
                </Text>

                {/* Stories in this file (only show if this file is active) */}
                {isActiveFile && (
                  <Box flexDirection="column" paddingLeft={2} marginTop={1}>
                    {file.stories.map((story, storyIndex) => {
                      const isActiveStory =
                        isActiveFile && storyIndex === activeStoryIndex;

                      return (
                        <Text
                          key={story.id}
                          color={isActiveStory ? theme.secondary : theme.text}
                          dimColor={!isActiveStory}
                        >
                          {isActiveStory ? "› " : "  "}
                          {story.title}
                        </Text>
                      );
                    })}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      ))}

      {/* Display ungrouped files */}
      {ungroupedFiles.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          {ungroupedFiles.map((fileIndex) => {
            const file = storyFiles[fileIndex];
            const isActiveFile = fileIndex === activeFileIndex;

            return (
              <Box key={file.filePath} flexDirection="column" marginBottom={1}>
                {/* File name */}
                <Text bold color={isActiveFile ? theme.primary : theme.text}>
                  {isActiveFile ? "▼ " : "▶ "}
                  {file.name}
                </Text>

                {/* Stories in this file (only show if this file is active) */}
                {isActiveFile && (
                  <Box flexDirection="column" paddingLeft={2} marginTop={1}>
                    {file.stories.map((story, storyIndex) => {
                      const isActiveStory =
                        isActiveFile && storyIndex === activeStoryIndex;

                      return (
                        <Text
                          key={story.id}
                          color={isActiveStory ? theme.secondary : theme.text}
                          dimColor={!isActiveStory}
                        >
                          {isActiveStory ? "› " : "  "}
                          {story.title}
                        </Text>
                      );
                    })}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* Controls */}
      {showControls && (
        <KeyboardControls
          nextKeys={nextKeysDisplay}
          prevKeys={prevKeysDisplay}
          nextFileKeys={nextFileKeysDisplay}
          prevFileKeys={prevFileKeysDisplay}
        />
      )}
    </Box>
  );
}
