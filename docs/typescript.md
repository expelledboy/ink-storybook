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

## Using the TypeScript-specific CLI

For TypeScript support, use our dedicated TypeScript-friendly CLI:

```bash
npx ts-ink-storybook
```

This command uses `npx` to run the TypeScript files directly with `tsx`, without requiring a separate compilation step.

The TypeScript CLI supports all the same options as the regular CLI:

```bash
npx ts-ink-storybook --stories ./components --config ./my-config.js
```

## How it Works

The TypeScript CLI uses [tsx](https://www.npmjs.com/package/tsx) (via npx) to directly execute TypeScript files without a separate compilation step. This allows you to:

1. Write your story files in TypeScript (`.story.tsx`)
2. Import TypeScript components directly in your stories
3. Use TypeScript for your configuration files

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

1. Make sure you're using the `ts-ink-storybook` command, not the regular `ink-storybook` command
2. Verify that `tsx` is installed globally or as a dev dependency in your project
3. If you see a "tsx: command not found" error, install it with `npm install -g tsx` or `npm install --save-dev tsx`
4. Try providing an absolute path to your stories directory:

```bash
npx ts-ink-storybook -s $PWD/src
```

This ensures paths are resolved correctly. 