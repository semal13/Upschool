# Geliştirme Görevleri (Cursor Agent İçin)

- [ ] **Görev 1: Proje İskeleti ve Tasarım Sistemi**
  - Vite ile React projesi oluştur, Tailwind CSS kur.
  - `tailwind.config.js` içine mor, lila ve krem (sıcak/şefkatli) tonlarında renk paleti ekle. Mobil görünümlü bir ana kapsayıcı yap.

- [ ] **Görev 2: Onboarding (Karşılama) Modülü**
  - Kullanıcıdan isim, PCOS zorluk alanı, yaşam tarzı (öğrenci/bütçe kısıtı) ve mevcut döngü evresini alan bir form oluştur. Verileri `localStorage`'a kaydet.

- [ ] **Görev 3: Dashboard (Ana Ekran)**
  - Üstte isme özel selamlama, ortada "Günlük Plan", "Kriz Anı" (en belirgin buton) ve "İçini Dök" butonlarını tasarla.

- [ ] **Görev 4: Kriz Anı Modülü (AI Chat Entegrasyonu)**
  - Anthropic Claude API bağlantısını kur (`.env` içine `VITE_CLAUDE_API_KEY` ekle).
  - Kullanıcı kriz butonuna bastığında açılan, şefkatli ve yargılamayan bir prompt (System Message) ile çalışan chat arayüzünü kodla.

- [ ] **Görev 5: Günlük Plan Modülü**
  - Onboarding'den gelen "döngü evresi" ve "bütçe" verilerini Claude API'ye göndererek, o güne özel 3'lü plan (Beslenme, Hareket, Zihin) üreten ekranı yap.

- [ ] **Görev 6: İçini Dök Duvarı (Vent Wall)**
  - Kullanıcıların anonim metin girebileceği ve daha önce girilen mesajları kartlar halinde (feed) görebileceği bir ekran tasarla (MVP için verileri `localStorage`'da tut).

- [ ] **Görev 7: UI/UX İyileştirmeleri**
  - Butonlara hover efektleri, sayfa geçişlerine animasyonlar ekle. API yanıt beklerken şık bir "Lumina düşünüyor..." loading animasyonu koy.