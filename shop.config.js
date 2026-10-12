// ============================================================================
//  SHOP CONFIG: edit your business details here. This is the only file you
//  need to change for links, phone numbers and the Google review button.
//  (All on-screen text lives in src/strings.js.)
// ============================================================================

export default {
  shopName: "Shanu's Gadgets",
  tagline: 'Phones & Accessories',
  city: 'Madhupur', // used in "Loved by customers in …"
  address: 'Agartala-Kamalasagar Road, Madhupur Bazar, Sepahijala, Tripura 799102',

  // --- Google review button --------------------------------------------------
  // Fill in ONE of these (see README → "Set up the Google review link").
  //
  // reviewUrl: the review link from Google Business Profile → "Ask for reviews"
  //            (looks like https://g.page/r/…/review or https://share.google/…).
  //            Used as is. Open it on your phone once: it must show Google's
  //            star-rating box, not just your shop page.
  // placeId:   your Place ID from Google's "Place ID Finder", e.g. 'ChIJ…'.
  //            Used to build https://search.google.com/local/writereview?placeid=…
  //
  // Do NOT paste a google.com/maps/… or maps.app.goo.gl link here: those open
  // the shop page, not the "Write a review" screen.
  reviewUrl: 'https://share.google/yBb40ws5TBnyv5M5L',
  placeId: '', // only a real Place ID (starts with 'ChIJ'); not needed while reviewUrl is set

  // --- Contact & directions ---------------------------------------------------
  phone: '+91 70058 38381', // shown on screen and used for the Call button
  whatsapp: '917005838381', // country code + number, digits only
  // Link for the "Directions" button. A Maps or share link is fine here.
  mapsUrl: 'https://share.google/IpLBwbsm6F8jadyfW',
  // Instagram profile for the "Instagram" button. Leave empty to hide the button.
  instagram: 'https://www.instagram.com/shanus_gadgets_official/',

  // --- Branding -----------------------------------------------------------------
  logo: 'logo-256.webp', // file in /public (round logo shown in the header)
  logoPng: 'logo-256.png', // PNG version, used in the QR code centre and downloads

  // Public address of this website (what customers open), with a trailing
  // slash, e.g. 'https://shanus-gadgets.vercel.app/'. NOT the GitHub page.
  // Used for the QR code and for WhatsApp/Facebook link previews. While empty,
  // qr.html uses the address it is opened from, which is right on the live site.
  siteUrl: 'https://shanu-s-gadgets-google-review-qr-code-90cuggdnf.vercel.app/',

  // Only fill these with your REAL current Google rating, or leave them null.
  // When both are set, the header shows e.g. "4.8 ★ · 120 Google reviews".
  googleRating: null, // e.g. 4.8
  googleReviewCount: null, // e.g. 120

  defaultLanguage: 'en', // 'en' or 'hi' (see src/strings.js)

  // --- Optional click counting --------------------------------------------------
  // Leave empty to count nothing. If you set a URL, the page sends a tiny
  // anonymous beacon ({ event, rating, lang }) to it on button taps. No
  // cookies, no personal data. See README → "Click counting".
  analyticsEndpoint: '',
};
