#!/bin/sh

# Run the example
node --no-warnings --import tsx \
    src/cli/index.ts \
        -c examples/storybook/config.ts \
        "$@"
