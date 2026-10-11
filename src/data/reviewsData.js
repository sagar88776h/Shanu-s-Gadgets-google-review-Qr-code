// Review templates, seed data, and dynamic generation engine
export const BUSINESS_INFO = {
  name: "Shanu's Gadgets",
  tagline: "Pre-owned iPhones, Android Phones & New Accessories",
  location: "Agartala-Kamalasagar Road, Madhupur Bazar, West Tripura - 799102",
  phone: "7005838381",
  whatsapp: "917005838381",
  rating: "4.9",
  reviewCount: "128+",
  googleReviewUrl: "https://share.google/IpLBwbsm6F8jadyfW",
};

export const CATEGORIES = [
  { id: "iphone", label: "📱 Pre-owned iPhone", en: "pre-owned iPhone", bn: "আইফোন (iPhone)", hi: "pre-owned iPhone" },
  { id: "android", label: "🤖 Android Smartphone", en: "Android phone", bn: "স্মার্টফোন", hi: "Android smartphone" },
  { id: "accessories", label: "⚡ Fast Charger / Cable", en: "original charger and accessories", bn: "অরিজিনাল চার্জার ও অ্যাক্সেসরিজ", hi: "original charger aur accessories" },
  { id: "protection", label: "🛡️ Case & Tempered Glass", en: "premium case & tempered glass", bn: "ব্যাক কভার ও টেম্পার্ড গ্লাস", hi: "premium cover aur tempered glass" },
  { id: "repair", label: "🔧 Screen / Battery Service", en: "display repair & service", bn: "ডিসপ্লে ও ব্যাটারি সার্ভিস", hi: "display aur repair service" },
  { id: "exchange", label: "🔄 Phone Exchange Deal", en: "phone exchange deal", bn: "ফোন এক্সচেঞ্জ অফার", hi: "phone exchange offer" },
];

export const HIGHLIGHTS = [
  { id: "genuine", label: "💎 100% Genuine Condition", en: "phone is in pristine condition like brand new", bn: "একদম ১০০% জেনুইন কন্ডিশন, নতুনের মতো", hi: "phone bilkul new jaisa condition me mila" },
  { id: "price", label: "💰 Unbeatable Fair Price", en: "honest pricing with no hidden charges", bn: "মধুরপুরের মধ্যে সবচেয়ে ভালো ও ন্যায্য দাম", hi: "bazar se kafi sasta aur genuine rate" },
  { id: "hospitality", label: "🤝 Friendly & Honest Owner", en: "Shanu da is extremely polite, humble, and guides customers genuinely", bn: "শানুর ব্যবহার এবং গাইডেন্স অসাধারণ", hi: "Shanu bhai ka nature aur guidance lajawab hai" },
  { id: "speed", label: "⚡ Fast Testing & Billing", en: "quick testing, original bill, and smooth handover", bn: "খুব দ্রুত টেস্টিং এবং বিল সহ ডেলিভারি", hi: "turant testing aur proper bill ke sath delivery" },
  { id: "warranty", label: "📜 Trust & Guarantee", en: "gives full testing warranty and complete peace of mind", bn: "ওয়ারেন্টি ও বিশ্বাসের সাথে সার্ভিস", hi: "full testing warranty aur bharosemand service" },
];

export const LANGUAGES = [
  { id: "en", label: "🇬🇧 English", name: "English" },
  { id: "bn", label: "🇧🇩 বাংলা", name: "Bengali" },
  { id: "hi", label: "🇮🇳 हिंदी", name: "Hindi" },
  { id: "hinglish", label: "💬 Hinglish", name: "Hinglish" },
];

export const TONES = [
  { id: "enthusiastic", label: "🔥 Enthusiastic & Detailed" },
  { id: "concise", label: "⚡ Short & Impactful" },
  { id: "trust", label: "💎 Value & Trust Focus" },
];

/**
 * Generates dynamic, varied review suggestions based on selected categories, highlights, language, and tone.
 */
export function generateReviewSuggestions({ categories = [], highlights = [], language = "en", tone = "enthusiastic" }) {
  const selectedCatNames = categories.length > 0 
    ? categories.map(c => c.label.replace(/^[^\s]+\s*/, "")) 
    : ["phone & accessories"];
  
  const catTextEn = selectedCatNames.join(" and ");

  if (language === "bn") {
    return generateBengaliReviews(categories, highlights, tone);
  } else if (language === "hi") {
    return generateHindiReviews(categories, highlights, tone);
  } else if (language === "hinglish") {
    return generateHinglishReviews(categories, highlights, tone);
  } else {
    return generateEnglishReviews(catTextEn, highlights, tone);
  }
}

function generateEnglishReviews(catText, highlights, tone) {
  if (tone === "concise") {
    return [
      `Best tech shop in Madhupur! Purchased ${catText} at an unbeatable price. 100% genuine condition and Shanu is very humble. Highly recommend! ⭐⭐⭐⭐⭐`,
      `Awesome experience at Shanu's Gadgets! Super fast service, authentic products with proper bills. If you need reliable phones in Tripura, visit here.`,
      `Got my ${catText} from Shanu's Gadgets. Completely satisfied with the condition and honest pricing. 5 stars all the way!`,
      `Top-notch quality and trustworthy service in Madhupur. Shanu da provides genuine testing warranty and great advice. Thank you!`
    ];
  }

  if (tone === "trust") {
    return [
      `Finding trustworthy pre-owned smartphones and genuine accessories in West Tripura used to be tough, but Shanu's Gadgets changed that! Bought ${catText} today—everything is thoroughly checked, verified, and comes with testing peace of mind. Shanu da is honest and transparent. Truly a 5-star experience! ⭐⭐⭐⭐⭐`,
      `I always buy my gadgets and ${catText} from Shanu's Gadgets Madhupur. They never compromise on quality or authenticity. Proper billing, crystal-clear pricing, and zero false promises. Best dealer on Agartala-Kamalasagar Road!`,
      `Shanu's Gadgets is the most reliable mobile store in Madhupur. Got ${catText} in mint condition. The honesty in their pricing and customer support makes them stand out from the rest. Highly recommended!`,
      `Reliable, authentic, and customer-first! Purchased ${catText} and the owner explained everything patiently with full transparency. 100% genuine store in Tripura!`
    ];
  }

  // enthusiastic / default
  return [
    `Had a fantastic experience at Shanu's Gadgets in Madhupur! Picked up ${catText} and the condition is like brand new. Shanu da is extremely polite, guides you honestly, and offers prices you won't find anywhere else in Tripura. 10/10 recommended! ⭐⭐⭐⭐⭐`,
    `If you're looking for pre-owned iPhones, Android phones, or original accessories, Shanu's Gadgets is hands down the best place! Got my ${catText} in pristine condition. Fast testing, great behavior, and unbeatable value!`,
    `Super happy with my purchase of ${catText} from Shanu's Gadgets! The phone feels fresh out of the box, battery health is great, and the deal was incredible. Big thanks to Shanu da for the warm hospitality!`,
    `One of the best mobile shops around Kamalasagar & Madhupur! Great collection of ${catText}, genuine warranty, and friendly service. Do visit Shanu's Gadgets if you want a reliable gadget at the best rate!`
  ];
}

function generateBengaliReviews(categories, highlights, tone) {
  const item = categories.length > 0 ? categories[0].bn : "ফোন ও অ্যাক্সেসরিজ";

  if (tone === "concise") {
    return [
      `মধুরপুরের সেরা গ্যাজেট শপ! শানুর গ্যাজেট থেকে ${item} নিলাম, একদম নতুনের মতো কন্ডিশন। দাদার ব্যবহার খুব ভালো এবং দামও ন্যায্য। ৫ স্টার! ⭐⭐⭐⭐⭐`,
      `দারুণ অভিজ্ঞতা! খুব কম দামে অরিজিনাল ${item} পেলাম। শানু দাদার ব্যবহার ও সার্ভিস দারুণ। সবাইকে আসার অনুরোধ রইলো।`,
      `একদম ১০০% জেনুইন প্রোডাক্ট ও বিশ্বস্ত দোকান। মধুরপুরে গ্যাজেটের জন্য শানুর গ্যাজেটের কোনো তুলনা নেই।`,
      `শানুর গ্যাজেট থেকে জিনিস নিয়ে খুব খুশি। ভালো কোয়ালিটি, টেস্টিং ওয়ারেন্টি এবং সঠিক দাম। ধন্যবাদ শানু দা!`
    ];
  }

  return [
    `শানুর গ্যাজেট (Madhupur) থেকে ${item} কিনলাম। ফোনটার কন্ডিশন একদম ফ্রেশ এবং ১০০% অরিজিনাল। আগরতলা-কমলাসাগর রোডের মধ্যে সবচেয়ে বিশ্বস্ত মোবাইল শপ। শানু দাদার নম্র ব্যবহার আর সৎ পরামর্শ মন জয় করে নিয়েছে। সবাইকে সাজেস্ট করছি! ⭐⭐⭐⭐⭐`,
    `পুরনো আইফোন বা প্রি-ওনড অ্যান্ড্রয়েড নেওয়ার জন্য শানুর গ্যাজেট সেরা জায়গা। আমি ${item} নিয়েছি, কোয়ালিটি যেমন ভালো দামও তেমনই সস্তা। টেস্টিং ওয়ারেন্টি এবং বিল সহ পেয়েছি। দারুণ সার্ভিস!`,
    `মধুরপুরে এত ভালো গ্যাজেট ও অ্যাক্সেসরিজের কালেকশন ভাবাই যায় না। শানু দাদা প্রতিটি জিনিস বুঝিয়ে দিয়েছেন। প্রোডাক্টের কন্ডিশন জেনুইন এবং দামও খুব রিজনেবল। নিশ্চিন্তে সবাই আসতে পারেন।`,
    `খুবই সন্তুষ্ট শানুর গ্যাজেটের সার্ভিসে! ${item} একদম নতুনের মতো কাজ করছে। ভালো ডিল ও মিষ্টি ব্যবহারের জন্য অনেক ধন্যবাদ শানু দা!`
  ];
}

function generateHindiReviews(categories, highlights, tone) {
  const item = categories.length > 0 ? categories[0].hi : "phone aur accessories";

  if (tone === "concise") {
    return [
      `Madhupur me sabse best gadget shop! Shanu's Gadgets se ${item} liya, condition bilkul new jaisa hai aur rate bhi bahut sahi. 5 Stars! ⭐⭐⭐⭐⭐`,
      `Shanu bhai ka nature aur service bahut hi badhiya hai. 100% genuine products aur fast delivery. Must visit shop in Tripura!`,
      `Superb deal on ${item}! Bilkul original aur transparent pricing. Madhupur me mobile lene ke liye best jagah.`,
      `Ekdum mast experience raha. Proper bill aur testing warranty ke sath saman mila. Shanu's Gadgets is the best!`
    ];
  }

  return [
    `Shanu's Gadgets Madhupur se ${item} liya, condition ekdum brand new jaisa hai! Shanu bhai ka nature bahut polite aur honest hai, bina kisi jhanjhat ke best rate me deal mili. Pure Tripura me aisa trusted gadget store milna mushkil hai. Highly recommended! ⭐⭐⭐⭐⭐`,
    `Agar aapko pre-owned iPhone ya Android phone chahiye toh Shanu's Gadgets se better koi shop nahi hai. ${item} ki condition 100% authentic hai aur battery health bhi top-notch hai. Thank you Shanu bhai!`,
    `Kamalasagar Road par sabse trusted mobile shop! Honest guidance, fair price aur genuine warranty. ${item} lekar poori tarah satisfied hoon. Sabhi ko yaha aane ki salah dunga!`,
    `Bahut hi lajawab service! Customer ko acche se guide karte hain aur best price dete hain. ${item} ke liye best store. 5/5 stars for Shanu's Gadgets!`
  ];
}

function generateHinglishReviews(categories, highlights, tone) {
  const item = categories.length > 0 ? categories[0].label.replace(/^[^\s]+\s*/, "") : "gadget";
  return [
    `Just bought ${item} from Shanu's Gadgets Madhupur. Phone condition is literally 10/10 like brand new! Shanu bro is super chill and honest with pricing. Best mobile store in the area! ⭐⭐⭐⭐⭐`,
    `Super happy with my ${item} purchase! Genuine product, proper testing, and best price in Tripura. Shanu da's customer support is top tier. Highly recommended!`,
    `Got an insane deal on ${item} at Shanu's Gadgets! No fake promises, pure quality and warranty. If you need phones or accessories, definitely check them out!`,
    `Best experience ever at Shanu's Gadgets! Super fast service, 100% authentic condition and very reasonable pricing. 5 stars easily!`
  ];
}
