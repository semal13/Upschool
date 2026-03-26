export const getGroqResponse = async (systemPrompt, messageHistoryArray = [], currentMessage) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key bulunamadı! Lütfen .env dosyasını kontrol et.");
    throw new Error("API Key missing");
  }

  try {
    const history = (messageHistoryArray || []).map(msg => ({
      role: msg.isUser ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    const contents = [];
    if (history.length > 0) {
      const firstUserIndex = history.findIndex(item => item.role === "user");
      if (firstUserIndex >= 0) {
        history[firstUserIndex] = {
          ...history[firstUserIndex],
          parts: [{ text: `${systemPrompt}\n\n${history[firstUserIndex].parts?.[0]?.text || ''}` }]
        };
      } else {
        contents.push({ role: "user", parts: [{ text: systemPrompt }] });
      }
      contents.push(...history);
      contents.push({ role: "user", parts: [{ text: currentMessage }] });
    } else {
      contents.push({
        role: "user",
        parts: [{ text: `${systemPrompt}\n\n${currentMessage}` }]
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 2000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Hatası:", errorData);
      throw new Error("API yanıt vermedi");
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.warn("Gemini boş yanıt döndü:", data);
      return "Şu an yanıt oluşturamadım, tekrar deneyelim mi? 💜";
    }
    return text;
  } catch (error) {
    console.error("Fetch işlemi başarısız:", error);
    return "Bir anlığına bağlantımız koptu ama ben seninleyim. Lütfen tekrar yazar mısın? 💜";
  }
};

const getUserData = () => {
  try {
    const raw = localStorage.getItem('talya_user_data');
    if (!raw || raw === 'undefined' || raw === 'null') return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Profile parse error, clearing corrupted data:', e);
    localStorage.removeItem('talya_user_data');
    return {};
  }
};

const getSystemPrompt = () => {
  const data = getUserData();
  const cycleData = JSON.parse(localStorage.getItem('talya_cycle_sync') || '{}');
  const lifeConditions = JSON.parse(localStorage.getItem('talya_life_conditions') || '{}');
  const now = new Date();
  const localDate = now.toLocaleDateString('tr-TR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const localTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Istanbul';
  
  const currentPhase = cycleData.cyclePhase || data.cyclePhase || "Bilinmiyor";
  const currentDay = cycleData.cycleDay || "Bilinmiyor";
  const kitchen = data.kitchen || lifeConditions.kitchenType || "Belirtilmemiş";
  const lifestyle = data.lifestyle || "Belirtilmemiş";
  const diets = data.dietaryRestrictions && data.dietaryRestrictions.length > 0 ? data.dietaryRestrictions.join(', ') : 'Herhangi bir diyet/kısıtlama yok';
  const goal = data.goal || "PCOS Yönetimi";
  
  return `Sen Talya'sın. PCOS'lu kadınlara şefkatle yaklaşan dijital bir yoldaşsın. Asla tıbbi teşhis koyma. 
  Yerel Tarih/Saat: "${localDate} - ${localTime}" (Saat Dilimi: ${timezone})
  Kullanıcının Adı: "${data.name}"
  Yaşam Tarzı: "${lifestyle}"
  Bütçesi: "${data.budget}"
  Mutfak İmkanları: "${kitchen}"
  Beslenme Kısıtlamaları: "${diets}"
  Ana Hedefi: "${goal}"
  Güncel Döngü Evresi: "${currentPhase}" (Gün: ${currentDay}). 

  Tavsiyelerini bu gerçekliğe göre son derece kişiselleştir. Kullanıcı kısıtlı bütçeli bir "öğrenciyse", tarifleri yurt dostu, ucuz, pişirmesi pratik ve maksimum 20 dakikalık tut. Kullanıcı "ev hanımıysa" daha vakit isteyen kapsamlı ve detaylı ev tarifleri öner. Kullanıcının beslenme sınırlarına (allerjiler, vegan vs) KESİNLİKLE uy. Hedefi odaklı (Örn: Kas & Güç) ise öğünlerde ona destek ol. Döngü gününe ve evresine göre hormonları (östrojen/progesteron) destekleyecek tavsiyeler ver. Kısa, motive edici, samimi konuş. Asla emir kipi veya stres yaratıcı yargılayıcı kelimeler kullanma.`;
};

// 1. Home.jsx -> Sabah Motivasyon Mesajı
export const fetchMotivation = async () => {
  const system = getSystemPrompt();
  const user = "Lütfen bana bugün bütçeme ve döngü evreme uygun, bana iyi hissettirecek, 3 cümleyi geçmeyen son derece samimi ve şefkatli bir sabah motivasyon mesajı yaz.";
  return await getGroqResponse(system, [], user);
};

const safeParseGroqJson = (rawResponse = '') => {
  if (!rawResponse || typeof rawResponse !== 'string') return null;

  // Prefer fenced JSON blocks if present.
  const fenced = rawResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced?.[1] ?? rawResponse;

  // Best-effort: take the outermost JSON object.
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  const sliced = start >= 0 && end > start ? candidate.slice(start, end + 1) : candidate;

  try {
    return JSON.parse(sliced);
  } catch {
    // Common model mistakes: trailing commas and smart quotes.
    const repaired = sliced
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/,\s*([}\]])/g, '$1');
    try {
      return JSON.parse(repaired);
    } catch {
      return null;
    }
  }
};

const getAllergenKeywords = (allergens = []) => {
  const map = {
    Gluten: ['gluten', 'buğday', 'arpa', 'çavdar', 'bulgur', 'irmik', 'un', 'makarna', 'ekmek'],
    Laktoz: ['laktoz', 'süt', 'yoğurt', 'peynir', 'kefir', 'krema', 'tereyağı'],
    Yumurta: ['yumurta'],
    Fıstık: ['fıstık', 'yer fıstığı', 'peanut'],
    'Balık & Deniz Ürünleri': ['balık', 'somon', 'ton', 'deniz ürünü', 'karides', 'midye'],
    'Kırmızı Et': ['kırmızı et', 'dana', 'kuzu', 'et'],
    Tavuk: ['tavuk'],
    Vejetaryen: ['tavuk', 'balık', 'et', 'dana', 'kuzu'],
    Vegan: ['tavuk', 'balık', 'et', 'dana', 'kuzu', 'yumurta', 'süt', 'yoğurt', 'peynir', 'tereyağı'],
    Şeker: ['şeker', 'bal', 'pekmez', 'şurup'],
    Kafein: ['kahve', 'espresso', 'kafein', 'enerji içeceği', 'siyah çay']
  };

  const out = new Set();
  for (const item of allergens) {
    (map[item] || [String(item || '').toLowerCase()]).forEach(k => out.add(k.toLowerCase()));
  }
  return Array.from(out);
};

const hasAllergenConflict = (plan, allergens = []) => {
  if (!Array.isArray(allergens) || allergens.length === 0) return false;
  const banned = getAllergenKeywords(allergens);
  if (banned.length === 0) return false;

  const recipes = Array.isArray(plan?.recipes) ? plan.recipes : [];
  const corpus = recipes
    .flatMap(r => [r?.title, ...(r?.ingredients || []), ...(r?.steps || [])])
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return banned.some(keyword => keyword && corpus.includes(keyword));
};

const getCachedLifestylePlan = () => {
  try {
    const raw = localStorage.getItem('talya_last_lifestyle_plan');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    const parsed = JSON.parse(raw);
    if (parsed?.recipes?.length && parsed?.workouts?.length) return parsed;
    return null;
  } catch {
    return null;
  }
};

const saveCachedLifestylePlan = (plan) => {
  try {
    localStorage.setItem('talya_last_lifestyle_plan', JSON.stringify(plan));
  } catch {
    // ignore
  }
};

const buildEmergencyPlan = ({ budget, kitchen, goal, dietaryRestrictions, cyclePhase }) => ({
  focus: `${goal} odağında, ${cyclePhase} evresine uygun hızlı plan`,
  recipes: [
    {
      id: 1,
      title: `${kitchen} için hızlı sebze kasesi`,
      time: "12 dk",
      cal: budget.includes('Kısıtlı') ? "320 kcal" : "380 kcal",
      type: dietaryRestrictions.includes('Glutensiz') ? "Glütensiz" : "Yüksek Protein",
      ingredients: ["Kinoa veya karabuğday", "Mevsim sebzeleri", "Zeytinyağı", "Limon"],
      steps: ["Tahılı haşla.", "Sebzeleri doğra ve karıştır.", "Sosla birleştirip servis et."]
    },
    {
      id: 2,
      title: "Yoğun güne uygun pratik tabak",
      time: "10 dk",
      cal: "300 kcal",
      type: "Düşük Karb",
      ingredients: ["Avokado", "Salatalık", "Yeşillik", "Tohum karışımı"],
      steps: ["Malzemeleri doğra.", "Tabakta birleştir.", "Tohumlarla tamamla."]
    },
    {
      id: 3,
      title: "Dengeleyici ara öğün",
      time: "5 dk",
      cal: "180 kcal",
      type: "Yüksek Protein",
      ingredients: ["Bitkisel yoğurt", "Chia", "Tarçın", "Meyve"],
      steps: ["Kasede karıştır.", "2-3 dk beklet.", "Meyve ile servis et."]
    },
    {
      id: 4,
      title: "Akşam hafif tabak",
      time: "15 dk",
      cal: "360 kcal",
      type: "Tümü",
      ingredients: ["Zeytinyağlı sebze", "Protein kaynağı", "Lifli salata"],
      steps: ["Sebzeleri hazırla.", "Protein ile birleştir.", "Salata ile tamamla."]
    }
  ],
  workouts: [
    {
      id: 5,
      title: "Nazik Yoga Akışı",
      time: "20 dk",
      intensity: "Hafif",
      type: "Yoga",
      movements: [{ name: "Kedi-İnek", desc: "Omurgayı mobilize et." }, { name: "Çocuk Duruşu", desc: "Nefesi dengele." }],
      equipmentNote: "Yoga matı"
    },
    {
      id: 6,
      title: "Temel Güç Rutini",
      time: "25 dk",
      intensity: "Orta",
      type: "Güç",
      movements: [{ name: "Squat", desc: "12 tekrar x 3 set." }, { name: "Glute Bridge", desc: "15 tekrar x 3 set." }],
      equipmentNote: "Mat"
    },
    {
      id: 7,
      title: "Düşük Efor Esneme",
      time: "15 dk",
      intensity: "Hafif",
      type: "Düşük Efor",
      movements: [{ name: "Boyun-Omuz Esnetme", desc: "Yavaş ve kontrollü." }, { name: "Hamstring Esnetme", desc: "Her iki taraf 45 sn." }],
      equipmentNote: "Ekipmansız"
    },
    {
      id: 8,
      title: "Nefes Odaklı Yoga",
      time: "18 dk",
      intensity: "Hafif",
      type: "Yoga",
      movements: [{ name: "Box Breathing", desc: "4-4-4-4 nefes." }, { name: "Twist", desc: "Omurga rahatlat." }],
      equipmentNote: "Mat"
    },
    {
      id: 9,
      title: "Core & Güç",
      time: "22 dk",
      intensity: "Orta",
      type: "Güç",
      movements: [{ name: "Dead Bug", desc: "10 tekrar x 3 set." }, { name: "Plank", desc: "30 sn x 3 set." }],
      equipmentNote: "Ekipmansız"
    },
    {
      id: 10,
      title: "Aktif Toparlanma",
      time: "12 dk",
      intensity: "Hafif",
      type: "Düşük Efor",
      movements: [{ name: "Yürüyüş", desc: "Rahat tempoda." }, { name: "Kalça Açıcı", desc: "Hafif mobilite." }],
      equipmentNote: "Ekipmansız"
    }
  ]
});

// 2. Lifestyle.jsx -> Dynamic JSON API
export const fetchLifestylePlan = async (userData = {}) => {
  // Tüm kaynaklardan profil bilgisini birleştir
  const cycleData = JSON.parse(localStorage.getItem('talya_cycle_sync') || '{}');
  const lifeConditions = JSON.parse(localStorage.getItem('talya_life_conditions') || '{}');
  
  const rawBudget = userData.budget || lifeConditions.budgetType || "Orta Halli";
  const rawKitchen = userData.kitchen || lifeConditions.kitchenType || "Belirtilmemiş";

  const normalizeBudget = (b) => {
    if (b.includes("Kısıtlı") || b === "student") return "Kısıtlı";
    if (b.includes("Orta") || b === "standard") return "Orta Halli";
    if (b.includes("Esnek") || b === "premium") return "Esnek";
    return b;
  };
  const normalizeKitchen = (k) => {
    if (k === "full" || k.includes("Tam")) return "Tam Donanımlı";
    if (k === "basic" || k.includes("Temel")) return "Temel Mutfak";
    if (k === "mini" || k.includes("Mini")) return "Mini Mutfak";
    if (k === "none" || k.includes("Yok")) return "Mutfak Yok";
    return k;
  };

  const budget = normalizeBudget(rawBudget);
  const kitchen = normalizeKitchen(rawKitchen);
  const lifestyle = userData.lifestyle || "Belirtilmemiş";
  const goal = userData.goal || "PCOS Yönetimi";
  const allergens = userData.allergens?.length > 0
    ? userData.allergens.join(', ')
    : 'Alerjen bildirilmedi';
  const dietaryRestrictions = userData.dietaryRestrictions?.length > 0 
    ? userData.dietaryRestrictions.join(', ') 
    : 'Kısıtlama yok';
  const cyclePhase = cycleData.cyclePhase || userData.cyclePhase || "Bilinmiyor";
  const cycleDay = cycleData.cycleDay || "Bilinmiyor";
  
  const themes = [
    "Akdeniz usulü ferah, zeytinyağlı ve bol yeşillikli",
    "Çok pratik, tek tavada/tencerede pişen sıcak ev yemeği tarzı",
    "Baharatlı, doyurucu ve fırınlanmış kışkırtıcı lezzetler",
    "Uzak Doğu esintili, çok renkli ve wok tavada sote stili",
    "Bahar ferahlığında, bol lifli, meyveli ve yemişli kaseler (Bowls)"
  ];
  const workoutThemes = [
    "Sadece yatakta/matta yatılarak yapılan tembel kız esnemeleri",
    "Dans esintili, kıpır kıpır ve terletici kardiyo",
    "Ağırlık odaklı, yavaş ama kasları yakan direnç antrenmanı",
    "Nefes ve esneme odaklı, zihni sakinleştiren derin yoga",
    "Ayakta yapılan, ekipmansız ve sessiz (zıplamasız) pilates"
  ];

  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  const randomWorkout = workoutThemes[Math.floor(Math.random() * workoutThemes.length)];
  const randomSeed = Math.floor(Math.random() * 1000000);

  const system = getSystemPrompt() + " SADECE GEÇERLİ BİR JSON FORMATI DÖNDÜR. MD kod parçacıkları kullanma, salt JSON döndür.";
  
const user = `KULLANICI PROFİLİ (KESİNLİKLE UY):
- Bütçe: ${budget}
- Yaşam Tarzı: ${lifestyle}
- Mutfak: ${kitchen}
- Hedef: ${goal}
- Alerjenler: ${allergens}
- Diyet Kısıtlamaları: ${dietaryRestrictions}
- Döngü Evresi: ${cyclePhase} (Gün: ${cycleDay})

[SİSTEM ZARI: ${randomSeed} - Her üretimde tamamen yeni kombinasyon yarat.]

LÜTFEN BU YENİLEMEDE TARİFLER İÇİN ŞU TEMAYA AĞIRLIK VER: "${randomTheme}".
EGZERSİZLER İÇİN İSE ŞU TARZI BENİMSE: "${randomWorkout}".

HARD RULE - ALERJEN GÜVENLİĞİ:
- "Alerjenler" alanında geçen içerikler tarif başlığı, malzeme ve adımlarda ASLA geçmeyecek.
- Şüpheli durumda o malzemeyi tamamen dışla ve güvenli alternatif kullan.
- Eğer bu kurala uyamıyorsan yine de JSON dön, ama tüm tarifleri alerjensiz yeniden üret.

Lütfen JSON formatında bütçeme, yaşam tarzıma ve döngü evreme %100 uygun, DAHA ÖNCE VERMEDİĞİN, tamamen YENİ 4 adet yemek tarifi ve TOPLAM 6 ADET BÜTÜNSEL EGZERSİZ RUTİNİ ver. 

ÇOK ÖNEMLİ EGZERSİZ KURALI:
1) Egzersiz dağılımı KESİNLİKLE şöyle olmalıdır: 2 adet "Yoga", 2 adet "Güç", 2 adet "Düşük Efor". 
2) Göndereceğin her bir "workout" objesi ASLA tek bir atomic hareket (Örn: 'Ayakta Esneme', 'Karın Dayama') OLMAMALIDIR! 
Her bir workout objesi 15-30 dakikalık tam teşekküllü, kapsamlı bir antrenman programı (Örn: 'Sabah Canlandırıcı Tüm Vücut Yogası', 'PCOS Terleten Kardiyo') olmalıdır. 
İçindeki "movements" listesi ise bu antrenman programının içerdiği tekil hareketleri (Örn: Squat, Lunge, Kedi-İnek) barındırmalıdır. Bir rutinde en az 3-4 farklı hareket olmalı. Kullanıcı verisine harfiyen uy.

Başka hiçbir metin ekleme. JSON şablonu tam olarak şu olmalı:
{
  "focus": "Günün yeni odak mesajı",
  "recipes": [
    { "id": 1, "title": "Türkçe Yemek Adı", "time": "25 dk", "cal": "380 kcal", "type": "Yüksek Protein", "ingredients": ["..."], "steps": ["..."] }
  ],
  "workouts": [
    { "id": 5, "title": "Tüm Vücut Sabah Yogası (Örnek Tam Program)", "time": "20 dk", "intensity": "Hafif", "type": "Yoga", "movements": [{ "name": "Hareket 1", "desc": "Aciklamasi"}], "equipmentNote": "..." }
  ]
}
Recipe tipleri şunlardan biri olmalı: "Glütensiz", "Yüksek Protein", "Düşük Karb", "Tümü". Workout tipleri KESİNLİKLE şunlar olmalıdır: "Düşük Efor", "Güç", "Yoga".`;

  const extraRules = [
    "",
    "Sadece JSON döndür. Başına/sonuna hiçbir metin ekleme. Tüm diziler ve objeler düzgün kapanmalı.",
    "Alerjen güvenliği: Yasak içerik geçmeyecek. Emin değilsen o içeriği tamamen çıkar."
  ];

  for (const rule of extraRules) {
    const rawResponse = await getGroqResponse(
      system,
      [],
      rule ? `${user}\n\nEK KURAL:\n${rule}` : user
    );
    const parsed = safeParseGroqJson(rawResponse);
    if (parsed && !hasAllergenConflict(parsed, userData.allergens || [])) {
      saveCachedLifestylePlan(parsed);
      return parsed;
    }
  }

  const cached = getCachedLifestylePlan();
  if (cached) return cached;

  // Never return null to avoid any static fallback flow.
  return buildEmergencyPlan({ budget, kitchen, goal, dietaryRestrictions, cyclePhase });
};

// 3. Calm.jsx -> Kriz Anı Chat (Crisis AI)
export const sendCrisisMessage = async (history, message) => {
  const system = getSystemPrompt() + " Sen bir panik/kriz anı destek uzmanısın. Kullanıcı şu an anksiyete veya yeme atağı yaşıyor olabilir. Uzun paragraflar YAZMA. Sadece 1 veya 2 cümleyle ona güvende olduğunu hissettir ve ona odaklanması için basit bir nefes veya topraklanma sorusu sor (Örn: Etrafında mavi renkli 3 eşya sayabilir misin, yoksa birlikte derin bir nefes mi alalım?). Kullanıcıya direkt ismiyle, şefkatle hitap et.";
  return await getGroqResponse(system, history, message);
};

// 4. Home.jsx -> Ask Talya Chat (General AI)
export const sendGeneralMessage = async (history, message) => {
  const system = getSystemPrompt() + " Cevapların kesinlikle 3 cümleyi geçmesin. Maddeleme kullanman gerekirse çok kısa ve öz yap. Kullanıcıya her zaman ismiyle, çok samimi hitap et ve yargılamadan dinle.";
  return await getGroqResponse(system, history, message);
};