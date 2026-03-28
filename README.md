cat > README.md << 'EOF'
# Talya — PCOS'lu Kadınların Dijital Yoldaşı

## Problem
PCOS yaşayan kadınlar için mevcut sağlık uygulamaları sadece kalori sayar ya da genel tarifler sunar. Hiçbiri şunu yapmıyor:
- Döngü evresine göre beslenme önermek
- Bütçe ve mutfak koşullarına gerçekten uymak
- Yeme ataklarıyla o an, orada başa çıkmak
- Psikolojik desteği beslenme ve egzersizle birleştirmek

PCOS sadece fiziksel değil — kaygı, yeme atakları, motivasyon kaybı da bu hastalığın parçası. Ama hiçbir uygulama bütünü göremiyor.

## Çözüm
Talya, PCOS'lu kadınlara üç alanda aynı anda destek veren bir AI yoldaşıdır:

🥗 **Beslenme** — Bütçeye, mutfağa, alerjen ve döngü evresine göre her gün farklı, kişisel tarifler

💪 **Egzersiz** — Döngü evresine uygun yoga, güç ve düşük efor rutinleri

🧠 **Psikolojik Destek** — Yeme atağı anında kriz modu, panik anı topraklanma egzersizleri, sabah motivasyonu

Talya bir diyet uygulaması değil — PCOS'lu kadının yanında olan, onu tanıyan, o anki koşullarına göre konuşan bir dijital yoldaş.

## Canlı Demo
Yayın Linki: https://beamish-kataifi-9ce2ac.netlify.app
Demo Video: 

## Kullanılan Teknolojiler
- React + Vite (Frontend)
- Tailwind CSS (UI)
- Groq API / LLaMA 3 (AI önerileri)
- n8n (Workflow otomasyonu)
- localStorage (Kullanıcı profili)
- Netlify (Deploy)

## Nasıl Çalışır?
1. Kullanıcı profil oluşturur (yaşam tarzı, bütçe, mutfak, hedef, alerjenler)
2. Talya döngü evresini hesaplar ve o güne özel plan üretir
3. AI her gün profile özel 4 tarif + 6 egzersiz rutini sunar
4. Kriz anında "Sakin Ol" modu devreye girer — topraklanma ve nefes egzersizleri
5. Kullanıcı tarifleri favoriler, geri bildirim verebilir

## Nasıl Çalıştırılır?
```bash
npm install
cp .env.example .env  # API key'lerini ekle
npm run dev
```

## Gerekli Environment Variables
- VITE_GROQ_API_KEY
- VITE_N8N_WEBHOOK_URL
EOF

git add README.md
git commit -m "docs: README hikayesi güncellendi"
git push
