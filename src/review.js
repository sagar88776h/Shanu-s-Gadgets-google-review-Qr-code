import './styles/base.css';
import './styles/review.css';
import config from '../shop.config.js';
import { tagGroups } from './strings.js';
import { LANGS, getStrings, fill } from './lib/i18n.js';
import { resolveReviewLink, telUrl, whatsappUrl, directionsUrl, chromeIntentUrl } from './lib/links.js';
import { buildDraft } from './lib/draft.js';
import { copyText } from './lib/clipboard.js';
import { createTracker } from './lib/track.js';
import { icons, motif } from './icons.js';

// QR codes printed from the old site may point at #studio (the old print tool).
if (location.hash === '#studio') location.replace('qr.html');

const review = resolveReviewLink(config);
if (review.problem) console.warn(`[Google review link] ${review.problem}`);

const track = createTracker(config.analyticsEndpoint);
const ua = navigator.userAgent;
const inAppBrowser = /Instagram|FBAN|FBAV|FB_IAB|FBIOS|Messenger|WhatsApp|Line\/|Snapchat|LinkedInApp|; wv\)/i.test(ua);
const isAndroid = /Android/i.test(ua);
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

const app = document.getElementById('app');

const state = {
  lang: initialLang(),
  rating: 0,
  tags: new Set(),
  draftOpen: false,
  draftEdited: false,
  draftText: '',
  draftVariant: 0, // which wording "New suggestion" is on
};
let s = getStrings(state.lang);

// ---------------------------------------------------------------------------
// Helpers

function storage(fn) {
  try {
    return fn(window.localStorage);
  } catch {
    return null;
  }
}

function initialLang() {
  const saved = storage((ls) => ls.getItem('lang'));
  if (LANGS.includes(saved)) return saved;
  const browser = (navigator.language || '').slice(0, 2).toLowerCase();
  if (browser !== 'en' && LANGS.includes(browser)) return browser;
  return LANGS.includes(config.defaultLanguage) ? config.defaultLanguage : 'en';
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

const $ = (selector) => app.querySelector(selector);

const groupFor = (rating) => (rating >= 4 ? 'positive' : rating >= 1 ? 'negative' : null);
const isLow = () => state.rating >= 1 && state.rating <= 3;

function reviewLinkAttrs() {
  return review.url
    ? `href="${esc(review.url)}" target="_blank" rel="noopener"`
    : 'href="#" aria-disabled="true"';
}

function currentDraft() {
  return buildDraft({ rating: state.rating, tagIds: [...state.tags], s, shopName: config.shopName, variant: state.draftVariant });
}

function privateMessage() {
  const issues = [...state.tags].map((id) => s.tags[id]?.label).filter(Boolean);
  const lines = [fill(s.privateMessage, { shop: config.shopName, rating: state.rating })];
  if (issues.length) lines.push(fill(s.privateIssues, { issues: issues.join(', ') }));
  lines.push(`${s.privateMore} `);
  return lines.join('\n');
}

let toastTimer;
function toast(message) {
  const el = $('#toast');
  el.innerHTML = `${icons.check}<span>${esc(message)}</span>`;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3600);
}

// ---------------------------------------------------------------------------
// Rendering

function chipsHtml() {
  const group = groupFor(state.rating);
  if (!group) return '';
  return tagGroups[group]
    .filter((id) => s.tags[id])
    .map(
      (id) => `<button type="button" class="chip" data-tag="${id}" aria-pressed="${state.tags.has(id)}">
        <span class="chip-check">${icons.check}</span><span>${esc(s.tags[id].label)}</span>
      </button>`,
    )
    .join('');
}

function render() {
  s = getStrings(state.lang);
  document.documentElement.lang = state.lang;

  const shop = esc(config.shopName);
  const hasRealRating = config.googleRating != null && config.googleReviewCount != null;
  const setupBanner = review.url ? '' : `<p class="setup-banner" role="note">${esc(s.setupBanner)}</p>`;
  const inAppHint = inAppBrowser
    ? `<p class="inapp-hint">${esc(s.inAppHint)}${
        isAndroid && review.url ? ` <a href="${esc(chromeIntentUrl(review.url))}">${esc(s.openInChrome)}</a>` : ''
      }</p>`
    : '';

  app.innerHTML = `
    ${setupBanner}
    <header class="hero">
      ${motif}
      <div class="topbar">
        <div class="lang-switch" role="group" aria-label="${esc(s.langLabel)}">
          ${LANGS.map(
            (code) =>
              `<button type="button" class="lang-btn" data-lang="${code}" lang="${code}" aria-pressed="${code === state.lang}">${esc(getStrings(code).langName)}</button>`,
          ).join('')}
        </div>
      </div>
      <img class="logo" src="${esc(config.logo)}" width="88" height="88" alt="${shop} logo" fetchpriority="high">
      <h1 class="shop-name">${shop}</h1>
      <p class="tagline">${esc(s.tagline || config.tagline)}</p>
      <p class="trust">${icons.heart}<span>${esc(fill(s.trustLine, { city: config.city }))}</span></p>
      ${
        hasRealRating
          ? `<p class="rating-summary">${esc(fill(s.ratingSummary, { rating: config.googleRating, count: config.googleReviewCount }))}</p>`
          : ''
      }
    </header>

    <main class="content">
      <section class="card rate-card" aria-labelledby="rate-title">
        <h2 id="rate-title" class="card-title">${esc(s.rateTitle)}</h2>
        <div class="stars" id="stars" role="radiogroup" aria-labelledby="rate-title">
          ${[1, 2, 3, 4, 5]
            .map(
              (n) => `<label class="star${n <= state.rating ? ' is-on' : ''}" data-n="${n}" style="--i:${n - 1}">
                <input type="radio" name="rating" value="${n}"${n === state.rating ? ' checked' : ''}>
                <span class="star-icon">${icons.star}</span>
                <span class="sr-only">${esc(fill(s.starLabel, { n }))}</span>
              </label>`,
            )
            .join('')}
        </div>
        <p class="rate-word" id="rate-word">${esc(s.ratingWords[state.rating] || s.rateHint)}</p>
        <p class="rate-note">${esc(s.rateNote)}</p>
      </section>

      <section class="card tags-card" id="tags-card" aria-labelledby="tags-title"${state.rating ? '' : ' hidden'}>
        <h2 id="tags-title" class="card-title">${esc(state.rating >= 4 ? s.likedTitle : s.wrongTitle)}</h2>
        <p class="card-hint">${esc(s.tagsHint)}</p>
        <div class="chips" id="chips" role="group" aria-labelledby="tags-title">${chipsHtml()}</div>

        <button type="button" class="btn btn-soft suggest-btn" id="suggest-btn"${state.draftOpen ? ' hidden' : ''}>
          ${icons.pen}<span>${esc(s.suggestBtn)}</span>
        </button>

        <div class="draft" id="draft"${state.draftOpen ? '' : ' hidden'}>
          <div class="draft-head">
            <label for="draft-text" class="draft-label">${esc(s.draftLabel)}</label>
            <button type="button" class="text-btn" id="rebuild-btn">${icons.refresh}<span>${esc(s.rebuildBtn)}</span></button>
          </div>
          <textarea id="draft-text" rows="5" placeholder="${esc(s.draftPlaceholder)}" aria-describedby="draft-note"></textarea>
          <p class="draft-note" id="draft-note">${esc(s.draftNote)}</p>
          <a class="btn btn-outline" id="copy-open" ${reviewLinkAttrs()}>${icons.copy}<span>${esc(s.copyOpenBtn)}</span></a>
          <p class="btn-note">${esc(s.copyOpenNote)}</p>
        </div>
      </section>

      <section class="card private-card" id="private-card" aria-labelledby="private-title"${isLow() ? '' : ' hidden'}>
        <h2 id="private-title" class="card-title">${esc(s.privateTitle)}</h2>
        <p class="card-text">${esc(fill(s.privateBody, { shop: config.shopName }))}</p>
        <a class="btn btn-outline btn-wa" id="private-wa" href="#" target="_blank" rel="noopener">${icons.whatsapp}<span>${esc(s.privateBtn)}</span></a>
      </section>

      <nav class="helpers" aria-label="${esc(s.helpersLabel)}">
        <a class="helper" href="${esc(telUrl(config.phone))}" data-track="call">${icons.call}<span>${esc(s.call)}</span></a>
        <a class="helper" href="${esc(whatsappUrl(config.whatsapp, fill(s.whatsappHello, { shop: config.shopName })))}" target="_blank" rel="noopener" data-track="whatsapp">${icons.whatsapp}<span>${esc(s.whatsapp)}</span></a>
        <a class="helper" href="${esc(directionsUrl(config))}" target="_blank" rel="noopener" data-track="directions">${icons.pin}<span>${esc(s.directions)}</span></a>
        ${
          config.instagram?.trim()
            ? `<a class="helper" href="${esc(config.instagram.trim())}" target="_blank" rel="noopener" data-track="instagram">${icons.instagram}<span>${esc(s.instagram)}</span></a>`
            : ''
        }
      </nav>

      <footer class="footer">
        <p>${esc(config.address)}</p>
        <p><a href="${esc(telUrl(config.phone))}">${esc(config.phone)}</a></p>
      </footer>
    </main>

    <div class="cta-bar">
      <a class="btn btn-primary" id="open-review" ${reviewLinkAttrs()}>
        <span class="cta-star">${icons.star}</span><span>${esc(s.openReviewBtn)}</span>${icons.external}
      </a>
      <p class="cta-note">${esc(s.ctaNote)}</p>
      ${inAppHint}
    </div>

    <div class="toast" id="toast" role="status" aria-live="polite"></div>
  `;

  const textarea = $('#draft-text');
  textarea.value = state.draftOpen ? (state.draftEdited ? state.draftText : currentDraft()) : '';
  updatePrivateLink();
}

function updatePrivateLink() {
  $('#private-wa').href = whatsappUrl(config.whatsapp, privateMessage());
}

function updateDraftIfUntouched() {
  if (state.draftOpen && !state.draftEdited) $('#draft-text').value = currentDraft();
}

function setRating(rating) {
  const groupChanged = groupFor(rating) !== groupFor(state.rating);
  state.rating = rating;
  if (groupChanged) state.tags.clear();

  app.querySelectorAll('.star').forEach((star) => {
    const n = Number(star.dataset.n);
    star.classList.toggle('is-on', n <= rating);
    star.classList.remove('is-picked');
  });
  const picked = app.querySelector(`.star[data-n="${rating}"]`);
  void picked.offsetWidth; // restart the bounce animation
  picked.classList.add('is-picked');

  $('#rate-word').textContent = s.ratingWords[rating];

  const tagsCard = $('#tags-card');
  tagsCard.hidden = false;
  $('#tags-title').textContent = rating >= 4 ? s.likedTitle : s.wrongTitle;
  if (groupChanged) $('#chips').innerHTML = chipsHtml();

  $('#private-card').hidden = !isLow();
  updatePrivateLink();
  updateDraftIfUntouched();

  try {
    navigator.vibrate?.(12);
  } catch {
    // Not supported (e.g. iPhone): no haptic, nothing else changes.
  }
  track('rate', { rating, lang: state.lang });
}

function setLang(lang) {
  if (lang === state.lang) return;
  state.lang = lang;
  storage((ls) => ls.setItem('lang', lang));
  render();
  $(`.lang-btn[data-lang="${lang}"]`).focus();
  track('language', { lang });
}

function guardUnconfigured(event) {
  if (review.url) return false;
  event.preventDefault();
  toast(s.notConfiguredToast);
  return true;
}

// ---------------------------------------------------------------------------
// Events (delegated, so they survive re-renders)

app.addEventListener('change', (event) => {
  if (event.target.name === 'rating') setRating(Number(event.target.value));
});

app.addEventListener('input', (event) => {
  if (event.target.id === 'draft-text') {
    state.draftEdited = true;
    state.draftText = event.target.value;
  }
});

app.addEventListener('click', (event) => {
  const target = event.target.closest('button, a');
  if (!target) return;

  if (target.dataset.lang) return setLang(target.dataset.lang);

  if (target.dataset.tag) {
    const id = target.dataset.tag;
    if (state.tags.has(id)) state.tags.delete(id);
    else state.tags.add(id);
    target.setAttribute('aria-pressed', String(state.tags.has(id)));
    updatePrivateLink();
    updateDraftIfUntouched();
    return;
  }

  switch (target.id) {
    case 'suggest-btn': {
      state.draftOpen = true;
      state.draftEdited = false;
      $('#draft-text').value = currentDraft();
      $('#draft').hidden = false;
      target.hidden = true;
      $('#draft-text').focus({ preventScroll: true });
      $('#draft').scrollIntoView({ behavior: 'smooth', block: 'center' });
      track('suggest_text', { rating: state.rating, lang: state.lang });
      return;
    }
    case 'rebuild-btn': {
      // Step to the next wording; skip any that would look the same as now.
      const textarea = $('#draft-text');
      const before = textarea.value.trim();
      for (let tries = 0; tries < 6; tries++) {
        state.draftVariant++;
        if (currentDraft() !== before) break;
      }
      state.draftEdited = false;
      textarea.value = currentDraft();
      textarea.classList.remove('is-fresh');
      void textarea.offsetWidth; // restart the highlight animation
      textarea.classList.add('is-fresh');
      toast(s.newSuggestionToast);
      track('new_suggestion', { rating: state.rating, lang: state.lang });
      return;
    }
    case 'copy-open': {
      if (guardUnconfigured(event)) return;
      // Let the link open normally (direct tap = no popup blocker). Copy first.
      const text = $('#draft-text').value.trim();
      if (text) {
        copyText(text).then((ok) => toast(ok ? s.copiedToast : s.copyFailedToast));
      }
      track('open_review', { via: 'copy', rating: state.rating, lang: state.lang });
      return;
    }
    case 'open-review':
      if (guardUnconfigured(event)) return;
      track('open_review', { via: 'button', rating: state.rating, lang: state.lang });
      return;
    case 'private-wa':
      track('private_feedback', { rating: state.rating, lang: state.lang });
      return;
    default:
      if (target.dataset.track) track(target.dataset.track, { lang: state.lang });
  }
});

// Hover preview for mouse users: light up stars up to the one under the pointer.
if (canHover) {
  app.addEventListener('mouseover', (event) => {
    const star = event.target.closest('.star');
    if (!star) return;
    const n = Number(star.dataset.n);
    app.querySelectorAll('.star').forEach((el) => el.classList.toggle('is-preview', Number(el.dataset.n) <= n));
  });
  app.addEventListener('mouseout', (event) => {
    if (event.target.closest('.stars') && !event.relatedTarget?.closest?.('.stars')) {
      app.querySelectorAll('.star').forEach((el) => el.classList.remove('is-preview'));
    }
  });
}

render();
