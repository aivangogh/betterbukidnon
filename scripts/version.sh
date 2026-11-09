#!/bin/bash

# Version Management Script for BetterBukidnon
# Delegates to the cross-platform Node.js script which handles:
#   - version.json (master source of truth)
#   - package.json sync
#   - all HTML files (Ver. X.X.X pattern)
#   - react-app/public/version.json sync
#
# Usage: ./scripts/version.sh [major|minor|patch]

BUMP_TYPE=${1:-""}

if [ -z "$BUMP_TYPE" ]; then
    pnpm exec tsx "$(dirname "$0")/bump-version.ts"
else
    pnpm exec tsx "$(dirname "$0")/bump-version.ts" "$BUMP_TYPE"
fi
