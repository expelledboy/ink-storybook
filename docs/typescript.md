# Using TypeScript with ink-storybook

ink-storybook fully supports TypeScript story files (`.story.tsx`).

## Setup for TypeScript Support

To use TypeScript with ink-storybook, you need to install the `tsx` package either globally or as a dev dependency:

```bash
# Install globally
npm install -g tsx

# OR install as a dev dependency
npm install --save-dev typescript tsx
```

## Running With TypeScript Support

### Recommended approach (v0.1.4+)

The simplest way to run ink-storybook with TypeScript is to use our built-in TypeScript entry point:

```bash
# When installed as a dependency in your project
npx tsx ./node_modules/@expelledboy/ink-storybook/bin/ts-ink-storybook.ts -s src

# Or with the package.json exports (after npm publish)
npx tsx @expelledboy/ink-storybook/ts -s src
```

These methods work with both local and global installations and are the most direct way to use TypeScript with ink-storybook.

### Alternative approaches

You can also run the CLI directly:

```bash
# From your project root
npx tsx ./node_modules/@expelledboy/ink-storybook/src/cli/index.ts -s src
```

### Using a package.json script (Recommended):

Add a script to your package.json for convenience:

```json
{
  "scripts": {
    "storybook:ts": "npx tsx ./node_modules/@expelledboy/ink-storybook/bin/ts-ink-storybook.ts -s src"
  }
}
```

Then simply run:

```bash
npm run storybook:ts
```

The CLI supports all the same options as the regular ink-storybook command.

## How it Works

Using `tsx` allows you to:

1. Write your story files in TypeScript (`.story.tsx`)
2. Import TypeScript components directly in your stories
3. Use TypeScript for your configuration files

The `tsx` package provides a runtime TypeScript execution environment, similar to `ts-node` but with better ESM support, making it ideal for modern TypeScript applications.

## Creating TypeScript Story Files

Create your story files with the `.story.tsx` extension:

```tsx
// Button.story.tsx
import React from 'react';
import { Box, Text } from 'ink';
import { Button } from './Button';
import type { StoryExport } from '@expelledboy/ink-storybook';

const storyExport: StoryExport = {
  stories: [
    {
      id: 'default',
      title: 'Default Button',
      component: <Button>Click me</Button>,
      description: 'The default button style'
    },
    {
      id: 'primary',
      title: 'Primary Button',
      component: <Button primary>Click me</Button>,
      description: 'A primary button style'
    }
  ],
  meta: {
    group: 'Components',
    order: 1
  }
};

export default storyExport;
```

## Configuration with TypeScript

You can also write your configuration files in TypeScript:

```ts
// storybook/config.ts
import type { StorybookConfig } from '@expelledboy/ink-storybook';

const config: StorybookConfig = {
  title: 'My TypeScript Storybook',
  theme: {
    primary: 'blue',
    secondary: 'green',
    text: 'white',
    background: 'black',
  },
  // other configuration options...
};

export default config;
```

## Troubleshooting

If you encounter issues with TypeScript files:

1. Verify that `tsx` is installed globally or as a dev dependency in your project
2. If you see a "tsx: command not found" error, install it with `npm install -g tsx` or `npm install --save-dev tsx`
3. Try providing an absolute path to your stories directory:

```bash
npx tsx @expelledboy/ink-storybook/ts -s $PWD/src
```

4. When using a TypeScript configuration file, use the `.ts` extension in your path:

```bash
npx tsx @expelledboy/ink-storybook/ts -c storybook/config.ts
```

5. If you're using the package in a development environment (like when contributing to ink-storybook), you can run:

```bash
npx tsx ./bin/ts-ink-storybook.ts -s examples
``` 