# Using TypeScript with ink-storybook

ink-storybook fully supports TypeScript story files (`.story.tsx`).

## Built-in TypeScript Support

As of version 0.1.6, ink-storybook comes with TypeScript support out of the box. You can use it with `.story.tsx` files without any extra setup:

```bash
# Run directly with TypeScript support
npx @expelledboy/ink-storybook -s src
```

The CLI will automatically handle TypeScript files thanks to the built-in `tsx` integration.

### Using a package.json script:

Add a script to your package.json for convenience:

```json
{
  "scripts": {
    "storybook": "ink-storybook -s src"
  }
}
```

Then simply run:

```bash
npm run storybook
```

## How it Works

ink-storybook uses the `tsx` package internally to:

1. Write your story files in TypeScript (`.story.tsx`)
2. Import TypeScript components directly in your stories
3. Use TypeScript for your configuration files

This provides a seamless experience similar to using JavaScript files, with no separate compilation step required.

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