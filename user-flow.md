# Kullanıcı Akışı (User Flow) - Talya

1. **Uygulamaya İlk Giriş (Kapsayıcı Onboarding)**
   - Kullanıcı uygulamayı açar ve "Talya'ya hoş geldin" mesajıyla karşılaşır.
   - İsim, yaş ve kilo bilgileri istenir.
   - **Çoklu Seçim (Multi-select) Ekranları:** Kullanıcı; zorlandığı semptomları (Halsizlik, Yeme Atakları vb.), yaşam tarzını (Yurtta/Evde Öğrenci, Çalışan) ve bütçe durumunu (Kısıtlı/Esnek) seçer.
   - Veriler cihaza (localStorage) kaydedilir ve kullanıcı doğrudan Ana Ekrana (Home) yönlendirilir.

2. **Ana Ekran (Home / Dashboard) Deneyimi**
   - Kullanıcı, her sabah güncel koşullarına (öğrenci/çalışan) özel, şefkatli bir motivasyon mesajı okur.
   - Günlük döngü günü, su tüketimi, adım takibi ve duygu durumunu (mood) tek ekrandan hızlıca günceller.
   - Ekranın altında her zaman 5 sekmeli modern bir menü (Home, Calm, Lifestyle, Journey, Community) ve sağ altta Talya ile anında mesajlaşabileceği yüzen (floating) bir AI sohbet butonu bulunur.

3. **Senaryo A: Kriz Anı ve Sakinleşme (Calm Odası)**
   - Kullanıcı yeme atağı veya anksiyete hissettiğinde alt menüden **Calm** sekmesine geçer.
   - Ekranda büyüyüp küçülen, görsel olarak rahatlatıcı "Nefes Al / Nefes Ver" animasyonunu takip ederek nabzını düşürür.
   - İhtiyaç duyarsa "Talya'ya Danış" butonuna basar. AI (Groq), kullanıcının adını ve bütçe/yaşam tarzı verilerini bilerek anında şefkatle devreye girer: *"Seni duyuyorum. Bu hormonlarının sesi, senin suçun değil. Hadi önce birlikte derin bir nefes alalım..."*

4. **Senaryo B: Yaşam Tarzı ve Gelişim (Lifestyle & Journey)**
   - Kullanıcı **Lifestyle** sekmesine girer. Talya (AI), kullanıcının mutfak imkanlarına (örn: yurt mutfağı) ve bütçesine uygun pratik tarifler ile bulunduğu ortama uygun (örn: ekipmansız mat) egzersizler sunar.
   - Kullanıcı **Journey** sekmesine geçerek, o güne kadar elde ettiği başarıları (Streak/Seri), duygu durumu trendlerini ve kazandığı rozetleri görerek motive olur.

5. **Senaryo C: Toplulukla Dertleşme (Community)**
   - Kullanıcı yalnız hissettiğinde alt menüden **Community** (İçini Dök Duvarı) sekmesine girer.
   - Başka PCOS'lu kadınların anonim olarak paylaştığı zorlukları veya zaferleri okur.
   - Kendisi de o anki hislerini anonim bir karta yazarak duvara asar ve rahatlamış bir şekilde uygulamadan çıkar.