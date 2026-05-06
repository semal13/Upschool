import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const apiKeyMatch = envFile.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

const body = {
  systemInstruction: { parts: [{ text: "Sen Talya'sın." }] },
  contents: [{ role: "user", parts: [{ text: "Lütfen JSON formatında bütçeme uygun DAHA ÖNCE VERMEDİĞİN 4 adet yemek tarifi ve 6 egzersiz ver." }] }],
  generationConfig: { temperature: 0.85, maxOutputTokens: 2000, responseMimeType: "application/json" }
};

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
})
  .then(res => res.json())
  .then(data => {
      console.log("Finish Reason:", data?.candidates?.[0]?.finishReason);
      console.log("Length:", data?.candidates?.[0]?.content?.parts?.[0]?.text.length);
  })
  .catch(console.error);
