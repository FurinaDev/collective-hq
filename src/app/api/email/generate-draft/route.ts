import { NextRequest, NextResponse } from "next/server";
import { generateEmailDraft } from "../../../../lib/email-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      senderName,
      senderEmail,
      subject,
      incomingMessage,
      managerNote,
      orgName = "Çağdaş Girişim Platformu",
      orgSettings = {
        calendar_booking_url: "https://calendar.app.google/sample",
        default_form_url: "https://forms.gle/sample",
        signature_title: "Kurumsal İletişim Koordinatörlüğü",
        ai_tone: "professional_warm",
        ai_preferred_provider: "openrouter"
      },
      apiKey
    } = body;

    if (!incomingMessage || !managerNote) {
      return NextResponse.json(
        { error: "Gelen mesaj ve yönetici notu zorunludur." },
        { status: 400 }
      );
    }

    const draft = await generateEmailDraft({
      senderName: senderName || "Yetkili",
      senderEmail: senderEmail || "iletisim@kurum.org",
      subject: subject || "Bilgilendirme",
      incomingMessage,
      managerNote,
      orgName,
      orgSettings,
      apiKey
    });

    return NextResponse.json({ success: true, draft });
  } catch (err: any) {
    console.error("API Error generate-draft:", err);
    return NextResponse.json(
      { error: err.message || "E-posta taslağı üretilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
