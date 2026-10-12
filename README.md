# Shanu's Gadgets: smart Google review page

A small, fast review page for **Shanu's Gadgets** (Phones & Accessories, Madhupur Bazar, West Tripura).
Customers scan a QR code at the counter and tap 1–5 stars. They can pick quick tags and optionally get suggested review text, then open Google's **"Write a review"** screen directly.

- **Customer page:** `index.html` (the site root). Old QR codes that point at `…/#review` still land here.
- **Print page for the owner:** `qr.html`. It makes the counter card, packaging stickers and PNG/SVG downloads.

Built with Vite and plain JavaScript. The customer page loads about 10 KB of gzipped JavaScript and scores 100 on all four Lighthouse mobile categories (Performance, Accessibility, Best Practices, SEO).

---

## Quick start

```bash
npm install
npm run dev        # open http://localhost:5173 and http://localhost:5173/qr.html
npm test           # unit tests for the review link and review-text builder
npm run build      # production files in dist/
```

---

## 1. Set up the Google review link (required)

Open **`shop.config.js`** and fill in **one** of these two fields. Until you do, the page shows a yellow "Setup needed" bar and the Google button does nothing.

### Option A (easiest): the review link from your Business Profile → `reviewUrl`

1. On your phone, open the **Google Maps** app (or search "Shanu's Gadgets" on Google while signed in as the owner).
2. Open your Business Profile and tap **"Ask for reviews"** (sometimes labelled **"Get more reviews"** or **"Share review form"**).
3. Copy the link. It looks like `https://g.page/r/XXXXXXXXXXXX/review`.
4. Paste it into `shop.config.js`:
   ```js
   reviewUrl: 'https://g.page/r/XXXXXXXXXXXX/review',
   ```
   The button opens exactly that link.

### Option B: your Place ID → `placeId`

1. Open Google's **Place ID Finder**: <https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder>
2. Type "Shanu's Gadgets Madhupur" in the search box and pick your shop.
3. Copy the Place ID. It starts with `ChIJ…`.
4. Paste it into `shop.config.js`:
   ```js
   placeId: 'ChIJ…',
   ```
   The button then opens `https://search.google.com/local/writereview?placeid=ChIJ…`.

If both are filled in, `reviewUrl` wins.

> ⚠️ **Do not** use a `google.com/maps/place/…`, `maps.app.goo.gl/…` or `share.google/…` link here. Those open the shop's listing page instead of the review dialog, which was the old bug. The code ignores such links for the review button and prints a warning in the browser console. (The old `share.google` link is still used for the **Directions** button, where opening the listing is what you want.)

**Check it:** run `npm run dev`, tap **Open Google Review**, and confirm Google shows the star-rating box for your shop.

### How the button opens on phones

- It is a normal link (`<a target="_blank" rel="noopener">`) tapped directly by the customer, so mobile popup blockers do not stop it.
- **Android Chrome / iPhone Safari:** opens Google's review screen. If the customer is not signed in to Google, Google asks them to sign in first.
- **In-app browsers (Instagram, Facebook, sometimes WhatsApp):** the link still opens. Google sign-in can be awkward inside these apps, so the page shows a small tip to open it in the real browser. On Android it also shows an **Open in Chrome** link.

---

## 2. Shop details: `shop.config.js`

Everything about the business is in this one file:

| Field | What it does |
| --- | --- |
| `shopName`, `tagline`, `city`, `address` | Header, footer, page title and link preview |
| `reviewUrl` / `placeId` | Google review button (see above) |
| `phone` | **Call** button and footer |
| `whatsapp` | **WhatsApp** buttons: country code + number, digits only (`917005838381`) |
| `mapsUrl` | **Directions** button. If empty, a Google Maps directions link is built from `placeId` or the address |
| `instagram` | **Instagram** button (your profile link). Leave empty to hide the button |
| `logo`, `logoPng` | Files in `public/` (round logo for the page; PNG for the QR centre) |
| `siteUrl` | Your live website address (the one customers open, e.g. `https://your-project.vercel.app/`), **not** the GitHub page. Used inside the QR code and for WhatsApp link previews. While empty, `qr.html` uses the address it is opened from |
| `googleRating`, `googleReviewCount` | Leave `null` unless you enter your **real** current Google numbers. When both are set, the header shows "4.8 ★ · 120 Google reviews" |
| `defaultLanguage` | `'en'` or `'hi'` |
| `analyticsEndpoint` | Optional click counting (see section 6) |

To change the logo, replace `public/logo-256.webp` and `public/logo-256.png` (square, 256 × 256, round logo on a transparent background). The original `public/logo.jpg` is kept as the source file.

---

## 3. Edit tags and text: `src/strings.js`

All words on the page live here, in English (`en`) and Hindi (`hi`). You never need to touch the logic files.

- **Which chips show:** `tagGroups.positive` (shown for 4–5★) and `tagGroups.negative` (shown for 1–3★). Reorder or remove ids here.
- **Chip wording:** each language has a `tags` section. `label` is the chip text and `phrase` is what goes into the suggested review text:
  ```js
  genuine: { label: 'Genuine products', phrase: 'the products are genuine' },
  ```
  To add a new chip, add an id to `tagGroups`, then add a `tags` entry with that id in each language.
- **Suggested review text** is built as: opener (by star rating) + the selected chips' phrases + closer. Edit `draft.openers` and `draft.closers`; each has a list of wordings for 1★ to 5★. The **New suggestion** button steps through those wordings (and reorders the chip phrases), so add more lines for more variety.
- **Add a language:** copy the whole `en: { … }` block, paste it after `hi`, change the key (e.g. `bn:` for Bengali) and translate. Anything you skip falls back to English. The language toggle shows it automatically.
- **Header tagline per language:** English uses `tagline` from `shop.config.js`. Hindi has its own `tagline` in the `hi` block.
- **Printed text** on the counter card and stickers is in `printText` at the bottom of the file.

---

## 4. Print the QR code: `qr.html`

1. **First**, set `siteUrl` in `shop.config.js` to your live website and deploy (see section 5). The QR code must contain the public address, not `localhost`.
2. Open `https://your-site/qr.html`. It is not linked from the customer page, so bookmark it.
3. Choose what to print:
   - **Counter card:** A6 (4 per A4 sheet, fits a 4×6" acrylic stand), A5, or an A4 poster.
   - **Stickers** for packaging: 40 mm (24 per sheet), 50 mm (15) or 60 mm (12).
   - **QR only:** a large plain code, for a designer or print shop.
4. Press **Print (A4)**. In the print dialog choose **A4**, **Scale 100% / Actual size**, **Margins: None**. Dashed lines are cut guides.
5. **Scan one printout with a phone before printing many.**

**Download PNG** (2048 px) and **Download SVG** (vector, best for print shops) give you just the code. The logo in the middle is optional. With it on, the code uses Google's highest error correction, so it still scans.

The QR code is generated in the browser by the `qrcode` package bundled with the site. No outside service is called.

> If you printed QR codes from the old version with **"Direct Google Review Link"** selected, those point at the `share.google` listing page. Please reprint them from `qr.html`. Codes that pointed at `…/#review` keep working.

---

## 5. Deploy

`npm run build` creates the `dist/` folder. All paths are relative, so it works at a domain root or in a sub-folder.

- **Netlify:** New site → import this repo → Build command `npm run build`, Publish directory `dist`.
- **Vercel:** Import the repo. It detects Vite (build `npm run build`, output `dist`).
- **GitHub Pages:** Settings → Pages → Source: **GitHub Actions** → "Static HTML" → Configure. In that workflow, add a step `- run: npm ci && npm run build` before the upload step, and change the upload `path` from `'.'` to `'dist'`.
- **Any other static host:** upload the contents of `dist/`.

After the first deploy, put the final address in `siteUrl` and deploy again. That makes WhatsApp link previews show the image `public/og-image.jpg` and keeps the QR codes correct.

---

## 6. Click counting (optional)

A static site cannot store counts on its own, because that needs a small server. The page already has a privacy-friendly hook ready for one:

- Every tap (`rate`, `open_review`, `private_feedback`, `call`, `whatsapp`, `directions`, `instagram`, `suggest_text`, `new_suggestion`, `language`) fires a browser event `shop:track`.
- If you set `analyticsEndpoint` in `shop.config.js`, the page also sends a tiny anonymous beacon such as `{"event":"open_review","via":"button","rating":5,"lang":"en"}`. No cookies and no personal data.

A free way to collect them is a **Google Apps Script web app** that appends each beacon to a Google Sheet. Paste its `/exec` URL as `analyticsEndpoint`. Leave it empty to count nothing.

---

## 7. Google review policy

The page follows Google's rules on reviews:

- **No review gating.** Every rating, including 1–3★, sees the **Open Google Review** button. Low ratings also get an optional "Tell us privately so we can fix it" WhatsApp button. The Google review is never hidden, delayed or discouraged.
- **No incentives.** No discounts, offers or rewards for reviews appear anywhere (a unit test checks the text).
- **Suggested text is optional and editable.** The customer is told it is only a starting point and should reflect their real experience.
- **No fake numbers.** The rating and review count only show if you enter real ones in the config.
- The stars on this page only choose the tags. The customer picks their actual rating on Google.

---

## Project structure

```
shop.config.js        ← business details (edit me)
src/strings.js        ← all text, tags, languages (edit me)
index.html            customer page shell + meta tags (filled from shop.config.js at build time)
qr.html               printable QR page
src/review.js         customer page logic
src/qr.js             QR page logic
src/lib/links.js      review / WhatsApp / call / directions links
src/lib/draft.js      suggested review text
src/lib/qr-svg.js     QR code as SVG / PNG
src/lib/clipboard.js  copy that works before the new tab opens
src/lib/track.js      optional click counting hook
src/styles/           design tokens, page styles, print styles
public/               logo, icons, font, link-preview image
tests/                npm test
```

## Business details

- **Shanu's Gadgets**, Agartala-Kamalasagar Road, Madhupur Bazar, West Tripura 799102
- Phone / WhatsApp: +91 70058 38381
