// ==============================================================================
// COLLECTIVE HQ - CV / CANDIDATE PARSER ENGINE
// ==============================================================================

export interface ParsedCvResult {
  full_name: string;
  email: string;
  phone: string;
  education_summary: string;
  ai_summary: string;
  skills: string[];
  experience_years: number;
}

export async function parseCvWithAi(
  cvText: string,
  targetPosition: string,
  fileName: string,
  apiKey?: string
): Promise<ParsedCvResult> {
  const activeKey = apiKey || process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
  if (!activeKey) {
    throw new Error("AI API Key (OPENROUTER_API_KEY veya GEMINI_API_KEY) tanımlı değil.");
  }

  const prompt = `
Sen profesyonel bir işe alım veri çıkarma asistanısın. Aşağıdaki CV metnini yalnızca metinde gerçekten yazan bilgilere dayanarak analiz et. Bilgi yoksa tahmin etme, boş bırak veya 0 ver.

Başvurulan Pozisyon / Alan: ${targetPosition}
Dosya Adı: ${fileName}

SADECE aşağıdaki JSON nesnesini döndür. Markdown, kod bloğu veya açıklama yazma.
{
  "full_name": "Ad Soyad",
  "email": "E-posta",
  "phone": "Telefon numarası",
  "education_summary": "Üniversite ve bölüm",
  "ai_summary": "Adayın deneyim ve yetkinliklerini 2-3 cümlede anlatan objektif özet",
  "skills": ["Yetkinlik 1", "Yetkinlik 2"],
  "experience_years": 2
}

CV METNİ:
${cvText.substring(0, 20000)}
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${activeKey}`,
      "HTTP-Referer": "https://collective-hq.com",
      "X-Title": "Collective HQ - CV Parser"
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CV Parser Hatası: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content?.trim() || "{}";

  // Temiz JSON ayrıştırma
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI geçerli bir JSON yanıtı döndürmedi.");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    full_name: parsed.full_name || fileName.replace(/\.[^/.]+$/, ""),
    email: parsed.email || "",
    phone: parsed.phone || "",
    education_summary: parsed.education_summary || "",
    ai_summary: parsed.ai_summary || "",
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    experience_years: Number(parsed.experience_years) || 0
  };
}
