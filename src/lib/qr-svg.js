import QRCode from 'qrcode';

const LOGO_FRACTION = 0.24; // logo size relative to the code (safe with error level H)

/** Module matrix for `text`. Uses level H when a centre logo will cover part of it. */
export function qrMatrix(text, withLogo) {
  const qr = QRCode.create(text, { errorCorrectionLevel: withLogo ? 'H' : 'M' });
  const { size, data } = qr.modules;
  return { size, isDark: (x, y) => data[y * size + x] === 1 };
}

/**
 * Builds a crisp, scalable SVG of the QR code, with `margin` modules of white around it.
 * @param {string} text
 * @param {{ logoHref?: string, color?: string, margin?: number }} options
 */
export function qrSvg(text, { logoHref = '', color = '#0b0b0f', margin = 2 } = {}) {
  const { size, isDark } = qrMatrix(text, Boolean(logoHref));
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
    const box = size * LOGO_FRACTION;
    const pad = box * 0.14;
    const start = (size - box) / 2;
    logo = `<rect x="${start - pad}" y="${start - pad}" width="${box + pad * 2}" height="${box + pad * 2}" rx="${(box + pad * 2) / 2}" fill="#fff"/>
      <image href="${logoHref}" x="${start}" y="${start}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  const full = size + margin * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margin} ${-margin} ${full} ${full}" role="img" aria-label="QR code"><rect x="${-margin}" y="${-margin}" width="${full}" height="${full}" fill="#fff"/><path d="${d}" fill="${color}" shape-rendering="crispEdges"/>${logo}</svg>`;
}

/** Draws the QR code (with a white quiet zone) onto a new canvas and returns it. */
export async function qrCanvas(text, { pixels = 2048, logoSrc = '', color = '#0b0b0f' } = {}) {
  const { size, isDark } = qrMatrix(text, Boolean(logoSrc));
  const quiet = 4;
  const total = size + quiet * 2;
  const scale = Math.floor(pixels / total);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = total * scale;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (isDark(x, y)) ctx.fillRect((x + quiet) * scale, (y + quiet) * scale, scale, scale);
    }
  }

  if (logoSrc) {
    const img = new Image();
    img.src = logoSrc;
    await img.decode();
    const box = size * LOGO_FRACTION * scale;
    const pad = box * 0.14;
    const center = canvas.width / 2;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(center, center, box / 2 + pad, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(img, center - box / 2, center - box / 2, box, box);
  }
  return canvas;
}
