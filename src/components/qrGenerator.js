import QRCode from 'qrcode';
import { SHANU_LOGO_DATA_URL } from '../assets/logoBase64.js';

export const QR_PALETTES = {
  google: {
    id: "google",
    name: "Google Multi-Color & Royal Blue",
    dark: "#1a73e8",
    light: "#ffffff",
    accent: "#fbbc04",
    badgeBg: "#ffffff"
  },
  gold: {
    id: "gold",
    name: "Luxury Gold & Obsidian",
    dark: "#0b0f19",
    light: "#ffffff",
    accent: "#f59e0b",
    badgeBg: "#0b0f19"
  },
  neon: {
    id: "neon",
    name: "Cyber Neon Amber",
    dark: "#d97706",
    light: "#ffffff",
    accent: "#fbbf24",
    badgeBg: "#18181b"
  },
  darkModern: {
    id: "darkModern",
    name: "Minimalist Jet Black",
    dark: "#111827",
    light: "#ffffff",
    accent: "#3b82f6",
    badgeBg: "#ffffff"
  }
};

/**
 * Renders QR code onto an existing or newly created HTML canvas element.
 * Embeds the logo in the center with a crisp circular or rounded badge border.
 */
export async function renderQrCode(canvas, text, options = {}) {
  const {
    paletteKey = "google",
    logoType = "shanu", // "shanu" | "google" | "star" | "none"
    size = 320,
    margin = 2,
    customLogo = null
  } = options;

  const palette = QR_PALETTES[paletteKey] || QR_PALETTES.google;

  canvas.width = size;
  canvas.height = size;

  // Generate QR matrix on canvas
  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin: margin,
    errorCorrectionLevel: 'H', // Crucial: High 30% redundancy so center logo is 100% scannable
    color: {
      dark: palette.dark,
      light: palette.light
    }
  });

  const ctx = canvas.getContext('2d');
  if (!ctx || logoType === "none") return;

  // Draw Center Logo Overlay
  const logoSize = Math.floor(size * 0.24); // 24% of QR dimension
  const centerPos = (size - logoSize) / 2;
  const radius = logoSize / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Background circle for contrast
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
  ctx.fillStyle = palette.light;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 8;
  ctx.fill();

  // Border ring
  ctx.lineWidth = 3;
  ctx.strokeStyle = palette.dark;
  ctx.stroke();

  // Clip circular region
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  if (logoType === "shanu") {
    const logoImg = new Image();
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve;
      logoImg.src = customLogo || SHANU_LOGO_DATA_URL;
    });
    ctx.drawImage(logoImg, centerPos, centerPos, logoSize, logoSize);
  } else if (logoType === "google") {
    // Draw Google "G" icon
    drawGoogleIcon(ctx, centerPos, centerPos, logoSize);
  } else if (logoType === "star") {
    // Draw 5-Star Golden Star
    drawStarIcon(ctx, cx, cy, radius * 0.7);
  }

  ctx.restore();
}

function drawGoogleIcon(ctx, x, y, size) {
  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, size, size);

  // Draw stylized G
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.38;

  ctx.lineWidth = size * 0.18;
  ctx.strokeStyle = "#4285F4";
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI * 0.25, Math.PI * 0.75);
  ctx.stroke();

  ctx.strokeStyle = "#EA4335";
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 1.25);
  ctx.stroke();

  ctx.strokeStyle = "#FBBC05";
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 1.25, Math.PI * 1.6);
  ctx.stroke();

  ctx.strokeStyle = "#34A853";
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 1.6, Math.PI * 1.95);
  ctx.stroke();

  // Crossbar
  ctx.fillStyle = "#4285F4";
  ctx.fillRect(cx, cy - (size * 0.09), r, size * 0.18);
}

function drawStarIcon(ctx, cx, cy, radius) {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(cx - radius * 1.5, cy - radius * 1.5, radius * 3, radius * 3);

  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  const spikes = 5;
  const step = Math.PI / spikes;
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;

  ctx.moveTo(cx, cy - radius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * radius;
    y = cy + Math.sin(rot) * radius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * (radius * 0.45);
    y = cy + Math.sin(rot) * (radius * 0.45);
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - radius);
  ctx.closePath();
  ctx.fill();
}

/**
 * Generates high-res DataURL for downloading or printing.
 */
export async function getHighResQrDataUrl(text, options = {}) {
  const tempCanvas = document.createElement('canvas');
  await renderQrCode(tempCanvas, text, {
    ...options,
    size: 1024 // 1024x1024 ultra-crisp resolution
  });
  return tempCanvas.toDataURL('image/png');
}

/**
 * Triggers browser download of QR code PNG
 */
export async function downloadQrCode(text, options = {}, filename = "shanu_gadgets_review_qr.png") {
  const dataUrl = await getHighResQrDataUrl(text, options);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
