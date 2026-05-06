import { isStrictNoFallback } from "../lib/envFlags.js";

export const sendSymptomsToN8n = async (symptomsData) => {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  // symptomsData already contains the fully structured userProfile from Journey.jsx
  const payload = { ...symptomsData };

  if (!webhookUrl || webhookUrl.includes('[') || !webhookUrl.startsWith('http')) {
    if (isStrictNoFallback()) {
      return {
        success: false,
        analysis:
          "Strict mod: n8n webhook adresi tanımlı değil. .env dosyanda Journey için geçerli bir HTTPS webhook URL’si ayarla (placeholder bırakma).",
        recipe: null,
        tea: "",
        workout: null,
      };
    }
    console.warn("n8n Webhook URL bulunamadı veya placeholder (geçersiz), mock veri dönülüyor.");
    // Simulate network delay for UI feedback
    await new Promise(res => setTimeout(res, 2500));
    
    // Fake AI Response logic based on symptoms
    let mockAnalysis = "Bugün kendini nasıl hissettiğini paylaştığın için teşekkürler. Yaşam koşullarını da (mutfak ve bütçe) göz önünde bulundurarak sana en uygun, bütçe dostu, pratik formülü hazırladım.";
    let mockRecipe = { 
      title: "Dengeli Glutensiz Yulaf Kasesi", 
      ingredients: ["3 kaşık glutensiz yulaf ezmesi", "Yarım yeşil elma", "1 çay kaşığı tarçın", "1 bardak sıcak su veya badem sütü"],
      steps: ["Yulafları bir kaseye alın ve üzerine sıcak sıvıyı ekleyin.", "Elmaları küçük küpler halinde doğrayın.", "Kaseye elmaları ve tarçını ekleyip 5 dakika dinlendirin."]
    };
    let mockTea = "Metabolizma Hızlandırıcı Yeşil Çay";
    let mockWorkout = "15 dk Canlandırıcı Pilates Serisi";
    
    // Ağır kramp veya gecikme durumları
    if (payload.painLevel > 3 || payload.cycleStatus === 'Gecikti / Henüz Olmadım') {
      mockAnalysis = "Bu aralar bedenine çok yüklendiğini ve hassaslaştığını görüyorum. Özellikle yurt koşullarında bile rahatça yapabileceğin stres azaltıcı ve ödem atıcı bir ritüele ihtiyacın var. Yurt Modu Aktif!";
      mockWorkout = "Hafif Yoga ve Pelvik Esneme";
      mockTea = "Papatya ve Taze Zencefil Çayı";
      mockRecipe = { 
        title: "Kettle'da Altın Süt", 
        ingredients: ["1 bardak süt (badem veya inek)", "Yarım çay kaşığı zerdeçal", "Bir çimdik karabiber", "1 çay kaşığı bal"],
        steps: ["Sütü kettle'da veya ocakta ısıtın.", "Bardağa zerdeçal ve karabiberi koyun.", "Isınan sütü ekleyip karıştırın, en son ılıyınca balı ekleyin."]
      };
    } 
    // Yorgunluk 
    else if (payload.moods && payload.moods.includes('Yorgun')) {
      mockAnalysis = "Enerjinin düşük olduğunu görebiliyorum. Bütçe dostu ve 10 Dakika Hızlı hazırlayabileceğin bir enerji bombası ile kan şekerini toparlıyoruz.";
      mockWorkout = "10 dk Açık Hava Tempolu Yürüyüş";
      mockTea = "Limonlu Ilık Su";
      mockRecipe = { 
        title: "Kan Şekerini Dengeleyen Fıstık Ezmeli Dilimler", 
        ingredients: ["1 adet tam buğday wasa veya pirinç patlağı", "1 tatlı kaşığı şekersiz fıstık ezmesi", "Yarım muz", "Chia tohumu"],
        steps: ["Wasa'nın üzerine fıstık ezmesini sürün.", "Muzları ince ince dilimleyip yerleştirin.", "Üzerine chia tohumu serpiştirerek tüketin."]
      };
    }
    // Şişkinlik
    else if (payload.moods && payload.moods.includes('Şişkin')) {
      mockAnalysis = "Şişkinlik hissi PCOS döneminde çok normaldir, kendini suçlama. Karbonhidratı biraz kısıp ödem atıcılara odaklanacağımız öğrenci dostu bir rutin ayarladım.";
      mockWorkout = "Sindirim Destekleyici Omurga Burguları";
      mockTea = "Rezene Çayı";
      mockRecipe = { 
        title: "Kavanozda Anti-İnflamatuvar Salata", 
        ingredients: ["Yarım kutu haşlanmış konserve nohut (Yurt dostu)", "1 avuç roka", "Limon", "Zeytinyağı"],
        steps: ["Konserve nohutları süzüp yıkayın.", "Kavanozun altına limon ve yağı koyun.", "Üzerine nohutları ve en üste rokayı ekleyip çalkalayın."]
      };
    }

    return {
      success: true,
      analysis: mockAnalysis,
      recipe: mockRecipe,
      tea: mockTea,
      workout: mockWorkout
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      if(response.status === 404) throw new Error('n8n Webhook bulunamadı (URL hatalı veya webhook-test süresi dolmuş)');
      throw new Error(`Ağ hatası: n8n sunucusu ${response.status} döndürdü`);
    }
    let rawData = await response.json();
    let data = Array.isArray(rawData) ? (rawData[0] || {}) : rawData;
    // Eğer n8n raw item formatında döndüyse (örn: [{ json: { analysis: "..." } }])
    if (data.json && typeof data.json === 'object') {
      data = data.json;
    }
    
    // Normalization for recipe
    let parsedRecipe = data.recipe || data.tarif || null;
    
    // Eğer n8n yeni formattaki gibi düz yapı dönüyorsa (tarif_adi, malzemeler, hazirlanis)
    if (!parsedRecipe && data.tarif_adi) {
      parsedRecipe = {
        title: data.tarif_adi,
        ingredients: Array.isArray(data.malzemeler) ? data.malzemeler : (typeof data.malzemeler === 'string' ? [data.malzemeler] : ["Malzemeler belirtilmemiş"]),
        steps: Array.isArray(data.hazirlanis) ? data.hazirlanis : (typeof data.hazirlanis === 'string' ? [data.hazirlanis] : ["Hazırlanış belirtilmemiş"])
      };
    } else if (typeof parsedRecipe === 'string') {
      try {
        parsedRecipe = JSON.parse(parsedRecipe);
      } catch (e) {
        parsedRecipe = {
          title: "Sana Özel Tarif",
          ingredients: ["Malzemeler n8n metninde yer alıyor"],
          steps: [parsedRecipe]
        };
      }
    }

    // Normalization for workout
    let parsedWorkout = data.workout || data.egzersiz || data.rutin || data.egzersiz_detay || "Hafif Egzersiz";
    if (typeof parsedWorkout === 'string' && parsedWorkout.trim().startsWith('{')) {
      try {
        parsedWorkout = JSON.parse(parsedWorkout);
      } catch (e) {}
    }

    // Normalization for analysis
    let parsedAnalysis = data.analysis || data.text || data.neden_uygun || data.talya_notu || "Veriler başarıyla analiz edildi.";

    return {
      success: true,
      analysis: parsedAnalysis,
      recipe: parsedRecipe,
      tea: data.tea || data.cay || data.çözüm || "Rahatlatıcı Çay",
      workout: parsedWorkout,
      ...data
    };
  } catch (error) {
    console.error("n8n Servis Hatası:", error);
    return {
      success: false,
      analysis: `Şu an analiz sistemine bağlanamıyorum (${error.message}). Lütfen n8n webhook URL'sini (webhook-test yerine webhook) kontrol edin veya Gemini API limitinizin dolmadığından emin olun.`,
      recipe: null,
      tea: "Papatya Çayı (Sakinleştirici)",
      workout: "Nefes Egzersizi"
    };
  }
};

export const getCommunityMessages = async () => {
  const url = import.meta.env.VITE_N8N_MESSAGE_GET_URL;
  const defaults = [
    { id: 1, text: "Yalnız değilsin 💜", author: "Anonim", time: "2 saat önce" },
    { id: 2, text: "Bugün kendime iyi bakıyorum", author: "Anonim", time: "5 saat önce" },
    { id: 3, text: "Küçük adımlar, büyük zaferler!", author: "Anonim", time: "1 gün önce" },
    { id: 4, text: "PCOS'un bizi tanımlamasına izin vermeyelim 🌸", author: "Anonim", time: "2 gün önce" }
  ];
  if (!url || url.includes('[') || !url.startsWith('http')) {
    return isStrictNoFallback() ? [] : defaults;
  }
  
  try {
     const res = await fetch(url);
     const data = await res.json();
     const list = Array.isArray(data.messages) ? data.messages : [];
     if (list.length > 0) return list;
     return isStrictNoFallback() ? [] : defaults;
  } catch (e) {
     return isStrictNoFallback() ? [] : defaults;
  }
};

export const postCommunityMessage = async (text) => {
  const url = import.meta.env.VITE_N8N_MESSAGE_POST_URL;
  if (!url || url.includes('[') || !url.startsWith('http')) {
    return isStrictNoFallback()
      ? { success: false, error: "Topluluk mesajı gönderme URL’i .env içinde tanımlı değil." }
      : { success: true };
  }
  
  try {
     const res = await fetch(url, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message: text, timestamp: new Date().toISOString() })
     });
     return await res.json();
  } catch(e) {
     return { success: false };
  }
};

export const fetchPreviousRecommendations = async (userId) => {
  const url = import.meta.env.VITE_N8N_HISTORY_GET_URL || 'https://semal13.app.n8n.cloud/webhook/Talya-journey-history';
  if (!url || url.includes('[') || !url.startsWith('http')) {
    return [];
  }
  
  try {
     const res = await fetch(`${url}?userId=${encodeURIComponent(userId)}`);
     const data = await res.json();
     return Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
  } catch (e) {
     console.error("Geçmiş verileri çekerken hata:", e);
     return [];
  }
};
