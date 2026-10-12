// ============================================================================
//  ALL TEXT ON THE SITE: edit wording here without touching any logic.
//
//  • {shop}, {city}, {rating}, {count}, {n}, {issues} are filled in for you.
//  • To add a language: copy the whole `en: { … }` block, paste it below `hi`,
//    change the key (e.g. `bn:`), and translate the values. Anything you leave
//    out falls back to English. The language toggle picks it up automatically.
// ============================================================================

// Which quick-tag chips are shown, and in what order. The ids must match the
// `tags` entries inside each language below.
export const tagGroups = {
  positive: ['genuine', 'fairPrice', 'fastService', 'helpfulStaff', 'accessories', 'repairSetup', 'warranty'], // 4–5★
  negative: ['longWait', 'highPrice', 'productIssue', 'unhelpfulStaff', 'outOfStock', 'repairProblem', 'warrantyIssue'], // 1–3★
};

export const strings = {
  en: {
    langName: 'English',
    langLabel: 'Language',

    // Header (tagline comes from shop.config.js unless you set `tagline` here)
    trustLine: 'Loved by customers in {city}',
    ratingSummary: '{rating} ★ · {count} Google reviews',

    // Star rating
    rateTitle: 'How was your visit?',
    rateHint: 'Tap a star to rate',
    starLabel: '{n} out of 5 stars',
    ratingWords: ['', 'Poor', 'Not great', 'Okay', 'Good', 'Excellent'],
    rateNote: "These stars only help us suggest words. You'll choose your actual rating on Google.",

    // Quick tags
    likedTitle: 'What did you like?',
    wrongTitle: 'What went wrong?',
    tagsHint: 'Pick any that apply (optional)',
    tags: {
      genuine: { label: 'Genuine products', phrase: 'the products are genuine' },
      fairPrice: { label: 'Fair price', phrase: 'the prices are fair' },
      fastService: { label: 'Fast service', phrase: 'the service was quick' },
      helpfulStaff: { label: 'Helpful staff', phrase: 'the staff were helpful' },
      accessories: { label: 'Wide accessories range', phrase: 'there is a wide range of accessories' },
      repairSetup: { label: 'Easy repair/setup', phrase: 'the repair and setup were easy' },
      warranty: { label: 'Warranty support', phrase: 'the warranty support is good' },

      longWait: { label: 'Long wait', phrase: 'I had to wait a long time' },
      highPrice: { label: 'Price felt high', phrase: 'the price felt high' },
      productIssue: { label: 'Product issue', phrase: 'there was a problem with the product' },
      unhelpfulStaff: { label: 'Staff not helpful', phrase: 'the staff were not very helpful' },
      outOfStock: { label: 'Item not available', phrase: 'what I needed was not in stock' },
      repairProblem: { label: 'Repair/setup problem', phrase: 'the repair or setup did not go well' },
      warrantyIssue: { label: 'Warranty/return issue', phrase: 'I had trouble with a warranty or return' },
    },

    // Suggested review text. Built as: opener + tag phrases + closer.
    suggestBtn: 'Suggest review text',
    draftLabel: 'Your review',
    draftNote: 'Just a starting point. Please edit it so it reflects your real experience.',
    draftPlaceholder: 'Write a few words about your visit…',
    rebuildBtn: 'Rebuild from tags',
    copyOpenBtn: 'Copy & open Google Review',
    copyOpenNote: 'We copy your text. Paste it on the next screen.',
    copiedToast: 'Copied — paste it on the next screen',
    copyFailedToast: "Couldn't copy automatically. Please select the text and copy it.",
    draft: {
      openers: ['', 'Poor experience at {shop}.', 'Not a great experience at {shop}.', 'Mixed experience at {shop}.', 'Good experience at {shop}.', 'Great experience at {shop}.'],
      closers: ['', 'Hope they can fix this.', 'Hope they can fix this.', 'Hope they can improve this.', 'Would recommend.', 'Would recommend.'],
      and: 'and',
      stop: '.',
    },

    // Private feedback (shown in addition to the Google button for 1–3★)
    privateTitle: 'Tell us privately so we can fix it',
    privateBody: "Message {shop} directly and we'll do our best to make it right. This is optional. You're always welcome to post your honest review on Google too.",
    privateBtn: 'Message us on WhatsApp',
    privateMessage: 'Hi {shop}, I rated my visit {rating}/5.',
    privateIssues: 'What went wrong: {issues}.',
    privateMore: 'Details:',

    // Main button
    openReviewBtn: 'Open Google Review',
    ctaNote: 'Opens the "Write a review" screen on Google',
    inAppHint: 'Opened inside an app? If Google asks you to sign in, open this page in your browser using the ⋮ or ··· menu.',
    openInChrome: 'Open in Chrome',
    notConfiguredToast: "The Google review link isn't set up yet. Please ask the shop.",
    setupBanner: 'Setup needed: add your reviewUrl or placeId in shop.config.js. The Google button will not work until then. See README.',

    // Helper links
    helpersLabel: 'Contact the shop',
    call: 'Call',
    whatsapp: 'WhatsApp',
    directions: 'Directions',
    instagram: 'Instagram',
    whatsappHello: 'Hi {shop}, ',
  },

  hi: {
    langName: 'हिन्दी',
    langLabel: 'भाषा',

    tagline: 'फ़ोन और एक्सेसरीज़',
    trustLine: '{city} के ग्राहकों की पसंद',
    ratingSummary: '{rating} ★ · {count} Google रिव्यू',

    rateTitle: 'आपका अनुभव कैसा रहा?',
    rateHint: 'रेटिंग देने के लिए स्टार पर टैप करें',
    starLabel: '5 में से {n} स्टार',
    ratingWords: ['', 'खराब', 'अच्छा नहीं', 'ठीक-ठाक', 'अच्छा', 'बहुत बढ़िया'],
    rateNote: 'ये स्टार सिर्फ़ शब्द सुझाने के लिए हैं। असली रेटिंग आप Google पर देंगे।',

    likedTitle: 'आपको क्या अच्छा लगा?',
    wrongTitle: 'क्या गड़बड़ हुई?',
    tagsHint: 'जो लागू हों, चुनें (वैकल्पिक)',
    tags: {
      genuine: { label: 'असली प्रोडक्ट', phrase: 'प्रोडक्ट असली हैं' },
      fairPrice: { label: 'सही दाम', phrase: 'दाम सही हैं' },
      fastService: { label: 'तेज़ सर्विस', phrase: 'सर्विस तेज़ थी' },
      helpfulStaff: { label: 'मददगार स्टाफ़', phrase: 'स्टाफ़ ने अच्छे से मदद की' },
      accessories: { label: 'एक्सेसरीज़ की बड़ी रेंज', phrase: 'एक्सेसरीज़ की अच्छी रेंज है' },
      repairSetup: { label: 'आसान रिपेयर/सेटअप', phrase: 'रिपेयर और सेटअप आसानी से हो गया' },
      warranty: { label: 'वारंटी सपोर्ट', phrase: 'वारंटी सपोर्ट अच्छा है' },

      longWait: { label: 'लंबा इंतज़ार', phrase: 'मुझे काफ़ी देर इंतज़ार करना पड़ा' },
      highPrice: { label: 'दाम ज़्यादा लगे', phrase: 'दाम ज़्यादा लगे' },
      productIssue: { label: 'प्रोडक्ट में दिक्कत', phrase: 'प्रोडक्ट में दिक्कत थी' },
      unhelpfulStaff: { label: 'स्टाफ़ ने मदद नहीं की', phrase: 'स्टाफ़ ने ठीक से मदद नहीं की' },
      outOfStock: { label: 'सामान उपलब्ध नहीं', phrase: 'जो चाहिए था वह स्टॉक में नहीं था' },
      repairProblem: { label: 'रिपेयर/सेटअप में दिक्कत', phrase: 'रिपेयर या सेटअप ठीक से नहीं हुआ' },
      warrantyIssue: { label: 'वारंटी/रिटर्न में दिक्कत', phrase: 'वारंटी या रिटर्न में परेशानी हुई' },
    },

    suggestBtn: 'रिव्यू का टेक्स्ट सुझाएँ',
    draftLabel: 'आपका रिव्यू',
    draftNote: 'यह सिर्फ़ एक शुरुआत है। इसे बदलकर अपना असली अनुभव लिखें।',
    draftPlaceholder: 'अपनी विज़िट के बारे में कुछ शब्द लिखें…',
    rebuildBtn: 'टैग से दोबारा बनाएँ',
    copyOpenBtn: 'कॉपी करें और Google रिव्यू खोलें',
    copyOpenNote: 'आपका टेक्स्ट कॉपी हो जाएगा। अगली स्क्रीन पर पेस्ट करें।',
    copiedToast: 'कॉपी हो गया — अगली स्क्रीन पर पेस्ट करें',
    copyFailedToast: 'अपने-आप कॉपी नहीं हुआ। कृपया टेक्स्ट चुनकर कॉपी करें।',
    draft: {
      openers: ['', '{shop} पर अनुभव खराब रहा।', '{shop} पर अनुभव अच्छा नहीं रहा।', '{shop} पर अनुभव ठीक-ठाक रहा।', '{shop} पर अच्छा अनुभव रहा।', '{shop} पर बहुत अच्छा अनुभव रहा।'],
      closers: ['', 'उम्मीद है इसे ठीक किया जाएगा।', 'उम्मीद है इसे ठीक किया जाएगा।', 'उम्मीद है इसमें सुधार होगा।', 'आप भी ज़रूर आज़माएँ।', 'आप भी ज़रूर आज़माएँ।'],
      and: 'और',
      stop: '।',
    },

    privateTitle: 'हमें निजी तौर पर बताएँ, ताकि हम इसे ठीक कर सकें',
    privateBody: 'सीधे {shop} को मैसेज करें, हम इसे ठीक करने की पूरी कोशिश करेंगे। यह वैकल्पिक है। आप Google पर अपना सच्चा रिव्यू भी ज़रूर लिख सकते हैं।',
    privateBtn: 'WhatsApp पर मैसेज करें',
    privateMessage: 'नमस्ते {shop}, मैंने अपनी विज़िट को {rating}/5 रेटिंग दी।',
    privateIssues: 'क्या गड़बड़ हुई: {issues}।',
    privateMore: 'और जानकारी:',

    openReviewBtn: 'Google रिव्यू खोलें',
    ctaNote: 'Google पर "रिव्यू लिखें" स्क्रीन खुलेगी',
    inAppHint: 'किसी ऐप के अंदर खुला है? अगर Google साइन-इन माँगे, तो ⋮ या ··· मेन्यू से यह पेज ब्राउज़र में खोलें।',
    openInChrome: 'Chrome में खोलें',
    notConfiguredToast: 'Google रिव्यू लिंक अभी सेट नहीं है। कृपया दुकान पर बताएँ।',

    helpersLabel: 'दुकान से संपर्क करें',
    call: 'कॉल',
    whatsapp: 'WhatsApp',
    directions: 'रास्ता',
    instagram: 'Instagram',
    whatsappHello: 'नमस्ते {shop}, ',
  },
};

// Text printed on the QR counter card and packaging stickers (qr.html).
// Both lines are printed so English and Hindi readers are covered.
export const printText = {
  cardTitle: 'How was your visit?',
  cardTitleAlt: 'आपका अनुभव कैसा रहा?',
  cardAction: 'Scan to review us on Google',
  cardActionAlt: 'स्कैन करें और Google पर रिव्यू दें',
  cardFoot: 'Takes about a minute',
  sticker: 'Rate your visit on Google',
};
