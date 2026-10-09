# Videos de Licicont

Recorridos de licicont.me grabados de la página real.

## Requisitos
- Chromium y Playwright globales (preinstalados en el entorno en la nube), ffmpeg y Python 3.
- `./prepare.sh` copia el logo y la fuente del sitio y genera `Inter.ttf`.
- Para voz y música: `ELEVENLABS_API_KEY` en las variables del entorno y `api.elevenlabs.io` permitido en la red.

## Vertical 9:16 (Reels / TikTok) — el principal
1. Compilar y servir el sitio: `cd client && npm run build && npx vite preview --port 4173`
2. Grabar (tiempo controlado cuadro a cuadro, ~25 min):
   `PW_PATH=$(npm root -g)/playwright/index.js node marketing/video/vrec.mjs /ruta/vraw`
3. Editar (cámara, focos, toques, rótulos, intro y cierre, ~3 min):
   `python3 -I marketing/video/post.py /ruta/vraw Licicont-vertical.mp4`

El guion de escenas está al final de `vrec.mjs`; los efectos (zoom, focos, rótulos) en `post.py`
(listas `cam`, `SPOTS`, `CAPS`). El video final dura ~37,6 s.

## Horizontal 16:9
`rec.mjs` graba intro, recorrido y cierre (`node rec.mjs <intro|tour|outro> <dir> 1440 810 0 1.3333`)
y se montan con ffmpeg (fundidos `xfade`).

## Pendiente: locución y música (ElevenLabs)
Guion de locución sincronizado con el video vertical:
- Intro: "¿Quieres venderle al Estado? Yo lo hago por ti."
- Cobro: "Y cobro el uno por ciento, no el tres. Solo si ganas."
- Cifras: "Más de diez años y doscientos mil millones en procesos."
- Diagnóstico: "Haz el diagnóstico gratis: en cuarenta y cinco segundos sabes cuál es tu plan."
- Precios: "Precios claros, desde ciento cincuenta mil pesos por proceso."
- 1 y 3: "En un contrato de quinientos millones, te ahorras diez."
- Cierre: "Licicont. Licitaciones y contratas. Entra a licicont punto me."
Música: corporativa moderna, motivadora, ~100 bpm, sin voces, ~38 s; bajar la música cuando habla la voz.
