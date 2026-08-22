/**
 * Documento imprimible del diagnóstico — sin backend ni librerías.
 *
 * En vez de recolorear la landing para imprimirla (lo que arrastra el resto de
 * la página), se arma un documento propio de una sola hoja y se manda a
 * imprimir desde un iframe oculto. Así el visitante se lleva su plan en PDF con
 * el navegador y nada más.
 */

import type { Recommendation } from '@/lib/recommendation';
import type { LeadContact } from '@/lib/whatsapp';
import { CONTACT_EMAIL } from '@/lib/whatsapp';

/** El contenido lo escribe el visitante: se escapa antes de inyectarlo. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function listItems(items: string[], muted = false): string {
  return items
    .map(
      (item) =>
        `<li class="${muted ? 'muted' : ''}">${muted ? '·' : '✓'} ${escapeHtml(item)}</li>`
    )
    .join('');
}

export function buildDiagnosticHtml(
  rec: Recommendation,
  contact?: LeadContact,
  shareUrl?: string
): string {
  const { primary, complements, reasons, nextSteps, affinity, profile } = rec;

  const date = new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const contactBlock =
    contact && contact.fullName
      ? `<p class="meta">${escapeHtml(contact.fullName)}${
          contact.company ? ` · ${escapeHtml(contact.company)}` : ''
        }</p>`
      : '';

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Diagnóstico Licicont — ${escapeHtml(primary.name)}</title>
<style>
  @page { size: A4; margin: 16mm; }
  /* Misma tipografía de marca que la web: el iframe resuelve estas rutas. */
  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url("/fonts/inter-latin.woff2") format("woff2");
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #23262E;
    font-size: 11px;
    line-height: 1.55;
  }
  h1, h2, h3 { margin: 0; color: #0A192F; letter-spacing: -0.02em; }
  .brand {
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; margin-bottom: 18px;
    font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
    color: #8A6D3F;
  }
  .brand span:last-child { color: #9CA3AF; font-weight: 500; letter-spacing: .02em; text-transform: none; }
  .kicker { font-size: 9px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #8A6D3F; }
  .plan { display: flex; align-items: center; gap: 16px; margin: 4px 0 6px; }
  .plan h1 { font-size: 23px; font-weight: 700; letter-spacing: -0.025em; }
  .ring {
    width: 62px; height: 62px; flex: 0 0 62px; border: 3px solid #B08D57; border-radius: 50%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .ring strong { font-size: 17px; color: #0A192F; line-height: 1; font-weight: 700; }
  .ring small { font-size: 6px; letter-spacing: .08em; text-transform: uppercase; color: #6B7280; }
  .tagline { color: #6B7280; margin: 0 0 16px; }
  .meta { color: #6B7280; margin: 2px 0 0; font-size: 10px; }
  .grid { display: flex; gap: 22px; }
  .grid > div { flex: 1; }
  h3 { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: #8A6D3F; margin-bottom: 6px; }
  ul { list-style: none; margin: 0 0 14px; padding: 0; }
  li { margin-bottom: 4px; padding-left: 14px; text-indent: -14px; }
  li.muted { color: #9CA3AF; }
  .box { border: 1px solid #E5E7EB; border-radius: 8px; padding: 10px 12px; margin-bottom: 14px; }
  .price { font-size: 16px; font-weight: 700; color: #8A6D3F; letter-spacing: -0.01em; }
  .steps { display: flex; gap: 10px; margin-bottom: 14px; }
  .steps div { flex: 1; border: 1px solid #E5E7EB; border-radius: 8px; padding: 9px 10px; }
  .steps b { display: block; color: #8A6D3F; margin-bottom: 3px; }
  .profile { border-top: 1px solid #E5E7EB; padding-top: 10px; }
  .profile span { display: inline-block; margin: 0 14px 3px 0; color: #6B7280; }
  .profile b { color: #1F2937; font-weight: 600; }
  footer {
    margin-top: 18px; border-top: 1px solid #E5E7EB; padding-top: 10px;
    font-size: 9px; color: #6B7280;
  }
  footer a { color: #8A6D3F; text-decoration: none; }
</style>
</head>
<body>
  <div class="brand">
    <span>Licicont · Mi diagnóstico de contratación estatal</span>
    <span>${date}</span>
  </div>

  <p class="kicker">Plan recomendado</p>
  <div class="plan">
    <div class="ring"><strong>${affinity}%</strong><small>afinidad</small></div>
    <div>
      <h1>${escapeHtml(primary.name)}</h1>
      ${contactBlock}
    </div>
  </div>
  <p class="tagline">${escapeHtml(primary.tagline)}</p>

  <div class="grid">
    <div>
      <h3>Por qué este plan</h3>
      <ul>${listItems(reasons)}</ul>
      <div class="box">
        <p class="kicker">Inversión estimada</p>
        <p class="price">${escapeHtml(primary.price)}</p>
        <p class="meta">${escapeHtml(primary.pricingModel)}</p>
      </div>
    </div>
    <div>
      <h3>Qué incluye</h3>
      <ul>${listItems(primary.includes)}</ul>
      ${
        primary.notIncludes.length
          ? `<h3>No incluye</h3><ul>${listItems(primary.notIncludes, true)}</ul>`
          : ''
      }
    </div>
  </div>

  <h3>Cómo arrancamos</h3>
  <div class="steps">
    ${nextSteps
      .map((step, i) => `<div><b>${i + 1}</b>${escapeHtml(step)}</div>`)
      .join('')}
  </div>

  ${
    complements.length
      ? `<h3>Complementos sugeridos</h3><ul>${listItems(
          complements.map((c) => `${c.name} — ${c.price}`)
        )}</ul>`
      : ''
  }

  <div class="profile">
    <p class="kicker">Tus respuestas</p>
    ${profile
      .map((p) => `<span>${escapeHtml(p.label)}: <b>${escapeHtml(p.value)}</b></span>`)
      .join('')}
  </div>

  <footer>
    Andrés Beltrán Mora · Licicont · WhatsApp +57 302 380 5967 · ${CONTACT_EMAIL} · licicont.me
    ${shareUrl ? `<br>Vuelve a tu diagnóstico: <a href="${escapeHtml(shareUrl)}">${escapeHtml(shareUrl)}</a>` : ''}
  </footer>
</body>
</html>`;
}

/**
 * Imprime el documento desde un iframe oculto: no depende de ventanas
 * emergentes y deja intacta la página que el visitante está viendo.
 */
export function printDiagnostic(
  rec: Recommendation,
  contact?: LeadContact,
  shareUrl?: string
): void {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  frame.srcdoc = buildDiagnosticHtml(rec, contact, shareUrl);

  frame.onload = () => {
    const win = frame.contentWindow;
    if (!win) {
      frame.remove();
      return;
    }

    // El diálogo de impresión es bloqueante; al cerrarse se retira el iframe.
    win.addEventListener('afterprint', () => frame.remove());
    win.focus();
    win.print();

    // Salvaguarda para navegadores que no emiten afterprint.
    window.setTimeout(() => {
      if (document.body.contains(frame)) frame.remove();
    }, 60000);
  };

  document.body.appendChild(frame);
}
