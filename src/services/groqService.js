export const getGroqResponse = async (systemPrompt, messageHistoryArray = [], currentMessage) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.error("API Key bulunamadı! Lütfen .env dosyasını kontrol et.");
    throw new Error("API Key missing");
  }

  try {
    const formattedHistory = messageHistoryArray?.map(msg => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text
    })) || [];

    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: currentMessage }
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Hatası:", errorData);
      throw new Error("API yanıt vermedi");
    }

    const data = await response.json();
    return data.choices[0].message.content;
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
  
  const currentPhase = cycleData.cyclePhase || data.cyclePhase || "Bilinmiyor";
  const currentDay = cycleData.cycleDay || "Bilinmiyor";
  const kitchen = data.kitchen || lifeConditions.kitchenType || "Belirtilmemiş";
  const lifestyle = data.lifestyle || "Belirtilmemiş";
  const diets = data.dietaryRestrictions && data.dietaryRestrictions.length > 0 ? data.dietaryRestrictions.join(', ') : 'Herhangi bir diyet/kısıtlama yok';
  const goal = data.goal || "PCOS Yönetimi";
  
  return `Sen Talya'sın. PCOS'lu kadınlara şefkatle yaklaşan dijital bir yoldaşsın. Asla tıbbi teşhis koyma. 
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

// 2. Lifestyle.jsx -> Dynamic JSON API
export const fetchLifestylePlan = async (userData = {}) => {
  const budget = userData.budget || "Orta Halli";
  const cyclePhase = userData.cyclePhase || "Bilinmiyor";
  
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
  
const user = `Benim döngü evrem: ${cyclePhase}. Bütçe durumum: ${budget}.
[SİSTEM ZARI: ${randomSeed} - Her üretimde tamamen yeni ve daha önce hiç akla gelmemiş özel bir kombinasyon yarat.]

LÜTFEN BU YENİLEMEDE TARİFLER İÇİN ŞU TEMAYA AĞIRLIK VER: "${randomTheme}".
EGZERSİZLER İÇİN İSE ŞU TARZI BENİMSE: "${randomWorkout}".

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

  const rawResponse = await getGroqResponse(system, [], user);
  
  try {
    const parsed = safeParseGroqJson(rawResponse);
    if (!parsed) throw new Error('Invalid JSON response');
    return parsed;
  } catch (error) {
    console.warn("Lifestyle JSON Parse Error:", error);
    return null; // Signals fallback to the local static objects
  }
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
