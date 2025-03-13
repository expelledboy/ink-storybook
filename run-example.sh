#!/bin/sh


# Run the example
node --no-warnings --loader @swc-node/register/esm \
    src/cli/index.ts \
        -c examples/storybook/config.js \
        -s examples