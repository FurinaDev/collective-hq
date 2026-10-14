"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  FileText, 
  Copy, 
  ExternalLink, 
  Clock, 
  ShieldAlert, 
  RefreshCw,
  Layers,
  ChevronRight,
  Send,
  RotateCcw,
  Check,
  Share2,
  Bookmark
} from "lucide-react";
import { useToast } from "./ui/ToastNotification";
import { BottleneckScenario, MicroActionStep } from "../types";

export const sanitizePhone = (raw: string): string => {
  if (!raw) return "";
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "9" + digits;
  if (!digits.startsWith("90")) digits = "90" + digits;
  return digits;
};

export const PRESET_SCENARIOS: BottleneckScenario[] = [
  {
    id: "grant_deadline",
    title: "TÜBİTAK / KOSGEB Başvurusuna 72 Saat Kaldı, Bütçe Tablosu Boş",
    category: "Hibe & Fon",
    urgency: "KRİTİK",
    problemDesc: "Mali müşavirden bordro dökümleri gelmedi, proje yürütücüsü bütçe formüllerini toparlayamadı. Sistem 3 gün sonra kapanıyor.",
    solutionPlan: {
      title: "72 Saatlik Acil Kurtarma Planı: Bütçe & Gerekçe Kilidi Açma",
      actionSteps: [
        { text: "Mali müşavire tek satırlık acil bordro şablonunu WhatsApp'tan gönder (10 dk)", done: false, estimatedMinutes: 10 },
        { text: "Google Sheets standart 1507 personel maliyet tablosunu aç ve ham veriyi gir (20 dk)", done: false, estimatedMinutes: 20 },
        { text: "Yürütücüye teknik gerekçe özetini delege et, ar-ge hedeflerini 3 maddeye indir (15 dk)", done: false, estimatedMinutes: 15 }
      ],
      whatsappDraft: {
        recipient: "Mali Müşavir & Muhasebe Sorumlusu",
        role: "Mali Danışman",
        phone: "905321112233",
        message: "Merhaba Üstat, TÜBİTAK portalı cuma 17:00'de kapanıyor. Başvurunun bloke olmaması için son 3 aylık Ar-Ge personel brüt maliyet tablosuna acil ihtiyacımız var. İlgili hazır Google Sheets tablosunu açtık, yalnızca sarı alanları doldurmanız yeterli olacaktır: https://docs.google.com/spreadsheets/d/örnek_butce. Teşekkürler!"
      },
      docDraft: {
        title: "TÜBİTAK 1507 Ar-Ge Bütçeleme & Maliyet Gerekçelendirme Notu",
        type: "google_sheets",
        contentSnippet: "BÖLÜM 1: PERSONEL GİDERLERİ\n- Proje Yürütücüsü (Yazılım Mimarisi): 12 Ay x %100 Efor = 960.000 TL\n- Kıdemli Ar-Ge Mühendisi: 12 Ay x %80 Efor = 720.000 TL\nBÖLÜM 2: HİZMET ALIMI & TEST\n- Bulut Güvenlik & Penetrasyon Test Hizmeti: 140.000 TL\nTOPLAM TALEP EDİLEN HİBE ORANI: %75"
      }
    }
  },
  {
    id: "investor_deck_freeze",
    title: "Seed Turu Yatırımcısı Cap Table ve Finansal Projeksiyon İstedi",
    category: "Yatırımcı",
    urgency: "YÜKSEK",
    problemDesc: "VC toplantısından olumlu sinyal alındı ancak kurucunun elinde güncel Cap Table ve 18 aylık nakit yakım (burn rate) simülasyonu yok.",
    solutionPlan: {
      title: "Yatırımcı Bilgi Paketi: One-Pager + Cap Table Acil Eylemi",
      actionSteps: [
        { text: "Mevcut hisse dağılımını kurucu sözleşmesine göre doğrula (ESOP havuzunu %10 olarak ayır)", done: false, estimatedMinutes: 15 },
        { text: "Aylık sabit giderleri (maaş + SaaS araçları) 3 sütun halinde netleştir", done: false, estimatedMinutes: 15 },
        { text: "Hazırlanan Google Docs One-Pager özetini yatırımcıya kurumsal e-posta ile ilet", done: false, estimatedMinutes: 10 }
      ],
      whatsappDraft: {
        recipient: "Yatırım Ortağı / Ortak Kurucu",
        role: "Co-Founder",
        phone: "905332223344",
        message: "Selamlar, Venture Capital ekibi bugün 18 aylık runway ve Cap Table özetimizi istedi. Hazırladığım taslak dokümanı iletiyorum. 15:00'e kadar teyit verirsen doğrudan yatırım komitesine göndereceğiz."
      },
      docDraft: {
        title: "Seed Investment Memorandum & Cap Table Structure",
        type: "google_docs",
        contentSnippet: "CAPITAL STRUCTURE & PROJECTIONS\n- Pre-Money Valuation: $3,200,000\n- Target Raise: $450,000 (SAFE Note with 20% discount, $4.5M Cap)\n- Runway Expansion: 18 Months (Target ARR: $480,000)\n- Core Allocation: 60% Engineering & Product, 25% Go-To-Market, 15% Operations & Legal."
      }
    }
  },
  {
    id: "team_exam_blocker",
    title: "Kilit Ekip Lideri Sınav Haftasında, Teslimat Riski Oluştu",
    category: "Ekip & İnsan",
    urgency: "YÜKSEK",
    problemDesc: "Genç ekip lideri üniversite vize dönemine girdi. Sponsorluk dosyası ve etkinlik lansmanı ortada kaldı, iletişim kesildi.",
    solutionPlan: {
      title: "Sıfır Sürtünmeli Delegasyon & Geçici Görev Aktarımı",
      actionSteps: [
        { text: "Kişinin üzerindeki 4 görevi 1 kritik göreve indirge (diğerlerini ertele)", done: false, estimatedMinutes: 10 },
        { text: "Yedek koordinatöre (Buse) 1 cümlelik WhatsApp brifiyle dosyayı devret", done: false, estimatedMinutes: 5 },
        { text: "Sınav bitiş tarihine kadar takvim dondurma bildirimi gönder", done: false, estimatedMinutes: 10 }
      ],
      whatsappDraft: {
        recipient: "Fatih Demir",
        role: "Sponsorluk Sorumlusu (Sınav Haftasında)",
        phone: "905354445566",
        message: "Fatih selam, sınav haftan olduğunu biliyoruz, başarılar! Masandaki sponsorluk dosyasının sadece son PDF çıktısını Buse'ye devrettik, senin hiçbir şeye dokunmana gerek yok. Sınavların bitene kadar kafan rahat olsun. Haftaya salı görüşmek üzere!"
      },
      docDraft: {
        title: "Operasyonel Görev Devir & Nöbetçi Koordinatör Tutanağı",
        type: "google_docs",
        contentSnippet: "GÖREV DEVİR PROTOKOLÜ\nDevreden: Fatih Demir (Mazeret: Akademik Sınav Dönemi)\nDevralan: Buse Kaya (Geçici Sponsorluk İletişimi)\nKapsam: Yalnızca mevcut sponsorluk sunumunun ilgili kurumlara iletilmesi ve gelen yanıtların kaydedilmesi."
      }
    }
  },
  {
    id: "b2b_contract_stall",
    title: "B2B Müşteri Kurumsal Sözleşmeyi Reddetti, Çift Taraflı NDA ve IP İstiyor",
    category: "Hukuk & Sözleşme",
    urgency: "KRİTİK",
    problemDesc: "Müşteri kurumsal hukuk ekibi standart sözleşmeyi reddetti, fikri mülkiyet ve çift taraflı gizlilik maddeleri acil revizyon bekliyor.",
    solutionPlan: {
      title: "Hukuki Kilit Açma: Bilingual NDA & Fikri Mülkiyet Protokolü",
      actionSteps: [
        { text: "Standart Bilingual NDA şablonundaki gizlilik süresini 3 yıla ayarla (10 dk)", done: false, estimatedMinutes: 10 },
        { text: "Fikri mülkiyet (IP) koruma şerhini sözleşme taslağına ekle (15 dk)", done: false, estimatedMinutes: 15 },
        { text: "Karşı tarafın hukuk müşavirine imzalı taslağı e-postala (10 dk)", done: false, estimatedMinutes: 10 }
      ],
      whatsappDraft: {
        recipient: "Hukuk Danışmanı & Kurumsal Müşteri Temsilcisi",
        role: "Hukuk Müşaviri",
        phone: "905325556677",
        message: "Merhaba, talep ettiğiniz çift taraflı NDA ve IP maddelerini içeren revize sözleşme taslağını hazırladık. İnceleyip onay vermeniz durumunda doğrudan dijital imzaya açacağız: https://docs.google.com/document/create?title=Bilingual_NDA"
      },
      docDraft: {
        title: "Çift Taraflı Gizlilik ve Fikri Mülkiyet Sözleşmesi (Bilingual NDA)",
        type: "google_docs",
        contentSnippet: "MUTUAL NON-DISCLOSURE & INTELLECTUAL PROPERTY AGREEMENT\n1. Definition of Confidential Information / Gizli Bilgi Tanımı\n2. Proprietary Source Code & Model Weights Protection / Fikri Mülkiyet Hakları\n3. Survival Period: 3 Years / 3 Yıllık Geçerlilik Şerhi"
      }
    }
  },
  {
    id: "runway_cashflow_crunch",
    title: "Vergi/SGK Haftasında Beklenmeyen Giderler Nakit Akışını Kilitledi",
    category: "Operasyon",
    urgency: "KRİTİK",
    problemDesc: "KDV ve SGK ödeme haftasında beklenmeyen SaaS yenileme faturaları nakit tamponunu eritti. Acil tahsilat ve gider dondurma gerekiyor.",
    solutionPlan: {
      title: "30 Günlük Acil Nakit Tamponu ve Tasarruf Eylemi",
      actionSteps: [
        { text: "Kullanılmayan 4 SaaS lisansını anında iptal et veya dondur (15 dk)", done: false, estimatedMinutes: 15 },
        { text: "Vadesi geçmiş 2 kurumsal B2B faturası için acil tahsilat mesajı gönder (10 dk)", done: false, estimatedMinutes: 10 },
        { text: "30 günlük acil nakit akış ve tasarruf protokolünü güncelle (15 dk)", done: false, estimatedMinutes: 15 }
      ],
      whatsappDraft: {
        recipient: "Mali İşler / Muhasebe Koordinatörü",
        role: "Finans Yöneticisi",
        phone: "905338889900",
        message: "Selamlar, bu haftaki nakit sıkışıklığını aşmak adına kullanılmayan abonelikleri dondurduk ve vadesi geçen 2 faturanın takibini başlattık. Güncel nakit akış tablosunu onayınıza sunuyorum."
      },
      docDraft: {
        title: "30 Günlük Acil Nakit Akış ve Tasarruf Protokolü",
        type: "google_sheets",
        contentSnippet: "NAKİT AKIŞ PROTOKOLÜ & ACİL EYLEMLER\n- Dondurulan SaaS Giderleri: ₺42.500 / Ay\n- Takipteki B2B Alacaklar: ₺115.000\n- Minimum 30 Günlük Kritik Runway Koruma Önlemleri"
      }
    }
  }
];

export function DeBottleneckEngine({ 
  onCreateDoc 
}: { 
  onCreateDoc?: (title: string, type: "google_docs" | "google_sheets") => void 
}) {
  const toast = useToast();
  const [scenarios, setScenarios] = useState<BottleneckScenario[]>(PRESET_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(PRESET_SCENARIOS[0].id);
  const [customInput, setCustomInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedWA, setCopiedWA] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedDoc, setCopiedDoc] = useState(false);

  // Load persisted scenarios from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("vortex_bottlenecks");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setScenarios(parsed);
          setSelectedScenarioId(parsed[0].id);
        }
      }
    } catch (e) {
      console.warn("Failed to read vortex_bottlenecks from localStorage:", e);
    }
  }, []);

  // Save to localStorage when scenarios change
  const persistScenarios = (updated: BottleneckScenario[]) => {
    setScenarios(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vortex_bottlenecks", JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to write vortex_bottlenecks to localStorage:", e);
      }
    }
  };

  const selectedScenario = useMemo(() => {
    return scenarios.find(s => s.id === selectedScenarioId) || scenarios[0] || PRESET_SCENARIOS[0];
  }, [scenarios, selectedScenarioId]);

  const actionList = selectedScenario.solutionPlan.actionSteps;

  const completedCount = actionList.filter(a => a.done).length;
  const progressPercent = actionList.length > 0 ? Math.round((completedCount / actionList.length) * 100) : 0;
  const isResolved = actionList.length > 0 && completedCount === actionList.length;

  const handleSelectScenario = (scenario: BottleneckScenario) => {
    setSelectedScenarioId(scenario.id);
  };

  const toggleAction = (index: number) => {
    const updatedScenarios = scenarios.map(scen => {
      if (scen.id !== selectedScenario.id) return scen;
      const nextSteps = scen.solutionPlan.actionSteps.map((step, idx) => {
        if (idx === index) {
          return { ...step, done: !step.done };
        }
        return step;
      });
      return {
        ...scen,
        solutionPlan: {
          ...scen.solutionPlan,
          actionSteps: nextSteps
        }
      };
    });

    persistScenarios(updatedScenarios);
    const toggledItem = actionList[index];
    const willBeDone = !toggledItem.done;
    if (willBeDone) {
      toast.success("Adım Tamamlandı", `"${toggledItem.text.slice(0, 40)}..." tamamlandı.`);
    }
  };

  const handleResetScenario = () => {
    const updatedScenarios = scenarios.map(scen => {
      if (scen.id !== selectedScenario.id) return scen;
      return {
        ...scen,
        solutionPlan: {
          ...scen.solutionPlan,
          actionSteps: scen.solutionPlan.actionSteps.map(s => ({ ...s, done: false }))
        }
      };
    });
    persistScenarios(updatedScenarios);
    toast.info("Senaryo Sıfırlandı", `"${selectedScenario.title.slice(0, 35)}..." adımları sıfırlandı.`);
  };

  const handleCustomAnalyze = (textToAnalyze?: string) => {
    const input = (textToAnalyze !== undefined ? textToAnalyze : customInput);
    if (!input || !input.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const trimmed = input.trim();
      const sanitizedDocTitle = `Operasyonel Kriz Çözüm Memorandumu: ${trimmed.slice(0, 30)}`;

      const generated: BottleneckScenario = {
        id: `custom-${Date.now()}`,
        title: trimmed,
        category: "Operasyon",
        urgency: "KRİTİK",
        problemDesc: `Özel Tanımlanan Tıkanıklık: ${trimmed}`,
        solutionPlan: {
          title: "Özel Darboğaz Çözüm Paketi: 30 Dakikalık Eylem Rotası",
          actionSteps: [
            { text: "Karar ikilemini iki alternatife indir ve risk analizini tamamla (10 dk)", done: false, estimatedMinutes: 10 },
            { text: "İlgili paydaşa kurumsal WhatsApp teyit mesajı gönder (5 dk)", done: false, estimatedMinutes: 5 },
            { text: "Google Docs üzerinde resmi karar tutanağını oluşturup arşive al (15 dk)", done: false, estimatedMinutes: 15 }
          ],
          whatsappDraft: {
            recipient: "İlgili Paydaş / Ekip Üyesi",
            role: "Operasyon Paydaşı",
            phone: "905320000000",
            message: `Merhaba, ${trimmed} konusuyla ilgili süreci hızlandırmak adına aksiyon planını çıkardık. Detayları tek tıkla onaylamanız için iletiyorum: https://docs.google.com/document/create?title=Acil_Cozum_Tutanagi`
          },
          docDraft: {
            title: sanitizedDocTitle,
            type: "google_docs",
            contentSnippet: `DARBOĞAZ ANALİZİ VE MÜDAHALE PLANI\nKonu: ${trimmed}\nÖncelik Seviyesi: Yüksek\nAlınan Karar: Operasyonel felci kırmak için süreç 3 kademeli mini-adımlara bölünmüş ve yetkilendirme tanımlanmıştır.`
          }
        }
      };

      const nextScenarios = [generated, ...scenarios];
      persistScenarios(nextScenarios);
      setSelectedScenarioId(generated.id);
      setIsAnalyzing(false);
      setCustomInput("");
      toast.success("Darboğaz Analiz Edildi", "3 adımlı mikro-eylem planı ve WhatsApp brifi hazırlandı.");
    }, 400);
  };

  // Generate context-rich WhatsApp brief
  const rawRecipientPhone = selectedScenario.solutionPlan.whatsappDraft.phone || "905320000000";
  const cleanPhone = sanitizePhone(rawRecipientPhone);

  const contextRichBrief = useMemo(() => {
    const stepsChecklist = selectedScenario.solutionPlan.actionSteps
      .map((step, i) => `${step.done ? "[✓]" : "[◻]"} ${i + 1}. ${step.text}`)
      .join("\n");

    return `*VORTEX OPERASYONEL KRİZ BRİFİ*\n\n` +
      `*Darboğaz:* ${selectedScenario.title}\n` +
      `*Öncelik:* ${selectedScenario.urgency} | *Kategori:* ${selectedScenario.category}\n` +
      `*Muhatap / Sorumlu:* ${selectedScenario.solutionPlan.whatsappDraft.recipient} (${selectedScenario.solutionPlan.whatsappDraft.role})\n\n` +
      `*Kriz Tanımı & Etki:*\n${selectedScenario.problemDesc}\n\n` +
      `*15-Dakikalık Eylem Planı (%${progressPercent} Tamamlandı):*\n${stepsChecklist}\n\n` +
      `*Doğrudan Mesaj:*\n${selectedScenario.solutionPlan.whatsappDraft.message}\n\n` +
      `⚠️ _Herhangi bir SaaS hesabı açmanıza gerek yoktur. Bu mesajı 'TAMAM' olarak yanıtlamanız durumunda görev onaylanmış kabul edilir._\n` +
      `Detay Dokümanı: https://docs.google.com/document/create?title=${encodeURIComponent(selectedScenario.solutionPlan.docDraft.title)}`;
  }, [selectedScenario, progressPercent]);

  // URLs
  const waMeUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(contextRichBrief)}`
    : `https://wa.me/?text=${encodeURIComponent(contextRichBrief)}`;

  const apiWhatsAppUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(selectedScenario.solutionPlan.whatsappDraft.message)}`;

  const handleCopyWABrief = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(contextRichBrief);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
      toast.success("Brif Kopyalandı", "Context-rich WhatsApp brifi panoya kopyalandı.");
    }
  };

  const handleCopyDirectMessage = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(selectedScenario.solutionPlan.whatsappDraft.message);
      setCopiedWA(true);
      setTimeout(() => setCopiedWA(false), 2000);
      toast.success("Mesaj Kopyalandı", "WhatsApp doğrudan mesaj metni panoya kopyalandı.");
    }
  };

  const handleCopyDocSnippet = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(selectedScenario.solutionPlan.docDraft.contentSnippet);
      setCopiedDoc(true);
      setTimeout(() => setCopiedDoc(false), 2000);
      toast.success("Taslak Kopyalandı", "Doküman taslağı içeriği panoya kopyalandı.");
    }
  };

  const handleOpenOrExportDoc = () => {
    const docTitle = selectedScenario.solutionPlan.docDraft.title;
    const docType = selectedScenario.solutionPlan.docDraft.type;

    if (onCreateDoc) {
      onCreateDoc(docTitle, docType);
      toast.success("Doküman Fabrikası'na Aktarıldı", `"${docTitle}" Workspace Docs Hub'da açıldı.`);
    } else {
      const url = docType === "google_sheets"
        ? `https://docs.google.com/spreadsheets/create?title=${encodeURIComponent(docTitle)}`
        : `https://docs.google.com/document/create?title=${encodeURIComponent(docTitle)}`;
      window.open(url, "_blank");
      toast.info("Google Workspace Başlatıldı", `"${docTitle}" yeni sekmede açılıyor.`);
    }
  };

  const statusText = isResolved ? "Darboğaz Çözüldü!" : "Tüm adımlar tamamlandığında kilit kalkar.";

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Giriş */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-600 text-white font-black text-xs">
                !
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Canlı Darboğaz Çözücü (Live De-Bottleneck Engine)
              </h2>
              <span className="rounded bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                Kriz Kırıcı
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Kurucunun zihnindeki tıkanıklığı, ertelenen resmi evrakları ve ekip kilitlenmelerini tek tıkla eyleme dönüştürün.
            </p>
          </div>

          {/* İlerleme Çubuğu & Durum */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-lg px-3 py-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Kilit Açma Durumu:</span>
            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  isResolved ? "bg-emerald-500" : "bg-brand-600"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 min-w-[32px] text-right">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Serbest Kriz Yazma Alanı */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Şu an hangi konuda kilitlendiniz? (Örn: Yatırımcı benden finansal projeksiyon istedi ne yapmalıyım?)"
              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-brand-500 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleCustomAnalyze()}
            />
            <button
              onClick={() => handleCustomAnalyze()}
              disabled={isAnalyzing || !customInput.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 px-4 py-2 text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 transition-colors shadow-2xs shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Kriz Çözülüyor...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  Darboğazı Çöz
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hazır Senaryolar Seçimi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {scenarios.map((scen) => {
          const isSelected = selectedScenario.id === scen.id;
          const scenCompleted = scen.solutionPlan.actionSteps.filter(a => a.done).length;
          const scenTotal = scen.solutionPlan.actionSteps.length;
          const scenProgress = scenTotal > 0 ? Math.round((scenCompleted / scenTotal) * 100) : 0;

          return (
            <button
              key={scen.id}
              onClick={() => handleSelectScenario(scen)}
              className={`text-left p-3.5 rounded-xl border transition-all relative ${
                isSelected
                  ? "border-rose-500 dark:border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 shadow-2xs ring-1 ring-rose-400 dark:ring-rose-500"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">{scen.category}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  scen.urgency === "KRİTİK" 
                    ? "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300" 
                    : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                }`}>
                  {scen.urgency}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 line-clamp-2">
                {scen.title}
              </h4>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{scenCompleted}/{scenTotal} Adım</span>
                <span className={scenProgress === 100 ? "text-emerald-600 font-bold" : ""}>
                  %{scenProgress}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Seçili Krizin Aktif Çözüm Masası */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SOL: 15-Dakikalık Mikro Eylem Planı (Checklist) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-600" />
              15-Dakikalık Mikro Eylem Adımları
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetScenario}
                title="Tüm adımları sıfırla"
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Sıfırla
              </button>
              <span className="text-[10px] text-slate-400 font-mono font-semibold">
                {completedCount}/{actionList.length} Tamam
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Kurucu felcini kırmak için tasarlanmış küçük, yapılabilir mikro hamleler:
          </p>

          <div className="space-y-2.5">
            {actionList.map((action, idx) => (
              <div
                key={idx}
                onClick={() => toggleAction(idx)}
                className={`cursor-pointer flex items-start gap-3 p-3 rounded-lg border text-xs transition-all select-none ${
                  action.done 
                    ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-400 dark:text-slate-500 line-through" 
                    : "border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                }`}
              >
                <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  action.done 
                    ? "border-emerald-600 bg-emerald-600 text-white" 
                    : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                }`}>
                  {action.done && <CheckCircle2 className="h-3 w-3" />}
                </div>
                <div className="flex-1">
                  <span className="text-xs leading-relaxed font-medium">
                    {action.text}
                  </span>
                  {action.estimatedMinutes && (
                    <span className="ml-2 text-[10px] text-slate-400 font-mono">
                      ({action.estimatedMinutes} dk)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{statusText}</span>
            {isResolved && (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="h-3.5 w-3.5" /> Darboğaz Çözüldü!
              </span>
            )}
          </div>
        </div>

        {/* SAĞ: WhatsApp ve Doküman Otomasyonu */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 1. Tek Tıkla WhatsApp Mesajı & Context-Rich Brif */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Sıfır Sürtünmeli WhatsApp Delegasyonu & Brif
                </h4>
              </div>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold font-mono">
                Alıcı: {selectedScenario.solutionPlan.whatsappDraft.recipient}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Karşı tarafın hiçbir SaaS hesabı açmasına gerek yoktur. Görev, bağlam ve mikro adımlar tek tıkla doğrudan WhatsApp mesajına dönüşür:
            </p>

            <div className="rounded-lg bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/80 p-3 font-mono text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
              {contextRichBrief}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyWABrief}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  <Copy className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  {copiedBrief ? "Brif Kopyalandı! ✓" : "Brifi Kopyala"}
                </button>
                <button
                  onClick={handleCopyDirectMessage}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  {copiedWA ? "Kopyalandı! ✓" : "Metni Kopyala"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={waMeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  WhatsApp ile Gönder ↗
                </a>
                <a
                  href={apiWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="api.whatsapp.com alternatif gönderim"
                  className="flex items-center gap-1 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                >
                  api.wa ↗
                </a>
              </div>
            </div>
          </div>

          {/* 2. Hazır Doküman Taslağı & Workspace Entegrasyonu */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {selectedScenario.solutionPlan.docDraft.title}
                </h4>
              </div>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono font-semibold">
                {selectedScenario.solutionPlan.docDraft.type === "google_sheets" ? "Google Sheets" : "Google Docs"}
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
              {selectedScenario.solutionPlan.docDraft.contentSnippet}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleCopyDocSnippet}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
              >
                <Copy className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                {copiedDoc ? "Kopyalandı! ✓" : "Taslak İçeriğini Kopyala"}
              </button>

              <button
                onClick={handleOpenOrExportDoc}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-2xs"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Google Workspace&apos;te Canlı Aç ↗
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
