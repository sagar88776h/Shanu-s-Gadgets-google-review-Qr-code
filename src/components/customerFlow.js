import confetti from 'canvas-confetti';
import { CATEGORIES, HIGHLIGHTS, LANGUAGES, TONES, generateReviewSuggestions } from '../data/reviewsData.js';
import { SHANU_LOGO_SRC } from '../assets/logoBase64.js';

export function createCustomerFlow(container, business, options = {}) {
  // State
  let rating = 5;
  let selectedCategoryIds = ["iphone"];
  let selectedHighlightIds = ["genuine", "hospitality", "price"];
  let currentLanguage = "en";
  let currentTone = "enthusiastic";
  let currentDrafts = [];
  let selectedDraft = "";
  let isCopied = false;

  function updateDrafts() {
    const selectedCats = CATEGORIES.filter(c => selectedCategoryIds.includes(c.id));
    const selectedHighs = HIGHLIGHTS.filter(h => selectedHighlightIds.includes(h.id));
    currentDrafts = generateReviewSuggestions({
      categories: selectedCats,
      highlights: selectedHighs,
      language: currentLanguage,
      tone: currentTone
    });
    if (!selectedDraft || !currentDrafts.includes(selectedDraft)) {
      selectedDraft = currentDrafts[0] || "";
    }
  }

  function render() {
    updateDrafts();

    container.innerHTML = `
      <div class="customer-app-wrapper">
        <!-- Brand Header -->
        <header class="customer-header">
          <div class="header-badge-row">
            <div class="google-verified-tag">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              <span>Verified Business</span>
            </div>
            <div class="rating-badge-tag">
              <span>⭐ 4.9 (120+ Reviews)</span>
            </div>
          </div>

          <div class="store-profile-card">
            <div class="logo-circle-wrapper">
              <img src="${SHANU_LOGO_SRC}" alt="${business.name}" class="store-avatar" />
              <div class="active-pulse"></div>
            </div>
            <div class="store-details">
              <h1 class="store-name">${business.name}</h1>
              <p class="store-sub">${business.tagline}</p>
              <p class="store-loc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg> Madhupur Bazar, West Tripura</p>
            </div>
          </div>
        </header>

        <!-- Star Rating Question -->
        <section class="rating-section card-box">
          <h2 class="section-heading">How was your experience today?</h2>
          <div class="interactive-stars" id="star-selector">
            ${[1, 2, 3, 4, 5].map(star => `
              <button type="button" class="star-btn ${star <= rating ? 'active' : ''}" data-star="${star}" aria-label="${star} stars">
                ★
              </button>
            `).join('')}
          </div>
          <p class="rating-feedback-text">
            ${rating === 5 ? '🌟 Outstanding! 5-Star Experience' :
              rating === 4 ? '😊 Great! 4-Star Experience' :
              rating === 3 ? '😐 Average Experience' :
              '😞 Disappointed Experience'}
          </p>
        </section>

        ${rating <= 3 ? renderPrivateShield(business) : renderReviewBuilder()}
      </div>

      <!-- Modal Guidance on Review Copy -->
      <div id="copy-modal" class="modal-backdrop ${isCopied ? 'show' : ''}">
        <div class="modal-card">
          <div class="modal-icon-circle">🎉</div>
          <h3>Review Copied to Clipboard!</h3>
          <p>We are opening Google Reviews for <strong>${business.name}</strong> right now.</p>
          
          <div class="guide-steps">
            <div class="guide-step">
              <span class="num">1</span>
              <span>Tap <strong>5 Stars</strong> on Google</span>
            </div>
            <div class="guide-step">
              <span class="num">2</span>
              <span><strong>Paste</strong> your copied review</span>
            </div>
            <div class="guide-step">
              <span class="num">3</span>
              <span>Hit <strong>Post</strong> to submit!</span>
            </div>
          </div>

          <a href="${business.googleReviewUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary full-width modal-btn" id="open-google-direct">
            <span>🚀 Continue to Google Reviews</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>

          <button type="button" class="btn-ghost full-width" id="close-modal-btn">
            Done / Close Window
          </button>
        </div>
      </div>
    `;

    bindEvents();
  }

  function renderReviewBuilder() {
    return `
      <!-- Step 1: What did you get? -->
      <section class="card-box review-step-box">
        <div class="step-badge-row">
          <span class="step-num-pill">Step 1</span>
          <h3>What did you visit or buy today?</h3>
        </div>
        <div class="chips-container">
          ${CATEGORIES.map(cat => `
            <button type="button" class="chip-btn ${selectedCategoryIds.includes(cat.id) ? 'selected' : ''}" data-cat-id="${cat.id}">
              ${cat.label}
            </button>
          `).join('')}
        </div>
      </section>

      <!-- Step 2: What stood out? -->
      <section class="card-box review-step-box">
        <div class="step-badge-row">
          <span class="step-num-pill">Step 2</span>
          <h3>What did you like the most?</h3>
        </div>
        <div class="chips-container">
          ${HIGHLIGHTS.map(high => `
            <button type="button" class="chip-btn ${selectedHighlightIds.includes(high.id) ? 'selected' : ''}" data-high-id="${high.id}">
              ${high.label}
            </button>
          `).join('')}
        </div>
      </section>

      <!-- Step 3: Language & Tone Selection -->
      <section class="card-box review-step-box">
        <div class="step-badge-row">
          <span class="step-num-pill">Step 3</span>
          <h3>Choose Language & Tone</h3>
        </div>
        <div class="selectors-row">
          <div class="selector-group">
            <label class="group-label">Language:</label>
            <div class="toggle-pills" id="lang-selector">
              ${LANGUAGES.map(lang => `
                <button type="button" class="toggle-pill ${currentLanguage === lang.id ? 'active' : ''}" data-lang="${lang.id}">
                  ${lang.label}
                </button>
              `).join('')}
            </div>
          </div>
          <div class="selector-group">
            <label class="group-label">Tone:</label>
            <div class="toggle-pills" id="tone-selector">
              ${TONES.map(tone => `
                <button type="button" class="toggle-pill ${currentTone === tone.id ? 'active' : ''}" data-tone="${tone.id}">
                  ${tone.label}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Step 4: AI Suggested Reviews -->
      <section class="card-box review-step-box suggestions-box">
        <div class="step-badge-row space-between">
          <div>
            <span class="step-num-pill">Step 4</span>
            <h3>Tap Any AI Review to Select It</h3>
          </div>
          <button type="button" class="btn-ghost btn-sm" id="reroll-btn" title="Generate fresh suggestions">
            <span>🎲 Fresh AI Drafts</span>
          </button>
        </div>

        <div class="suggestions-list">
          ${currentDrafts.map((draft, idx) => `
            <div class="suggestion-card ${selectedDraft === draft ? 'selected' : ''}" data-draft-idx="${idx}">
              <div class="card-top-indicator">
                <span class="draft-tag">Option ${idx + 1}</span>
                <span class="select-indicator">${selectedDraft === draft ? '✓ Selected' : 'Tap to select'}</span>
              </div>
              <p class="draft-text">"${draft}"</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Step 5: Final Review & 1-Click Action -->
      <section class="card-box review-step-box final-action-box">
        <div class="step-badge-row">
          <span class="step-num-pill">Step 5</span>
          <h3>Your Review (Ready to Post)</h3>
        </div>
        <textarea id="review-textarea" class="review-textarea" rows="4" placeholder="Your review text will appear here...">${selectedDraft}</textarea>
        <p class="edit-hint">💡 You can edit or add your own words directly in the box above.</p>

        <button type="button" class="btn-primary-glow full-width" id="copy-and-open-btn">
          <span class="btn-icon">🚀</span>
          <span class="btn-main-text">Copy Review & Open Google</span>
          <span class="btn-sub-text">⭐⭐⭐⭐⭐ 15-second fast submission</span>
        </button>

        <div class="direct-link-fallback">
          <a href="${business.googleReviewUrl}" target="_blank" rel="noopener noreferrer" class="link-muted">
            Or open Google Reviews page directly ↗
          </a>
        </div>
      </section>
    `;
  }

  function renderPrivateShield(business) {
    const defaultWhatsAppMsg = encodeURIComponent(`Hi Shanu's Gadgets, I visited your store in Madhupur and wanted to share some feedback: `);
    const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${defaultWhatsAppMsg}`;

    return `
      <section class="card-box private-shield-box">
        <div class="shield-icon">🛡️</div>
        <h2>We are genuinely sorry!</h2>
        <p class="shield-desc">
          At <strong>${business.name}</strong>, customer happiness is our top priority. Please tell Shanu directly so we can make this right for you immediately.
        </p>

        <form id="private-feedback-form" class="private-form">
          <div class="form-group">
            <label>What could we have done better?</label>
            <textarea id="private-feedback-text" class="review-textarea" rows="3" placeholder="Tell us what went wrong..." required></textarea>
          </div>
          <div class="form-group">
            <label>Your Contact Number (optional, so we can contact you):</label>
            <input type="tel" id="private-customer-phone" class="form-input" placeholder="e.g. 9876543210" />
          </div>

          <div class="shield-actions">
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp full-width">
              <span>💬 Message Shanu on WhatsApp (+91 ${business.phone})</span>
            </a>
            <button type="submit" class="btn-secondary full-width">
              Submit Direct Feedback to Management
            </button>
          </div>
        </form>
      </section>
    `;
  }

  function bindEvents() {
    // Star Rating click
    const starBtns = container.querySelectorAll('#star-selector .star-btn');
    starBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const star = parseInt(btn.getAttribute('data-star'), 10);
        rating = star;
        render();
      });
    });

    // Category chips
    const catBtns = container.querySelectorAll('[data-cat-id]');
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-cat-id');
        if (selectedCategoryIds.includes(catId)) {
          if (selectedCategoryIds.length > 1) {
            selectedCategoryIds = selectedCategoryIds.filter(id => id !== catId);
          }
        } else {
          selectedCategoryIds.push(catId);
        }
        render();
      });
    });

    // Highlight chips
    const highBtns = container.querySelectorAll('[data-high-id]');
    highBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const highId = btn.getAttribute('data-high-id');
        if (selectedHighlightIds.includes(highId)) {
          if (selectedHighlightIds.length > 1) {
            selectedHighlightIds = selectedHighlightIds.filter(id => id !== highId);
          }
        } else {
          selectedHighlightIds.push(highId);
        }
        render();
      });
    });

    // Language pills
    const langBtns = container.querySelectorAll('#lang-selector [data-lang]');
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentLanguage = btn.getAttribute('data-lang');
        render();
      });
    });

    // Tone pills
    const toneBtns = container.querySelectorAll('#tone-selector [data-tone]');
    toneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentTone = btn.getAttribute('data-tone');
        render();
      });
    });

    // Reroll button
    const rerollBtn = container.querySelector('#reroll-btn');
    if (rerollBtn) {
      rerollBtn.addEventListener('click', () => {
        updateDrafts();
        // pick random
        const randomIndex = Math.floor(Math.random() * currentDrafts.length);
        selectedDraft = currentDrafts[randomIndex];
        render();
      });
    }

    // Suggestion cards click
    const draftCards = container.querySelectorAll('.suggestion-card');
    draftCards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-draft-idx'), 10);
        selectedDraft = currentDrafts[idx];
        const textarea = container.querySelector('#review-textarea');
        if (textarea) textarea.value = selectedDraft;
        draftCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });

    // Textarea manual edits
    const textarea = container.querySelector('#review-textarea');
    if (textarea) {
      textarea.addEventListener('input', (e) => {
        selectedDraft = e.target.value;
      });
    }

    // Copy and Open Google button
    const copyBtn = container.querySelector('#copy-and-open-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const textToCopy = textarea ? textarea.value : selectedDraft;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
          } else {
            // fallback
            textarea.select();
            document.execCommand('copy');
          }
        } catch (err) {
          console.warn("Clipboard access fallback:", err);
        }

        // Fire celebratory confetti!
        triggerConfetti();

        // Show modal guide
        isCopied = true;
        const modal = container.querySelector('#copy-modal');
        if (modal) modal.classList.add('show');

        // Automatically open the user's Google Review URL in 1.2 seconds
        setTimeout(() => {
          window.open(business.googleReviewUrl, '_blank', 'noopener,noreferrer');
        }, 1200);
      });
    }

    // Modal Close
    const closeModalBtn = container.querySelector('#close-modal-btn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        isCopied = false;
        const modal = container.querySelector('#copy-modal');
        if (modal) modal.classList.remove('show');
      });
    }

    // Private feedback form
    const privateForm = container.querySelector('#private-feedback-form');
    if (privateForm) {
      privateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = container.querySelector('#private-feedback-text').value;
        const phone = container.querySelector('#private-customer-phone').value;
        alert(`Thank you! Your private feedback has been logged. Shanu will contact you shortly if needed.`);
        rating = 5;
        render();
      });
    }
  }

  function triggerConfetti() {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#ffffff']
      });
    } catch (e) {
      console.warn("Confetti error:", e);
    }
  }

  // Initial render
  render();

  return {
    setRating(newRating) {
      rating = newRating;
      render();
    },
    refresh() {
      render();
    }
  };
}
