#!/usr/bin/env bash
set -euo pipefail

FORK_URL="${1:-}"
TARGET_DIR="${2:-../shopify-api-ruby-upstream}"
UPSTREAM_URL="git@github.com:Shopify/shopify-api-ruby.git"

if [[ -z "${FORK_URL}" ]]; then
  cat >&2 <<'USAGE'
Usage:
  scripts/prepare-shopify-upstream.sh <your-fork-url> [target-dir]

Example:
  scripts/prepare-shopify-upstream.sh git@github.com:your-user/shopify-api-ruby.git
USAGE
  exit 64
fi

if [[ -e "${TARGET_DIR}" && ! -d "${TARGET_DIR}/.git" ]]; then
  echo "Target exists but is not a git repository: ${TARGET_DIR}" >&2
  exit 65
fi

if [[ ! -d "${TARGET_DIR}/.git" ]]; then
  git clone "${FORK_URL}" "${TARGET_DIR}"
fi

cd "${TARGET_DIR}"

if ! git remote get-url upstream >/dev/null 2>&1; then
  git remote add upstream "${UPSTREAM_URL}"
fi

if ! git remote get-url fork >/dev/null 2>&1; then
  git remote add fork "${FORK_URL}"
fi

git fetch upstream main || git fetch origin main
git checkout main
git pull --ff-only upstream main || git pull --ff-only origin main

cat <<SUMMARY
Prepared Shopify API Ruby workspace:
  Directory: ${TARGET_DIR}
  Upstream:  $(git remote get-url upstream 2>/dev/null || true)
  Fork:      $(git remote get-url fork 2>/dev/null || true)

Next steps:
  cd ${TARGET_DIR}
  git checkout -b forma/<short-change-name>
  bundle install
  bundle exec rake test
SUMMARY
