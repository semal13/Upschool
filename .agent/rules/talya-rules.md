---
trigger: always_on
---

# Talya Projesi - Temel Geliştirme Kuralları (Core Rules)

**1. Proje Kimliği ve İletişim Tonu:**
- Proje Adı: Talya (PCOS'lu kadınlar için dijital yoldaş).
- Ton: Şefkatli, kapsayıcı, motive edici ve yargılamayan bir dil kullan. Asla tıbbi teşhis koyma veya emir kipiyle ("diyetini bozma" gibi) konuşma.

**2. Tasarım Dili (UI/UX) ve CSS Sınırları:**
- Framework: Kesinlikle sadece Tailwind CSS kullan. Harici CSS dosyaları yazma.
- Renk Paleti: "Adaçayı Yeşili" (Sage green), sıcak "Krem/Fildişi" ve "Soft Lila" tonlarını kullan. Hastane veya medikal hissi veren soğuk renklerden uzak dur.
- Kavisler: Uygulama mobil önceliklidir. Kartlar, butonlar ve görseller her zaman geniş kavisli (`rounded-2xl` veya `rounded-3xl`) olmalıdır.

**3. Teknik Mimari ve Kısıtlamalar:**
- Veritabanı veya Backend kullanmak KESİNLİKLE YASAKTIR.
- Tüm kullanıcı verilerini (isim, çoklu seçim semptomlar, bütçe durumu vb.) sadece cihazın `localStorage` belleğinde `talya:user-profile` anahtarıyla JSON formatında tut.
- AI entegrasyonu için sadece `groq-sdk` ve Llama 3 (`llama3-8b-8192`) modelini kullan. 

**4. Ajan (Agent) Otonomisi ve Artifact Üretimi:**
- Yeni bir sayfa veya bileşen kodladığında, işlemi bitirmeden önce entegre tarayıcıyı kullanarak tıkla ve test et.
- Bana sadece "Kodu yazdım" demek yerine, mutlaka işlemin çalıştığını kanıtlayan bir Artifact (görsel kanıt, task listesi güncellenmesi veya terminal çıktısı) sun.