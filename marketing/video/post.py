"""Posproducción del video vertical: cámara, focos, toques, rótulos, intro y cierre.
Uso: python3 -I post.py <vraw_dir> <out.mp4>
"""
import json, math, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAW, OUT = sys.argv[1], sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__))
W, H, FPS = 1080, 1920, 30
NAVY, NAVY2 = (10, 25, 47), (18, 37, 63)
GOLD, GOLD_L, GOLD_D = (176, 141, 87), (201, 169, 106), (138, 109, 63)
CREAM = (250, 248, 244)
FONT = os.path.join(HERE, 'Inter.ttf')
LOGO = Image.open(os.path.join(HERE, 'cards', 'logo-full.png')).convert('RGBA')

ev = json.load(open(os.path.join(RAW, 'events.json')))
NF = ev['frames']
src0 = Image.open(os.path.join(RAW, 'f00000.jpg'))
SW, SH = src0.size
S = SW / ev['vw']                                  # px de captura por px CSS
M = {m['name']: m for m in ev['marks']}
TAPS = ev['taps']

class LD:
    """Dibuja en una capa transparente y la compone encima: Pillow no mezcla alfa
    al dibujar directo sobre una imagen RGBA."""
    def __init__(self, img):
        self.img = img
        self.lay = Image.new('RGBA', img.size, (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.lay)
    def __getattr__(self, k):
        return getattr(self.d, k)
    def done(self):
        self.img.alpha_composite(self.lay)

_fc = {}
def font(size, weight=700):
    k = (size, weight)
    if k not in _fc:
        f = ImageFont.truetype(FONT, size)
        f.set_variation_by_axes([weight])
        _fc[k] = f
    return _fc[k]

def ease(t):
    t = max(0.0, min(1.0, t))
    return 4 * t * t * t if t < .5 else 1 - pow(-2 * t + 2, 3) / 2

def ease_out(t):
    t = max(0.0, min(1.0, t))
    return 1 - pow(1 - t, 3)

def back_out(t):
    t = max(0.0, min(1.0, t)); c = 1.7
    return 1 + (c + 1) * pow(t - 1, 3) + c * pow(t - 1, 2)

def ramp(f, a, b):
    """0→1 entre a y b (cuadros)."""
    return 0.0 if f <= a else 1.0 if f >= b else (f - a) / (b - a)

def window(f, a, b, fin=9, fout=8):
    """Opacidad de un efecto visible entre a y b con entrada/salida suaves."""
    return ease(ramp(f, a, a + fin)) * (1 - ease(ramp(f, b - fout, b)))

def mrect(name):
    """Rectángulo de una marca en px de captura."""
    m = M[name]
    return (m['x'] * S, m['y'] * S, m['w'] * S, m['h'] * S)

def mframe(name):
    return M[name]['frame']

# ───────── Guion de efectos (cuadros de la grabación) ─────────
F = mframe
# Cámara: lista de (cuadro, zoom, cx, cy) en px de captura; se interpola con suavidad.
CX, CY = SW / 2, SH / 2
def center(name, dy=0):
    x, y, w, h = mrect(name); return (x + w / 2, y + h / 2 + dy * S)

def zc(name, want, dy=0):
    """Zoom hacia una marca sin recortarla: nunca más cerca de lo que cabe con margen."""
    x, y, w, h = mrect(name)
    z = max(1.0, min(want, 0.9 * SW / w, 0.8 * SH / h))
    return (z, x + w / 2, y + h / 2 + dy * S)

cam = [
    (0, 1.3, *center('titular')),
    (12, 1.3, *center('titular')),
    (F('titular') + 50, 1.0, CX, CY),
    (F('cobro'), 1.0, CX, CY),
    (F('cobro') + 16, *zc('cobro', 1.45)),
    (F('cobro') + 56, *zc('cobro', 1.45)),
    (F('cobro') + 66, 1.0, CX, CY),
    (F('cifra'), 1.0, CX, CY),
    (F('cifra') + 14, *zc('cifra', 1.6)),
    (F('cifra') + 52, *zc('cifra', 1.6)),
    (F('cifra') + 62, 1.0, CX, CY),
    (F('foto'), 1.0, CX, CY),
    (F('foto') + 56, *zc('foto', 1.22)),
    (F('foto') + 58, 1.0, CX, CY),
    (F('empezar') - 14, 1.0, CX, CY),
    (F('empezar') - 1, *zc('empezar', 1.3)),
    (F('empezar') + 8, *zc('empezar', 1.3)),
    (F('empezar') + 22, 1.0, CX, CY),
    (F('opcion'), 1.0, CX, CY),
    (F('opcion') + 10, *zc('opcion', 1.35)),
    (F('opcion') + 19, *zc('opcion', 1.35)),
    (F('opcion') + 34, 1.0, CX, CY),
    (F('precio'), 1.0, CX, CY),
    (F('precio') + 14, *zc('precio', 1.55)),
    (F('precio') + 50, *zc('precio', 1.55)),
    (F('precio') + 60, 1.0, CX, CY),
    (F('proceso'), 1.0, CX, CY),
    (F('proceso') + 12, *zc('proceso', 1.45)),
    (F('proceso') + 44, *zc('proceso', 1.45)),
    (F('proceso') + 50, 1.0, CX, CY),
    (F('unoytres'), 1.0, CX, CY),
    (F('unoytres') + 14, *zc('unoytres', 1.35)),
    (F('unoytres') + 60, *zc('unoytres', 1.35)),
    (F('unoytres') + 68, 1.0, CX, CY),
    (F('proyecto'), 1.0, CX, CY),
    (NF - 1, 1.08, CX, CY),
]
cam.sort(key=lambda k: k[0])

# Focos: (marca, desde, hasta)
SPOTS = [
    ('cobro', F('cobro') + 10, F('cobro') + 62),
    ('cifra', F('cifra') + 8, F('cifra') + 58),
    ('empezar', F('empezar') - 9, F('empezar') + 8),
    ('opcion', F('opcion') + 2, F('opcion') + 19),
    ('precio', F('precio') + 8, F('precio') + 56),
    ('proceso', F('proceso') + 6, F('proceso') + 46),
    ('unoytres', F('unoytres') + 8, F('unoytres') + 64),
]

# Rótulos: (cuadro desde, hasta, antetítulo, texto con **dorado**, posición)
CAPS = [
    (8, F('titular') + 44, 'Licitaciones públicas', 'Tu área de licitaciones, **sin contratar un equipo**', 'bottom'),
    (F('cobro') + 14, F('cobro') + 62, 'El trato', 'Cobro **1%,** no 3%. **Y solo si ganas.**', 'bottom'),
    (F('cifra') + 12, F('cifra') + 58, 'Experiencia', '**+$200.000 millones** en procesos', 'top'),
    (F('foto') + 4, F('foto') + 56, 'Andrés Beltrán', '+10 años **ganando** licitaciones', 'top'),
    (F('empezar') - 10, F('opcion') + 36, 'Diagnóstico gratis', 'Tu plan ideal en **45 segundos**', 'top'),
    (F('precio') + 12, F('precio') + 56, 'Socio Licitador', '$1.500.000/mes **+ 1% solo si ganas**', 'top'),
    (F('proceso') + 10, F('proceso') + 46, 'Por proceso', 'Desde **$150.000,** sin mensualidad', 'top'),
    (F('unoytres') + 12, F('unoytres') + 64, 'Haz la cuenta', 'En $500M te ahorras **$10 millones**', 'top'),
    (F('proyecto') + 4, NF - 4, 'Trayectoria', 'Proyectos **reales,** adjudicados', 'top'),
]

def camera(f):
    for i in range(len(cam) - 1):
        a, b = cam[i], cam[i + 1]
        if a[0] <= f <= b[0]:
            t = ease((f - a[0]) / max(1, b[0] - a[0]))
            return tuple(a[j] + (b[j] - a[j]) * t for j in (1, 2, 3))
    return cam[-1][1:] if f > cam[-1][0] else cam[0][1:]

def crop_box(z, cx, cy):
    cw, ch = SW / z, SH / z
    x0 = min(max(cx - cw / 2, 0), SW - cw)
    y0 = min(max(cy - ch / 2, 0), SH - ch)
    return x0, y0, cw, ch

def to_out(rect, box):
    x0, y0, cw, ch = box; k = W / cw
    x, y, w, h = rect
    return ((x - x0) * k, (y - y0) * k, w * k, h * k)

def rich_lines(text, fnt, maxw):
    """Parte el texto en líneas; cada palabra conserva si va en dorado."""
    words, gold = [], False
    for part in text.split('**'):
        for wd in part.split():
            words.append((wd, gold))
        gold = not gold
    lines, cur = [], []
    d = ImageDraw.Draw(Image.new('L', (1, 1)))
    for wd in words:
        trial = ' '.join(x for x, _ in cur + [wd])
        if cur and d.textlength(trial, font=fnt) > maxw:
            lines.append(cur); cur = [wd]
        else:
            cur.append(wd)
    if cur: lines.append(cur)
    return lines

def draw_caption(img, f, a, b, eyebrow, text, pos):
    o = window(f, a, b, 11, 8)
    if o <= 0: return
    t_in = ramp(f, a, a + 12)
    big, small = font(62, 800), font(27, 650)
    lines = rich_lines(text, big, 880)
    d0 = ImageDraw.Draw(Image.new('L', (1, 1)))
    lh = 76
    tw = max(d0.textlength(' '.join(w for w, _ in ln), font=big) for ln in lines)
    ew = d0.textlength(eyebrow.upper(), font=small) + 6 * len(eyebrow)
    bw = int(max(tw, ew) + 96); bh = int(52 + 34 + len(lines) * lh + 40)
    bx = (W - bw) // 2
    by = 250 if pos == 'top' else 1330
    by += int((1 - back_out(t_in)) * 60)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((bx, by + 16, bx + bw, by + bh + 16), 38, fill=(10, 25, 47, 110))
    layer.alpha_composite(sh.filter(ImageFilter.GaussianBlur(26)))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle((bx, by, bx + bw, by + bh), 38, fill=NAVY + (240,), outline=GOLD_L + (150,), width=3)
    # antetítulo espaciado
    x = W / 2 - ew / 2; y = by + 44
    for ch in eyebrow.upper():
        d.text((x, y), ch, font=small, fill=GOLD_L + (255,)); x += d.textlength(ch, font=small) + 6
    # líneas con palabras que suben en cascada
    y = by + 44 + 50
    k = 0
    for ln in lines:
        lw = d.textlength(' '.join(w for w, _ in ln), font=big)
        x = W / 2 - lw / 2
        for wd, gold in ln:
            tw_ = ramp(f, a + 4 + k * 2.2, a + 14 + k * 2.2)
            dy = (1 - ease_out(tw_)) * 26
            al = int(255 * ease_out(tw_))
            d.text((x, y + dy), wd, font=big, fill=(GOLD_L if gold else (255, 255, 255)) + (al,))
            x += d.textlength(wd + ' ', font=big); k += 1
        y += lh
    if o < 1:
        layer.putalpha(layer.getchannel('A').point(lambda v: int(v * o)))
    img.alpha_composite(layer)

def draw_spot(img, f, rect_out, a, b):
    o = window(f, a, b, 8, 8)
    if o <= 0: return
    x, y, w, h = rect_out
    r = 28
    dim = Image.new('L', (W, H), int(150 * o))
    ImageDraw.Draw(dim).rounded_rectangle((x, y, x + w, y + h), r, fill=0)
    dim = dim.filter(ImageFilter.GaussianBlur(3))
    shade = Image.new('RGBA', (W, H), NAVY + (0,)); shade.putalpha(dim)
    img.alpha_composite(shade)
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle((x - 2, y - 2, x + w + 2, y + h + 2), r + 2, outline=GOLD_L + (int(200 * o),), width=10)
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(14)))
    d = LD(img); d.rounded_rectangle((x, y, x + w, y + h), r, outline=GOLD_L + (int(255 * o),), width=5); d.done()

def draw_taps(img, f, box):
    for tp in TAPS:
        df = f - tp['frame']
        if -8 <= df <= 20:
            x, y, _, _ = to_out((tp['x'] * S, tp['y'] * S, 0, 0), box)
            d = LD(img)
            if df < 0:                                    # el dedo se acerca
                t = ramp(df, -8, 0); rr = 70 - 30 * ease_out(t)
                d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=(255, 255, 255, int(110 * t)),
                          outline=GOLD_L + (int(230 * t),), width=5)
            else:
                t = df / 20
                for i, lag in enumerate((0, 5)):
                    tt = max(0, (df - lag) / 20)
                    if tt <= 0: continue
                    rr = 40 + 150 * ease_out(tt)
                    d.ellipse((x - rr, y - rr, x + rr, y + rr), outline=GOLD_L + (int(255 * (1 - tt)),), width=8 - i * 3)
                rr = 38 * (1 - ease_out(t))
                if rr > 2:
                    d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=(255, 255, 255, int(170 * (1 - t))))
            d.done()

def vignette():
    v = Image.new('L', (W, H), 0)
    ImageDraw.Draw(v).ellipse((-W * .35, -H * .2, W * 1.35, H * 1.2), fill=255)
    v = v.filter(ImageFilter.GaussianBlur(160))
    out = Image.new('RGBA', (W, H), NAVY + (0,))
    out.putalpha(v.point(lambda p: int((255 - p) * 0.14)))
    return out
VIG = vignette()

def page_frame(f):
    src = Image.open(os.path.join(RAW, f'f{f:05d}.jpg')).convert('RGB')
    z, cx, cy = camera(f)
    box = crop_box(z, cx, cy)
    x0, y0, cw, ch = box
    img = src.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch)).convert('RGBA')
    img.alpha_composite(VIG)
    for name, a, b in SPOTS:
        if a - 2 <= f <= b + 2:
            draw_spot(img, f, to_out(mrect(name), box), a, b)
    draw_taps(img, f, box)
    for a, b, eb, tx, pos in CAPS:
        if a <= f <= b:
            draw_caption(img, f, a, b, eb, tx, pos)
    return img

# ───────── Intro y cierre ─────────
def card_bg(f):
    img = Image.new('RGBA', (W, H), CREAM + (255,))
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    s = math.sin(f / 22)
    gd.ellipse((560 + 40 * s, -260, 1500 + 40 * s, 680), fill=GOLD + (42,))
    gd.ellipse((-480, 1300 - 30 * s, 420, 2200 - 30 * s), fill=NAVY + (7,))
    img.alpha_composite(g.filter(ImageFilter.GaussianBlur(140)))
    grid = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dg = ImageDraw.Draw(grid)
    for x in range(0, W, 90): dg.line((x, 0, x, H), fill=NAVY + (9,), width=2)
    for y in range(0, H, 90): dg.line((0, y, W, y), fill=NAVY + (9,), width=2)
    img.alpha_composite(grid)
    return img

def paste_logo(img, f, cx, cy, width, a0):
    t = ramp(f, a0, a0 + 22)
    sc = 0.78 + 0.22 * back_out(t)
    lw = int(width * sc); lh = int(LOGO.height * lw / LOGO.width)
    lg = LOGO.resize((lw, lh), Image.LANCZOS)
    blur = (1 - ease_out(t)) * 22
    if blur > 0.5: lg = lg.filter(ImageFilter.GaussianBlur(blur))
    lg.putalpha(lg.getchannel('A').point(lambda v: int(v * ease_out(t))))
    img.alpha_composite(lg, (int(cx - lw / 2), int(cy - lh / 2)))

def words_line(img, f, y, text, fnt, a0, step=3.0, color=NAVY):
    d = LD(img)
    plain = text.replace('**', '')
    lw = d.textlength(plain, font=fnt); x = W / 2 - lw / 2
    gold = False; k = 0
    for part in text.split('**'):
        for wd in part.split():
            t = ramp(f, a0 + k * step, a0 + k * step + 10)
            dy = (1 - back_out(t)) * 40
            d.text((x, y + dy), wd, font=fnt, fill=(GOLD if gold else color) + (int(255 * ease_out(t)),))
            x += d.textlength(wd + ' ', font=fnt); k += 1
        gold = not gold
    d.done()

def gold_line(img, f, y, a0, maxw=520):
    t = ease_out(ramp(f, a0, a0 + 18)); w = maxw * t
    if w < 2: return
    d = LD(img); d.rounded_rectangle((W / 2 - w / 2, y, W / 2 + w / 2, y + 5), 3, fill=GOLD + (255,)); d.done()

INTRO_N = 84
def intro_frame(f):
    img = card_bg(f)
    paste_logo(img, f, W / 2, 760, 640, 2)
    gold_line(img, f, 1040, 18)
    eb = font(30, 650); d = LD(img)
    t = ease_out(ramp(f, 26, 40)); s = 'LICITACIONES PÚBLICAS · SECOP II'
    x = W / 2 - (d.textlength(s, font=eb) + 7 * len(s)) / 2
    for ch in s:
        d.text((x, 1090 + (1 - t) * 20), ch, font=eb, fill=GOLD_D + (int(255 * t),)); x += d.textlength(ch, font=eb) + 7
    d.done()
    words_line(img, f, 1170, 'Le vendo al Estado', font(92, 800), 34, 3.2)
    words_line(img, f, 1280, '**por ti.**', font(110, 850), 46, 3.2)
    return img

OUTRO_N = 135
def outro_frame(f):
    img = card_bg(f + 200)
    paste_logo(img, f, W / 2, 520, 470, 0)
    gold_line(img, f, 760, 12, 420)
    words_line(img, f, 830, '¿Cuál de mis', font(96, 800), 18, 3)
    words_line(img, f, 945, '4 servicios', font(96, 800), 24, 3)
    words_line(img, f, 1060, '**es el tuyo?**', font(110, 850), 30, 3)
    d = LD(img)
    t = ease_out(ramp(f, 44, 58))
    sub = 'Diagnóstico gratis en 45 segundos'
    fs = font(44, 500)
    d.text((W / 2 - d.textlength(sub, font=fs) / 2, 1215 + (1 - t) * 24), sub, font=fs, fill=(74, 85, 104, int(255 * t)))
    # botón con latido
    t2 = back_out(ramp(f, 54, 70)); pulse = 1 + 0.04 * max(0, math.sin((f - 70) / 6)) if f > 70 else 1
    bw, bh = 560 * t2 * pulse, 132 * t2 * pulse
    if bw > 4:
        by = 1360
        sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle((W / 2 - bw / 2, by + 30, W / 2 + bw / 2, by + bh + 30), 30, fill=GOLD + (120,))
        img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(30)))
        btn = Image.new('RGBA', (int(bw), int(bh)), (0, 0, 0, 0))
        grad = Image.linear_gradient('L').rotate(-90).resize((int(bw), int(bh)))
        c1 = Image.new('RGBA', btn.size, GOLD_L + (255,)); c2 = Image.new('RGBA', btn.size, GOLD_D + (255,))
        fill = Image.composite(c2, c1, grad)
        mask = Image.new('L', btn.size, 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, bw - 1, bh - 1), 30 * t2, fill=255)
        img.paste(fill, (int(W / 2 - bw / 2), int(by)), mask)
        ft = font(int(60 * t2 * pulse) or 1, 750); tx = 'licicont.me'
        d.text((W / 2 - d.textlength(tx, font=ft) / 2, by + bh / 2 - 36 * t2 * pulse), tx, font=ft, fill=(255, 255, 255, 255))
    t3 = ease_out(ramp(f, 72, 86))
    f1, f2 = font(42, 500), font(42, 750)
    a, b = 'WhatsApp  ', '+57 302 380 5967'
    x = W / 2 - (d.textlength(a, font=f1) + d.textlength(b, font=f2)) / 2; y = 1580 + (1 - t3) * 20
    d.text((x, y), a, font=f1, fill=(74, 85, 104, int(255 * t3)))
    d.text((x + d.textlength(a, font=f1), y), b, font=f2, fill=NAVY + (int(255 * t3),))
    t4 = ease_out(ramp(f, 80, 94)); s = '@licicont_'
    d.text((W / 2 - d.textlength(s, font=f1) / 2, 1650 + (1 - t4) * 20), s, font=f1, fill=GOLD_D + (int(255 * t4),))
    d.done()
    return img

# ───────── Montaje ─────────
XF_IN, XF_OUT = 10, 14          # cuadros de transición
ff = subprocess.Popen([
    'ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
    '-i', '-', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '128k', OUT], stdin=subprocess.PIPE)

def emit(img):
    ff.stdin.write(img.convert('RGB').tobytes())

total = 0
for f in range(INTRO_N - XF_IN):
    emit(intro_frame(f)); total += 1
for i in range(XF_IN):                                  # intro → página
    a = intro_frame(INTRO_N - XF_IN + i); b = page_frame(i)
    emit(Image.blend(a, b, ease((i + 1) / XF_IN))); total += 1
for f in range(XF_IN, NF - XF_OUT):
    emit(page_frame(f)); total += 1
    if f % 60 == 0: print('cuadro', f, '/', NF, flush=True)
for i in range(XF_OUT):                                 # página → cierre (acercamiento + fundido)
    t = ease((i + 1) / XF_OUT)
    p = page_frame(NF - XF_OUT + i)
    z = 1 + 0.18 * t
    pw_, ph_ = int(W * z), int(H * z)
    p = p.resize((pw_, ph_), Image.BICUBIC).crop(((pw_ - W) // 2, (ph_ - H) // 2, (pw_ - W) // 2 + W, (ph_ - H) // 2 + H))
    emit(Image.blend(p, outro_frame(i), t)); total += 1
for f in range(XF_OUT, OUTRO_N):
    emit(outro_frame(f)); total += 1
ff.stdin.close(); ff.wait()
print('listo', total, 'cuadros', round(total / FPS, 1), 's')
