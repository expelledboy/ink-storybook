import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";
import type { StoryFile, StoryExport } from "../types.js";
import { ensureAbsolutePath, findFilesRecursively } from "../utils/file.js";

// --- Constants ---

export const STORY_FILE_REGEX = /\.story\.(tsx|jsx|ts|js)$/;
export const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

// --- File Processing Functions ---

/**
 * Convert file path to a display name
 */
function getFileDisplayName(filePath: string): string {
  return path.basename(filePath).replace(STORY_FILE_REGEX, "");
}

/**
 * Check if a path is a story file
 */
export function isStoryFile(filePath: string): boolean {
  return STORY_FILE_REGEX.test(filePath);
}

/**
 * Resolve an import path to an actual file path
 */
function resolveImportPath(basePath: string, importPath: string): string {
  // Only process relative imports
  if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
    return "";
  }

  const resolvedPath = path.resolve(path.dirname(basePath), importPath);

  // Try with exact path
  if (fs.existsSync(resolvedPath)) {
    return resolvedPath;
  }

  // Try with extensions
  for (const ext of FILE_EXTENSIONS) {
    const pathWithExt = resolvedPath + ext;
    if (fs.existsSync(pathWithExt)) {
      return pathWithExt;
    }
  }

  // Try with index files
  for (const ext of FILE_EXTENSIONS) {
    const indexPath = path.join(resolvedPath, `index${ext}`);
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  return resolvedPath;
}

/**
 * Extract imports from a file
 */
export function extractImports(filePath: string): string[] {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const importRegex = /import\s+(?:.+\s+from\s+)?['"]([^'"]+)['"]/g;
    const matches = Array.from(content.matchAll(importRegex));

    return matches
      .map((match) => match[1])
      .map((importPath) => resolveImportPath(filePath, importPath))
      .filter(Boolean);
  } catch (err) {
    console.error(`Error extracting imports from ${filePath}:`, err);
    return [];
  }
}

/**
 * Sort and group story files
 */
export function sortStoryFiles(files: StoryFile[]): StoryFile[] {
  // Sort by order or name
  const orderSorted = [...files].sort((a, b) => {
    // Sort by order if available
    const orderA = a.meta?.order;
    const orderB = b.meta?.order;

    if (orderA !== undefined && orderB !== undefined) return orderA - orderB;
    if (orderA !== undefined) return -1;
    if (orderB !== undefined) return 1;

    // Fall back to name
    return a.name.localeCompare(b.name);
  });

  // Group files
  const filesByGroup = new Map<string, StoryFile[]>();
  const ungrouped: StoryFile[] = [];

  // Distribute files into groups
  orderSorted.forEach((file) => {
    const group = file.meta?.group;
    if (group) {
      if (!filesByGroup.has(group)) filesByGroup.set(group, []);
      filesByGroup.get(group)!.push(file);
    } else {
      ungrouped.push(file);
    }
  });

  // Combine in order: grouped files (alphabetically by group) then ungrouped
  return [
    ...Array.from(filesByGroup.keys())
      .sort()
      .flatMap((group) => filesByGroup.get(group)!),
    ...ungrouped,
  ];
}

// --- File Discovery and Management ---

/**
 * Find story files and their dependencies
 */
export function findFilesAndDependencies(directory: string) {
  try {
    // Ensure directory is an absolute path
    const absoluteDir = ensureAbsolutePath(directory);

    // Get all files recursively
    const allFiles = findFilesRecursively(absoluteDir);

    // Filter for story files
    const storyFiles = allFiles.filter((file) => isStoryFile(file));

    // Verify all story file paths are absolute
    const absoluteStoryFiles = storyFiles.map(ensureAbsolutePath);

    // Track dependencies
    const dependencyMap = new Map<string, string[]>();

    // Extract dependencies from all story files
    absoluteStoryFiles.forEach((storyFile) => {
      const deps = extractImports(storyFile);

      // Ensure all dependency paths are absolute
      const absoluteDeps = deps.map(ensureAbsolutePath);

      absoluteDeps.forEach((dep) => {
        if (!dependencyMap.has(dep)) {
          dependencyMap.set(dep, []);
        }
        dependencyMap.get(dep)!.push(storyFile);
      });
    });

    // Filter valid dependencies (exist and aren't story files themselves)
    const dependencies = Array.from(dependencyMap.keys()).filter(
      (dep) => fs.existsSync(dep) && !absoluteStoryFiles.includes(dep)
    );

    // Ensure all returned paths are absolute
    return {
      storyFiles: absoluteStoryFiles,
      dependencies: dependencies.map(ensureAbsolutePath),
      dependencyMap,
    };
  } catch (err) {
    console.error(`Error finding files in ${directory}:`, err);
    return { storyFiles: [], dependencies: [], dependencyMap: new Map() };
  }
}

/**
 * Load a story file
 */
export async function loadStoryFile(
  filePath: string
): Promise<StoryFile | null> {
  try {
    // Add a cache-busting timestamp to force re-import
    const timestamp = Date.now();
    const fileUrl = `${pathToFileURL(filePath).href}?t=${timestamp}`;
    const imported = await import(fileUrl);

    const storyExport: StoryExport = imported.default || imported;

    if (!storyExport.stories || !Array.isArray(storyExport.stories)) {
      console.warn(`File ${filePath} does not export stories array.`);
      return null;
    }

    return {
      filePath,
      name: getFileDisplayName(filePath),
      stories: storyExport.stories,
      meta: storyExport.meta,
    };
  } catch (err) {
    console.error(`Error loading story file ${filePath}:`, err);
    return null;
  }
}
