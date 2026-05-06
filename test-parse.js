import fs from 'fs';

const rawResponse = JSON.parse(fs.readFileSync('debug-out.txt', 'utf-8')).candidates[0].content.parts[0].text;

const safeParseGeminiJson = (rawResponse = '') => {
  if (!rawResponse || typeof rawResponse !== 'string') return null;

  const fenced = rawResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced?.[1] ?? rawResponse;

  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  const sliced = start >= 0 && end > start ? candidate.slice(start, end + 1) : candidate;

  try {
    return JSON.parse(sliced);
  } catch (e) {
    console.error("Parse error 1:", e);
    const repaired = sliced
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/,\s*([}\]])/g, '$1');
    try {
      return JSON.parse(repaired);
    } catch (e2) {
      console.error("Parse error 2:", e2);
      return null;
    }
  }
};

const parsed = safeParseGeminiJson(rawResponse);
console.log(parsed ? "SUCCESS" : "FAIL");
