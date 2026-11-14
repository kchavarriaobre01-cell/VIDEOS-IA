#!/usr/bin/env bash
# Renderiza un Short vertical por cada dato (1..25) en out/shorts/.
set -euo pipefail
mkdir -p out/shorts
for i in $(seq 1 25); do
  n=$(printf "%02d" "$i")
  npx remotion render BasketShort "out/shorts/fact-$n.mp4" --props="{\"fact\":$i}" --crf=23 --log=error
  echo "short $n listo"
done
