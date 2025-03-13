#!/usr/bin/env node

// This is a simple wrapper that uses npx to run tsx directly
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";
import { spawnSync } from "child_process";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper functions for consistent error messages
function showTsxInstallInstructions() {
  console.error("\nPlease install 'tsx' with one of the following commands:");
  console.error("\n  npm install -g tsx");
  console.error("  # or");
  console.error("  npm install --save-dev tsx\n");
}

// Check if a command is available in the path
function isCommandAvailable(command) {
  try {
    execSync(`which ${command}`, { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

// Get the full path to the TS CLI entry point (using the source file, not the compiled one)
const cliPath = resolve(__dirname, "../src/cli/index.ts");

// Check if npx is available
if (!isCommandAvailable("npx")) {
  console.error(
    "Error: npx command not found. Please install Node.js with npm."
  );
  process.exit(1);
}

// Try to run with npx tsx
try {
  console.log("Starting ink-storybook with TypeScript support...");

  // Process arguments to ensure story paths are properly formatted for ESM imports
  const args = [];
  const cwd = process.cwd();

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    // If this is a stories argument (-s or --stories)
    if (arg === "-s" || arg === "--stories") {
      args.push(arg);

      // If there's a next argument, and it doesn't start with a dash, it's the path value
      if (i + 1 < process.argv.length && !process.argv[i + 1].startsWith("-")) {
        const storyPath = process.argv[i + 1];
        // Convert to absolute path to ensure proper ESM import
        args.push(join(cwd, storyPath));
        i++; // Skip the next argument as we've processed it
      }
    }
    // Handle --stories=path format
    else if (arg.startsWith("-s=") || arg.startsWith("--stories=")) {
      const [option, value] = arg.split("=");
      args.push(`${option}=${join(cwd, value)}`);
    } else {
      args.push(arg);
    }
  }

  // Use npx to run the tsx command directly
  const result = spawnSync("npx", ["tsx", cliPath, ...args], {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      NODE_NO_WARNINGS: "1", // Suppress experimental warnings
    },
  });

  // Handle the exit code
  if (result.status !== 0) {
    if (result.error) {
      if (result.error.code === "ENOENT") {
        console.error("\nError: 'tsx' package not found.");
        showTsxInstallInstructions();
      } else {
        console.error(`\nError: ${result.error.message}\n`);
      }
    }
    process.exit(result.status || 1);
  }
} catch (error) {
  console.error("\nFailed to start ink-storybook with TypeScript support:");
  console.error(error.message);
  showTsxInstallInstructions();
  process.exit(1);
}
