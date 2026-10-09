// Grabación vertical determinista: reloj de la página pausado y avanzado cuadro a cuadro.
// Guarda cuadros en alta resolución + events.json con marcas (rectángulos y toques) para la posproducción.
// Uso: PW_PATH=... node vrec.mjs <outDir>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH);

const OUT = process.argv[2];
const VW = 390, VH = 693;            // viewport CSS (9:16)
const DSF = 3.6;                     // margen para acercamientos nítidos (~1404×2495)
const FPS = 30;
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ args: ['--hide-scrollbars'] });
const ctx = await browser.newContext({
  viewport: { width: VW, height: VH }, deviceScaleFactor: DSF, isMobile: true, hasTouch: true,
});
const page = await ctx.newPage();
await page.clock.install({ time: new Date('2026-10-09T10:00:00') });
await page.clock.pauseAt(new Date('2026-10-09T10:00:01'));
await page.goto('http://localhost:4173/', { waitUntil: 'load' });
await page.addStyleTag({ content: 'html{scrollbar-width:none}::-webkit-scrollbar{display:none}' });
const cdp = await ctx.newCDPSession(page);

let n = 0;
const events = { fps: FPS, vw: VW, vh: VH, marks: [], taps: [] };
const frame = async () => {
  await page.clock.runFor(1000 / FPS);
  // El recorte va en coordenadas del documento: se ancla a la posición de scroll actual.
  const sy = await page.evaluate(() => window.scrollY);
  const r = await cdp.send('Page.captureScreenshot', {
    format: 'jpeg', quality: 93, clip: { x: 0, y: sy, width: VW, height: VH, scale: DSF },
  });
  fs.writeFileSync(path.join(OUT, `f${String(n).padStart(5, '0')}.jpg`), Buffer.from(r.data, 'base64'));
  n++;
};
const hold = async (s) => { for (let i = 0, k = Math.round(s * FPS); i < k; i++) await frame(); };
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Localiza un elemento por selector o por texto; opcionalmente sube a su contenedor.
const FIND = `(spec) => {
  let el = null;
  if (spec.text) {
    const pool = [...document.querySelectorAll(spec.sel || 'h1,h2,h3,h4,p,span,button,a,div')];
    el = pool.filter(e => spec.contains ? e.textContent.includes(spec.text) : e.textContent.trim().startsWith(spec.text))
             .sort((a, b) => a.textContent.length - b.textContent.length)[spec.nth || 0];
  } else el = document.querySelectorAll(spec.sel)[spec.nth || 0];
  if (el && spec.closest) el = el.closest(spec.closest);
  return el;
}`;
const rectOf = (spec) => page.evaluate(([f, s]) => {
  const el = eval(f)(s); if (!el) return null;
  const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, absY: r.y + scrollY };
}, [FIND, spec]);
const mark = async (name, spec, pad = 8) => {
  const r = await rectOf(spec);
  if (!r) { console.warn('sin marca', name, JSON.stringify(spec)); return; }
  events.marks.push({ name, frame: n, x: r.x - pad, y: r.y - pad, w: r.w + pad * 2, h: r.h + pad * 2 });
};
const scrollToY = async (y, s) => {
  const y0 = await page.evaluate(() => scrollY);
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const y1 = Math.max(0, Math.min(max, y));
  const k = Math.max(1, Math.round(s * FPS));
  for (let i = 1; i <= k; i++) {
    const v = y0 + (y1 - y0) * ease(i / k);
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), v);
    await frame();
  }
};
const scrollToEl = async (spec, top, s) => {
  const r = await rectOf(spec); if (!r) { console.warn('sin destino', JSON.stringify(spec)); return; }
  await scrollToY(r.absY - top, s);
};
const tap = async (name, spec) => {
  const r = await rectOf(spec); if (!r) { console.warn('sin toque', name); return; }
  events.taps.push({ name, frame: n, x: r.x + r.w / 2, y: r.y + r.h / 2 });
  await hold(0.25);                                   // el anillo aparece antes del cambio
  await page.evaluate(([f, s]) => eval(f)(s)?.click(), [FIND, spec]);
};
const swipe = async (railSel, cards, s) => {
  await page.evaluate((sel) => { const r = document.querySelector(sel); r.style.scrollSnapType = 'none'; r.style.scrollBehavior = 'auto'; }, railSel);
  const x0 = await page.evaluate((sel) => document.querySelector(sel).scrollLeft, railSel);
  const dx = await page.evaluate(([sel, c]) => {
    const r = document.querySelector(sel); const it = r.children[0]; return (it.getBoundingClientRect().width + 16) * c;
  }, [railSel, cards]);
  const k = Math.round(s * FPS);
  for (let i = 1; i <= k; i++) {
    await page.evaluate(([sel, v]) => { document.querySelector(sel).scrollLeft = v; }, [railSel, x0 + dx * ease(i / k)]);
    await frame();
  }
};
const cut = (name) => events.marks.push({ name, frame: n, cut: true });

// ───────────── Guion ─────────────
cut('inicio');
await hold(1.2);                                                     // entrada del hero
await mark('titular', { text: 'Transformo', sel: 'h1' }, 14);
await hold(2.4);
await mark('cobro', { text: 'Le vendo al Estado por ti', sel: 'p' }, 12);
await hold(2.1);

cut('cifras');
await scrollToEl({ text: '+$200.000', sel: 'p' }, 230, 1.1);
await mark('cifra', { text: '+$200.000', sel: 'p', closest: 'div' }, 12);
await hold(2.0);

cut('sobremi');
await scrollToEl({ sel: '#sobre-mi' }, 70, 1.2);
await mark('foto', { sel: '#sobre-mi img' }, 6);
await hold(1.9);

cut('diagnostico');
await scrollToEl({ sel: '#diagnostico' }, 76, 1.3);
await hold(0.5);
await mark('empezar', { text: 'Empezar mi diagnóstico', sel: 'button' }, 10);
await tap('empezar', { text: 'Empezar mi diagnóstico', sel: 'button' });
await hold(1.0);
await mark('opcion', { text: 'Me he presentado y no he ganado', sel: 'button', contains: true }, 8);
await hold(0.4);
await tap('opcion', { text: 'Me he presentado y no he ganado', sel: 'button', contains: true });
await hold(1.3);

cut('planes');
await scrollToEl({ text: 'Socio Licitador', sel: 'h3' }, 150, 1.4);
await mark('precio', { text: '$1.500.000 / mes + 1%', sel: 'p', closest: 'div' }, 10);
await hold(2.0);
await swipe('#planes .snap-row', 1, 1.0);
await mark('proceso', { text: 'Desde $150.000', sel: 'p', closest: 'div' }, 10);
await hold(1.6);

cut('diferencia');
await scrollToEl({ text: '1% y no 3%', sel: 'h4', closest: '.card' }, 230, 1.4);
await mark('unoytres', { text: '1% y no 3%', sel: 'h4', closest: '.card' }, 8);
await hold(2.2);

cut('trayectoria');
await scrollToEl({ sel: '#trayectoria' }, 60, 1.3);
await mark('proyecto', { sel: '#trayectoria article' }, 8);
await hold(1.6);
await swipe('#trayectoria .snap-row', 1, 0.9);
await hold(0.8);
cut('fin');

const first = fs.readdirSync(OUT).find((f) => f.endsWith('.jpg'));
const { width, height } = await page.evaluate(() => ({ width: 0, height: 0 }));
events.frames = n;
fs.writeFileSync(path.join(OUT, 'events.json'), JSON.stringify(events, null, 1));
console.log('cuadros', n, 'segundos', (n / FPS).toFixed(1), 'primero', first, width, height);
await browser.close();
