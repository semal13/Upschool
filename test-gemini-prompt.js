import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const apiKeyMatch = envFile.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

const systemPrompt = `Sen Talya'sın. PCOS'lu kadınlara şefkatle yaklaşan dijital bir yoldaşsın. Asla tıbbi teşhis koyma.
Tüm yanıtları sadece doğal, günlük TÜRKÇE ile yaz. İngilizce kelime veya harf ekleme.
EĞER mutfak "Mini Mutfak" ise KESİNLİKLE ocak, fırın veya tencerede pişirme işlemi GEREKTİRMEYEN tarifler ver. Sadece sıcak su (kettle), mikrodalga veya çiğ/soğuk (buzdolabı) hazırlanabilen tarifler öner.`;

const userMessage = `YASAK TARİFLER - Bunları kesinlikle önerme: 

KULLANICI PROFİLİ (KESİNLİKLE UY):
 - Bütçe: Öğrenci Dostu
 - Yaşam Tarzı: Belirtilmemiş
 - Mutfak: Mini Mutfak
 - Hedef: Kilo Verme
 - Alerjenler: Alerjen bildirilmedi
 - Diyet Kısıtlamaları: Kısıtlama yok
 - Döngü Evresi: Luteal (Gün: 20) -> KURAL: Magnezyum zengin

Lütfen JSON formatında bütçeme, yaşam tarzıma ve döngü evreme %100 uygun, DAHA ÖNCE VERMEDİĞİN, tamamen YENİ 4 adet yemek tarifi ve TOPLAM 6 ADET BÜTÜNSEL EGZERSİZ RUTİNİ ver.

JSON şablonu tam olarak şu olmalı:
{
  "focus": "Günün yeni odak mesajı",
  "recipes": [
    { "id": 1, "title": "Türkçe Yemek Adı", "time": "25 dk", "cal": "380 kcal", "type": "Yüksek Protein", "ingredients": ["..."], "steps": ["..."] }
  ],
  "workouts": [
    { "id": 5, "title": "Tüm Vücut Sabah Yogası", "time": "20 dk", "intensity": "Hafif", "type": "Yoga", "movements": [{ "name": "Hareket 1", "desc": "Aciklamasi"}], "equipmentNote": "..." }
  ]
}`;

const body = {
  systemInstruction: { parts: [{ text: systemPrompt }] },
  contents: [{ role: "user", parts: [{ text: userMessage }] }],
  generationConfig: { temperature: 0.85, maxOutputTokens: 2000, responseMimeType: "application/json" }
};

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
})
  .then(res => res.json())
  .then(data => {
      console.log(data?.candidates?.[0]?.content?.parts?.[0]?.text);
  })
  .catch(console.error);
