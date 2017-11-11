#!/usr/bin/env sh

function printErr {
  echo "$@" >&2
}

function die {
  printErr "$@"

  exit 1
}

function isInstalled {
  if ! [ -x "$(command -v $1)" ]; then
    die "Error: $1 is not installed. $2"
  fi
}

# Check git is installed.
isInstalled 'git' "
You may use brew to install git.

  brew install git
"

# Check npm is installed.
isInstalled 'npm' "
You may use brew to install node/npm.

  > brew install node
"

function publish {
  local BRANCH=$(git rev-parse --abbrev-ref HEAD)
  local COMMIT=$(git rev-parse "$BRANCH"^{commit})
  local VERSION="$1"
  shift

  if [ "$BRANCH" != "master" ]; then
    die "You should publish only master branch."
  fi

  function resetAndDie {
    git reset --hard ${COMMIT}

    die "$@"
  }

  npm version "$VERSION" || resetAndDie "NPM could not create new version."
  if [ -z "$1" ]; then
    AUTO_PUBLISH=pass npm publish --tags "$@" || resetAndDie "NPM publish failed."
  else
    AUTO_PUBLISH=pass npm publish || resetAndDie "NPM publish failed."
  fi
  git push -u origin "$BRANCH" && git push --tags
}


case "$1" in
  fail)
    echo "\n  Use ./publish.sh script for publishing this npm package.\n"
    exit 1
    ;;
  pass)
    exit 0
    ;;
  *)
    [ -z "$1" ] && die "Version is required."
    publish "$@"
    ;;
esac
