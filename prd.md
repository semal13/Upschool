# Ürün Gereksinim Belgesi (PRD) - Talya
**Proje Adı:** Talya (PCOS AI Hayat Koçu)
**Platform:** React Web App (Mobil Öncelikli, PWA Uyumluluğuna Hazır)
**Aşama:** MVP (AI Buildathon Kapsamı)

## 1. Proje Özeti
Talya, Polikistik Over Sendromu (PCOS) ile yaşayan kadınlar için tasarlanmış şefkatli, kapsayıcı ve zeki bir dijital yoldaştır. Kullanıcının yaşam tarzına (öğrenci, çalışan, ev hanımı) ve bütçesine göre anlık adapte olabilen Talya; kişiselleştirilmiş beslenme/egzersiz planları sunar, anksiyete veya yeme atakları (binge eating) sırasında aktif AI müdahalesiyle krizi yönetir ve kadınların gelişimini (streak) takip ederek onlara yalnız olmadıklarını hissettirir.

## 2. Hedef Kitle
- PCOS tanısı almış, hormonal dalgalanmalar, yeme atakları ve psikolojik zorluklar (halsizlik, anksiyete) yaşayan tüm kadınlar.
- Yaşam tarzı ve bütçe açısından çeşitlilik gösteren geniş bir kitle: Yurtta/evde kalan üniversite öğrencileri, ofiste/sahada çalışan profesyoneller veya evden çalışan kadınlar.

## 3. Temel Özellikler ve Modüller (MVP Kapsamı)

**A. Kapsayıcı ve Dinamik Onboarding:**
- Kullanıcıdan temel veriler (İsim, Yaş, Kilo) alınır.
- **Çoklu Seçim (Multi-select) ile Yaşam Tarzı:** "Öğrenciyim (Yurtta)", "Öğrenciyim (Evde)", "Çalışıyorum (Ofiste/Dışarıda)", "Evden Çalışıyorum / Ev Hanımıyım".
- **Bütçe Esnekliği:** "Kısıtlı Bütçe", "Esnek / Bütçe Sorunum Yok" gibi seçenekler.
- **Semptom Takibi:** "Halsizlik ve Yorgunluk", "Kilo Verememe", "Düzensiz Döngü", "Yeme Atakları" vb. şikayetlerin çoklu seçimi.
- *Tüm veriler `localStorage` (`talya:user-profile`) üzerinde JSON formatında tutulur.*

**B. Ana Kontrol Merkezi (Dashboard / Home):**
- Her sabah kullanıcıya özel, AI destekli yargılamayan motivasyon mesajı.
- Günlük döngü günü, su tüketimi, adım takibi ve duygu durumu loglama (mood tracker) arayüzü.
- Talya ile hızlı sohbet (Floating AI Chat) başlatma butonu.

**C. Sakinleşme ve Kriz Odası (Calm / Panic Room):**
- Anksiyete veya yeme atağı anında devreye giren şefkatli modül.
- Görsel olarak yönlendiren, animasyonlu **Nefes Egzersizi (Breathe in/out)** aracı.
- Acil durumlarda Talya'nın (AI) kullanıcıyı yargılamadan dinlediği ve sakinleşme stratejileri sunduğu hızlı erişim.

**D. Yaşam Tarzı Koçu (Lifestyle):**
- Kullanıcının bütçesine, mutfak imkanlarına (yurt/ev) göre AI tarafından filtrelenen PCOS dostu tarifler (Glutensiz, Düşük Karbonhidrat).
- Kullanıcının bulunduğu ortama göre egzersiz önerileri (Örn: Yurttakiler için ekipmansız mat egzersizleri, bütçesi olanlar için ağırlıklı antrenmanlar).

**E. Başarı ve Gelişim Takibi (Journey / Analytics):**
- Kullanıcının istikrarını kutlayan "Streak" (Seri) sayaçları.
- Duygu durumu trendleri ve döngü tahmin takvimi.
- Küçük başarıların (örn: 3 gün üst üste su hedefine ulaşma) rozetlerle kutlanması.

**F. "İçini Dök" Duvarı (Topluluk):**
- Kullanıcıların anonim olarak dertleştiği, başarılarını veya o günkü zorluklarını paylaştığı metin paylaşım panosu. *(MVP aşamasında veriler localStorage ile simüle edilecektir).*

## 4. Teknik Kısıtlamalar ve Mimari Kurallar
- **Frontend:** React (Vite) ve Tailwind CSS kullanılacak.
- **AI Motoru:** Yüksek hız ve performans için **Groq API (Llama 3)** kullanılacak.
- **Veri Yönetimi:** Backend veya harici veritabanı kullanılmayacak. Tüm kullanıcı state'leri, form verileri ve sohbet geçmişi cihazın `localStorage` belleğinde yönetilecek.
- **Tasarım Dili (UI/UX):** Medikal ve soğuk bir görünümden uzak durulacak. Şifa ve ferahlık hissi veren "Yumuşak Adaçayı Yeşili" (Sage Green), sıcak "Krem/Fildişi" arka planlar ve Calm odası için "Soft Lila/Mavi" geçişleri (gradient) kullanılacak. Tüm kartlar geniş kavisli (rounded-3xl) ve mobil uyumlu olacak.