import { useEffect, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { Sidebar } from "../components/Sidebar.js";
import { StoryWrapper } from "../components/StoryWrapper.js";
import {
  createKeyboardNavigationHandler,
  type NavigationActions,
} from "../navigation/keyboardNavigation.js";
import { isInteractive } from "../utils/tty.js";
import type { StorybookAppProps } from "../types.js";
import { useStoryFiles } from "../hooks/useStoryFiles.js";

/**
 * StorybookApp - The main component for the storybook
 *
 * Handles:
 * - Loading story files
 * - Rendering the sidebar
 * - Rendering the current story
 * - Keyboard navigation
 */
export function StorybookApp({ config }: StorybookAppProps) {
  const { exit } = useApp();
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const { loadedFiles, loading, error } = useStoryFiles(
    config.storybookLocation
  );

  useEffect(() => {
    if (error) exit();
  }, [error]);

  // Define navigation actions
  const navigationActions: NavigationActions = {
    navigateNextStory: () => {
      if (loadedFiles.length === 0) return;

      const currentFile = loadedFiles[activeFileIndex];
      if (activeStoryIndex < currentFile.stories.length - 1) {
        // Move to next story in current file
        setActiveStoryIndex(activeStoryIndex + 1);
      } else if (activeFileIndex < loadedFiles.length - 1) {
        // Move to first story in next file
        setActiveFileIndex(activeFileIndex + 1);
        setActiveStoryIndex(0);
      }
    },

    navigatePreviousStory: () => {
      if (loadedFiles.length === 0) return;

      if (activeStoryIndex > 0) {
        // Move to previous story in current file
        setActiveStoryIndex(activeStoryIndex - 1);
      } else if (activeFileIndex > 0) {
        // Move to last story in previous file
        setActiveFileIndex(activeFileIndex - 1);
        const prevFile = loadedFiles[activeFileIndex - 1];
        setActiveStoryIndex(prevFile.stories.length - 1);
      }
    },

    navigateNextFile: () => {
      if (activeFileIndex < loadedFiles.length - 1) {
        setActiveFileIndex(activeFileIndex + 1);
        setActiveStoryIndex(0);
      }
    },

    navigatePreviousFile: () => {
      if (activeFileIndex > 0) {
        setActiveFileIndex(activeFileIndex - 1);
        setActiveStoryIndex(0);
      }
    },
  };

  // Create keyboard handler from config
  const keyboardHandler = createKeyboardNavigationHandler(
    config,
    navigationActions
  );

  // Register keyboard input handler only in interactive environments
  if (isInteractive()) {
    useInput(keyboardHandler);
  }

  // Handle story selection from sidebar
  const handleSelectStory = (fileIndex: number, storyIndex: number) => {
    setActiveFileIndex(fileIndex);
    setActiveStoryIndex(storyIndex);
  };

  // Render loading state only on initial load when no files are loaded yet
  if (loading && loadedFiles.length === 0) {
    return (
      <Box>
        <Text>Loading story files...</Text>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box flexDirection="column">
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }

  // Render empty state
  if (loadedFiles.length === 0) {
    return (
      <Box flexDirection="column">
        <Text>
          No story files found. Create files with .story.tsx extension.
        </Text>
      </Box>
    );
  }

  // Get current story
  const currentFile = loadedFiles[activeFileIndex];
  const currentStory = currentFile?.stories[activeStoryIndex];

  return (
    <Box flexDirection="row">
      {/* Sidebar */}
      <Sidebar
        storyFiles={loadedFiles}
        activeFileIndex={activeFileIndex}
        activeStoryIndex={activeStoryIndex}
        onSelectStory={handleSelectStory}
        width={config.sidebarWidth}
        theme={config.theme}
        keybindings={config.keyBindings}
        showControls={config.showControls}
        loading={loading}
      />

      {/* Main content */}
      <Box
        borderStyle="single"
        borderColor={config.theme.secondary}
        padding={1}
        flexDirection="column"
      >
        {/* Header */}
        <Box marginBottom={1}>
          <Text bold color={config.theme.primary}>
            {config.title}
          </Text>
        </Box>

        {/* Story content */}
        {currentStory ? (
          <StoryWrapper
            title={`${currentFile.name} / ${currentStory.title}`}
            description={currentStory.description}
          >
            {currentStory.component}
          </StoryWrapper>
        ) : (
          <Text>No story selected</Text>
        )}
      </Box>
    </Box>
  );
}
