"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Send, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  UserCheck, 
  Calendar, 
  ShieldCheck, 
  FileText,
  Clock,
  Layers,
  Paperclip
} from "lucide-react";

interface CommsTemplate {
  id: string;
  category: "Yatırımcı" | "Resmi / Hibe" | "B2B Sponsorluk" | "Ekip Yönetimi";
  name: string;
  defaultRecipient: string;
  defaultCc: string;
  defaultSubject: string;
  promptInstructions: string;
  generatedBody: string;
  executiveSignature: string;
}

const TEMPLATES: CommsTemplate[] = [
  {
    id: "investor_update",
    category: "Yatırımcı",
    name: "Aylık Yatırımcı Bilgilendirme Raporu (Monthly Update)",
    defaultRecipient: "investors@venturepartners.com",
    defaultCc: "founders@startup.io",
    defaultSubject: "[ŞİRKET ADI] - Eylül / Ekim Yatırımcı İlerleme Notu: MRR, Runway ve Dönüm Noktaları",
    promptInstructions: "Bu ay ARR %24 arttı, yeni ürün modülü canlıya alındı, 1 kıdemli yazılımcı işe alındı. 16 aylık runway mevcut. Girişimcilere 2 konuda destek çağrısı yap.",
    generatedBody: `Değerli Yatırımcılarımız ve Danışmanlarımız,

Ekim ayı operasyonel ve finansal kapanış raporumuzu sizlerle paylaşmaktan memnuniyet duyuyoruz. Bu dönemde odağımız, çekirdek ürün metriklerini sabitlemek ve kurumsal B2B dağıtım hattını ölçeklemekti.

📊 TEMEL FİNANSAL VE ÜRÜN METRİKLERİ:
- MRR (Aylık Tekrarlayan Gelir): ₺340.000 (%24 MoM Artış)
- Net Nakit Yakım (Monthly Burn): ₺115.000 / ay
- Kalan Nakit Runway: 16.5 Ay
- Aktif B2B Müşteri / Pilot Sayısı: 14 Kurum (Churn: %0)

🚀 TAMAMLANAN KRİTİK DÖNÜM NOKTALARI:
1. Kurumsal API ve Google Workspace iki yönlü veri entegrasyonu başarıyla canlıya alındı.
2. Ar-Ge ekibimize Kıdemli Sistem Mimarı katıldı.
3. TÜBİTAK 1507 hibe başvurumuz jüri değerlendirme aşamasına geçti.

🤝 YATIRIMCI VE NETWORK DESTEK TALEPLERİMİZ:
- Fintek ve e-ticaret dikeyinde kurumsal CTO seviyesinde 2 sıcak tanışma.
- Yurt dışı açılımı için Delaware C-Corp hukuk danışmanlığı tavsiyesi.

Detaylı finansal tablo ve metrik dökümüne Google Drive bağlantımızdan erişebilirsiniz. Gösterdiğiniz kesintisiz güven ve ortaklık için teşekkür ederiz.`,
    executiveSignature: `Saygılarımla,\nKurucu & CEO\n[Şirket / Platform Adı]\nWeb: https://startup.io | Takvim: https://cal.com/founder`
  },
  {
    id: "grant_official",
    category: "Resmi / Hibe",
    name: "TÜBİTAK / KOSGEB Resmi Proje Durum ve Revizyon Yazısı",
    defaultRecipient: "proje.takip@tubitak.gov.tr",
    defaultCc: "mali.musavir@denetim.com",
    defaultSubject: "Proje No: 1507-2026-X: Ar-Ge Personel Revizyonu ve 1. Dönem İlerleme Raporu Teslimi",
    promptInstructions: "Resmi devlet dili kullan. 1. dönem ilerleme raporunun sisteme yüklendiğini, 1 araştırmacı değişikliği için onay talep edildiğini belirt.",
    generatedBody: `TÜBİTAK TEKNOLOJİ VE YENİLİK DESTEK PROGRAMLARI BAŞKANLIĞI’NA (TEYDEB),

İlgi: 1507-Ar-Ge Başlangıç Destek Programı Kapsamında Yürütülen [Proje Adı] Başlıklı ve [1507-2026-XXXX] Numaralı Projemiz.

İlgide kayıtlı projemizin 1. İzleme Dönemi (01.05.2026 - 31.10.2026) faaliyetleri proje takvimine ve iş paketlerine tam uyumlu olarak tamamlanmış olup, Dönem İlerleme Raporu (YMM Onaylı Mali Rapor dahil olmak üzere) PRODİS sistemi üzerinden Başkanlığınıza arz edilmiştir.

Projenin 2. İş Paketinde öngörülen derin öğrenme algoritmalarının optimizasyonu sürecinde, ekibimize yeni dahil olan Araştırmacı [Personel Adı Soyadı]'nın projeye dahil edilmesi hususunda hazırlanan gerekçeli revizyon formu ekte bilginize sunulmaktadır.

Gereğinin yapılmasını ve proje ekibi revizyonunun onaylanmasını tensiplerinize saygılarımla arz ederim.`,
    executiveSignature: `Proje Yürütücüsü & Şirket Yetkilisi\n[Kurum / Şirket Unvanı]\nVergi No: 1234567890 | İletişim: +90 (212) 000 00 00`
  },
  {
    id: "sponsorship_pitch",
    category: "B2B Sponsorluk",
    name: "B2B / Kurumsal Sponsorluk ve İş Birliği Teklifi",
    defaultRecipient: "kurumsal.iletisim@globalbrand.com",
    defaultCc: "sponsorluk@kolektif.org",
    defaultSubject: "[Kolektif / Marka Adı] x [Hedef Marka]: 2026 Yenilikçi Kültür & Teknoloji Ortaklığı",
    promptInstructions: "Hedef markaya değer katan, soğuk satış gibi durmayan, yüksek prestijli bir kültür-sanat & teknoloji iş birliği teklifi yaz.",
    generatedBody: `Sayın [Yetkili Adı],

[Hedef Marka]'nın genç profesyonellere, kültürel sürdürülebilirliğe ve açık inovasyona verdiği öncü desteği uzun süredir ilgiyle takip ediyoruz.

Biz [Kolektif / Şirket Adı] olarak, 2026 sezonunda 8.000'in üzerinde teknoloji profesyoneli, bağımsız sanatçı ve girişimciyi bir araya getireceğimiz hibrit programlar serisini başlatıyoruz. 

Markanızın bu vizyonda yalnızca bir logo olarak değil;
- 'Geleceğin İnovasyon Sahnesi' ana oturum ev sahipliği,
- Dijital ekosistemimizde 45.000+ nitelikli sektör profesyoneline doğrudan erişim,
- Genç yetenek burs fonu ortaklığı
boyutlarıyla ana stratejik paydaşımız olarak yer almasını arzu ediyoruz.

Sizin için hazırladığımız 6 sayfalık kurumsal iş birliği dosyamızı incelemeniz ve 15 dakikalık bir kahve / tanışma toplantısı gerçekleştirmek üzere takvim linkimi takdirlerinize sunuyorum.`,
    executiveSignature: `En içten saygılarımla,\nGenel Koordinatör & Kurucu\n[Kolektif / Platform Adı]\nTelefon: +90 532 000 00 00 | Dosya İnceleme: https://docs.google.com/presentation/örnek_sunum`
  }
];

export function CommsStudio({ 
  onSaveToDocs 
}: { 
  onSaveToDocs?: (title: string, type: "google_docs") => void 
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<CommsTemplate>(TEMPLATES[0]);
  const [recipient, setRecipient] = useState(selectedTemplate.defaultRecipient);
  const [cc, setCc] = useState(selectedTemplate.defaultCc);
  const [subject, setSubject] = useState(selectedTemplate.defaultSubject);
  const [body, setBody] = useState(selectedTemplate.generatedBody);
  const [signature, setSignature] = useState(selectedTemplate.executiveSignature);
  const [copied, setCopied] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"visual" | "raw">("visual");

  const handleSelectTemplate = (tmpl: CommsTemplate) => {
    setSelectedTemplate(tmpl);
    setRecipient(tmpl.defaultRecipient);
    setCc(tmpl.defaultCc);
    setSubject(tmpl.defaultSubject);
    setBody(tmpl.generatedBody);
    setSignature(tmpl.executiveSignature);
  };

  const fullEmailContent = `${body}\n\n--\n${signature}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`KİME: ${recipient}\nBİLGİ (CC): ${cc}\nKONU: ${subject}\n\n${fullEmailContent}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailto = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?cc=${encodeURIComponent(cc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullEmailContent)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="space-y-6">
      {/* Üst Bilgi Başlığı */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white font-bold text-xs">
                @
              </span>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Kurumsal İletişim & Yazışma Stüdyosu (Executive Comms Studio)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Yatırımcı güncellemeleri, resmi devlet/hibe dilekçeleri ve üst düzey kurumsal yazışmaları saniyeler içinde oluşturun ve gönderin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Copy className="h-3.5 w-3.5 text-slate-500" />
              {copied ? "Panoya Kopyalandı! ✓" : "Tümünü Kopyala"}
            </button>
            <button
              onClick={handleOpenMailto}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-2xs transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              E-Posta İstemcisinde Aç (Mailto)
            </button>
          </div>
        </div>
      </div>

      {/* Şablon Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl)}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              selectedTemplate.id === tmpl.id
                ? "border-brand-500 bg-brand-50/40 shadow-2xs ring-1 ring-brand-400"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
              {tmpl.category}
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-1">
              {tmpl.name}
            </h4>
          </button>
        ))}
      </div>

      {/* İletişim Editörü & Canlı Önizleme */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SOL: Form Editörü */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-600" />
            Yazışma Parametreleri
          </h3>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Alıcı (Kime)</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Bilgi (CC / BCC)</label>
            <input
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Konu Başlığı</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 font-medium focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mesaj Gövdesi (Düzenlenebilir)</label>
            <textarea
              rows={9}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 font-mono text-[11px] text-slate-800 leading-relaxed focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Kurumsal İmza Bloğu</label>
            <textarea
              rows={3}
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 font-mono text-[11px] text-slate-600 leading-relaxed focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* SAĞ: Canlı E-Posta Önizleme Kutusu (Simülatör) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col overflow-hidden">
          {/* Simülatör Üst Barı */}
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-slate-700 ml-2">Kurumsal Posta Görünümü</span>
            </div>

            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-[11px]">
              <button
                onClick={() => setActivePreviewTab("visual")}
                className={`px-2.5 py-1 rounded font-medium ${
                  activePreviewTab === "visual" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Görsel Simülasyon
              </button>
              <button
                onClick={() => setActivePreviewTab("raw")}
                className={`px-2.5 py-1 rounded font-medium ${
                  activePreviewTab === "raw" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Ham Metin
              </button>
            </div>
          </div>

          {/* E-Posta İçerik Alanı */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3 space-y-1.5 text-slate-500">
              <div><strong className="text-slate-700 font-semibold">Kime:</strong> <span className="font-mono text-slate-800">{recipient}</span></div>
              <div><strong className="text-slate-700 font-semibold">Bilgi (CC):</strong> <span className="font-mono text-slate-800">{cc}</span></div>
              <div><strong className="text-slate-700 font-semibold">Konu:</strong> <span className="text-slate-900 font-bold">{subject}</span></div>
            </div>

            {activePreviewTab === "visual" ? (
              <div className="pt-2 text-slate-800 whitespace-pre-line leading-relaxed text-xs">
                {body}
                <div className="mt-6 pt-4 border-t border-slate-100 text-slate-500 text-[11px] font-mono whitespace-pre-line">
                  {signature}
                </div>
              </div>
            ) : (
              <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
{`To: ${recipient}
Cc: ${cc}
Subject: ${subject}

${fullEmailContent}`}
              </pre>
            )}
          </div>

          {/* Alt Hızlı Aksiyon */}
          <div className="border-t border-slate-100 bg-slate-50/50 p-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Çift hitap temizlendi, imza bloğu kurumsal standarda uyarlandı.
            </span>

            <button
              onClick={() => {
                if (onSaveToDocs) {
                  onSaveToDocs(subject, "google_docs");
                } else {
                  window.open(`https://docs.google.com/document/create?title=${encodeURIComponent(subject)}`, "_blank");
                }
              }}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              Google Docs Taslağına Aktar ↗
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
