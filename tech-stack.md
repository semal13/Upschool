# Talya Projesi - Teknik Mimari ve Altyapı Detayları

Talya projesi, geleneksel bir sunucu (backend) mimarisine ihtiyaç duymadan, modern web teknolojilerini ve gelişmiş Yapay Zeka (AI) API'lerini doğrudan istemci (client) tarafında birleştiren **hafif, hızlı ve gizlilik odaklı (privacy-first)** bir yapı üzerine inşa edilmiştir.

İşte projenin teknik arka planını oluşturan temel bileşenler:

## 1. Çatı (Framework) ve Derleme: React & Vite
*   **React (Frontend):** Uygulamanın tüm kullanıcı arayüzü ve mantığı React bileşenleri (components) kullanılarak geliştirildi. Bu sayede Home, Calm, Lifestyle ve Journey gibi sekmeler arası geçişler sayfa yenilenmeden, anında (Single Page Application - SPA formatında) gerçekleşiyor.
*   **Vite:** Geleneksel Webpack veya Create-React-App yerine, çok daha hızlı derleme süreleri (HMR - Hot Module Replacement) sunan Vite kullanıldı. Bu da geliştirme sürecindeki hızımızı artırdı ve projenin boyutunu küçülttü.

## 2. Tasarım ve Stil Dili: Tailwind CSS & Glassmorphism
*   **Tailwind CSS:** Projede hiçbir harici veya geleneksel CSS dosyası kullanılmadı. Tüm tasarımlar doğrudan Tailwind'in "utility-first" sınıfları ile kodlandı.
*   **Modern UI/UX Prensipleri:** Tasarımda PCOS hastalarına hastane hissiyatı vermemek için steril beyazlar/maviler yerine **şefkatli, sıcak ve yatıştırıcı** "Adaçayı Yeşili (Sage Green)", "Lila (Soft Purple)" ve "Krem" tonları kullanıldı.
*   **Kavisli Tasarım (Rounded UI):** Uygulama "Mobil Öncelikli" (Mobile-First) olarak tasarlandı. Tüm butonlar, kartlar ve modal pencereleri yüksek kavisli (`rounded-2xl`, `rounded-3xl`) yapılarak yumuşak bir hissiyat sağlandı.
*   **Glassmorphism:** Yarı saydam arka planlar, bulanıklık efektleri (`backdrop-blur`) ve şık gölgelendirmelerle (glow efektleri) projeye "premium" bir dokunuş katıldı.

## 3. Veri Yönetimi ve Gizlilik: Backend-Less Mimari (Sıfır Sunucu)
*   **Yerel Depolama (Local Storage):** Talya'nın **en büyük avantajlarından biri** kullanıcı gizliliğidir. Kullanıcıların girdiği çok hassas veriler (regl döngüsü günü, bütçe kısıtlamaları, yeme atakları, boy/kilo) **hiçbir uzak veritabanına (SQL/NoSQL) veya sunucuya KAYDEDİLMEZ.**
*   Tüm veriler cihazın kendi tarayıcı belleğinde (localStorage içerisinde `talya:user-profile`, `talya_cycle_sync` gibi anahtarlarla) JSON formatında tutulur. Bu, projenin hem KVKK/GDPR uyumlu olmasını hem de anında yanıt vermesini sağlar.

## 4. Yapay Zeka Entegrasyonu: Google Gemini 2.5 Flash
*   **Doğrudan REST API Entegrasyonu:** Proje başlangıçta Groq kullanırken sonradan daha güçlü JSON işleme ve doğal dil desteği sunan **Google Gemini (gemini-2.5-flash)** modeline taşındı.
*   **Gerçek Zamanlı Sohbet (SSE - Server Sent Events):** Talya ile yapılan sohbetlerde yanıtın tümünün gelmesi beklenmez. Kelimeler üretildikçe ekrana akmasını (typing efekti) sağlayan akış (streaming) mimarisi kuruldu.
*   **Yapılandırılmış Veri Üretimi (JSON Mode):** Lifestyle (Yaşam Tarzı) sayfasındaki tarifler ve egzersizler rastgele metinler değildir. Gemini'ye arka planda özel bir "System Prompt" (Sistem Komutu) gönderilerek çıktının kesin bir **JSON formatında** olması zorunlu tutulmuştur.

## 5. Dinamik Prompt Mühendisliği (Context-Aware AI)
Talya, standart bir ChatGPT botu değildir. Kullanıcı `Lifestyle` sekmesinde tarif istediğinde, Talya arka planda cihazın belleğinden şu verileri toplar:
1.  **Döngü Evresi:** (Örn: Luteal evrede magnezyum ağırlıklı tavsiyeler)
2.  **Mutfak İmkanı:** (Örn: Sadece "Kettle" varsa asla ocakta pişen yemek önermeme kuralı)
3.  **Bütçe:** (Örn: Öğrenci dostu kısıtlı bütçe)
4.  **Alerjenler:** (Örn: Gluten intoleransı)

Bu parametreler birleştirilerek Gemini modeline görünmez bir "Zorunlu Kural Seti" olarak yollanır ve AI tam olarak o anki kullanıcıya %100 uyarlanmış (Hyper-Personalized) sonuçlar üretir.

## 6. Güvenlik ve Hata Yönetimi (Fallback Mechanisms)
*   Yapay zeka modelleri bazen geç yanıt verebilir veya JSON formatını bozabilir. Uygulamanın böyle anlarda çökmemesi için `buildEmergencyPlan` adında bir **Acil Durum / Yedek Plan** sistemi kurulmuştur.
*   Bağlantı kopması durumunda uygulama kullanıcıya hatayı teknik bir dille değil, "Bir anlığına bağlantımız koptu ama ben seninleyim..." gibi şefkatli bir UI diliyle aktarır.

## Özetle;
Talya projesi, **Tailwind CSS** ile tasarlanmış modern ve duyarlı bir ön yüze sahip, tüm veriyi kullanıcının cihazında güvenle tutan, arka planda **Google Gemini 2.5 Flash** modelini karmaşık **Prompt Engineering** taktikleriyle (JSON mode, Streaming) kullanarak kullanıcının anlık hayat koşullarına göre kendini şekillendiren bağımsız ve akıllı bir **Frontend Yapay Zeka** uygulamasıdır.