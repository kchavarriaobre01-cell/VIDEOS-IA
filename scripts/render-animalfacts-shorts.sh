#!/usr/bin/env bash
# Renderiza los 8 Shorts de animales con más potencial viral en out/animal-shorts/.
set -euo pipefail
mkdir -p out/animal-shorts
for i in 25 23 20 7 21 22 17 14; do
  n=$(printf "%02d" "$i")
  npx remotion render AnimalFactShort "out/animal-shorts/fact-$n.mp4" --props="{\"fact\":$i}" --crf=23 --log=error
  echo "short $n listo"
done
