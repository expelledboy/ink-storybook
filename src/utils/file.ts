import path from "path";
import fs from "fs";

/**
 * Ensures a path is absolute, converting relative paths to absolute
 */
export function ensureAbsolutePath(filePath: string): string {
  return path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
}

/**
 * Recursively find all files in a directory and its subdirectories
 */
export function findFilesRecursively(directory: string): string[] {
  const files: string[] = [];

  try {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        // Ignore .git and node_modules
        if (entry.name === ".git" || entry.name === "node_modules") {
          continue;
        }

        // Recursively search subdirectories
        files.push(...findFilesRecursively(fullPath));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${directory}:`, err);
  }

  return files;
}
