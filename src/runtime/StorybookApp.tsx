import { useState, useEffect } from "react";
import { Box, Text, useApp, useInput } from "ink";
import path from "path";
import { Sidebar } from "../components/Sidebar.js";
import { StoryWrapper } from "../components/StoryWrapper.js";
import {
  createKeyboardNavigationHandler,
  type NavigationActions,
} from "../navigation/keyboardNavigation.js";
import { isInteractive } from "../utils/tty.js";
import type {
  StorybookAppProps,
  StoryFile,
  StoryExport,
  Story,
} from "../types.js";
import { pathToFileURL } from "url";

/**
 * Convert file path to a display name
 */
function getFileDisplayName(filePath: string): string {
  // Get the base filename without extension
  const basename = path.basename(filePath);
  return basename.replace(/\.story\.(tsx|jsx|ts|js)$/, "");
}

/**
 * StorybookApp - The main component for the storybook
 *
 * Handles:
 * - Loading story files
 * - Rendering the sidebar
 * - Rendering the current story
 * - Keyboard navigation
 */
export function StorybookApp({ storyFiles, config }: StorybookAppProps) {
  const { exit } = useApp();
  const [loadedFiles, setLoadedFiles] = useState<StoryFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all story files
  useEffect(() => {
    async function loadFiles() {
      setLoading(true);
      try {
        const files: StoryFile[] = [];

        // Process each file
        for (const filePath of storyFiles) {
          try {
            // Dynamically import the story file
            const imported = await import(pathToFileURL(filePath).href);
            const storyExport: StoryExport = imported.default || imported;

            if (!storyExport.stories || !Array.isArray(storyExport.stories)) {
              console.warn(`File ${filePath} does not export stories array.`);
              continue;
            }

            // Add to loaded files with metadata if available
            files.push({
              filePath,
              name: getFileDisplayName(filePath),
              stories: storyExport.stories,
              meta: storyExport.meta, // Preserve the metadata
            });
          } catch (err) {
            console.error(`Error loading story file ${filePath}:`, err);
          }
        }

        // Group files and sort them
        // First sort by order (if defined) or filename
        files.sort((a, b) => {
          // If both files have order, sort by order
          if (a.meta?.order !== undefined && b.meta?.order !== undefined) {
            return a.meta.order - b.meta.order;
          }
          // If only one has order, prioritize it
          if (a.meta?.order !== undefined) return -1;
          if (b.meta?.order !== undefined) return 1;
          // Otherwise sort by name
          return a.name.localeCompare(b.name);
        });

        // Sort files by group (alphabetically) while preserving order within groups
        const groupedFiles = new Map<string, StoryFile[]>();
        const ungroupedFiles: StoryFile[] = [];

        // Group files
        files.forEach((file) => {
          if (file.meta?.group) {
            const group = file.meta.group;
            if (!groupedFiles.has(group)) {
              groupedFiles.set(group, []);
            }
            groupedFiles.get(group)!.push(file);
          } else {
            ungroupedFiles.push(file);
          }
        });

        // Sort groups alphabetically and flatten
        const sortedFiles: StoryFile[] = [];

        // Add grouped files in alphabetical order of group names
        Array.from(groupedFiles.keys())
          .sort()
          .forEach((group) => {
            sortedFiles.push(...groupedFiles.get(group)!);
          });

        // Add ungrouped files at the end
        sortedFiles.push(...ungroupedFiles);

        setLoadedFiles(sortedFiles);
        setLoading(false);
      } catch (err) {
        setError(
          `Error loading story files: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setLoading(false);
      }
    }

    loadFiles();
  }, [storyFiles]);

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

  // Render loading state
  if (loading) {
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
