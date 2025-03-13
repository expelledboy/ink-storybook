/**
 * Check if the current environment supports TTY input
 * This is used to disable interactive features in non-TTY environments (CI, tests, etc.)
 */
export function isTTYSupported(): boolean {
  try {
    return Boolean(process.stdin?.isTTY);
  } catch (error) {
    // If we can't access stdin, assume no TTY support
    return false;
  }
}

/**
 * Check if running in CI environment
 */
export function isCI(): boolean {
  return Boolean(
    process.env.CI ||
      process.env.CONTINUOUS_INTEGRATION ||
      process.env.BUILD_NUMBER ||
      process.env.GITHUB_ACTIONS ||
      process.env.JEST_WORKER_ID || // Jest
      process.env.NODE_TEST_CONTEXT || // NodeJS test context
      process.env.TEST // General test flag
  );
}

/**
 * Check if running in test environment (used during snapshot tests)
 */
export function isTest(): boolean {
  return Boolean(
    process.env.TEST === "true" || process.env.NODE_ENV === "test"
  );
}

/**
 * Check if environment supports interactive input
 * Combines TTY check and CI check
 */
export function isInteractive(): boolean {
  // Fast exit for CI or test environments
  if (isCI() || isTest()) {
    return false;
  }

  // Check for TTY support
  if (!isTTYSupported()) {
    return false;
  }

  // Edge case: Sometimes scripts run with TTY but we still don't want interaction
  try {
    // If stdin can't go into raw mode, we shouldn't allow interaction
    return process.stdin.isRaw !== undefined;
  } catch (error) {
    // If we can't check, be conservative and disable interaction
    return false;
  }
}
