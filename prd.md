# Ürün Gereksinim Belgesi (PRD) - Talya
**Proje Adı:** Talya (PCOS AI Hayat Koçu)
**Platform:** React Web App (Mobil Öncelikli)
**Aşama:** MVP (AI Buildathon Kapsamı)

## 1. Proje Özeti
Lumina, PCOS ile yaşayan ve kısıtlı bütçeye sahip kadınlar (özellikle öğrenciler) için şefkatli bir yapay zeka yoldaşıdır. Kullanıcıya bütçesine uygun günlük planlar sunar, yeme atakları anında aktif AI müdahalesiyle krizi yönetir ve "İçini Dök" duvarı ile yalnızlık hissini kırar.

## 2. Hedef Kitle
- PCOS tanısı almış, yeme atakları (binge eating) ve psikolojik zorluklar yaşayan kadınlar.
- Pahalı diyetisyenlere bütçesi yetmeyen üniversite öğrencileri.

## 3. Temel Özellikler (SADECE BU KAPSAM GELİŞTİRİLECEKTİR)
- **Kişiselleştirilmiş Onboarding:** Kullanıcıdan Yaş, Bütçe durumu (yurt/ev) ve Döngü evresi (Regl/Foliküler vb.) alınır. Veriler localStorage'da tutulur.
- **Şefkatli Dashboard:** Her sabah kullanıcıya özel, yargılamayan motivasyon mesajı gösterilir.
- **Döngü ve Bütçe Dostu Günlük Plan:** AI tarafından üretilen ekonomik beslenme, hafif hareket ve zihin (nefes) egzersizi önerileri sunulur.
- **Kriz Müdahale Butonu (Core Feature):** Yeme atağı anında devreye giren, 3 adımlı sakinleşme stratejisi sunan şefkatli AI sohbet arayüzü. Kesinlikle "diyetini bozma" gibi emir kipleri kullanmaz.
- **"İçini Dök" Duvarı (Topluluk):** Kullanıcıların anonim olarak dertleştiği basit bir metin paylaşım panosu. (Veriler şimdilik localStorage'da tutulacak).

## 4. Teknik Kısıtlamalar ve Kurallar
- Sadece React (Vite) ve Tailwind CSS kullanılacak.
- AI entegrasyonu Anthropic Claude API ile yapılacak.
- Veritabanı kullanılmayacak, tüm kullanıcı state'leri ve form verileri `localStorage` ile yönetilecek.
- Tasarım dili mor, lila ve krem tonlarında olacak, karanlık mod desteklenecek.