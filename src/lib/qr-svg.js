import QRCode from 'qrcode';

const LOGO_FRACTION = 0.24; // logo size relative to the code (safe with error level H)

// Premium style: brand ink for the dots, a deep plum to echo the logo's crown,
// and gold eye centres. All stay dark enough on white for phone cameras.
export const PREMIUM = { ink: '#0b0b0f', plum: '#3d1035', gold: '#7f5e00', ring: '#f5b301' };

/** Module matrix for `text`. Uses level H when a centre logo will cover part of it. */
export function qrMatrix(text, withLogo) {
  const qr = QRCode.create(text, { errorCorrectionLevel: withLogo ? 'H' : 'M' });
  const { size, data } = qr.modules;
  return { size, isDark: (x, y) => data[y * size + x] === 1 };
}

function logoBox(size) {
  const box = size * LOGO_FRACTION;
  const pad = box * 0.14;
  return { box, pad, start: (size - box) / 2, radius: box / 2 + pad };
}

// SVG path for a rounded rectangle (also usable with canvas Path2D).
function roundRect(x, y, w, h, r) {
  return `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z`;
}

/**
 * Path data (in module units) for the premium style: rounded modules, rounded
 * finder "eyes", and no dots under the centre logo.
 */
function premiumPaths(size, isDark, withLogo) {
  const eyes = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];
  const inEye = (x, y) => eyes.some(([ex, ey]) => x >= ex && x < ex + 7 && y >= ey && y < ey + 7);
  const centre = size / 2;
  const clear = withLogo ? logoBox(size).radius + 0.3 : 0;
  const underLogo = (x, y) => withLogo && Math.hypot(x + 0.5 - centre, y + 0.5 - centre) < clear;

  // Each module is a square whose outer corners are rounded where it has no
  // neighbours, so lone modules become dots and runs become smooth pills.
  // Full-size modules keep the code easy for every scanner to read.
  const dark = (x, y) => x >= 0 && y >= 0 && x < size && y < size && isDark(x, y) && !inEye(x, y) && !underLogo(x, y);
  const r = 0.5;
  let dots = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!dark(x, y)) continue;
      const up = dark(x, y - 1);
      const down = dark(x, y + 1);
      const left = dark(x - 1, y);
      const right = dark(x + 1, y);
      const tl = up || left ? 0 : r;
      const tr = up || right ? 0 : r;
      const br = down || right ? 0 : r;
      const bl = down || left ? 0 : r;
      dots += `M${x + tl} ${y}H${x + 1 - tr}`;
      if (tr) dots += `a${tr} ${tr} 0 0 1 ${tr} ${tr}`;
      dots += `V${y + 1 - br}`;
      if (br) dots += `a${br} ${br} 0 0 1 -${br} ${br}`;
      dots += `H${x + bl}`;
      if (bl) dots += `a${bl} ${bl} 0 0 1 -${bl} -${bl}`;
      dots += `V${y + tl}`;
      if (tl) dots += `a${tl} ${tl} 0 0 1 ${tl} -${tl}`;
      dots += 'z';
    }
  }

  let rings = '';
  let centres = '';
  for (const [ex, ey] of eyes) {
    rings += roundRect(ex, ey, 7, 7, 2.3) + roundRect(ex + 1, ey + 1, 5, 5, 1.5);
    centres += roundRect(ex + 2, ey + 2, 3, 3, 1);
  }
  return { dots, rings, centres };
}

/**
 * Builds a crisp, scalable SVG of the QR code, with `margin` modules of white around it.
 * `style: 'premium'` draws rounded modules, rounded eyes and brand colours.
 * @param {string} text
 * @param {{ logoHref?: string, color?: string, margin?: number, style?: 'classic' | 'premium' }} options
 */
export function qrSvg(text, { logoHref = '', color = '#0b0b0f', margin = 2, style = 'classic' } = {}) {
  const { size, isDark } = qrMatrix(text, Boolean(logoHref));
  const full = size + margin * 2;
  const background = `<rect x="${-margin}" y="${-margin}" width="${full}" height="${full}" fill="#fff"/>`;
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margin} ${-margin} ${full} ${full}" role="img" aria-label="QR code">`;

  if (style === 'premium') {
    const { dots, rings, centres } = premiumPaths(size, isDark, Boolean(logoHref));
    // Unique ids so several codes on one page don't share gradients.
    const id = `qrp${Math.random().toString(36).slice(2, 8)}`;
    let logo = '';
    if (logoHref) {
      const { box, start, radius } = logoBox(size);
      const c = size / 2;
      logo = `<circle cx="${c}" cy="${c}" r="${radius}" fill="#fff" stroke="${PREMIUM.ring}" stroke-width="${size * 0.006}"/>
      <clipPath id="${id}c"><circle cx="${c}" cy="${c}" r="${box / 2}"/></clipPath>
      <image href="${logoHref}" x="${start}" y="${start}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${id}c)"/>`;
    }
    return `${open}<defs><linearGradient id="${id}d" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${size}" y2="${size}"><stop offset="0" stop-color="${PREMIUM.ink}"/><stop offset="1" stop-color="${PREMIUM.plum}"/></linearGradient></defs>${background}<path d="${dots}" fill="url(#${id}d)"/><path d="${rings}" fill="url(#${id}d)" fill-rule="evenodd"/><path d="${centres}" fill="${PREMIUM.gold}"/>${logo}</svg>`;
  }

  let d = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!isDark(x, y)) continue;
      let run = 1;
      while (x + run < size && isDark(x + run, y)) run++;
      d += `M${x} ${y}h${run}v1h-${run}z`;
      x += run - 1;
    }
  }

  let logo = '';
  if (logoHref) {
    const { box, pad, start } = logoBox(size);
    logo = `<rect x="${start - pad}" y="${start - pad}" width="${box + pad * 2}" height="${box + pad * 2}" rx="${(box + pad * 2) / 2}" fill="#fff"/>
      <image href="${logoHref}" x="${start}" y="${start}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  return `${open}${background}<path d="${d}" fill="${color}" shape-rendering="crispEdges"/>${logo}</svg>`;
}

/** Draws the QR code (with a white quiet zone) onto a new canvas and returns it. */
export async function qrCanvas(text, { pixels = 2048, logoSrc = '', color = '#0b0b0f', style = 'classic' } = {}) {
  const { size, isDark } = qrMatrix(text, Boolean(logoSrc));
  const quiet = 4;
  const total = size + quiet * 2;
  const scale = Math.floor(pixels / total);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = total * scale;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (style === 'premium') {
    const { dots, rings, centres } = premiumPaths(size, isDark, Boolean(logoSrc));
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(quiet, quiet);
    const ink = ctx.createLinearGradient(0, 0, size, size);
    ink.addColorStop(0, PREMIUM.ink);
    ink.addColorStop(1, PREMIUM.plum);
    ctx.fillStyle = ink;
    ctx.fill(new Path2D(dots));
    ctx.fill(new Path2D(rings), 'evenodd');
    ctx.fillStyle = PREMIUM.gold;
    ctx.fill(new Path2D(centres));
    ctx.restore();
  } else {
    ctx.fillStyle = color;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (isDark(x, y)) ctx.fillRect((x + quiet) * scale, (y + quiet) * scale, scale, scale);
      }
    }
  }

  if (logoSrc) {
    const img = new Image();
    img.src = logoSrc;
    await img.decode();
    const { box, pad } = logoBox(size);
    const boxPx = box * scale;
    const padPx = pad * scale;
    const center = canvas.width / 2;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(center, center, boxPx / 2 + padPx, 0, Math.PI * 2);
    ctx.fill();
    if (style === 'premium') {
      ctx.strokeStyle = PREMIUM.ring;
      ctx.lineWidth = size * 0.006 * scale;
      ctx.stroke();
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, boxPx / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.drawImage(img, center - boxPx / 2, center - boxPx / 2, boxPx, boxPx);
    if (style === 'premium') ctx.restore();
  }
  return canvas;
}
