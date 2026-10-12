import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import shop from './shop.config.js';
import { buildReviewUrl } from './src/lib/links.js';

const root = fileURLToPath(new URL('.', import.meta.url));

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Fills {{tokens}} in the HTML pages from shop.config.js, so the title and the
// WhatsApp/Facebook link preview (which never run JavaScript) show real details.
function shopHtml() {
  const site = shop.siteUrl.trim();
  const description = `Rate your visit to ${shop.shopName}, ${shop.tagline.toLowerCase()} in ${shop.city}. Share your experience on Google in about a minute.`;
  const raw = {
    shopName: shop.shopName,
    description,
    reviewUrl: buildReviewUrl(shop) || '#',
    ogImage: site ? new URL('og-image.jpg', site).href : 'og-image.jpg',
  };
  const tokens = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, escapeHtml(v)]));
  tokens.canonical = site ? `<link rel="canonical" href="${escapeHtml(site)}" />` : '';
  tokens.ogUrl = site ? `<meta property="og:url" content="${escapeHtml(site)}" />` : '';

  return {
    name: 'shop-html',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace(/\{\{(\w+)\}\}/g, (match, key) => (key in tokens ? tokens[key] : match)),
    },
  };
}

export default defineConfig({
  // Relative paths: works on Netlify, Vercel, GitHub Pages (/repo-name/) or any folder.
  base: './',
  plugins: [shopHtml()],
  build: {
    rolldownOptions: {
      input: {
        main: `${root}index.html`,
        qr: `${root}qr.html`,
      },
    },
  },
});
