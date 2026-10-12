import './styles/base.css';
import './styles/qr.css';
import config from '../shop.config.js';
import { printText } from './strings.js';
import { qrSvg, qrCanvas } from './lib/qr-svg.js';
import { icons } from './icons.js';

// Sizes in millimetres. Everything is laid out on an A4 sheet (210 × 297 mm).
const SIZES = {
  card: [
    { id: 'a6', label: 'A6 (105 × 148 mm), 4 per sheet', w: 105, h: 148, cols: 2, rows: 2 },
    { id: 'a5', label: 'A5 (148 × 210 mm), 1 per sheet', w: 148, h: 210, cols: 1, rows: 1 },
    { id: 'a4', label: 'A4 poster (210 × 297 mm)', w: 210, h: 297, cols: 1, rows: 1 },
  ],
  stickers: [
    { id: 's40', label: '40 mm stickers, 24 per sheet', w: 40 },
    { id: 's50', label: '50 mm stickers, 15 per sheet', w: 50 },
    { id: 's60', label: '60 mm stickers, 12 per sheet', w: 60 },
  ],
  plain: [
    { id: 'p120', label: '120 mm', w: 120 },
    { id: 'p80', label: '80 mm', w: 80 },
    { id: 'p50', label: '50 mm', w: 50 },
  ],
};
const DEFAULT_SIZE = { card: 'a6', stickers: 's50', plain: 'p120' };

const $ = (selector) => document.querySelector(selector);
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

const state = {
  url: config.siteUrl.trim() || new URL('./', location.href).href,
  design: 'card',
  size: DEFAULT_SIZE.card,
  style: 'premium', // 'premium' (black & gold) or 'classic' (white)
  withLogo: true,
};

const fileBase = config.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stars = `<span class="print-stars">${icons.star.repeat(5)}</span>`;

function instagramHandle() {
  try {
    const name = new URL(config.instagram).pathname.split('/').filter(Boolean)[0];
    return name ? `@${name}` : '';
  } catch {
    return '';
  }
}
const insta = instagramHandle();

function currentSize() {
  return SIZES[state.design].find((size) => size.id === state.size);
}

const autoUrl = state.url;

function urlWarning(url) {
  if (!config.siteUrl.trim() && url === autoUrl) {
    return 'siteUrl is empty in shop.config.js, so this uses the current address. Set it to your live website before printing.';
  }
  try {
    const { hostname, protocol } = new URL(url);
    if (hostname === 'github.com') return 'This is your GitHub code page, not your website. Use the address customers open (e.g. your vercel.app address).';
    if (/^(localhost|127\.|0\.0\.0\.0|192\.168\.|10\.)/.test(hostname)) return 'This is a local address: phones in the shop cannot open it.';
    if (protocol !== 'https:') return 'Use an https:// address so phones open it without warnings.';
  } catch {
    return 'This does not look like a valid web address.';
  }
  return '';
}

function cardHtml(qr) {
  return `<article class="print-card">
    <header class="pc-brand">
      <img src="${esc(config.logoPng)}" alt="">
      <div>
        <p class="pc-name">${esc(config.shopName)}</p>
        <p class="pc-tagline">${esc(config.tagline)}</p>
      </div>
    </header>
    <div class="pc-ask">
      <p class="pc-title">${esc(printText.cardTitle)}</p>
      <p class="pc-title-alt" lang="hi">${esc(printText.cardTitleAlt)}</p>
    </div>
    ${stars}
    <div class="pc-qr">${qr}</div>
    <div class="pc-action">
      <p class="pc-action-main">${esc(printText.cardAction)}</p>
      <p class="pc-action-alt" lang="hi">${esc(printText.cardActionAlt)}</p>
    </div>
    <div class="pc-foot">
      <p>${esc(printText.cardFoot)} · ${esc(config.phone)}</p>
      ${insta ? `<p class="pc-insta">${icons.instagram}<span>${esc(insta)}</span></p>` : ''}
    </div>
  </article>`;
}

function stickerHtml(qr) {
  return `<article class="print-sticker">
    <p class="ps-top">${esc(printText.sticker)}</p>
    <div class="ps-qr">${qr}</div>
    <p class="ps-name">${esc(config.shopName)}</p>
  </article>`;
}

function plainHtml(qr) {
  return `<article class="print-plain">
    <div class="pp-qr">${qr}</div>
    <p class="pp-url">${esc(state.url)}</p>
  </article>`;
}

function renderSheet() {
  const size = currentSize();
  const sheet = $('#sheet');
  let qr;
  try {
    // Dark (premium) designs get the full 4-module white quiet zone that scanners
    // expect; on white classic designs the paper around the code provides it.
    const margin = state.style === 'premium' ? 4 : 2;
    qr = qrSvg(state.url, { logoHref: state.withLogo ? config.logoPng : '', style: state.style, margin });
  } catch (error) {
    sheet.innerHTML = `<p class="sheet-error">Could not make a QR code: ${esc(error.message)}</p>`;
    return;
  }

  sheet.className = `sheet sheet-${state.design} style-${state.style}`;
  sheet.style.setProperty('--w', `${size.w}mm`);
  sheet.style.setProperty('--u', `${size.w / 105}mm`);

  if (state.design === 'card') {
    sheet.style.setProperty('--h', `${size.h}mm`);
    sheet.style.setProperty('--cols', size.cols);
    sheet.dataset.cut = size.cols * size.rows > 1 || size.w < 210 ? 'yes' : 'no';
    sheet.innerHTML = Array.from({ length: size.cols * size.rows }, () => cardHtml(qr)).join('');
  } else if (state.design === 'stickers') {
    const gap = 4;
    const cols = Math.floor((190 + gap) / (size.w + gap));
    const rows = Math.floor((277 + gap) / (size.w + gap));
    sheet.style.setProperty('--cols', cols);
    sheet.innerHTML = Array.from({ length: cols * rows }, () => stickerHtml(qr)).join('');
  } else {
    sheet.innerHTML = plainHtml(qr);
  }
  fitPreview();
}

function renderSizeOptions() {
  $('#size').innerHTML = SIZES[state.design]
    .map((size) => `<option value="${size.id}"${size.id === state.size ? ' selected' : ''}>${esc(size.label)}</option>`)
    .join('');
}

function renderUrlNote() {
  const warning = urlWarning(state.url);
  const note = $('#url-note');
  note.textContent = warning || 'Looks good. Customers who scan will land on your review page.';
  note.classList.toggle('is-warning', Boolean(warning));
}

// Scale the A4 sheet down to fit the screen (printing always uses real size).
function fitPreview() {
  const preview = $('#preview');
  const sheet = $('#sheet');
  const scale = Math.min(1, preview.clientWidth / sheet.offsetWidth);
  sheet.style.transform = `scale(${scale})`;
  preview.style.height = `${sheet.offsetHeight * scale}px`;
}

function download(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

async function logoDataUrl() {
  const blob = await (await fetch(config.logoPng)).blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ---------------------------------------------------------------------------

$('#qr-url').value = state.url;
renderSizeOptions();
renderUrlNote();
renderSheet();

$('#qr-url').addEventListener('input', (event) => {
  state.url = event.target.value.trim() || state.url;
  renderUrlNote();
  renderSheet();
});

$('#design').addEventListener('change', (event) => {
  state.design = event.target.value;
  state.size = DEFAULT_SIZE[state.design];
  renderSizeOptions();
  renderSheet();
});

$('#style').addEventListener('change', (event) => {
  state.style = event.target.value;
  renderSheet();
});

$('#size').addEventListener('change', (event) => {
  state.size = event.target.value;
  renderSheet();
});

$('#with-logo').addEventListener('change', (event) => {
  state.withLogo = event.target.checked;
  renderSheet();
});

$('#print-btn').addEventListener('click', () => window.print());

$('#png-btn').addEventListener('click', async () => {
  const canvas = await qrCanvas(state.url, { logoSrc: state.withLogo ? config.logoPng : '', style: state.style });
  canvas.toBlob((blob) => download(blob, `${fileBase}-review-qr-${state.style}.png`), 'image/png');
});

$('#svg-btn').addEventListener('click', async () => {
  const logoHref = state.withLogo ? await logoDataUrl() : '';
  const svg = qrSvg(state.url, { logoHref, style: state.style, margin: 4 });
  download(new Blob([svg], { type: 'image/svg+xml' }), `${fileBase}-review-qr-${state.style}.svg`);
});

new ResizeObserver(fitPreview).observe($('#preview'));
