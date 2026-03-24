# Geliştirme Görevleri (Cursor Agent İçin)

- [ ] **Görev 1: Proje İskeleti ve Tasarım Sistemi**
  - Vite ile React projesi oluştur, Tailwind CSS kur.
  - `tailwind.config.js` içine "Yumuşak Adaçayı Yeşili" (Sage Green), sıcak "Krem/Fildişi" ve "Soft Lila" tonlarında renk paleti ekle. Kartlar için `rounded-3xl` (geniş kavisli) yapı kullan.

- [ ] **Görev 2: Kapsayıcı Onboarding (Karşılama) Modülü**
  - Kullanıcıdan isim, yaş ve kilo al.
  - Semptomlar (Halsizlik, Kilo verememe vb.), Yaşam Tarzı (Yurt, Ev, Ofis) ve Bütçe durumu için **çoklu seçime (multi-select)** izin veren şık kartlar oluştur.
  - Verileri `localStorage`'da `talya:user-profile` anahtarıyla JSON formatında kaydet.

- [ ] **Görev 3: Mimari ve Alt Navigasyon (Bottom Tab Bar)**
  - `App.jsx` içinde Onboarding tamamlanmamışsa sadece Onboarding ekranını göster (Koşullu Render).
  - Tamamlanmışsa; Home, Calm, Lifestyle, Journey ve Community sekmeleri arasında geçiş sağlayan modern bir alt menü (Bottom Navigation) kodla.

- [ ] **Görev 4: Home (Ana Kontrol Merkezi)**
  - Üstte isme özel motive edici selamlama.
  - Ekranda döngü günü, su tüketimi, adım takibi ve duygu durumu (mood) kartları.
  - Ekranın sağ altında her zaman erişilebilir "Talya'ya Danış" (Floating AI Chat) butonu.

- [ ] **Görev 5: AI Motoru ve Sohbet Entegrasyonu (Groq API)**
  - `groq-sdk` paketini kur ve `src/services/groqService.js` dosyasını oluştur.
  - Model olarak `llama3-8b-8192` kullan. API anahtarını bağla.
  - System Prompt: "Sen Talya'sın. PCOS'lu kadınlara şefkatle yaklaş. localStorage verilerini okuyup kişiselleştirilmiş, bütçeye/yaşam tarzına uygun tavsiyeler ver. Tıbbi teşhis koyma."

- [ ] **Görev 6: Calm (Sakinleşme ve Panik Odası)**
  - Yeme atağı veya anksiyete anında kullanılacak, ekranda animasyonlu büyüyüp küçülen "Nefes Al / Nefes Ver" (Breathe in/out) modülü tasarla. Soft lila/mavi gradient arka plan kullan.

- [ ] **Görev 7: Lifestyle ve Journey Ekranları**
  - **Lifestyle:** Kullanıcının bütçe ve yaşam tarzına (ev/yurt) uygun tarifler ve egzersiz kartları oluştur.
  - **Journey:** Kullanıcının istikrarını (streak), duygu durumu trendlerini ve döngü tahmin takvimini görselleştiren analitik ekranı tasarla.

- [ ] **Görev 8: Community (İçini Dök Duvarı)**
  - Kullanıcıların anonim metin girebileceği ve feed halinde görebileceği bir ekran tasarla (MVP için verileri `localStorage`'da tut).

- [ ] **Görev 9: UI/UX İyileştirmeleri**
  - Butonlara hover/aktif efektleri, sayfa geçişlerine akıcı animasyonlar (framer-motion veya CSS transition) ekle. AI yanıt beklerken şık bir "Talya düşünüyor..." yazılıyor animasyonu (typing effect) koy.