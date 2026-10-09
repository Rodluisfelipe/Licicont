// Graba la página real con el screencast de Chromium y deja cuadros + lista de concat para ffmpeg.
// Uso: node rec.mjs <intro|outro|tour> <outDir> [w] [h] [mobile]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH);

const [mode, outDir, W = '1920', H = '1080', MOBILE = '0', DSF = '1'] = process.argv.slice(2);
const w = +W, h = +H, mobile = MOBILE === '1', dsf = +DSF;
const CARDS = path.join(path.dirname(new URL(import.meta.url).pathname), 'cards');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ args: ['--hide-scrollbars'] });
const ctx = await browser.newContext({
  viewport: { width: w, height: h },
  deviceScaleFactor: dsf,
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: 'no-preference',
});
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);

const frames = [];
let recording = false;
cdp.on('Page.screencastFrame', async (f) => {
  if (recording) frames.push({ ts: f.metadata.timestamp, data: f.data });
  try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch {}
});
const start = async () => {
  recording = true;
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 94, maxWidth: Math.round(w * dsf), maxHeight: Math.round(h * dsf), everyNthFrame: 1 });
};
const stop = async () => { await cdp.send('Page.stopScreencast'); recording = false; };
const wait = (ms) => page.waitForTimeout(ms);

// ── Utilidades dentro de la página: cursor visible, desplazamiento suave y rótulos ──
const INJECT = `
(() => {
  if (window.__tour) return;
  const css = document.createElement('style');
  css.textContent = \`
    html{scrollbar-width:none}::-webkit-scrollbar{display:none}
    #__cur{position:fixed;z-index:2147483647;left:0;top:0;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;
      background:rgba(176,141,87,.35);border:2px solid #fff;box-shadow:0 2px 10px rgba(10,25,47,.35);pointer-events:none;
      transition:transform .15s ease, background .15s ease}
    #__cur.down{transform:scale(.7);background:rgba(176,141,87,.8)}
    .__ripple{position:fixed;z-index:2147483646;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;border:2px solid #B08D57;
      pointer-events:none;animation:__rip .6s ease-out forwards}
    @keyframes __rip{to{transform:scale(4.5);opacity:0}}
    #__cap{position:fixed;z-index:2147483645;left:\${${mobile} ? '50%' : '56px'};bottom:\${${mobile} ? '128px' : '56px'};
      transform:translate(\${${mobile} ? '-50%' : '0'},24px);opacity:0;transition:all .55s cubic-bezier(.22,1,.36,1);
      background:rgba(10,25,47,.94);color:#fff;border:1px solid rgba(201,169,106,.45);border-radius:14px;
      padding:\${${mobile} ? '14px 20px' : '18px 26px'};font-family:Inter,sans-serif;box-shadow:0 18px 50px rgba(10,25,47,.35);
      max-width:\${${mobile} ? '86vw' : '620px'};backdrop-filter:blur(8px);text-align:\${${mobile} ? 'center' : 'left'}}
    #__cap.on{opacity:1;transform:translate(\${${mobile} ? '-50%' : '0'},0)}
    #__cap .k{display:block;font-size:\${${mobile} ? '11px' : '12px'};letter-spacing:.24em;text-transform:uppercase;color:#C9A96A;font-weight:600;margin-bottom:6px}
    #__cap .t{display:block;font-size:\${${mobile} ? '18px' : '24px'};font-weight:700;letter-spacing:-.01em;line-height:1.25}
  \`;
  document.head.appendChild(css);
  const cur = document.createElement('div'); cur.id='__cur'; cur.style.opacity='0'; document.body.appendChild(cur);
  addEventListener('mousemove', e => { cur.style.opacity='1'; cur.style.left=e.clientX+'px'; cur.style.top=e.clientY+'px'; }, true);
  addEventListener('mousedown', e => { cur.classList.add('down'); const r=document.createElement('div'); r.className='__ripple';
    r.style.left=e.clientX+'px'; r.style.top=e.clientY+'px'; document.body.appendChild(r); setTimeout(()=>r.remove(),700); }, true);
  addEventListener('mouseup', () => cur.classList.remove('down'), true);
  const cap = document.createElement('div'); cap.id='__cap'; cap.innerHTML='<span class="k"></span><span class="t"></span>'; document.body.appendChild(cap);
  window.__cap = (k, t) => { cap.classList.remove('on'); setTimeout(()=>{ cap.querySelector('.k').textContent=k; cap.querySelector('.t').textContent=t; cap.classList.add('on'); }, 250); };
  window.__capHide = () => cap.classList.remove('on');
  const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
  // Desplazamiento nativo cuadro a cuadro: determinista y sin pelear con Lenis.
  window.__scroll = (dist, ms) => new Promise(res => {
    const t0 = performance.now(); const y0 = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    const step = now => {
      const t = Math.min(1, (now - t0) / ms);
      window.scrollTo({ top: Math.max(0, Math.min(max, y0 + ease(t) * dist)), behavior: 'instant' });
      t < 1 ? requestAnimationFrame(step) : setTimeout(res, 250);
    };
    requestAnimationFrame(step);
  });
  window.__distTo = (sel, offset) => { const el = document.querySelector(sel); return el ? el.getBoundingClientRect().top - offset : 0; };
  window.__distToText = (text, offset) => {
    const el = [...document.querySelectorAll('h2,h3')].find(e => e.textContent.trim().startsWith(text));
    return el ? el.getBoundingClientRect().top - offset : 0;
  };
  window.__tour = true;
})();`;

const scrollBy = (dist, ms) => page.evaluate(([d, m]) => window.__scroll(d, m), [dist, ms]);
const scrollTo = async (sel, ms, offset = 76) => {
  const d = await page.evaluate(([s, o]) => window.__distTo(s, o), [sel, offset]);
  await scrollBy(d, ms);
};
const cap = (k, t) => page.evaluate(([a, b]) => window.__cap(a, b), [k, t]);
const capHide = () => page.evaluate(() => window.__capHide());
let mx = w / 2, my = h / 2;
const glide = async (x, y, ms = 700) => {
  const steps = Math.max(8, Math.round(ms / 16));
  const sx = mx, sy = my;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps; const e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    await page.mouse.move(sx + (x - sx) * e, sy + (y - sy) * e);
    await wait(ms / steps * 0.6);
  }
  mx = x; my = y;
};
const glideTo = async (locator, ms) => {
  const b = await locator.boundingBox(); if (!b) return false;
  await glide(b.x + b.width / 2, b.y + b.height / 2, ms); return true;
};
const clickAt = async (locator, ms = 700) => {
  if (await glideTo(locator, ms)) { await wait(120); await page.mouse.down(); await wait(90); await page.mouse.up(); }
};

// ── Escenas ──
if (mode === 'intro' || mode === 'outro') {
  await page.goto('about:blank');
  await start();
  await page.goto('file://' + path.join(CARDS, mode + '.html'));
  await wait(mode === 'intro' ? 3300 : 4800);
  await stop();
} else {
  await page.goto('about:blank');
  await start();
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(INJECT);
  await page.mouse.move(mx, my);
  await wait(2600); // entrada del hero + palabras que rotan

  if (!mobile) {
    await glideTo(page.getByRole('button', { name: 'Descubre tu plan ideal' }).first(), 800);
    await wait(300);
  }
  await cap('Le vendo al Estado por ti', 'Cobro 1%, no 3%, y solo si ganas');
  await wait(1300);
  await scrollBy(mobile ? 760 : 620, 1300);
  await wait(500);
  await capHide();

  await scrollTo('#sobre-mi', 1300);
  await cap('Trayectoria', '+10 años y $200.000 millones en procesos');
  await wait(1500);
  if (mobile) { await scrollBy(560, 1100); await wait(500); }
  await capHide();

  // Diagnóstico interactivo
  await scrollTo('#diagnostico', 1300);
  await cap('Diagnóstico gratis', 'Tu plan ideal en 45 segundos');
  await wait(400);
  await clickAt(page.getByRole('button', { name: /Empezar mi diagnóstico|Hacer el diagnóstico de nuevo/ }).first(), 700);
  await wait(1200);
  await clickAt(page.getByRole('button', { name: /Ya he ganado contratos/ }).first(), 700);
  await wait(1500); // el diagnóstico reencuadra la pregunta por su cuenta
  await capHide();

  // Menú de servicios
  await scrollTo('#planes', 1500);
  await cap('Precios claros', '4 servicios: qué incluye, qué no y cuánto cuesta');
  await wait(900);
  await scrollBy(mobile ? 520 : 470, 1200);
  if (!mobile) {
    await clickAt(page.locator('#planes button[aria-expanded]').nth(1), 800);
    await wait(700);
    await scrollBy(520, 1400);
    await wait(700);
  } else {
    // En celular: deslizar el carrusel de tarjetas
    await page.evaluate(() => {
      const rail = document.querySelector('#planes .snap-row');
      rail && rail.scrollBy({ left: rail.clientWidth * 0.85, behavior: 'smooth' });
    });
    await wait(1400);
  }
  await capHide();

  // Diferenciadores
  await scrollBy(await page.evaluate(() => window.__distToText('Por qué Licicont', 150)), 1400);
  await cap('Por qué Licicont', 'La defensa de tu oferta va incluida');
  await wait(1600);
  await capHide();

  // Metodología (horizontal en escritorio)
  await scrollTo('#proceso', 1300, mobile ? 76 : 0);
  await cap('Metodología', 'De la oportunidad al contrato firmado');
  if (!mobile) {
    const dist = await page.evaluate(() => document.querySelector('#proceso').offsetHeight - innerHeight);
    await scrollBy(dist, 3000);
  } else {
    await wait(600);
    await page.evaluate(() => {
      const rail = document.querySelector('#proceso .snap-row');
      rail && rail.scrollBy({ left: rail.clientWidth * 0.85, behavior: 'smooth' });
    });
    await wait(1300);
  }
  await capHide();

  await scrollTo('#trayectoria', 1300);
  await cap('Proyectos reales', 'Terminal de Tunja · UPTC · Gobernación de Boyacá');
  await wait(1900);
  await stop();
}

// ── Cuadros + lista de concat con la duración real de cada cuadro ──
if (mode === 'tour') {
  // Descarta los cuadros en blanco mientras carga la página.
  const firstReal = frames.findIndex((f) => f.data.length > frames[0].data.length * 3);
  if (firstReal > 0) frames.splice(0, firstReal);
}
const list = [];
frames.forEach((f, i) => {
  const name = `f${String(i).padStart(5, '0')}.jpg`;
  fs.writeFileSync(path.join(outDir, name), Buffer.from(f.data, 'base64'));
  const next = frames[i + 1] ? frames[i + 1].ts : f.ts + 1 / 30;
  list.push(`file '${name}'\nduration ${Math.max(0.001, next - f.ts).toFixed(4)}`);
});
list.push(`file 'f${String(frames.length - 1).padStart(5, '0')}.jpg'`);
fs.writeFileSync(path.join(outDir, 'list.txt'), list.join('\n'));
const secs = frames.length ? frames.at(-1).ts - frames[0].ts : 0;
console.log(mode, 'cuadros', frames.length, 'segundos', secs.toFixed(1), 'fps', (frames.length / secs).toFixed(1));
await browser.close();
