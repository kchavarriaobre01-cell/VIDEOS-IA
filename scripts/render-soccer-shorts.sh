#!/usr/bin/env bash
# Renderiza los 8 Shorts de fútbol con más potencial viral en out/soccer-shorts/.
set -euo pipefail
mkdir -p out/soccer-shorts
for i in 25 22 17 18 10 20 23 24; do
  npx remotion render SoccerShort "out/soccer-shorts/fact-$i.mp4" --props="{\"fact\":$i}" --crf=23 --log=error
  echo "short $i listo"
done
