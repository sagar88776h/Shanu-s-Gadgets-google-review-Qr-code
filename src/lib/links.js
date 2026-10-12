// Link builders. Pure functions: no DOM, so they also run in vite.config.js and tests.

const WRITE_REVIEW_BASE = 'https://search.google.com/local/writereview?placeid=';

// These open the store / Maps listing, not the "Write a review" dialog.
// (share.google links are allowed: Google also uses them for the review form
// link from Business Profile → "Ask for reviews". Test the link on a phone.)
const STORE_PAGE_PATTERNS = [
  /^https?:\/\/(www\.)?google\.[a-z.]+\/maps/i,
  /^https?:\/\/maps\.google\.[a-z.]+/i,
  /^https?:\/\/maps\.app\.goo\.gl\//i,
  /^https?:\/\/goo\.gl\/maps/i,
];

function withScheme(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function isStorePageUrl(url) {
  return STORE_PAGE_PATTERNS.some((re) => re.test(withScheme(url.trim())));
}

/**
 * Resolves the Google "Write a review" link from the shop config.
 * reviewUrl wins when set (and is not a store-page link); otherwise placeId is used.
 * @returns {{ url: string, source: 'reviewUrl' | 'placeId' | null, problem: string | null }}
 */
export function resolveReviewLink({ reviewUrl = '', placeId = '' } = {}) {
  const custom = reviewUrl.trim();
  const id = placeId.trim();
  let problem = null;

  if (custom) {
    if (!isStorePageUrl(custom)) return { url: withScheme(custom), source: 'reviewUrl', problem };
    problem = `reviewUrl "${custom}" opens the store page, not the review dialog, so it was ignored.`;
  }
  if (id) {
    return { url: WRITE_REVIEW_BASE + encodeURIComponent(id), source: 'placeId', problem };
  }
  return { url: '', source: null, problem: problem || 'Neither reviewUrl nor placeId is set in shop.config.js.' };
}

export function buildReviewUrl(config) {
  return resolveReviewLink(config).url;
}

export function telUrl(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function whatsappUrl(number, text = '') {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function directionsUrl({ mapsUrl = '', placeId = '', shopName = '', address = '' }) {
  if (mapsUrl.trim()) return mapsUrl.trim();
  const params = new URLSearchParams({ api: '1', destination: [shopName, address].filter(Boolean).join(', ') });
  if (placeId.trim()) params.set('destination_place_id', placeId.trim());
  return `https://www.google.com/maps/dir/?${params}`;
}

/** Android-only "open this https link in Chrome" URL, for in-app browsers. */
export function chromeIntentUrl(url) {
  const { host, pathname, search } = new URL(url);
  return `intent://${host}${pathname}${search}#Intent;scheme=https;package=com.android.chrome;end`;
}
