import './style.css';
import { BUSINESS_INFO } from './data/reviewsData.js';
import { renderQrCode, getHighResQrDataUrl, downloadQrCode, QR_PALETTES } from './components/qrGenerator.js';
import { renderStandeeHtml, DISPLAY_TEMPLATES } from './components/standeeDesigner.js';
import { createCustomerFlow } from './components/customerFlow.js';
import { SHANU_LOGO_SRC } from './assets/logoBase64.js';

// Application State
const state = {
  activeTab: window.location.hash === '#review' ? 'customer' : 'studio',
  business: { ...BUSINESS_INFO },
  qrOptions: {
    paletteKey: 'google',
    logoType: 'shanu',
    size: 320,
    margin: 2
  },
  displayTemplate: 'standee', // "standee" | "plaque" | "poster" | "card"
  qrTargetType: 'customerApp', // "customerApp" (auto-suggest page) | "directGoogle" (direct google share link)
  qrDataUrl: ''
};

// Compute target URL to encode in QR
function getQrTargetUrl() {
  if (state.qrTargetType === 'directGoogle') {
    return state.business.googleReviewUrl;
  }
  // Point to this application's review hash route
  const currentUrl = new URL(window.location.href);
  currentUrl.hash = '#review';
  return currentUrl.toString();
}

const appEl = document.querySelector('#app');

function renderApp() {
  appEl.innerHTML = `
    <!-- Top Navigation Bar -->
    <header class="top-navbar">
      <div class="nav-brand">
        <img src="${SHANU_LOGO_SRC}" alt="${state.business.name}" class="brand-nav-logo" />
        <div class="brand-nav-text">
          <h2>${state.business.name}</h2>
          <span class="nav-badge-pill">⭐ Auto-Suggest Review QR</span>
        </div>
      </div>

      <nav class="nav-tabs" aria-label="Main Navigation">
        <button type="button" class="tab-btn ${state.activeTab === 'studio' ? 'active' : ''}" id="tab-studio">
          <span>🖨️ QR & Standee Studio</span>
        </button>
        <button type="button" class="tab-btn ${state.activeTab === 'customer' ? 'active' : ''}" id="tab-customer">
          <span>📱 Customer Review Flow</span>
        </button>
      </nav>

      <div class="nav-actions">
        <button type="button" class="btn-primary btn-sm" id="nav-print-btn">
          <span>🖨️ Print Standee</span>
        </button>
      </div>
    </header>

    <!-- Main View Content -->
    <main class="main-content">
      ${state.activeTab === 'studio' ? renderStudioView() : renderCustomerView()}
    </main>
  `;

  bindGlobalEvents();

  if (state.activeTab === 'studio') {
    updateQrAndStandee();
  } else {
    initCustomerReview();
  }
}

function renderStudioView() {
  return `
    <div class="studio-layout">
      <!-- Left Column: Generator Controls -->
      <aside class="studio-panel">
        <div class="panel-header">
          <h1 class="panel-title">QR Code & Standee Generator</h1>
          <p class="panel-desc">Generate smart auto-suggest review QR codes & print-ready counter displays for <strong>${state.business.name}</strong>.</p>
        </div>

        <!-- Live QR Preview Canvas -->
        <div class="config-group">
          <label class="group-title">Live QR Preview</label>
          <div class="qr-preview-box">
            <canvas id="qr-canvas" class="qr-canvas-preview"></canvas>
            <p class="qr-link-caption" id="qr-target-caption">${getQrTargetUrl()}</p>
          </div>
          <div class="button-row">
            <button type="button" class="btn-secondary full-width" id="download-qr-btn">
              <span>💾 Download PNG</span>
            </button>
            <button type="button" class="btn-secondary full-width" id="copy-qr-link-btn">
              <span>📋 Copy QR Link</span>
            </button>
          </div>
        </div>

        <!-- Target Destination Toggle -->
        <div class="config-group">
          <label class="group-title">QR Destination</label>
          <div class="form-field">
            <select id="qr-target-select" class="form-input">
              <option value="customerApp" ${state.qrTargetType === 'customerApp' ? 'selected' : ''}>✨ Auto-Suggest Review Flow (Recommended - AI Drafts & 5-Star Shield)</option>
              <option value="directGoogle" ${state.qrTargetType === 'directGoogle' ? 'selected' : ''}>🔗 Direct Google Review Link (https://share.google/IpLBwbsm6F8jadyfW)</option>
            </select>
          </div>
        </div>

        <!-- Color Style & Central Logo -->
        <div class="config-group">
          <label class="group-title">QR Styling</label>
          <div class="form-field">
            <label class="form-label">Color Palette:</label>
            <select id="qr-palette-select" class="form-input">
              ${Object.values(QR_PALETTES).map(pal => `
                <option value="${pal.id}" ${state.qrOptions.paletteKey === pal.id ? 'selected' : ''}>${pal.name}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">Center Badge:</label>
            <select id="qr-logo-select" class="form-input">
              <option value="shanu" ${state.qrOptions.logoType === 'shanu' ? 'selected' : ''}>Official Shanu's Gadgets Logo</option>
              <option value="google" ${state.qrOptions.logoType === 'google' ? 'selected' : ''}>Google "G" Icon</option>
              <option value="star" ${state.qrOptions.logoType === 'star' ? 'selected' : ''}>5-Star Gold Badge</option>
              <option value="none" ${state.qrOptions.logoType === 'none' ? 'selected' : ''}>None (Pure QR)</option>
            </select>
          </div>
        </div>

        <!-- Business Profile Configuration -->
        <div class="config-group">
          <label class="group-title">Business Profile & Links</label>
          <div class="form-field">
            <label class="form-label">Business Name:</label>
            <input type="text" id="cfg-name" class="form-input" value="${state.business.name}" />
          </div>
          <div class="form-field">
            <label class="form-label">Google Review URL:</label>
            <input type="url" id="cfg-url" class="form-input" value="${state.business.googleReviewUrl}" />
          </div>
          <div class="form-field">
            <label class="form-label">Location / Address:</label>
            <input type="text" id="cfg-location" class="form-input" value="${state.business.location}" />
          </div>
          <div class="form-field">
            <label class="form-label">Contact / WhatsApp Phone:</label>
            <input type="text" id="cfg-phone" class="form-input" value="${state.business.phone}" />
          </div>
        </div>
      </aside>

      <!-- Right Column: Print-Ready Physical Standee Showcase -->
      <section class="display-showcase-panel">
        <div class="display-toolbar">
          <div class="format-selector">
            ${DISPLAY_TEMPLATES.map(tpl => `
              <button type="button" class="format-btn ${state.displayTemplate === tpl.id ? 'active' : ''}" data-template="${tpl.id}">
                ${tpl.name}
              </button>
            `).join('')}
          </div>
          <button type="button" class="btn-primary" id="standee-print-btn">
            <span>🖨️ Print Ready Display</span>
          </button>
        </div>

        <div class="print-preview-stage" id="print-stage-container">
          <!-- Standee card injected dynamically with QR -->
        </div>
      </section>
    </div>
  `;
}

function renderCustomerView() {
  return `
    <div class="customer-view-container">
      <div class="phone-mockup-frame">
        <div class="phone-speaker-bar"></div>
        <div class="phone-screen" id="customer-flow-mount">
          <!-- Customer Flow rendered here -->
        </div>
      </div>
    </div>
  `;
}

async function updateQrAndStandee() {
  const canvas = document.querySelector('#qr-canvas');
  if (!canvas) return;

  const targetUrl = getQrTargetUrl();
  await renderQrCode(canvas, targetUrl, state.qrOptions);
  state.qrDataUrl = canvas.toDataURL('image/png');

  // Render standee
  const stage = document.querySelector('#print-stage-container');
  if (stage) {
    stage.innerHTML = renderStandeeHtml(state.business, state.displayTemplate, state.qrDataUrl);
  }

  const caption = document.querySelector('#qr-target-caption');
  if (caption) {
    caption.textContent = targetUrl;
  }
}

function initCustomerReview() {
  const mount = document.querySelector('#customer-flow-mount');
  if (mount) {
    createCustomerFlow(mount, state.business);
  }
}

function bindGlobalEvents() {
  // Tab switching
  const tabStudio = document.querySelector('#tab-studio');
  const tabCustomer = document.querySelector('#tab-customer');

  if (tabStudio) {
    tabStudio.addEventListener('click', () => {
      state.activeTab = 'studio';
      window.location.hash = '#studio';
      renderApp();
    });
  }

  if (tabCustomer) {
    tabCustomer.addEventListener('click', () => {
      state.activeTab = 'customer';
      window.location.hash = '#review';
      renderApp();
    });
  }

  // Print buttons
  const printBtns = document.querySelectorAll('#nav-print-btn, #standee-print-btn');
  printBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.activeTab !== 'studio') {
        state.activeTab = 'studio';
        renderApp();
      }
      setTimeout(() => {
        window.print();
      }, 300);
    });
  });

  // Template format switching
  const formatBtns = document.querySelectorAll('.format-btn');
  formatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.displayTemplate = btn.getAttribute('data-template');
      renderApp();
    });
  });

  // Palette selector
  const palSelect = document.querySelector('#qr-palette-select');
  if (palSelect) {
    palSelect.addEventListener('change', (e) => {
      state.qrOptions.paletteKey = e.target.value;
      updateQrAndStandee();
    });
  }

  // Logo selector
  const logoSelect = document.querySelector('#qr-logo-select');
  if (logoSelect) {
    logoSelect.addEventListener('change', (e) => {
      state.qrOptions.logoType = e.target.value;
      updateQrAndStandee();
    });
  }

  // Target destination selector
  const targetSelect = document.querySelector('#qr-target-select');
  if (targetSelect) {
    targetSelect.addEventListener('change', (e) => {
      state.qrTargetType = e.target.value;
      updateQrAndStandee();
    });
  }

  // Business config fields
  const nameInput = document.querySelector('#cfg-name');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      state.business.name = e.target.value;
      updateQrAndStandee();
    });
  }

  const urlInput = document.querySelector('#cfg-url');
  if (urlInput) {
    urlInput.addEventListener('input', (e) => {
      state.business.googleReviewUrl = e.target.value;
      updateQrAndStandee();
    });
  }

  const locInput = document.querySelector('#cfg-location');
  if (locInput) {
    locInput.addEventListener('input', (e) => {
      state.business.location = e.target.value;
      updateQrAndStandee();
    });
  }

  const phoneInput = document.querySelector('#cfg-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      state.business.phone = e.target.value;
      state.business.whatsapp = '91' + e.target.value.replace(/\D/g, '');
      updateQrAndStandee();
    });
  }

  // Download QR PNG button
  const downloadBtn = document.querySelector('#download-qr-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      const url = getQrTargetUrl();
      await downloadQrCode(url, state.qrOptions, `${state.business.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_review_qr.png`);
    });
  }

  // Copy QR Link button
  const copyLinkBtn = document.querySelector('#copy-qr-link-btn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      const url = getQrTargetUrl();
      try {
        await navigator.clipboard.writeText(url);
        copyLinkBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyLinkBtn.innerHTML = '<span>📋 Copy QR Link</span>';
        }, 2000);
      } catch (err) {
        alert(`Link: ${url}`);
      }
    });
  }
}

// Window hash change listener
window.addEventListener('hashchange', () => {
  const newTab = window.location.hash === '#review' ? 'customer' : 'studio';
  if (newTab !== state.activeTab) {
    state.activeTab = newTab;
    renderApp();
  }
});

// Initial boot
renderApp();
