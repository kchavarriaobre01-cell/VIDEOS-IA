#!/usr/bin/env bash
# Renderiza un Short vertical por cada dato del NFL (1..25) en out/nfl-shorts/.
set -euo pipefail
mkdir -p out/nfl-shorts
for i in $(seq 1 25); do
  n=$(printf "%02d" "$i")
  npx remotion render NFLShort "out/nfl-shorts/fact-$n.mp4" --props="{\"fact\":$i}" --crf=23 --log=error
  echo "short $n listo"
done
