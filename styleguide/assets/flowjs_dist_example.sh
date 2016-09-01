#!/bin/bash

# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#                        >>    IMPORTANT    <<
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# This file usually assumes to sit in a sub-directory e.g. "[PROJECT_DIR]/scripts".
# Make sure to adapt the path for the $PROJECT_DIR variable appropriately to
# your project structure!

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# >> CHECK ME <<
PROJECT_DIR="$SCRIPT_DIR/.."

TARGET_DIR="$PROJECT_DIR/dist/lib"

cd $PROJECT_DIR

command -v rsync >/dev/null 2>&1 || { echo "'rsync' not found. Aborting."; exit 1; }
command -v babel >/dev/null 2>&1 || { echo "'babel' not found. Aborting."; exit 1; }

function header() {
  echo ""
  echo "--------------------------------------------------------------"
  echo $1
  echo "--------------------------------------------------------------"
}

header "Working directory: $(pwd)"

mkdir -p dist

header "Clean dist/"
echo "rm -r ${TARGET_DIR}"
rm -r $TARGET_DIR 

header "Copy src to dist and rename to flow.js"
echo "rsync -r src/ ${TARGET_DIR}" 
rsync -r src/ $TARGET_DIR 

echo "find $TARGET_DIR > mv to js.flow ..."
find $TARGET_DIR -name "*.js" -exec bash -c 'mv "$1" "$(sed "s/\.js$/.js.flow/" <<< "$1")"' - '{}' \;

header "Transpile to ES6 -> ES5..."
babel src -d $TARGET_DIR
