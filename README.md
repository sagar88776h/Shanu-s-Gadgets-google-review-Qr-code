# Shanu's Gadgets — Auto-Suggest Google Review QR Generator & Display Studio

An AI-powered, interactive Google Review QR Code system and print-ready display generator crafted for **Shanu's Gadgets** (Madhupur Bazar, Agartala-Kamalasagar Road, West Tripura).

Designed to eliminate friction for customers leaving 5-star Google reviews while shielding the business against negative ratings.

---

## 🌟 Key Features

### 1. 📱 Customer Auto-Suggest Review Flow (`#/review`)
- **Direct Mobile Experience**: Point customer camera to QR code to instantly open a native-feeling review web app.
- **Smart 5-Star Reputation Shield**:
  - ⭐⭐⭐⭐⭐ / ⭐⭐⭐⭐: Unlocks 1-click review tags, language switchers, and AI suggested drafts.
  - ⭐ / ⭐⭐ / ⭐⭐⭐: Unlocks an empathetic **Private Feedback Shield** that routes dissatisfaction directly to Shanu's private WhatsApp (`+91 7005838381`) rather than posting publicly to Google Maps.
- **Multi-Category & Vibe Selection**:
  - *Products*: Pre-owned iPhone, Android Smartphone, Fast Chargers, Cases & Tempered Glass, Screen/Battery Service, Phone Exchange Deals.
  - *Highlights*: 100% Genuine Condition, Fair Prices, Friendly Hospitality (Shanu da), Fast Testing & Billing, Trusted Warranty.
- **Multi-Lingual Engine**:
  - English
  - বাংলা (Bengali - Tripura local language)
  - हिंदी (Hindi)
  - Hinglish
- **1-Click Copy & Google Launch**:
  - Copies review to clipboard with celebratory confetti.
  - Guides user: *1. Tap 5 Stars → 2. Paste → 3. Post*.
  - Opens Google Review link directly: `https://share.google/IpLBwbsm6F8jadyfW`.

---

### 2. 🖨️ QR Studio & Print Display Designer
- **Live Vector QR Generation**: High error correction (`H`), custom color palettes, and official round "SG" store logo in the center.
- **Print-Ready Counter Displays & Standees**:
  - **Table Tent / Acrylic Counter Standee (Portrait)**: 4" × 6" / 5" × 7" standard format for checkout counters.
  - **Cashier Desk Plaque (Landscape)**: 7" × 5" horizontal card.
  - **Storefront Window Poster (A4)**: High-visibility wall flyer.
  - **Pocket Handout Card**: 3.5" × 2" insert card for customer shopping bags.
- **Direct Print & PDF Export**: Press `Print Ready Display` (`window.print()`) with print-optimized CSS that hides interface buttons and prints crisp, high-DPI cards.
- **High-Res PNG Export**: 1024×1024 PNG download of the QR code.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/sagar88776h/Shanu-s-Gadgets-google-review-Qr-code.git
cd Shanu-s-Gadgets-google-review-Qr-code

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Technology Stack
- **Framework**: Vite + Vanilla JavaScript (ES Modules)
- **Styling**: Vanilla CSS3 (Design Tokens, Glassmorphism, Micro-animations, `@media print`)
- **QR Code Engine**: `qrcode` (Level H Error Correction)
- **FX**: `canvas-confetti`
- **Typography**: Google Fonts (*Outfit*, *Plus Jakarta Sans*)

---

## 📍 Business Details
- **Business Name**: Shanu's Gadgets
- **Location**: Agartala-Kamalasagar Road, Madhupur Bazar, West Tripura - 799102
- **Phone / WhatsApp**: +91 7005838381
- **Google Review Target**: [Google Business Profile](https://share.google/IpLBwbsm6F8jadyfW)
