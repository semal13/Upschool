export const getGroqResponse = async (systemPrompt, userMessage) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    console.error("API Key bulunamadı! Lütfen .env dosyasını kontrol et.");
    throw new Error("API Key missing");
  }

  try {
    console.log('API İsteği Başladı...');
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024
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
    return "Şu an bağlantı kurulamadı ama ben yanındayım. Lütfen birazdan tekrar dene. 💜";
  }
};

const getSystemPrompt = () => {
  const data = JSON.parse(localStorage.getItem('talya_user_data') || '{}');
  return `Sen Talya'sın. PCOS'lu kadınlara şefkatle yaklaşan dijital bir yoldaşsın. Asla tıbbi teşhis koyma. Kullanıcının adı: "${data.name || 'Bahar'}", yaşam tarzı: "${data.lifestyle || 'Bilinmiyor'}", bütçesi: "${data.budget || 'Bilinmiyor'}", güncel döngü evresi: "${data.cyclePhase || 'Bilinmiyor'}". Tavsiyelerini bu gerçekliğe göre son derece kişiselleştir. Kullanıcı esnek/iyi bütçeli biriyse ona daha kaliteli malzemeli tarifler, kısıtlı bütçeli bir öğrenci veya ev hanımıysa evdeki malzemelerle yapılacak en ekonomik PCOS çözümleri sun. Kısa, motive edici, samimi konuş. Asla emir kipi kullanma.`;
};

// 1. Home.jsx -> Sabah Motivasyon Mesajı
export const fetchMotivation = async () => {
  const system = getSystemPrompt();
  const user = "Lütfen bana bugün bütçeme ve döngü evreme uygun, bana iyi hissettirecek, 3 cümleyi geçmeyen son derece samimi ve şefkatli bir sabah motivasyon mesajı yaz.";
  return await getGroqResponse(system, user);
};

// 2. Lifestyle.jsx -> Dynamic JSON API
export const fetchLifestylePlan = async (userData = {}) => {
  const budget = userData.budget || "Orta Halli";
  const cyclePhase = userData.cyclePhase || "Bilinmiyor";
  
  let budgetInstruction = "";
  if (budget.includes("Kısıtlı")) {
    budgetInstruction = "DİKKAT: Kullanıcının bütçesi ÇOK KISITLI (Öğrenci Bütçesi). Kesinlikle somon, avokado, chia tohumu, kinoa, badem unu, kaju gibi pahalı ve lüks malzemeler YAZMA. Sadece yumurta, yulaf, mercimek, nohut, mevsim yeşillikleri, tavuk göğsü gibi son derece KENDİ BÜTÇESİNE UYGUN, ucuz ve ulaşılabilir malzemelerle harikalar yarat.";
  } else if (budget.includes("Orta")) {
    budgetInstruction = "Kullanıcının bütçesi ORTA HALLİ. Hem ekonomik malzemeleri hem de ara sıra ortalama fiyatlı malzemeleri dengeli kullan.";
  } else {
    budgetInstruction = "Kullanıcının bütçesi ESNEK/İYİ. Somon, avokado, badem unu, organik tohumlar gibi harika ve premium malzemeleri de içeren her türlü zengin içeriği rahatça kullanabilirsin.";
  }

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

${budgetInstruction}

LÜTFEN BU YENİLEMEDE TARİFLER İÇİN ŞU TEMAYA AĞIRLIK VER: "${randomTheme}".
EGZERSİZLER İÇİN İSE ŞU TARZI BENİMSE: "${randomWorkout}".

Yukarıdaki bütçe, döngü ve TEMA sınırlarına HARFİYEN uyarak; 4 adet detaylı yemek tarifi ve 3 adet egzersiz rutini üret. JSON şablonu tam olarak şu olmalı:
{
  "focus": "Günün yeni ve ilham verici odak mesajı",
  "recipes": [
    { "id": 1, "title": "Türkçe Yemek Adı", "time": "25 dk", "cal": "380 kcal", "type": "Yüksek Protein", "ingredients": ["..."], "steps": ["..."] }
  ],
  "workouts": [
    { "id": 5, "title": "Türkçe Egzersiz Adı", "time": "20 dk", "intensity": "Hafif", "type": "Yoga", "movements": [{ "name": "...", "desc": "..."}], "equipmentNote": "..." }
  ]
}
Recipe tipleri şunlardan biri olmalı: "Glütensiz", "Yüksek Protein", "Düşük Karb", "Tümü". Workout tipleri: "Düşük Efor", "Güç", "Yoga". Lütfen daha önce akla gelmeyen, yaratıcı ve Türk damak tadına / ev koşullarına uygun şefkatli rutinler ver.`;
  
  const rawResponse = await getGroqResponse(system, user);
  
  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const parseable = jsonMatch ? jsonMatch[0] : rawResponse;
    return JSON.parse(parseable);
  } catch (error) {
    console.error("Lifestyle JSON Parse Error:", error);
    return null; // Signals fallback to the local static objects
  }
};

// 3. Calm.jsx -> Kriz Anı Chat (Crisis AI)
export const sendCrisisMessage = async (history, message) => {
  const system = getSystemPrompt() + " Şu an kullanıcı bir kriz (yeme atağı veya panik) yaşıyor olabilir. Onu yargılamadan dinle, ismini kullanarak şefkatle hitap et ve nefes egzersizine yönlendir.";
  
  const historyText = history.length > 0 ? "Önceki konuşmalar:\n" + history.map(h => `${h.isUser ? "Kullanıcı" : "Talya"}: ${h.text}`).join('\n') + "\n\n" : "";
  const user = `${historyText}Kullanıcı: ${message}`;
  
  return await getGroqResponse(system, user);
};

// 4. Home.jsx -> Ask Talya Chat (General AI)
export const sendGeneralMessage = async (history, message) => {
  const system = getSystemPrompt() + " Kullanıcı sana genel yaşam tarzı, beslenme veya PCOS hakkında sorular soruyor olabilir. Kısa, öz, samimi ve motive edici yanıtlar ver.";
  
  const historyText = history.length > 0 ? "Önceki konuşmalar:\n" + history.map(h => `${h.isUser ? "Kullanıcı" : "Talya"}: ${h.text}`).join('\n') + "\n\n" : "";
  const user = `${historyText}Kullanıcı: ${message}`;
  
  return await getGroqResponse(system, user);
};
