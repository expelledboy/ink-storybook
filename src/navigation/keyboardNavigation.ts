import type { Key } from "ink";
import type { StorybookConfig } from "../config/loadConfig.js";

/**
 * Matches a key press against a key binding definition
 *
 * @param binding - The key binding to check
 * @param input - The input character
 * @param key - The key object from Ink
 */
function matchKeyBinding(binding: string, input: string, key: Key): boolean {
  const parts = binding.toLowerCase().split("+");

  // Special handling for modifiers
  const requiresShift = parts.includes("shift");
  const requiresCtrl = parts.includes("ctrl");
  // Ink doesn't support alt key in its Key type
  const requiresAlt = parts.includes("alt");

  // Check if modifiers match
  if (requiresShift !== Boolean(key.shift)) return false;
  if (requiresCtrl !== Boolean(key.ctrl)) return false;
  // Skip alt check since it's not supported in Ink
  if (requiresAlt) {
    console.warn("Alt key is not supported in key bindings");
    return false;
  }

  // Get the base key without modifiers
  const baseKey = parts[parts.length - 1];

  // Match arrow keys
  if (baseKey === "right" && key.rightArrow) return true;
  if (baseKey === "left" && key.leftArrow) return true;
  if (baseKey === "up" && key.upArrow) return true;
  if (baseKey === "down" && key.downArrow) return true;

  // Match single letter/character keys
  if (baseKey === input.toLowerCase()) return true;

  // Match special keys
  if (baseKey === "enter" && key.return) return true;
  if (baseKey === "escape" && key.escape) return true;
  if (baseKey === "space" && input === " ") return true;
  if (baseKey === "tab" && key.tab) return true;

  return false;
}

/**
 * Interface for navigation actions
 */
export interface NavigationActions {
  navigateNextStory: () => void;
  navigatePreviousStory: () => void;
  navigateNextFile: () => void;
  navigatePreviousFile: () => void;
}

/**
 * Creates a keyboard navigation handler based on the config
 */
export function createKeyboardNavigationHandler(
  config: StorybookConfig,
  actions: NavigationActions
): (input: string, key: Key) => void {
  // Extract key bindings from config
  const {
    next: nextStoryBindings,
    previous: prevStoryBindings,
    nextFile: nextFileBindings,
    prevFile: prevFileBindings,
  } = config.keyBindings;

  // Convert string format to array of strings
  const normalizeBindings = (bindings: string[] | undefined): string[] => {
    if (!bindings) return [];
    return bindings.map((b) => b.toLowerCase());
  };

  const nextStoryKeys = normalizeBindings(nextStoryBindings);
  const prevStoryKeys = normalizeBindings(prevStoryBindings);
  const nextFileKeys = normalizeBindings(nextFileBindings);
  const prevFileKeys = normalizeBindings(prevFileBindings);

  // Return the input handler function
  return (input: string, key: Key) => {
    // Check for exit (always allow Ctrl+C)
    if (key.ctrl && input === "c") {
      process.exit(0);
    }

    // Check for next story binding
    for (const binding of nextStoryKeys) {
      if (matchKeyBinding(binding, input, key)) {
        actions.navigateNextStory();
        return;
      }
    }

    // Check for previous story binding
    for (const binding of prevStoryKeys) {
      if (matchKeyBinding(binding, input, key)) {
        actions.navigatePreviousStory();
        return;
      }
    }

    // Check for next file binding
    for (const binding of nextFileKeys) {
      if (matchKeyBinding(binding, input, key)) {
        actions.navigateNextFile();
        return;
      }
    }

    // Check for previous file binding
    for (const binding of prevFileKeys) {
      if (matchKeyBinding(binding, input, key)) {
        actions.navigatePreviousFile();
        return;
      }
    }
  };
}
