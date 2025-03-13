#!/bin/bash

SNAPSHOT="tests/snapshot.txt"

# Run example with explicit CI environment to force non-interactive mode
# This ensures useInput is disabled during testing
OUTPUT=$(CI=true timeout 0.8 npm run example 2>&1 | sed 's/\x1B\[[0-9;]*[a-zA-Z]//g')

# If snapshot doesn't exist, create it and exit
if [ ! -f "$SNAPSHOT" ]; then
  echo "$OUTPUT" > "$SNAPSHOT"
  echo "Created new snapshot"
  exit 0
fi

# Compare with snapshot (ignoring whitespace)
if diff -bB <(echo "$OUTPUT") "$SNAPSHOT" > /dev/null; then
  echo "✓ Test passed"
  exit 0
else
  echo "✗ Test failed - output differs from snapshot"
  diff -b "$SNAPSHOT" <(echo "$OUTPUT")
  exit 1
fi
