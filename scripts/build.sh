#!/usr/bin/env bash

set -euo pipefail

DIST_DIR="dist"

echo "Cleaning ${DIST_DIR} directory..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

echo "Copying static assets..."
cp index.html style.css app.js "$DIST_DIR"/

echo "Injecting environment variables into env.js..."
cat >"${DIST_DIR}/env.js" <<EOF
window.__ENV__ = {
  SUPABASE_URL: "${SUPABASE_URL:-}",
  SUPABASE_ANON_KEY: "${SUPABASE_ANON_KEY:-}",
};
EOF

echo "Build complete. Output available in ${DIST_DIR}/"
