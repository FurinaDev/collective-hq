// ==============================================================================
// COLLECTIVE HQ - EMAIL AI & FORMATTING ENGINE
// Migrated & Enhanced from CMP Google Apps Script Automation
// ==============================================================================

import { OrgSettings } from "../types";

interface GenerateEmailDraftParams {
  senderName: string;
  senderEmail: string;
  subject: string;
  incomingMessage: string;
  managerNote: string;
  orgName: string;
  orgSettings: OrgSettings;
  apiKey?: string;
  provider?: "openrouter" | "gemini";
}

interface DraftResult {
  rawBody: string;
  formattedHtml: string;
  suggestedCc: string[];
  suggestedBcc: string[];
}

/**
 * AI tarafından üretilen gövde metnini kurum şablonuyla temiz ve standart HTML'e dönüştürür.
 * Asla çift hitap veya kaymış imza oluşturmaz.
 */
export function buildStandardEmailHtml(
  bodyText: string,
  recipientName: string,
  orgName: string,
  signatureTitle: string,
  calendarUrl?: string,
  formUrl?: string
): string {
  let text = (bodyText || "").trim();
  const name = (recipientName || "").trim() || "İlgili Yetkili";

  // 1. HTML ve Markdown etiketlerini temizle
  text = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\r/g, "")
    .replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>")
    .trim();

  // 2. AI'nin fazladan ekleyebileceği hitap ve kapanışları kaldır
  text = text
    .replace(/^\s*(?:Sayın|Saygıdeğer|Değerli)\s+[^,\n]+,?\s*/i, "")
    .replace(/^\s*(?:Merhaba|Merhabalar|Selam|İyi günler|İyi akşamlar),?\s*/i, "")
    .replace(/\n*\s*(?:Saygılarımızla|Saygılarımla|İyi çalışmalar|Sevgilerimizle),?\s*$/i, "")
    .trim();

  // 3. Paragrafları böl
  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/[ \t]+/g, " ").trim())
    .filter((p) => p.length > 0);

  const htmlParagraphs = paragraphs
    .map((p) => `<div style="margin: 0 0 14px 0;">${p.replace(/\n/g, "<br>")}</div>`)
    .join("");

  // 4. Sabit, jilet gibi Kurumsal Şablon
  const hitapHtml = `<div style="margin: 0 0 14px 0;">Sayın ${name},</div>`;
  const imzaHtml = `
    <div style="margin: 18px 0 0 0; color: #444444;">Saygılarımızla,</div>
    <div style="margin: 4px 0 0 0;">
      <b style="color: #1a365d;">${orgName}</b><br>
      <span style="color: #64748b; font-size: 13px;">${signatureTitle || "Kurumsal Koordinasyon"}</span>
    </div>
  `;

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #222222; line-height: 1.6; max-width: 650px;">
      ${hitapHtml}
      ${htmlParagraphs}
      ${imzaHtml}
    </div>
  `.trim();
}

/**
 * Yönetici notundan CC veya BCC yapılacak e-postaları veya kişileri ayıklar.
 */
export function extractCcBccFromNote(note: string): { cc: string[]; bcc: string[] } {
  const result: { cc: string[]; bcc: string[] } = { cc: [], bcc: [] };
  const text = (note || "").toString();

  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
  let match;
  while ((match = emailRegex.exec(text)) !== null) {
    const email = match[0].trim().toLowerCase();
    const snippet = text.substring(
      Math.max(0, match.index - 50),
      Math.min(text.length, match.index + email.length + 50)
    ).toLowerCase();

    if (snippet.includes("bcc")) {
      result.bcc.push(email);
    } else {
      result.cc.push(email);
    }
  }

  result.cc = Array.from(new Set(result.cc));
  result.bcc = Array.from(new Set(result.bcc));
  return result;
}

/**
 * OpenRouter veya Gemini API üzerinden kurumsal e-posta taslağı üretir.
 */
export async function generateEmailDraft(params: GenerateEmailDraftParams): Promise<DraftResult> {
  const {
    senderName,
    senderEmail,
    subject,
    incomingMessage,
    managerNote,
    orgName,
    orgSettings,
    apiKey,
    provider = "openrouter"
  } = params;

  const prompt = `
ROLÜN:
Sen ${orgName} (${orgSettings.signature_title || "Kurumsal İletişim"}) adına e-postaları yanıtlayan kıdemli bir kurumsal iletişim uzmanısın.

TEMEL GÖREV:
Gelen e-postayı ve yöneticinin verdiği kısa talimatı analiz ederek, gönderilmeye hazır, son derece profesyonel, doğal ve akıcı bir Türkçe e-posta GÖVDESİ yaz.

KESİN ÇIKTI KURALLARI:
1. YALNIZCA gövde paragraflarını yaz.
2. "Sayın ...", "Merhaba" gibi hitapları KESİNLİKLE yazma. Sistem hitabı kendisi ekler.
3. "Saygılarımızla", "İyi çalışmalar" veya imza KESİNLİKLE yazma. Sistem imzayı kendisi ekler.
4. Markdown, HTML, kod bloğu veya yapay süslemeler KULLANMA. Sade metin döndür.
5. Gönderen tarafın eylemini kurumun eylemi gibi tersine çevirme. Örneğin bir davet/bilgilendirme aldıysan teşekkür et ve iç birimlerle paylaşacağını belirt.
6. Yönetici randevu/takvim verilmesini istediyse metinde görüşme takvimi oluşturabileceklerini doğal bir cümleyle belirt.

GELEN E-POSTA:
Gönderen: ${senderName} <${senderEmail}>
Konu: ${subject}
Mesaj İçeriği:
${incomingMessage}

YÖNETİCİ NOTU / TALİMATI:
${managerNote}

KURUM ADI: ${orgName}
`;

  // Varsayılan API çağrısı (OpenRouter / Gemini)
  const activeKey = apiKey || process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
  if (!activeKey) {
    throw new Error("AI API Key (OPENROUTER_API_KEY veya GEMINI_API_KEY) tanımlı değil.");
  }

  // OpenRouter Free Modelleri (Örn. Nemotron, Mistral, Qwen)
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${activeKey}`,
      "HTTP-Referer": "https://collective-hq.com",
      "X-Title": "Collective HQ - Email Assistant"
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
    throw new Error(`AI API Hatası: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content?.trim() || "";

  // CC / BCC tespiti
  const { cc, bcc } = extractCcBccFromNote(managerNote);

  // Randevu / Form linki entegrasyonu
  let bodyWithLinks = rawContent;
  const noteLower = managerNote.toLowerCase();
  if (noteLower.includes("randevu") || noteLower.includes("takvim")) {
    if (orgSettings.calendar_booking_url) {
      bodyWithLinks += `\n\nUygun olduğunuz bir zaman dilimi için görüşme randevunuzu ${orgSettings.calendar_booking_url} üzerinden planlayabilirsiniz.`;
    }
  }

  const formattedHtml = buildStandardEmailHtml(
    bodyWithLinks,
    senderName,
    orgName,
    orgSettings.signature_title,
    orgSettings.calendar_booking_url,
    orgSettings.default_form_url
  );

  return {
    rawBody: bodyWithLinks,
    formattedHtml,
    suggestedCc: cc,
    suggestedBcc: bcc
  };
}
