#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# Function to print to stderr, for easier debugging
function echo_err() { echo "$@" 1>&2; }

PWD=$(pwd)
echo_err "Current working dir: $PWD"

# Check whether we need to execute
if [ ! -f "Gemfile.next" ]; then
  echo_err "Gemfile.next does not exist; skipping regeneration"

  # Exit early
  exit 0
fi

echo_err "Copy Gemfile.lock to Gemfile.next.lock"
cp Gemfile.lock Gemfile.next.lock

echo_err "Running bundle lock for Gemfile.next"
BUNDLE_GEMFILE=Gemfile.next bundle lock

echo_err "Running bundle-checksum.sh for Gemfile.next"

BUNDLE_CHECKSUM_SCRIPT="$(dirname "$0")/bundle-checksum.sh"

BUNDLE_GEMFILE=Gemfile.next BUNDLE_CHECKSUM_FILE=Gemfile.next.checksum bash $BUNDLE_CHECKSUM_SCRIPT

exit 0
