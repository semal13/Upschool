import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const apiKeyMatch = envFile.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
      const models = data.models.map(m => m.name);
      console.log("Available models:", models.includes("models/gemini-2.5-flash") ? "HAS 2.5 FLASH" : "MISSING 2.5 FLASH");
  })
  .catch(console.error);
