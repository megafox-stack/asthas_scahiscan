import React, { useMemo, useState } from "react";

const SUGAR_IMAGE = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160"><rect width="240" height="160" fill="#fff4d6"/><rect x="38" y="58" width="48" height="42" rx="5" fill="#fff" stroke="#dfc78d" stroke-width="3"/><rect x="96" y="42" width="52" height="48" rx="5" fill="#fff" stroke="#dfc78d" stroke-width="3"/><rect x="153" y="67" width="48" height="40" rx="5" fill="#fff" stroke="#dfc78d" stroke-width="3"/><path d="M43 63h38M101 47h42M158 72h38" stroke="#fff" stroke-width="5" opacity=".9"/></svg>`);
const SALT_IMAGE = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160"><rect width="240" height="160" fill="#edf5f8"/><path d="M73 68h94l-9 64H82z" fill="#fff" stroke="#abc0c8" stroke-width="3"/><path d="M66 68h108l-12-18H78z" fill="#7fa2ae" stroke="#587d89" stroke-width="3"/><path d="M88 50h64l-7-25H95z" fill="#dbe8eb" stroke="#587d89" stroke-width="3"/><circle cx="106" cy="88" r="3" fill="#9ab3ba"/><circle cx="126" cy="104" r="3" fill="#9ab3ba"/><circle cx="144" cy="84" r="3" fill="#9ab3ba"/><circle cx="118" cy="121" r="3" fill="#9ab3ba"/></svg>`);
const IMAGE_FALLBACK = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160"><rect width="240" height="160" fill="#eef3f0"/><rect x="58" y="38" width="124" height="84" rx="12" fill="#fff" stroke="#bfd1c8" stroke-width="4"/><path d="M82 101l24-25 18 18 16-14 24 21" fill="none" stroke="#7da594" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="63" r="8" fill="#ef755f"/></svg>`);

const PRODUCTS = {
  "8901234567890": {
    id: "8901234567890",
    name: "ABC Multigrain Crackers",
    brand: "ABC Foods",
    category: "Biscuits & Crackers",
    manufacturer: "ABC Foods India Pvt. Ltd.",
    fssai: "Verified · 10012345000123",
    image: "🥨",
    nutrition: {
      sodium: 890,
      sugar: 3.1,
      carbs: 62,
      fat: 14,
      satFat: 5.2,
      energy: 430
    },
    ingredients: [
      { name: "Whole wheat flour", type: "green", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&q=80", note: "Main cereal ingredient declared on the label." },
      { name: "Vegetable oil", type: "yellow", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=240&q=80", note: "Fat source declared on the label." },
      { name: "Sugar", type: "yellow", image: SUGAR_IMAGE, note: "Relevant to profiles that set an added-sugar preference." },
      { name: "Salt", type: "red", image: SALT_IMAGE, note: "Contributes to the product's sodium value." },
      { name: "INS 322 · Lecithins", type: "blue", image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=240&q=80", note: "An emulsifier used to help ingredients remain mixed and stable." },
      { name: "Milk solids", type: "purple", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=240&q=80", note: "Declared milk allergen." }
    ],
    reports: { total: 4, spoilage: 3, foreignObject: 1 },
    alternatives: [
      { name: "ABC Low-Sodium Crackers", sodium: 310, sugar: 3.4, verdict: "AGREED" },
      { name: "Daily Grain Lite Crackers", sodium: 360, sugar: 4.1, verdict: "AGREED" },
      { name: "Harvest Multigrain Bites", sodium: 395, sugar: 2.9, verdict: "AGREED" }
    ]
  },
  "8909876543210": {
    id: "8909876543210",
    name: "Harvest Oats & Seeds",
    brand: "Harvest",
    category: "Breakfast Cereal",
    manufacturer: "Harvest Foods India",
    fssai: "Verified · 10098765000421",
    image: "🥣",
    nutrition: {
      sodium: 240,
      sugar: 5.8,
      carbs: 58,
      fat: 9,
      satFat: 2.1,
      energy: 385
    },
    ingredients: [
      { name: "Whole oats", type: "green", note: "Primary cereal ingredient." },
      { name: "Pumpkin seeds", type: "green", note: "Seed ingredient declared on the label." },
      { name: "Jaggery", type: "yellow", note: "Sweetening ingredient declared on the label." },
      { name: "Sunflower oil", type: "yellow", note: "Declared fat source." },
      { name: "INS 322 · Lecithins", type: "blue", note: "Emulsifier used for stability." }
    ],
    reports: { total: 1, spoilage: 1, foreignObject: 0 },
    alternatives: [
      { name: "ABC Oats Daily", sodium: 210, sugar: 4.2, verdict: "AGREED" },
      { name: "Morning Grain Mix", sodium: 280, sugar: 5.1, verdict: "AGREED" }
    ]
  }
};

const SCAN_RESULTS = [
  PRODUCTS["8901234567890"],
  {
    ...PRODUCTS["8901234567890"],
    resultType: "AGREED",
    name: "ABC Multigrain Crackers · Low Salt Batch",
    nutrition: { sodium: 400, sugar: 3.3, carbs: 61, fat: 13.6, satFat: 5.0, energy: 425 }
  },
  {
    ...PRODUCTS["8901234567890"],
    resultType: "UNCLEAR",
    name: "ABC Multigrain Crackers · Partial Label",
    nutrition: { sodium: 100, sugar: 3.0, carbs: 63, fat: 14.2, satFat: 5.1, energy: 428 }
  }
];

const INITIAL_PROFILES = [
  { id: "me", name: "Me", icon: "🙂", template: "Custom", sodium: 600, sugar: 10 },
  { id: "amma", name: "Amma", icon: "👩", template: "Elderly", sodium: 400, sugar: 10 },
  { id: "child", name: "Child", icon: "🧒", template: "Child", sodium: 700, sugar: 12 }
];

const LANGUAGE_OPTIONS = [
  ["EN", "English"],
  ["HI", "हिंदी"],
  ["KN", "ಕನ್ನಡ"],
  ["TE", "తెలుగు"],
  ["TA", "தமிழ்"]
];

const UI_TRANSLATIONS = {
  EN: {},
  HI: { home: "होम", scan: "उत्पाद स्कैन करें", dart: "खुला भोजन · DART", reports: "गुणवत्ता रिपोर्ट", currentProfile: "वर्तमान प्रोफ़ाइल", manageProfiles: "प्रोफ़ाइल प्रबंधित करें →", intelligence: "भारत-केंद्रित खाद्य जानकारी", knowFood: "अपने भोजन को जानें।", knowFoodSub: "अपने लिए या घर में सभी के लिए।", verified: "सत्यापित खाद्य जानकारी, सरल भाषा में और चुनी गई प्रोफ़ाइल के अनुसार।", scanProduct: "⌁ उत्पाद स्कैन करें", looseFood: "◉ खुला भोजन जांचें", checkDate: "तारीख जांचें। सील जांचें।", snapCode: "कोड का फोटो लें।", recentActions: "हाल की गतिविधियां", whatCheck: "आप क्या जांचना चाहते हैं?", nutrition: "पोषण", labelSays: "लेबल पर क्या लिखा है", scanResult: "स्कैन परिणाम", scanAnother: "↻ दूसरा स्कैन", ingredientIntelligence: "सामग्री जानकारी", tapIngredient: "किसी सामग्री पर टैप करें → क्यों?", alternatives: "इस प्रोफ़ाइल के लिए बेहतर विकल्प", quality: "गुणवत्ता", recentReports: "हाल की रिपोर्ट", profiles: "प्रोफ़ाइल", addProfile: "+ प्रोफ़ाइल जोड़ें", language: "भाषा", online: "● ऑनलाइन", why: "क्यों?", source: "स्रोत" },
  KN: { home: "ಮುಖಪುಟ", scan: "ಉತ್ಪನ್ನ ಸ್ಕ್ಯಾನ್", dart: "ಸಡಿಲ ಆಹಾರ · DART", reports: "ಗುಣಮಟ್ಟದ ವರದಿಗಳು", currentProfile: "ಪ್ರಸ್ತುತ ಪ್ರೊಫೈಲ್", manageProfiles: "ಪ್ರೊಫೈಲ್ ನಿರ್ವಹಿಸಿ →", intelligence: "ಭಾರತ-ಕೇಂದ್ರಿತ ಆಹಾರ ಮಾಹಿತಿ", knowFood: "ನಿಮ್ಮ ಆಹಾರವನ್ನು ತಿಳಿದುಕೊಳ್ಳಿ.", knowFoodSub: "ನಿಮಗಾಗಿ ಅಥವಾ ಮನೆಯಲ್ಲಿ ಎಲ್ಲರಿಗಾಗಿ.", verified: "ಪರಿಶೀಲಿಸಿದ ಆಹಾರ ಮಾಹಿತಿ, ಸರಳವಾಗಿ ಮತ್ತು ಆಯ್ಕೆ ಮಾಡಿದ ಪ್ರೊಫೈಲ್‌ಗೆ ಹೊಂದುವಂತೆ.", scanProduct: "⌁ ಉತ್ಪನ್ನ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", looseFood: "◉ ಸಡಿಲ ಆಹಾರ ಪರಿಶೀಲಿಸಿ", checkDate: "ದಿನಾಂಕ ಪರಿಶೀಲಿಸಿ. ಸೀಲ್ ಪರಿಶೀಲಿಸಿ.", snapCode: "ಕೋಡ್‌ನ ಚಿತ್ರ ತೆಗೆಯಿರಿ.", recentActions: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಗಳು", whatCheck: "ನೀವು ಏನು ಪರಿಶೀಲಿಸಲು ಬಯಸುತ್ತೀರಿ?", nutrition: "ಪೋಷಣೆ", labelSays: "ಲೇಬಲ್ ಏನು ಹೇಳುತ್ತದೆ", scanResult: "ಸ್ಕ್ಯಾನ್ ಫಲಿತಾಂಶ", scanAnother: "↻ ಮತ್ತೊಂದು ಸ್ಕ್ಯಾನ್", ingredientIntelligence: "ಪದಾರ್ಥ ಮಾಹಿತಿ", tapIngredient: "ಯಾವುದೇ ಪದಾರ್ಥವನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ → ಏಕೆ?", alternatives: "ಈ ಪ್ರೊಫೈಲ್‌ಗೆ ಉತ್ತಮ ಆಯ್ಕೆಗಳು", quality: "ಗುಣಮಟ್ಟ", recentReports: "ಇತ್ತೀಚಿನ ವರದಿಗಳು", profiles: "ಪ್ರೊಫೈಲ್‌ಗಳು", addProfile: "+ ಪ್ರೊಫೈಲ್ ಸೇರಿಸಿ", language: "ಭಾಷೆ", online: "● ಆನ್‌ಲೈನ್", why: "ಏಕೆ?", source: "ಮೂಲ" },
  TE: { home: "హోమ్", scan: "ఉత్పత్తిని స్కాన్ చేయండి", dart: "వదులుగా ఉన్న ఆహారం · DART", reports: "నాణ్యత నివేదికలు", currentProfile: "ప్రస్తుత ప్రొఫైల్", manageProfiles: "ప్రొఫైల్‌లను నిర్వహించండి →", intelligence: "భారతదేశ ఆహార సమాచారం", knowFood: "మీ ఆహారాన్ని తెలుసుకోండి.", knowFoodSub: "మీ కోసం లేదా ఇంట్లో అందరి కోసం.", verified: "ధృవీకరించిన ఆహార సమాచారం, సరళంగా మరియు మీరు ఎంచుకున్న ప్రొఫైల్‌కు సరిపోయేలా.", scanProduct: "⌁ ఉత్పత్తిని స్కాన్ చేయండి", looseFood: "◉ వదులుగా ఉన్న ఆహారాన్ని తనిఖీ చేయండి", checkDate: "తేదీని తనిఖీ చేయండి. సీల్‌ను తనిఖీ చేయండి.", snapCode: "కోడ్ ఫోటో తీయండి.", recentActions: "ఇటీవలి చర్యలు", whatCheck: "మీరు ఏమి తనిఖీ చేయాలనుకుంటున్నారు?", nutrition: "పోషణ", labelSays: "లేబుల్ ఏమి చెబుతోంది", scanResult: "స్కాన్ ఫలితం", scanAnother: "↻ మరొకసారి స్కాన్ చేయండి", ingredientIntelligence: "పదార్థ సమాచారం", tapIngredient: "ఏదైనా పదార్థాన్ని నొక్కండి → ఎందుకు?", alternatives: "ఈ ప్రొఫైల్‌కు మెరుగైన ఎంపికలు", quality: "నాణ్యత", recentReports: "ఇటీవలి నివేదికలు", profiles: "ప్రొఫైల్‌లు", addProfile: "+ ప్రొఫైల్ జోడించండి", language: "భాష", online: "● ఆన్‌లైన్", why: "ఎందుకు?", source: "మూలం" },
  TA: { home: "முகப்பு", scan: "தயாரிப்பை ஸ்கேன் செய்", dart: "திறந்த உணவு · DART", reports: "தர அறிக்கைகள்", currentProfile: "தற்போதைய சுயவிவரம்", manageProfiles: "சுயவிவரங்களை நிர்வகி →", intelligence: "இந்தியா சார்ந்த உணவு தகவல்", knowFood: "உங்கள் உணவை அறிந்து கொள்ளுங்கள்.", knowFoodSub: "உங்களுக்காக அல்லது வீட்டில் அனைவருக்காக.", verified: "சரிபார்க்கப்பட்ட உணவு தகவல், எளிமையாகவும் தேர்ந்தெடுத்த சுயவிவரத்திற்கேற்பவும்.", scanProduct: "⌁ தயாரிப்பை ஸ்கேன் செய்", looseFood: "◉ திறந்த உணவை சரிபார்", checkDate: "தேதியை சரிபார். சீலை சரிபார்.", snapCode: "குறியீட்டைப் படம் எடு.", recentActions: "சமீபத்திய செயல்கள்", whatCheck: "எதைச் சரிபார்க்க விரும்புகிறீர்கள்?", nutrition: "ஊட்டச்சத்து", labelSays: "லேபிள் கூறுவது", scanResult: "ஸ்கேன் முடிவு", scanAnother: "↻ மற்றொன்றை ஸ்கேன் செய்", ingredientIntelligence: "பொருள் தகவல்", tapIngredient: "எந்த பொருளையும் தட்டவும் → ஏன்?", alternatives: "இந்த சுயவிவரத்திற்கு சிறந்த தேர்வுகள்", quality: "தரம்", recentReports: "சமீபத்திய அறிக்கைகள்", profiles: "சுயவிவரங்கள்", addProfile: "+ சுயவிவரம் சேர்", language: "மொழி", online: "● ஆன்லைன்", why: "ஏன்?", source: "மூலம்" }
};

function t(language, key, fallback) {
  return UI_TRANSLATIONS[language]?.[key] || fallback;
}

const HOME_COPY = {
  EN: { profileAware: "Profile-aware", profileAwareText: "The same food can be interpreted differently for each selected profile.", explainable: "Explainable", explainableText: "See the value, threshold and source behind every disagreement.", looseFoodText: "Use an FSSAI DART-guided flow even when there is no barcode.", sahiSaathi: "Sahi Saathi", sahiSaathiText: "Tap or talk in English, Hindi, Kannada, Telugu or Tamil.", package: "Scan a packaged product", packageText: "Nutrition · ingredients · FSSAI identity", looseAction: "Check loose food", looseActionText: "FSSAI DART guidance", reportAction: "View quality reports", reportActionText: "Structured citizen + FSSAI signals" },
  HI: { profileAware: "प्रोफ़ाइल के अनुसार", profileAwareText: "चुनी गई प्रोफ़ाइल के अनुसार एक ही भोजन की अलग व्याख्या हो सकती है।", explainable: "समझने योग्य", explainableText: "हर असहमति का मूल्य, सीमा और स्रोत देखें।", looseFoodText: "बारकोड न होने पर भी FSSAI DART निर्देशित प्रक्रिया का उपयोग करें।", sahiSaathi: "सही साथी", sahiSaathiText: "हिंदी, अंग्रेज़ी, कन्नड़, तेलुगु या तमिल में पूछें या बोलें।", package: "पैक किया हुआ उत्पाद स्कैन करें", packageText: "पोषण · सामग्री · FSSAI पहचान", looseAction: "खुला भोजन जांचें", looseActionText: "FSSAI DART मार्गदर्शन", reportAction: "गुणवत्ता रिपोर्ट देखें", reportActionText: "संरचित नागरिक + FSSAI संकेत" },
  KN: { profileAware: "ಪ್ರೊಫೈಲ್ ಆಧಾರಿತ", profileAwareText: "ಆಯ್ಕೆ ಮಾಡಿದ ಪ್ರೊಫೈಲ್‌ಗೆ ಅನುಗುಣವಾಗಿ ಒಂದೇ ಆಹಾರವನ್ನು ವಿಭಿನ್ನವಾಗಿ ಅರ್ಥೈಸಬಹುದು.", explainable: "ವಿವರಣಾತ್ಮಕ", explainableText: "ಪ್ರತಿ ಭಿನ್ನಾಭಿಪ್ರಾಯದ ಮೌಲ್ಯ, ಮಿತಿ ಮತ್ತು ಮೂಲವನ್ನು ನೋಡಿ.", looseFoodText: "ಬಾರ್‌ಕೋಡ್ ಇಲ್ಲದಿದ್ದರೂ FSSAI DART ಮಾರ್ಗದರ್ಶನ ಬಳಸಿ.", sahiSaathi: "ಸಹಿ ಸಾಥಿ", sahiSaathiText: "ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ, ಕನ್ನಡ, ತೆಲುಗು ಅಥವಾ ತಮಿಳಿನಲ್ಲಿ ಕೇಳಿ ಅಥವಾ ಮಾತನಾಡಿ.", package: "ಪ್ಯಾಕ್ ಮಾಡಿದ ಉತ್ಪನ್ನ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", packageText: "ಪೋಷಣೆ · ಪದಾರ್ಥಗಳು · FSSAI ಗುರುತು", looseAction: "ಸಡಿಲ ಆಹಾರ ಪರಿಶೀಲಿಸಿ", looseActionText: "FSSAI DART ಮಾರ್ಗದರ್ಶನ", reportAction: "ಗುಣಮಟ್ಟದ ವರದಿಗಳನ್ನು ನೋಡಿ", reportActionText: "ರಚನಾತ್ಮಕ ನಾಗರಿಕ + FSSAI ಸಂಕೇತಗಳು" },
  TE: { profileAware: "ప్రొఫైల్ ఆధారితం", profileAwareText: "ఎంచుకున్న ప్రొఫైల్‌ను బట్టి ఒకే ఆహారాన్ని వేర్వేరుగా అర్థం చేసుకోవచ్చు.", explainable: "వివరణాత్మకం", explainableText: "ప్రతి వ్యత్యాసం వెనుక విలువ, పరిమితి మరియు మూలాన్ని చూడండి.", looseFoodText: "బార్‌కోడ్ లేకపోయినా FSSAI DART మార్గదర్శకాన్ని ఉపయోగించండి.", sahiSaathi: "సహి సాథీ", sahiSaathiText: "ఇంగ్లీష్, హిందీ, కన్నడ, తెలుగు లేదా తమిళంలో అడగండి లేదా మాట్లాడండి.", package: "ప్యాక్ చేసిన ఉత్పత్తిని స్కాన్ చేయండి", packageText: "పోషణ · పదార్థాలు · FSSAI గుర్తింపు", looseAction: "వదులుగా ఉన్న ఆహారాన్ని తనిఖీ చేయండి", looseActionText: "FSSAI DART మార్గదర్శకం", reportAction: "నాణ్యత నివేదికలను చూడండి", reportActionText: "నిర్మిత పౌర + FSSAI సంకేతాలు" },
  TA: { profileAware: "சுயவிவரத்திற்கு ஏற்றது", profileAwareText: "தேர்ந்தெடுத்த சுயவிவரத்தைப் பொறுத்து ஒரே உணவை வெவ்வேறு விதமாகப் புரிந்துகொள்ளலாம்.", explainable: "விளக்கமானது", explainableText: "ஒவ்வொரு முரண்பாட்டிற்கும் மதிப்பு, வரம்பு மற்றும் மூலத்தைப் பாருங்கள்.", looseFoodText: "பார்கோடு இல்லாவிட்டாலும் FSSAI DART வழிகாட்டுதலைப் பயன்படுத்துங்கள்.", sahiSaathi: "சஹி சாதி", sahiSaathiText: "ஆங்கிலம், இந்தி, கன்னடம், தெலுங்கு அல்லது தமிழில் கேளுங்கள் அல்லது பேசுங்கள்.", package: "பேக் செய்யப்பட்ட தயாரிப்பை ஸ்கேன் செய்", packageText: "ஊட்டச்சத்து · பொருட்கள் · FSSAI அடையாளம்", looseAction: "திறந்த உணவைச் சரிபார்", looseActionText: "FSSAI DART வழிகாட்டுதல்", reportAction: "தர அறிக்கைகளைப் பார்", reportActionText: "கட்டமைக்கப்பட்ட குடிமக்கள் + FSSAI குறியீடுகள்" }
};

const INGREDIENT_COPY = {
  EN: { explorer: "INGREDIENT EXPLORER", what: "What is it?", why: "Why is ASATAS showing it?", detected: "It was detected in the declared ingredient information and its relevance is determined by the selected profile and ingredient rules.", source: "Source: demo product dataset · official reference can be attached in the backend version.", description: name => name, legend: ["No conflict", "Preference relevant", "Additive", "Declared allergen", "Contributes to disagreement"], names: {} },
  HI: { explorer: "सामग्री विवरण", what: "यह क्या है?", why: "ASATAS इसे क्यों दिखा रहा है?", detected: "यह घोषित सामग्री की जानकारी में पाया गया है। इसकी प्रासंगिकता चुनी गई प्रोफ़ाइल और सामग्री नियमों के आधार पर तय होती है।", source: "स्रोत: डेमो उत्पाद डेटासेट · आधिकारिक संदर्भ बैकएंड संस्करण में जोड़ा जा सकता है।", description: name => `${name} लेबल पर घोषित सामग्री है।`, legend: ["कोई विरोध नहीं", "प्रोफ़ाइल के लिए प्रासंगिक", "एडिटिव", "घोषित एलर्जेन", "असहमति में योगदान"], names: { "Whole wheat flour": "साबुत गेहूं का आटा", "Vegetable oil": "वनस्पति तेल", Sugar: "चीनी", Salt: "नमक", "INS 322 · Lecithins": "INS 322 · लेसिथिन", "Milk solids": "दूध के ठोस पदार्थ" } },
  KN: { explorer: "ಪದಾರ್ಥ ವಿವರ", what: "ಇದು ಏನು?", why: "ASATAS ಇದನ್ನು ಏಕೆ ತೋರಿಸುತ್ತಿದೆ?", detected: "ಇದು ಘೋಷಿತ ಪದಾರ್ಥಗಳ ಮಾಹಿತಿಯಲ್ಲಿ ಪತ್ತೆಯಾಗಿದೆ. ಇದರ ಪ್ರಸ್ತುತತೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಪದಾರ್ಥ ನಿಯಮಗಳ ಆಧಾರದ ಮೇಲೆ ನಿರ್ಧರಿಸಲಾಗುತ್ತದೆ.", source: "ಮೂಲ: ಡೆಮೊ ಉತ್ಪನ್ನ ಡೇಟಾಸೆಟ್ · ಅಧಿಕೃತ ಉಲ್ಲೇಖವನ್ನು ಬ್ಯಾಕೆಂಡ್ ಆವೃತ್ತಿಯಲ್ಲಿ ಸೇರಿಸಬಹುದು.", description: name => `${name} ಲೇಬಲ್‌ನಲ್ಲಿ ಘೋಷಿಸಲಾದ ಪದಾರ್ಥವಾಗಿದೆ.`, legend: ["ವಿರೋಧವಿಲ್ಲ", "ಪ್ರೊಫೈಲ್‌ಗೆ ಸಂಬಂಧಿಸಿದೆ", "ಸಂಯೋಜಕ", "ಘೋಷಿತ ಅಲರ್ಜೆನ್", "ಭಿನ್ನಾಭಿಪ್ರಾಯಕ್ಕೆ ಕೊಡುಗೆ"], names: { "Whole wheat flour": "ಸಂಪೂರ್ಣ ಗೋಧಿ ಹಿಟ್ಟು", "Vegetable oil": "ಸಸ್ಯಜನ್ಯ ಎಣ್ಣೆ", Sugar: "ಸಕ್ಕರೆ", Salt: "ಉಪ್ಪು", "INS 322 · Lecithins": "INS 322 · ಲೆಸಿಥಿನ್‌ಗಳು", "Milk solids": "ಹಾಲಿನ ಘನ ಪದಾರ್ಥಗಳು" } },
  TE: { explorer: "పదార్థ వివరాలు", what: "ఇది ఏమిటి?", why: "ASATAS దీన్ని ఎందుకు చూపిస్తోంది?", detected: "ఇది ప్రకటించిన పదార్థాల సమాచారంలో గుర్తించబడింది. దీని ప్రాముఖ్యతను ఎంచుకున్న ప్రొఫైల్ మరియు పదార్థ నియమాల ఆధారంగా నిర్ణయిస్తారు.", source: "మూలం: డెమో ఉత్పత్తి డేటాసెట్ · అధికారిక సూచనను బ్యాకెండ్ వెర్షన్‌లో జోడించవచ్చు.", description: name => `${name} లేబుల్‌పై ప్రకటించిన పదార్థం.`, legend: ["విరోధం లేదు", "ప్రొఫైల్‌కు సంబంధించినది", "సంకలితం", "ప్రకటించిన అలర్జీ కారకం", "వ్యత్యాసానికి కారణం"], names: { "Whole wheat flour": "సంపూర్ణ గోధుమ పిండి", "Vegetable oil": "వెజిటబుల్ ఆయిల్", Sugar: "చక్కెర", Salt: "ఉప్పు", "INS 322 · Lecithins": "INS 322 · లెసిథిన్లు", "Milk solids": "పాల ఘన పదార్థాలు" } },
  TA: { explorer: "பொருள் விவரம்", what: "இது என்ன?", why: "ASATAS இதை ஏன் காட்டுகிறது?", detected: "இது அறிவிக்கப்பட்ட பொருள் தகவலில் கண்டறியப்பட்டது. இதன் தொடர்பு தேர்ந்தெடுத்த சுயவிவரம் மற்றும் பொருள் விதிகளின் அடிப்படையில் தீர்மானிக்கப்படுகிறது.", source: "மூலம்: டெமோ தயாரிப்பு தரவுத்தொகுப்பு · அதிகாரப்பூர்வ குறிப்பு பின்தள பதிப்பில் சேர்க்கலாம்.", description: name => `${name} லேபிளில் அறிவிக்கப்பட்ட பொருள்.`, legend: ["முரண்பாடு இல்லை", "சுயவிவரத்திற்கு தொடர்புடையது", "சேர்க்கை", "அறிவிக்கப்பட்ட ஒவ்வாமை பொருள்", "முரண்பாட்டிற்கு காரணம்"], names: { "Whole wheat flour": "முழு கோதுமை மாவு", "Vegetable oil": "தாவர எண்ணெய்", Sugar: "சர்க்கரை", Salt: "உப்பு", "INS 322 · Lecithins": "INS 322 · லெசித்தின்கள்", "Milk solids": "பால் திடப்பொருட்கள்" } }
};

const CHAT_COPY = {
  EN: { greeting: "Namaste. I am Sahi-Saath, your food and label assistant. Ask me about this product, an ingredient, nutrition, or food safety.", title: "Your food companion", subtitle: "Ask in your mother tongue. I will keep answers grounded in the information available here.", placeholder: "Ask Sahi-Saath anything...", send: "Send", voice: "Speak", listening: "Listening...", empty: "Start with a question about food, ingredients or your scan." },
  HI: { greeting: "नमस्ते। मैं सही-साथी हूं, आपका भोजन और लेबल सहायक। इस उत्पाद, किसी सामग्री, पोषण या खाद्य सुरक्षा के बारे में पूछें।", title: "आपका भोजन साथी", subtitle: "अपनी मातृभाषा में पूछें। मैं यहां उपलब्ध जानकारी के आधार पर जवाब दूंगा।", placeholder: "सही-साथी से कुछ पूछें...", send: "भेजें", voice: "बोलें", listening: "सुन रहा हूं...", empty: "भोजन, सामग्री या अपने स्कैन के बारे में सवाल से शुरू करें।" },
  KN: { greeting: "ನಮಸ್ಕಾರ. ನಾನು ಸಹಿ-ಸಾಥ್, ನಿಮ್ಮ ಆಹಾರ ಮತ್ತು ಲೇಬಲ್ ಸಹಾಯಕ. ಈ ಉತ್ಪನ್ನ, ಪದಾರ್ಥ, ಪೋಷಣೆ ಅಥವಾ ಆಹಾರ ಸುರಕ್ಷತೆ ಬಗ್ಗೆ ಕೇಳಿ.", title: "ನಿಮ್ಮ ಆಹಾರ ಸಂಗಾತಿ", subtitle: "ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ. ಇಲ್ಲಿ ಲಭ್ಯವಿರುವ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ ಉತ್ತರಿಸುತ್ತೇನೆ.", placeholder: "ಸಹಿ-ಸಾಥ್ ಅನ್ನು ಕೇಳಿ...", send: "ಕಳುಹಿಸಿ", voice: "ಮಾತನಾಡಿ", listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ...", empty: "ಆಹಾರ, ಪದಾರ್ಥಗಳು ಅಥವಾ ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಯಿಂದ ಪ್ರಾರಂಭಿಸಿ." },
  TE: { greeting: "నమస్కారం. నేను సహి-సాత్, మీ ఆహారం మరియు లేబుల్ సహాయకుడిని. ఈ ఉత్పత్తి, పదార్థం, పోషణ లేదా ఆహార భద్రత గురించి అడగండి.", title: "మీ ఆహార సహచరుడు", subtitle: "మీ మాతృభాషలో అడగండి. ఇక్కడ అందుబాటులో ఉన్న సమాచారంతో సమాధానం ఇస్తాను.", placeholder: "సహి-సాత్‌ను ఏదైనా అడగండి...", send: "పంపండి", voice: "మాట్లాడండి", listening: "వింటున్నాను...", empty: "ఆహారం, పదార్థాలు లేదా మీ స్కాన్ గురించి ప్రశ్నతో ప్రారంభించండి." },
  TA: { greeting: "வணக்கம். நான் சஹி-சாத், உங்கள் உணவு மற்றும் லேபிள் உதவியாளர். இந்த தயாரிப்பு, பொருள், ஊட்டச்சத்து அல்லது உணவு பாதுகாப்பு பற்றி கேளுங்கள்.", title: "உங்கள் உணவு துணை", subtitle: "உங்கள் தாய்மொழியில் கேளுங்கள். இங்கே உள்ள தகவலின் அடிப்படையில் பதிலளிப்பேன்.", placeholder: "சஹி-சாத்திடம் கேளுங்கள்...", send: "அனுப்பு", voice: "பேசுங்கள்", listening: "கேட்கிறேன்...", empty: "உணவு, பொருட்கள் அல்லது உங்கள் ஸ்கேன் பற்றி கேள்வியுடன் தொடங்குங்கள்." }
};

const SPEECH_LOCALES = { EN: "en-IN", HI: "hi-IN", KN: "kn-IN", TE: "te-IN", TA: "ta-IN" };

function App() {
  const [page, setPage] = useState("home");
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState("amma");
  const [product, setProduct] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [toast, setToast] = useState("");

  const profile = profiles.find(p => p.id === activeProfile) || profiles[0];

  const evaluate = (p, prof = profile) => {
    if (!p) return { verdict: "UNCLEAR", reason: "No product selected." };
    if (p.resultType === "UNCLEAR") {
      return { verdict: "UNCLEAR", reason: "The available label information is incomplete for a confident profile match." };
    }
    if (p.resultType === "AGREED") {
      return { verdict: "AGREED", reason: `The declared nutrition values match ${prof.name}'s configured preferences.` };
    }
    if (!p.nutrition || typeof p.nutrition.sodium !== "number") {
      return { verdict: "UNCLEAR", reason: "Nutrition information could not be verified." };
    }
    if (p.nutrition.sodium > prof.sodium) {
      return {
        verdict: "DISAGREED",
        reason: `Sodium is ${p.nutrition.sodium} mg/100 g, above ${prof.sodium} mg/100 g for ${prof.name}.`,
        nutrient: "Sodium",
        value: p.nutrition.sodium,
        threshold: prof.sodium
      };
    }
    if (p.nutrition.sugar > prof.sugar) {
      return {
        verdict: "DISAGREED",
        reason: `Sugar is ${p.nutrition.sugar} g/100 g, above ${prof.sugar} g/100 g for ${prof.name}.`,
        nutrient: "Sugar",
        value: p.nutrition.sugar,
        threshold: prof.sugar
      };
    }
    return {
      verdict: "AGREED",
      reason: `The declared nutrition values match ${prof.name}'s configured preferences.`
    };
  };

  const scan = (code = "8901234567890") => {
    setScanning(true);
    setToast("");
    setTimeout(() => {
      const found = code === "8901234567890"
        ? SCAN_RESULTS[Math.floor(Math.random() * SCAN_RESULTS.length)]
        : PRODUCTS[code] || SCAN_RESULTS[0];
      setProduct(found);
      setScanning(false);
      setPage("scan");
    }, 850);
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setToast("Speech output is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const addProfile = (name) => {
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setProfiles(prev => [...prev, { id, name, icon: "👤", template: "Custom", sodium: 600, sugar: 10 }]);
    setActiveProfile(id);
    setShowProfileModal(false);
    setToast(`${name} profile added`);
  };

  const verdict = evaluate(product);
  const ui = (key, fallback) => t(language, key, fallback);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <strong>ASATAS</strong>
            <span>Sahi Scan</span>
          </div>
        </div>

        <nav>
          <NavItem icon="⌂" label={ui("home", "Home")} active={page === "home"} onClick={() => setPage("home")} />
          <NavItem icon="⌁" label={ui("scan", "Scan Product")} active={page === "scan"} onClick={() => { if (product) setPage("scan"); else scan(); }} />
          <NavItem icon="◉" label={ui("dart", "Loose Food · DART")} active={page === "dart"} onClick={() => setPage("dart")} />
          <NavItem icon="⚑" label={ui("reports", "Quality Reports")} active={page === "reports"} onClick={() => setPage("reports")} />
        </nav>

        <div className="sidebar-bottom">
          <button className="profile-switch" onClick={() => setShowProfileModal(true)}>
            <span className="avatar">{profile.icon}</span>
            <span>
              <small>{ui("currentProfile", "Current profile")}</small>
              <b>{profile.name}</b>
            </span>
            <span>⌄</span>
          </button>
          <button className="text-btn" onClick={() => setPage("profiles")}>{ui("manageProfiles", "Manage profiles →")}</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="mobile-brand"><b>ASATAS</b><span>· Sahi Scan</span></div>
          <div className="top-actions">
            <div className="language-menu">
              <button className="language" aria-label="Change language" aria-expanded={languageOpen} onClick={() => setLanguageOpen(open => !open)}><b>{language}</b><span>⌄</span></button>
              {languageOpen && (
                <div className="language-dropdown">
                  {LANGUAGE_OPTIONS.map(([code, name]) => (
                    <button key={code} className={language === code ? "selected" : ""} onClick={() => { setLanguage(code); setLanguageOpen(false); setToast(`${name} selected`); }}><span>{name}</span>{language === code && <b>✓</b>}</button>
                  ))}
                </div>
              )}
            </div>
            <button className={`sahi-btn ${page === "chat" ? "active" : ""}`} onClick={() => { setLanguageOpen(false); setPage("chat"); }}><span>✦</span> SAHI-SAATH</button>
          </div>
        </header>

        {page === "home" && (
          <Home
            profile={profile}
            onScan={() => scan()}
            onDart={() => setPage("dart")}
            onReports={() => setPage("reports")}
            onProfiles={() => setPage("profiles")}
            language={language}
          />
        )}

        {page === "scan" && (
          <ScanPage
            product={product}
            scanning={scanning}
            profile={profile}
            verdict={verdict}
            onScan={() => scan()}
            onScanAnother={() => { setProduct(null); setScanning(false); setPage("scan"); }}
            onIngredient={setSelectedIngredient}
            onSpeak={() => speak(verdict.reason)}
            onAlternatives={() => document.getElementById("alternatives")?.scrollIntoView({ behavior: "smooth" })}
            language={language}
          />
        )}

        {page === "dart" && <DartPage onReport={() => setPage("reports")} language={language} />}
        {page === "reports" && <ReportsPage language={language} />}
        {page === "profiles" && (
          <ProfilesPage
            profiles={profiles}
            activeProfile={activeProfile}
            setActiveProfile={setActiveProfile}
            onAdd={() => setShowProfileModal(true)}
            language={language}
          />
        )}
        {page === "chat" && (
          <SahiSaathPage
            language={language}
            setLanguage={setLanguage}
            product={product}
            profile={profile}
          />
        )}

        {toast && <div className="toast">{toast}</div>}
      </main>

      <nav className="mobile-nav" aria-label="App navigation">
        <NavItem icon="⌂" label={ui("home", "Home")} active={page === "home"} onClick={() => setPage("home")} />
        <NavItem icon="⌁" label={ui("scan", "Scan")} active={page === "scan"} onClick={() => { if (product) setPage("scan"); else scan(); }} />
        <NavItem icon="◉" label={ui("dart", "DART")} active={page === "dart"} onClick={() => setPage("dart")} />
        <NavItem icon="⚑" label={ui("reports", "Reports")} active={page === "reports"} onClick={() => setPage("reports")} />
      </nav>

      {selectedIngredient && (
        <IngredientModal ingredient={selectedIngredient} language={language} onClose={() => setSelectedIngredient(null)} />
      )}

      {showVoice && (
        <VoiceModal onClose={() => setShowVoice(false)} onSpeak={speak} product={product} profile={profile} />
      )}

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onAdd={addProfile}
        />
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}><span>{icon}</span>{label}</button>;
}

function Home({ profile, onScan, onDart, onReports, onProfiles, language }) {
  const ui = (key, fallback) => t(language, key, fallback);
  const copy = HOME_COPY[language] || HOME_COPY.EN;
  return (
    <div className="content">
      <section className="hero">
        <div>
          <p className="eyebrow">{ui("intelligence", "INDIA-FIRST FOOD INTELLIGENCE")}</p>
          <h1>{ui("knowFood", "Know your food.")}<br /><em>{ui("knowFoodSub", "For yourself or everyone at home.")}</em></h1>
          <p className="hero-copy">{ui("verified", "Verified food information, explained simply and matched to the profile you choose.")}</p>
          <div className="hero-actions">
            <button className="primary-btn large" onClick={onScan}>{ui("scanProduct", "⌁ Scan product")}</button>
            <button className="secondary-btn large" onClick={onDart}>{ui("looseFood", "◉ Check loose food")}</button>
          </div>
        </div>
        <div className="hero-card">
          <div className="scan-visual"><span>▦</span></div>
          <div className="loading-tip">{ui("checkDate", "Check the date. Check the seal.")}<br /><b>{ui("snapCode", "Snap the code before the grab.")}</b></div>
        </div>
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">{ui("currentProfile", "CURRENT PROFILE")}</p>
          <h2>{profile.icon} {profile.name}</h2>
        </div>
        <button className="link-btn" onClick={onProfiles}>{ui("manageProfiles", "Manage profiles →")}</button>
      </section>

      <div className="quick-grid">
        <FeatureCard icon="🥗" title={copy.profileAware} text={copy.profileAwareText} />
        <FeatureCard icon="🔬" title={copy.explainable} text={copy.explainableText} />
        <FeatureCard icon="🌾" title={ui("looseFood", "Loose food")} text={copy.looseFoodText} />
        <FeatureCard icon="🗣️" title={copy.sahiSaathi} text={copy.sahiSaathiText} />
      </div>

      <section className="section-head mt">
        <div>
          <p className="eyebrow">{ui("recentActions", "RECENT ACTIONS")}</p>
          <h2>{ui("whatCheck", "What do you want to check?")}</h2>
        </div>
      </section>
      <div className="action-grid">
        <ActionCard title={copy.package} subtitle={copy.packageText} icon="📦" onClick={onScan} />
        <ActionCard title={copy.looseAction} subtitle={copy.looseActionText} icon="🥛" onClick={onDart} />
        <ActionCard title={copy.reportAction} subtitle={copy.reportActionText} icon="⚑" onClick={onReports} />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return <div className="feature-card"><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{text}</p></div>;
}

function ActionCard({ title, subtitle, icon, onClick }) {
  return <button className="action-card" onClick={onClick}><span>{icon}</span><div><b>{title}</b><small>{subtitle}</small></div><strong>→</strong></button>;
}

function ScanPage({ product, scanning, profile, verdict, onScan, onScanAnother, onIngredient, onSpeak, onAlternatives, language }) {
  const ui = (key, fallback) => t(language, key, fallback);
  const ingredientCopy = INGREDIENT_COPY[language] || INGREDIENT_COPY.EN;
  if (scanning || !product) {
    return (
      <div className="content scan-empty">
        <div className="scanner-box">
          <div className="scanner-icon">▦</div>
          <h1>{ui("scanProduct", "Scan a product")}</h1>
          <p>Point the camera at a barcode or supported 2D product code.</p>
          <button className="primary-btn" onClick={onScan}>{language === "HI" ? "स्कैन शुरू करें" : language === "KN" ? "ಸ್ಕ್ಯಾನ್ ಪ್ರಾರಂಭಿಸಿ" : language === "TE" ? "స్కాన్ ప్రారంభించండి" : language === "TA" ? "ஸ்கேனைத் தொடங்கு" : "Simulate scan"}</button>
          <p className="demo-note">Frontend demo · no backend/database connected</p>
        </div>
      </div>
    );
  }

  const sodiumFlag = product.nutrition.sodium > profile.sodium;
  const sugarFlag = product.nutrition.sugar > profile.sugar;

  return (
    <div className="content">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">PRODUCT CHECK</p>
          <h1>{ui("scanResult", "Scan result")}</h1>
        </div>
        <button className="secondary-btn" onClick={onScanAnother}>{ui("scanAnother", "↻ Scan another")}</button>
      </div>

      <div className="packet-reminder">{ui("checkDate", "Check the date. Check the seal.")} <b>{ui("snapCode", "Snap the code before the grab.")}</b></div>

      <section className="product-header card">
        <div className="product-emoji">{product.image}</div>
        <div className="product-main">
          <span className="pill">{product.category}</span>
          <h2>{product.name}</h2>
          <p>{product.brand} · {product.manufacturer}</p>
          <div className="verified">✓ {product.fssai}</div>
        </div>
        <div className={`verdict-badge ${verdict.verdict.toLowerCase()}`}>
          <span>{verdict.verdict === "AGREED" ? "✓" : verdict.verdict === "DISAGREED" ? "!" : "–"}</span>
          <b>ASATAS {verdict.verdict}</b>
          <small>for {profile.name}</small>
        </div>
      </section>

      <div className="grid-2">
        <section className="card">
          <div className="card-title"><div><p className="eyebrow">{ui("nutrition", "NUTRITION")}</p><h2>{ui("labelSays", "What the label says")}</h2></div><button className="icon-btn" onClick={onSpeak}>🔊</button></div>
          <NutritionRow name="Sodium" value={`${product.nutrition.sodium} mg / 100 g`} flag={sodiumFlag} />
          <NutritionRow name="Sugar" value={`${product.nutrition.sugar} g / 100 g`} flag={sugarFlag} />
          <NutritionRow name="Carbohydrates" value={`${product.nutrition.carbs} g / 100 g`} />
          <NutritionRow name="Fat" value={`${product.nutrition.fat} g / 100 g`} />
          <NutritionRow name="Saturated fat" value={`${product.nutrition.satFat} g / 100 g`} />
          <div className="source-line">Source: curated product data · published reference where applicable</div>
        </section>

        {verdict.verdict === "DISAGREED" && (
          <section className="card">
            <div className="card-title"><div><p className="eyebrow">WHY?</p><h2>Why was it flagged?</h2></div></div>
            <div className={`reason-box ${verdict.verdict.toLowerCase()}`}>
              <strong>ASATAS {verdict.verdict}</strong>
              <p>{verdict.reason}</p>
            </div>
            <div className="evidence-row"><span>Selected profile</span><b>{profile.name}</b></div>
            <div className="evidence-row"><span>Sodium preference</span><b>{profile.sodium} mg / 100 g</b></div>
            <div className="evidence-row"><span>Sugar preference</span><b>{profile.sugar} g / 100 g</b></div>
          </section>
        )}
      </div>

      <section className="card">
        <div className="card-title"><div><p className="eyebrow">{ui("ingredientIntelligence", "INGREDIENT INTELLIGENCE")}</p><h2>{ui("tapIngredient", "Tap any ingredient → Why?")}</h2></div></div>
        <div className="ingredient-list">
          {product.ingredients.map((item, i) => (
            <button key={i} className={`ingredient-tag ${item.type}`} onClick={() => onIngredient(item)}>
              <img src={item.image || IMAGE_FALLBACK} alt="" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = IMAGE_FALLBACK; }} />
              <span className="ingredient-status"></span>
              <strong>{ingredientCopy.names[item.name] || item.name}</strong>
              <span className="ingredient-arrow">→</span>
            </button>
          ))}
        </div>
        <div className="legend">
          <span><i className="dot green"></i>{ingredientCopy.legend[0]}</span>
          <span><i className="dot yellow"></i>{ingredientCopy.legend[1]}</span>
          <span><i className="dot blue"></i>{ingredientCopy.legend[2]}</span>
          <span><i className="dot purple"></i>{ingredientCopy.legend[3]}</span>
          <span><i className="dot red"></i>{ingredientCopy.legend[4]}</span>
        </div>
      </section>

      <section className="card" id="alternatives">
        <div className="card-title"><div><p className="eyebrow">NEXT STEP</p><h2>{ui("alternatives", "Alternatives that better match")} {profile.name}</h2></div></div>
        <div className="alternatives">
          {product.alternatives.map((a, i) => (
            <div className="alternative" key={i}>
              <div className="alt-icon">🥨</div>
              <div><b>{a.name}</b><small>Sodium · {a.sodium} mg / 100 g</small></div>
              <span className="mini-agreed">✓ ASATAS AGREED</span>
            </div>
          ))}
        </div>
        <p className="disclaimer">Recommendations mean “better match for this profile”, not “universally healthier”.</p>
      </section>

      <section className="card quality-card">
        <div className="card-title"><div><p className="eyebrow">{ui("quality", "QUALITY")}</p><h2>{ui("recentReports", "Recent reports")}</h2></div><span className="report-count">{product.reports.total}</span></div>
        <div className="quality-stats">
          <div><b>{product.reports.spoilage}</b><span>Spoilage</span></div>
          <div><b>{product.reports.foreignObject}</b><span>Foreign object</span></div>
          <div className="quality-note">No matching FSSAI enforcement notice currently found in this demo dataset.</div>
        </div>
      </section>
    </div>
  );
}

function NutritionRow({ name, value, flag }) {
  return <div className={`nutrition-row ${flag ? "flagged" : ""}`}><span>{name}</span><b>{value}</b>{flag ? <em>DISAGREED</em> : <em className="ok">✓</em>}</div>;
}

function DartPage({ onReport, language }) {
  const ui = (key, fallback) => t(language, key, fallback);
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Choose a loose food", body: "Select the food you want to check. This demo starts with milk." },
    { title: "Check the packet-free sample", body: "Follow the applicable FSSAI DART procedure carefully. ASATAS guides the sequence; it does not replace laboratory testing." },
    { title: "Record what you observe", body: "Use the structured result to decide whether you want to file a food-safety complaint." },
    { title: "Take action", body: "Open the report flow and route the concern through the official FSSAI complaint pathway." }
  ];
  return (
    <div className="content">
      <div className="page-title-row">
        <div><p className="eyebrow">{ui("looseFood", "LOOSE FOOD")}</p><h1>FSSAI DART guide</h1></div>
        <span className="official-pill">FSSAI DART</span>
      </div>
      <div className="dart-hero card">
        <div className="dart-icon">🥛</div>
        <div><p className="eyebrow">DEMO PROTOCOL</p><h2>Milk · possible added water</h2><p>Follow the official DART procedure step by step. ASATAS provides the interface and reminders; it does not claim laboratory certainty.</p></div>
      </div>
      <div className="stepper">
        {steps.map((s, i) => <div key={i} className={`step-dot ${i <= step ? "done" : ""}`}><span>{i + 1}</span><small>{s.title}</small></div>)}
      </div>
      <section className="card dart-card">
        <p className="eyebrow">STEP {step + 1} OF {steps.length}</p>
        <h2>{steps[step].title}</h2>
        <p className="big-copy">{steps[step].body}</p>
        <div className="dart-actions">
          {step > 0 && <button className="secondary-btn" onClick={() => setStep(s => s - 1)}>← Back</button>}
          {step < steps.length - 1 ? <button className="primary-btn" onClick={() => setStep(s => s + 1)}>Continue →</button> : <button className="primary-btn" onClick={onReport}>Open report flow</button>}
        </div>
      </section>
    </div>
  );
}

function ReportsPage({ language }) {
  const ui = (key, fallback) => t(language, key, fallback);
  const [submitted, setSubmitted] = useState(false);
  const [reportCounts, setReportCounts] = useState({
    "Spoilage": 18,
    "Foreign object": 7,
    "Packaging issue": 11,
    "Suspected adulteration": 9
  });
  const submitReport = (type) => {
    setReportCounts(counts => ({ ...counts, [type]: (counts[type] || 0) + 1 }));
    setSubmitted(false);
  };
  return (
    <div className="content">
      <div className="page-title-row">
        <div><p className="eyebrow">{ui("quality", "QUALITY LAYER")}</p><h1>{ui("reports", "Food quality reports")}</h1></div>
        <button className="primary-btn" onClick={() => setSubmitted(true)}>+ Report an issue</button>
      </div>
      <div className="report-banner"><span>⚑</span><div><b>Structured evidence, not review mining.</b><p>Tag the problem so reports can be grouped by product, brand, batch, place and time.</p></div></div>
      <div className="report-grid">
        <ReportCard icon="🦠" title="Spoilage" count={reportCounts["Spoilage"]} />
        <ReportCard icon="🔎" title="Foreign object" count={reportCounts["Foreign object"]} />
        <ReportCard icon="📦" title="Packaging issue" count={reportCounts["Packaging issue"]} />
        <ReportCard icon="⚠️" title="Suspected adulteration" count={reportCounts["Suspected adulteration"]} />
      </div>
      <section className="card">
        <p className="eyebrow">RECENT SIGNALS</p>
        <div className="report-row"><span className="status-dot red"></span><div><b>ABC Multigrain Crackers</b><small>3 spoilage reports · last 30 days</small></div><span>→</span></div>
        <div className="report-row"><span className="status-dot yellow"></span><div><b>Local Milk Vendor</b><small>2 suspected adulteration reports · last 7 days</small></div><span>→</span></div>
        <div className="report-row"><span className="status-dot blue"></span><div><b>Harvest Oats & Seeds</b><small>1 packaging report · last 30 days</small></div><span>→</span></div>
      </section>
      {submitted && <div className="modal-backdrop"><div className="modal"><button className="close" onClick={() => setSubmitted(false)}>×</button><p className="eyebrow">REPORT</p><h2>What went wrong?</h2><div className="report-options">{["Spoilage", "Foreign object", "Suspected adulteration", "Packaging issue", "Mislabelling"].map(x => <button key={x} onClick={() => submitReport(x)}>{x}<span>→</span></button>)}</div><p className="modal-note">Demo only. In the backend version this would route into the official FSSAI complaint flow.</p></div></div>}
    </div>
  );
}

function ReportCard({ icon, title, count }) {
  return <div className="report-card"><span>{icon}</span><b>{count}</b><small>{title}</small></div>;
}

function ProfilesPage({ profiles, activeProfile, setActiveProfile, onAdd, language }) {
  const ui = (key, fallback) => t(language, key, fallback);
  return (
    <div className="content">
      <div className="page-title-row">
        <div><p className="eyebrow">PERSONALISATION</p><h1>{ui("profiles", "Profiles")}</h1></div>
        <button className="primary-btn" onClick={onAdd}>{ui("addProfile", "+ Add profile")}</button>
      </div>
      <p className="page-copy">Profiles are optional. Use one profile for yourself, or add family members when useful. Product evidence stays the same; only the interpretation changes.</p>
      <div className="profiles-grid">
        {profiles.map(p => (
          <button className={`profile-card ${p.id === activeProfile ? "selected" : ""}`} key={p.id} onClick={() => setActiveProfile(p.id)}>
            <span className="profile-avatar">{p.icon}</span>
            <div><b>{p.name}</b><small>{p.template}</small><small>Sodium · {p.sodium} mg/100 g</small><small>Sugar · {p.sugar} g/100 g</small></div>
            {p.id === activeProfile && <span className="selected-check">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function SahiSaathPage({ language, setLanguage, product, profile }) {
  const copy = CHAT_COPY[language] || CHAT_COPY.EN;
  const ui = (key, fallback) => t(language, key, fallback);
  const [question, setQuestion] = useState("");
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: copy.greeting }]);

  const replyTo = (text) => {
    const normalized = text.toLowerCase();
    if (!product) {
      return language === "HI"
        ? "अभी कोई उत्पाद स्कैन नहीं किया गया है। पहले उत्पाद स्कैन करें, फिर मैं उसके लेबल और पोषण की जानकारी समझाऊंगा।"
        : "No product is scanned yet. Scan a product first and I can explain its label, nutrition and ingredients from the available data.";
    }
    if (/sodium|salt|नमक|ಉಪ್ಪು|ఉప్పు|உப்பு/.test(normalized)) {
      return language === "HI"
        ? `${product.name} में सोडियम ${product.nutrition.sodium} mg/100 g है। ${profile.name} की सीमा ${profile.sodium} mg/100 g है, इसलिए यह ${product.nutrition.sodium > profile.sodium ? "सीमा से अधिक" : "सीमा के अंदर"} है।`
        : `${product.name} has ${product.nutrition.sodium} mg sodium per 100 g. ${profile.name}'s configured limit is ${profile.sodium} mg/100 g, so it is ${product.nutrition.sodium > profile.sodium ? "above" : "within"} the limit.`;
    }
    if (/sugar|चीनी|ಸಕ್ಕರೆ|చక్కెర|சர்க்கரை/.test(normalized)) {
      return language === "HI"
        ? `इस उत्पाद में चीनी ${product.nutrition.sugar} g/100 g है। ${profile.name} की सीमा ${profile.sugar} g/100 g है।`
        : `This product has ${product.nutrition.sugar} g sugar per 100 g. ${profile.name}'s configured limit is ${profile.sugar} g/100 g.`;
    }
    if (/ingredient|सामग्री|ಪದಾರ್ಥ|పదార్థం|பொருள்/.test(normalized)) {
      return language === "HI"
        ? `घोषित सामग्री: ${product.ingredients.map(item => item.name).join(", ")}। किसी सामग्री पर टैप करके उसका विवरण भी देख सकते हैं।`
        : `The declared ingredients are: ${product.ingredients.map(item => item.name).join(", ")}. Tap an ingredient in the scan result for its explanation.`;
    }
    return language === "HI"
      ? "मैं स्कैन किए गए उत्पाद, पोषण, सामग्री और खाद्य-सुरक्षा संकेतों को समझा सकता हूं। सामान्य स्वास्थ्य या चिकित्सीय सलाह के लिए डॉक्टर और आधिकारिक स्रोत से पुष्टि करें।"
      : "I can explain the scanned product, nutrition, ingredients and food-safety signals. For medical or current external questions, please verify with a qualified professional or an official source.";
  };

  const sendQuestion = (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    setMessages(current => [...current, { role: "user", text: trimmed }, { role: "assistant", text: replyTo(trimmed) }]);
    setQuestion("");
  };

  const speakReply = (text) => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LOCALES[language] || SPEECH_LOCALES.EN;
    window.speechSynthesis.speak(utterance);
  };

  const startVoice = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setMessages(current => [...current, { role: "assistant", text: "Voice input is not supported in this browser. You can still type your question." }]);
      return;
    }
    const recognition = new Recognition();
    recognition.lang = SPEECH_LOCALES[language] || SPEECH_LOCALES.EN;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = event => {
      const spokenQuestion = event.results[0][0].transcript.trim();
      if (!spokenQuestion) return;
      const response = replyTo(spokenQuestion);
      setMessages(current => [...current, { role: "user", text: spokenQuestion }, { role: "assistant", text: response }]);
      speakReply(response);
    };
    try {
      recognition.start();
    } catch {
      setListening(false);
      setMessages(current => [...current, { role: "assistant", text: "Voice input could not start. You can still type your question." }]);
    }
  };

  return (
    <div className="content chat-page">
      <div className="page-title-row">
        <div><p className="eyebrow">SAHI-SAATH</p><h1>{copy.title}</h1></div>
        <div className="chat-language">
          <label htmlFor="chat-language-select">{ui("language", "Language")}</label>
          <select id="chat-language-select" value={language} onChange={event => { setLanguage(event.target.value); setMessages([{ role: "assistant", text: CHAT_COPY[event.target.value].greeting }]); }}>
            {LANGUAGE_OPTIONS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </div>
      </div>
      <section className="chat-shell card">
        <div className="chat-header"><span className="chat-avatar">✦</span><div><b>SAHI-SAATH</b><small>{copy.subtitle}</small></div><span className="chat-status">{ui("online", "● Online")}</span></div>
        <div className="chat-messages" aria-live="polite">
          {messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === "assistant" ? "✦" : profile.icon}</span><p>{message.text}</p></div>)}
        </div>
        <form className="chat-form" onSubmit={sendQuestion}>
          <input value={question} onChange={event => setQuestion(event.target.value)} placeholder={copy.placeholder} aria-label={copy.placeholder} />
          <button className={`voice-chat-btn ${listening ? "listening" : ""}`} type="button" onClick={startVoice} aria-label={listening ? copy.listening : copy.voice} title={listening ? copy.listening : copy.voice}>{listening ? "◌" : "🎙"}</button>
          <button className="primary-btn" type="submit">{copy.send} <span>→</span></button>
        </form>
        <p className="chat-note">{copy.empty}</p>
      </section>
    </div>
  );
}

function IngredientModal({ ingredient, language, onClose }) {
  const copy = INGREDIENT_COPY[language] || INGREDIENT_COPY.EN;
  const ingredientName = copy.names[ingredient.name] || ingredient.name;
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal ingredient-modal" onMouseDown={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <p className="eyebrow">{copy.explorer}</p>
        <h2>{ingredientName}</h2>
        <div className={`modal-color ${ingredient.type}`}></div>
        <h3>{copy.what}</h3>
        <p>{language === "EN" ? ingredient.note : copy.description(ingredientName)}</p>
        <h3>{copy.why}</h3>
        <p>{copy.detected}</p>
        <div className="source-box">{copy.source}</div>
      </div>
    </div>
  );
}

function VoiceModal({ onClose, onSpeak, product, profile }) {
  const [heard, setHeard] = useState("");
  const [listening, setListening] = useState(false);

  const start = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setHeard("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = e => {
      const text = e.results[0][0].transcript;
      setHeard(text);
      if (/why|disagree|flag/i.test(text) && product) {
        const sodium = product.nutrition.sodium;
        onSpeak(`ASATAS disagreed for ${profile.name}. Sodium is ${sodium} milligrams per 100 grams, compared with the selected preference of ${profile.sodium} milligrams per 100 grams.`);
      } else {
        onSpeak("I can check a product, explain a flag, explain an ingredient, show alternatives, check loose food, or help file a report.");
      }
    };
    try {
      recognition.start();
    } catch {
      setListening(false);
      setHeard("Voice input could not start. You can still use the buttons or type instead.");
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal voice-modal" onMouseDown={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <p className="eyebrow">SAHI SAATHI</p>
        <h2>Tap or talk</h2>
        <p>Voice replaces tapping, not thinking. The demo maps speech to a small fixed set of actions.</p>
        <button className={`mic ${listening ? "listening" : ""}`} onClick={start}>{listening ? "Listening…" : "🎙"}</button>
        <div className="intent-list">
          <span>“Why was this flagged?”</span>
          <span>“Explain this ingredient.”</span>
          <span>“Show me alternatives.”</span>
          <span>“Report this.”</span>
        </div>
        {heard && <div className="heard">You said: <b>{heard}</b></div>}
      </div>
    </div>
  );
}

function ProfileModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <p className="eyebrow">OPTIONAL PROFILE</p>
        <h2>Add someone</h2>
        <p>Profiles are optional. Product facts do not change; the interpretation can.</p>
        <input className="text-input" placeholder="Profile name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        <button className="primary-btn full" disabled={!name.trim()} onClick={() => onAdd(name.trim())}>Create profile</button>
      </div>
    </div>
  );
}

export default App;