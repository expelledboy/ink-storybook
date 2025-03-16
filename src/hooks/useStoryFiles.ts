import { useState, useEffect } from "react";
import chokidar from "chokidar";
import type { StoryFile } from "../types.js";
import { DEBUG } from "../constants.js";
// Import only the essential utilities
import {
  isStoryFile,
  extractImports,
  sortStoryFiles,
  findFilesAndDependencies,
  loadStoryFile,
  ensureAbsolutePath,
} from "./useStoryFiles.utils.js";

/**
 * Hook to load and watch story files
 *
 * First principles approach:
 * 1. Single source of truth - fileMap tracks loaded files
 * 2. Dependency tracking - depMap connects dependencies to story files
 * 3. Event-driven - all updates flow from filesystem events
 * 4. No duplicate state - leverages chokidar's internal tracking
 */
export function useStoryFiles(storybookLocation: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedFiles, setLoadedFiles] = useState<StoryFile[]>([]);

  useEffect(() => {
    // State is fully derived from these two maps
    const fileMap = new Map<string, StoryFile>(); // Current loaded state of each file
    const depMap = new Map<string, Set<string>>(); // Dependencies → story files

    // Single function to update React state from our maps
    const syncState = () => {
      setLoadedFiles(sortStoryFiles([...fileMap.values()]));
    };

    // Initialize watcher with good defaults
    const watcher = chokidar.watch([], {
      persistent: true,
      ignoreInitial: true,
    });

    // Process a story file (add or update)
    const processStoryFile = async (filePath: string) => {
      try {
        setLoading(true);

        // Load the file
        const story = await loadStoryFile(filePath);
        if (!story) return;

        // Update file map
        fileMap.set(filePath, story);

        // Track dependencies
        const deps = extractImports(filePath);
        deps.forEach((dep) => {
          if (!depMap.has(dep)) depMap.set(dep, new Set());
          depMap.get(dep)!.add(filePath);
          watcher.add(dep); // Add to watch list
        });

        // Update React state
        syncState();
        setError(null);
      } catch (err) {
        setError(
          `Error processing ${filePath}: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    // Handle removing a story file
    const removeStoryFile = (filePath: string) => {
      try {
        setLoading(true);

        // Remove from file map
        fileMap.delete(filePath);

        // Clean up dependency references (could be optimized)
        depMap.forEach((stories, dep) => {
          stories.delete(filePath);
        });

        // Update React state
        syncState();
        setError(null);
      } catch (err) {
        setError(
          `Error removing ${filePath}: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    // Scan directory once at startup
    const setupInitialFiles = async () => {
      try {
        setLoading(true);

        // Find story files
        const absoluteDir = ensureAbsolutePath(storybookLocation);
        const { storyFiles, dependencies } =
          findFilesAndDependencies(absoluteDir);

        if (storyFiles.length === 0) {
          setError("No story files found in " + absoluteDir);
          setLoading(false);
          return;
        }

        // Set up watch patterns - this automatically tracks what it watches
        watcher.add([absoluteDir, ...dependencies]);

        // Build dependency map
        storyFiles.forEach((storyPath) => {
          const deps = extractImports(storyPath);
          deps.forEach((dep) => {
            if (!depMap.has(dep)) depMap.set(dep, new Set());
            depMap.get(dep)!.add(storyPath);
          });
        });

        // Process initial files in parallel
        const stories = await Promise.all(storyFiles.map(loadStoryFile));

        // Store loaded stories in file map
        stories.filter(Boolean).forEach((story) => {
          if (story) fileMap.set(story.filePath, story);
        });

        DEBUG && console.log("chokidar watched", watcher.getWatched());

        // Update React state
        syncState();
        setError(null);
      } catch (err) {
        setError(
          `Setup error: ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setLoading(false);
      }
    };

    // Event handling - single source of truth from filesystem events
    watcher
      .on("add", (filePath) => {
        if (isStoryFile(filePath)) {
          processStoryFile(filePath);
        }
      })
      .on("change", (filePath) => {
        if (isStoryFile(filePath)) {
          // Story file changed - just reprocess it
          processStoryFile(filePath);
        } else if (depMap.has(filePath)) {
          // Dependency changed - update all affected stories
          setLoading(true);

          const affectedPaths = Array.from(
            depMap.get(filePath) || new Set()
          ) as string[];

          // Process each affected story
          Promise.all(
            affectedPaths.map((storyPath) => processStoryFile(storyPath))
          )
            .catch((err) => {
              setError(
                `Error updating dependencies: ${
                  err instanceof Error ? err.message : String(err)
                }`
              );
            })
            .finally(() => {
              setLoading(false);
            });
        }
      })
      .on("unlink", (filePath) => {
        if (isStoryFile(filePath)) {
          // Story file removed
          removeStoryFile(filePath);
        }
      });

    // Start watching (without awaiting)
    setupInitialFiles();

    // Clean up when unmounting
    return () => {
      watcher.close();
    };
  }, [storybookLocation]);

  return { loadedFiles, loading, error };
}
