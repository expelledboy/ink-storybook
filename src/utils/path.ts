import path from "path";

/**
 * Ensures a path is absolute, converting relative paths to absolute
 */
export function ensureAbsolutePath(filePath: string): string {
  return path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
}
