import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const apiKeyMatch = envFile.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';
const model = "gemini-2.5-flash";

const body = {
  systemInstruction: { parts: [{ text: "You are a helpful assistant." }] },
  contents: [{ role: "user", parts: [{ text: "Return a JSON object with 'test': 'hello'" }] }],
  generationConfig: { responseMimeType: "application/json" }
};

const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  .then(res => res.json().then(data => ({ status: res.status, data })))
  .then(res => {
     console.log("Status:", res.status);
     if (res.status !== 200) console.log("Error:", res.data);
     else console.log("Success! Output:", res.data?.candidates?.[0]?.content?.parts?.[0]?.text);
  })
  .catch(err => console.error("Fetch Error:", err));
