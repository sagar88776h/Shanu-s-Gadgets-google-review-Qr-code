import QRCode from 'qrcode';

const LOGO_FRACTION = 0.24; // logo size relative to the code (safe with error level H)
const INK = '#0b0b0f';
const GOLD_RING = '#c99a2e'; // decorative ring around the logo
const GOLD_PUPIL = '#8a6200'; // centres of the corner squares: dark enough for scanners

/** Module matrix for `text`. Uses level H when a centre logo will cover part of it. */
export function qrMatrix(text, withLogo) {
  const qr = QRCode.create(text, { errorCorrectionLevel: withLogo ? 'H' : 'M' });
  const { size, data } = qr.modules;
  return { size, isDark: (x, y) => data[y * size + x] === 1 };
}

function roundedRect(x, y, w, h, r) {
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
}

// A module square whose corners are rounded where both neighbours on that corner
// are empty: single modules become dots, runs become smooth pills.
function softModule(x, y, dark) {
  const r = 0.5;
  const up = dark(x, y - 1);
  const down = dark(x, y + 1);
  const left = dark(x - 1, y);
  const right = dark(x + 1, y);
  const tl = !up && !left ? r : 0;
  const tr = !up && !right ? r : 0;
  const br = !down && !right ? r : 0;
  const bl = !down && !left ? r : 0;
  let d = `M${x + tl} ${y}H${x + 1 - tr}`;
  if (tr) d += `A${r} ${r} 0 0 1 ${x + 1} ${y + tr}`;
  d += `V${y + 1 - br}`;
  if (br) d += `A${r} ${r} 0 0 1 ${x + 1 - br} ${y + 1}`;
  d += `H${x + bl}`;
  if (bl) d += `A${r} ${r} 0 0 1 ${x} ${y + 1 - bl}`;
  d += `V${y + tl}`;
  if (tl) d += `A${r} ${r} 0 0 1 ${x + tl} ${y}`;
  return `${d}Z`;
}

/**
 * Shapes for one QR code, in module units (0…size), shared by the SVG and PNG output.
 * style 'classic': square modules. style 'premium': rounded modules, rounded corner
 * squares with gold centres, and a gold ring around the logo.
 */
export function qrGeometry(text, { style = 'classic', withLogo = false } = {}) {
  const { size, isDark } = qrMatrix(text, withLogo);
  const premium = style === 'premium';
  const centre = size / 2;
  const logoBox = withLogo ? size * LOGO_FRACTION : 0;
  const logoPad = logoBox * 0.14;
  const clearRadius = logoBox / 2 + logoPad;

  const inFinder = (x, y) => (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
  const underLogo = (x, y) => withLogo && Math.hypot(x + 0.5 - centre, y + 0.5 - centre) < clearRadius + 0.2;
  const dark = (x, y) =>
    x >= 0 && y >= 0 && x < size && y < size && isDark(x, y) && !underLogo(x, y) && !(premium && inFinder(x, y));

  let modules = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!dark(x, y)) continue;
      if (premium) {
        modules += softModule(x, y, dark);
      } else {
        let run = 1;
        while (dark(x + run, y)) run++;
        modules += `M${x} ${y}h${run}v1h-${run}z`;
        x += run - 1;
      }
    }
  }

  let eyes = '';
  let pupils = '';
  if (premium) {
    for (const [ex, ey] of [[0, 0], [size - 7, 0], [0, size - 7]]) {
      eyes += roundedRect(ex, ey, 7, 7, 2.2) + roundedRect(ex + 1, ey + 1, 5, 5, 1.5);
      pupils += roundedRect(ex + 2, ey + 2, 3, 3, 1);
    }
  }

  return {
    size,
    premium,
    modules,
    eyes,
    pupils,
    logo: withLogo ? { cx: centre, cy: centre, box: logoBox, clearRadius } : null,
  };
}

/**
 * Builds a crisp, scalable SVG of the QR code, with `margin` modules of white around it.
 * @param {string} text
 * @param {{ logoHref?: string, style?: 'classic' | 'premium', color?: string, margin?: number }} options
 */
export function qrSvg(text, { logoHref = '', style = 'classic', color = INK, margin = 2 } = {}) {
  const g = qrGeometry(text, { style, withLogo: Boolean(logoHref) });
  let body = `<path d="${g.modules}" fill="${color}"${g.premium ? '' : ' shape-rendering="crispEdges"'}/>`;
  if (g.premium) {
    body += `<path d="${g.eyes}" fill="${color}" fill-rule="evenodd"/><path d="${g.pupils}" fill="${GOLD_PUPIL}"/>`;
  }
  if (g.logo) {
    const { cx, cy, box, clearRadius } = g.logo;
    body += `<circle cx="${cx}" cy="${cy}" r="${clearRadius}" fill="#fff"/>`;
    if (g.premium) {
      body += `<circle cx="${cx}" cy="${cy}" r="${clearRadius - 0.35}" fill="none" stroke="${GOLD_RING}" stroke-width="0.3"/>`;
    }
    body += `<image href="${logoHref}" x="${cx - box / 2}" y="${cy - box / 2}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid meet"/>`;
  }
  const full = g.size + margin * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margin} ${-margin} ${full} ${full}" role="img" aria-label="QR code"><rect x="${-margin}" y="${-margin}" width="${full}" height="${full}" fill="#fff"/>${body}</svg>`;
}

/** Draws the QR code (with a white quiet zone) onto a new canvas and returns it. */
// 1024 px is sharp for print up to ~8.5 cm at 300 dpi (use the SVG for bigger).
// Larger PNGs of the logo version confused some scanner apps reading the file
// directly, so the download stays at this size.
export async function qrCanvas(text, { pixels = 1024, logoSrc = '', style = 'classic', color = INK } = {}) {
  const g = qrGeometry(text, { style, withLogo: Boolean(logoSrc) });
  const quiet = 4;
  const total = g.size + quiet * 2;
  const scale = Math.floor(pixels / total);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = total * scale;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(scale, 0, 0, scale, quiet * scale, quiet * scale);

  ctx.fillStyle = color;
  ctx.fill(new Path2D(g.modules));
  if (g.premium) {
    ctx.fill(new Path2D(g.eyes), 'evenodd');
    ctx.fillStyle = GOLD_PUPIL;
    ctx.fill(new Path2D(g.pupils));
  }

  if (g.logo) {
    const { cx, cy, box, clearRadius } = g.logo;
    const img = new Image();
    img.src = logoSrc;
    await img.decode();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, clearRadius, 0, Math.PI * 2);
    ctx.fill();
    if (g.premium) {
      ctx.strokeStyle = GOLD_RING;
      ctx.lineWidth = 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, clearRadius - 0.35, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.drawImage(img, cx - box / 2, cy - box / 2, box, box);
  }
  return canvas;
}
