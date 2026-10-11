import { SHANU_LOGO_SRC } from '../assets/logoBase64.js';

export const DISPLAY_TEMPLATES = [
  { id: "standee", name: "Table Tent / Acrylic Standee (Portrait)", size: "4\" × 6\" / 5\" × 7\"" },
  { id: "plaque", name: "Cashier Desk Plaque (Landscape)", size: "7\" × 5\"" },
  { id: "poster", name: "A4 Storefront Window Poster", size: "A4 Printable" },
  { id: "card", name: "Pocket Bag Card / NFC Insert", size: "3.5\" × 2\"" },
];

export function renderStandeeHtml(business, templateId = "standee", qrCanvasDataUrl = "") {
  const logoUrl = SHANU_LOGO_SRC;

  if (templateId === "plaque") {
    return `
      <div class="print-plaque-card">
        <div class="plaque-left">
          <div class="brand-row">
            <img src="${logoUrl}" alt="${business.name}" class="print-brand-logo" />
            <div>
              <h2 class="print-brand-title">${business.name}</h2>
              <p class="print-brand-sub">${business.tagline}</p>
            </div>
          </div>
          <div class="stars-badge-row">
            <span class="stars-icons">⭐⭐⭐⭐⭐</span>
            <span class="rating-text">4.9 / 5.0 Rating</span>
          </div>
          <h1 class="callout-heading">REVIEW US ON GOOGLE</h1>
          <p class="callout-desc">Scan the QR code to auto-generate and post your review in just 15 seconds!</p>
          <div class="perks-row">
            <span class="perk-chip">⚡ 1-Click Auto Drafts</span>
            <span class="perk-chip">💎 100% Free & Fast</span>
            <span class="perk-chip">🌐 বাংলা / Hindi / English</span>
          </div>
          <div class="print-footer-info">
            📍 ${business.location} • 📞 ${business.phone}
          </div>
        </div>
        <div class="plaque-right">
          <div class="qr-print-frame">
            <div class="google-badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              <span>Google Review</span>
            </div>
            <img src="${qrCanvasDataUrl}" alt="Google Review QR" class="print-qr-img" />
            <span class="qr-scan-label">SCAN WITH CAMERA</span>
          </div>
        </div>
      </div>
    `;
  }

  if (templateId === "poster") {
    return `
      <div class="print-poster-card">
        <div class="poster-header">
          <img src="${logoUrl}" alt="${business.name}" class="poster-logo" />
          <h1 class="poster-title">${business.name}</h1>
          <p class="poster-tagline">${business.tagline}</p>
          <div class="poster-rating">
            <span class="stars-icons">⭐⭐⭐⭐⭐</span>
            <span class="rating-text">4.9 ★ ON GOOGLE REVIEWS</span>
          </div>
        </div>

        <div class="poster-body">
          <div class="poster-banner">
            <h2>LOVE YOUR NEW GADGET?</h2>
            <p>Help others in Madhupur find the best deals & genuine phones!</p>
          </div>

          <div class="poster-qr-section">
            <div class="qr-glow-wrapper">
              <img src="${qrCanvasDataUrl}" alt="Google Review QR" class="print-qr-img large" />
            </div>
            <div class="scan-arrow-text">
              <span>👇 SCAN WITH ANY PHONE CAMERA 👇</span>
            </div>
          </div>

          <div class="poster-steps-grid">
            <div class="poster-step">
              <span class="step-num">1</span>
              <h4>Scan QR Code</h4>
              <p>Opens directly on your mobile browser</p>
            </div>
            <div class="poster-step">
              <span class="step-num">2</span>
              <h4>Pick Suggestions</h4>
              <p>1-tap pre-written glowing review drafts</p>
            </div>
            <div class="poster-step">
              <span class="step-num">3</span>
              <h4>Post on Google</h4>
              <p>Takes only 15 seconds!</p>
            </div>
          </div>
        </div>

        <div class="poster-footer">
          <p class="poster-address">📍 ${business.location}</p>
          <p class="poster-contact">📞 Call / WhatsApp: +91 ${business.phone}</p>
        </div>
      </div>
    `;
  }

  if (templateId === "card") {
    return `
      <div class="print-handout-card">
        <div class="card-left">
          <img src="${logoUrl}" alt="${business.name}" class="card-logo" />
          <h3 class="card-title">${business.name}</h3>
          <p class="card-stars">⭐⭐⭐⭐⭐</p>
          <p class="card-cta">Review us & help us grow!</p>
          <p class="card-loc">Madhupur Bazar • ${business.phone}</p>
        </div>
        <div class="card-right">
          <img src="${qrCanvasDataUrl}" alt="QR" class="card-qr" />
          <span class="card-scan-text">SCAN FOR AI DRAFTS</span>
        </div>
      </div>
    `;
  }

  // Default: Table Tent / Counter Standee (Portrait)
  return `
    <div class="print-standee-card">
      <div class="standee-top-badge">
        <div class="google-badge-pill">
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          <span>Verified Business on Google</span>
        </div>
      </div>

      <div class="standee-brand-header">
        <img src="${logoUrl}" alt="${business.name}" class="standee-brand-logo" />
        <h1 class="standee-brand-name">${business.name}</h1>
        <p class="standee-brand-sub">${business.tagline}</p>
        <div class="standee-rating-stars">
          <span class="stars-icons">⭐⭐⭐⭐⭐</span>
          <span class="rating-label">4.9 ★ (120+ Reviews)</span>
        </div>
      </div>

      <div class="standee-callout">
        <h2>SCAN TO REVIEW US</h2>
        <p>Takes just 15 seconds • AI suggested reviews ready to copy!</p>
      </div>

      <div class="standee-qr-container">
        <div class="qr-border-box">
          <img src="${qrCanvasDataUrl}" alt="Google Review QR" class="print-qr-img" />
        </div>
        <div class="scan-pill-tag">
          📷 Point your phone camera here
        </div>
      </div>

      <div class="standee-features">
        <div class="feature-item">
          <span>✨</span>
          <p>Instant review drafts in বাংলা & English</p>
        </div>
        <div class="feature-item">
          <span>🚀</span>
          <p>1-Click copy & direct Google post</p>
        </div>
      </div>

      <div class="standee-footer">
        <p class="address-text">📍 ${business.location}</p>
        <p class="phone-text">📞 +91 ${business.phone}</p>
      </div>
    </div>
  `;
}
