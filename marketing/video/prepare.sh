#!/usr/bin/env bash
# Prepara los recursos binarios a partir del sitio (no se versionan aquí).
set -euo pipefail
cd "$(dirname "$0")"
cp ../../client/public/logo-full.png ../../client/public/fonts/inter-latin.woff2 cards/
pip install -q fonttools brotli pillow numpy
python3 -c "from fontTools.ttLib import TTFont; f=TTFont('cards/inter-latin.woff2'); f.flavor=None; f.save('Inter.ttf')"
echo "Listo: cards/logo-full.png, cards/inter-latin.woff2 e Inter.ttf"
