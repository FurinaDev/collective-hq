"use client";

import React, { useState } from "react";
import { 
  FileText, 
  FileSpreadsheet, 
  Plus, 
  Copy, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Search, 
  Filter, 
  Layers,
  Clock,
  Sparkles
} from "lucide-react";

export interface RichDocument {
  id: string;
  title: string;
  docType: "google_docs" | "google_sheets";
  category: "Yatırım & Fon" | "Ar-Ge / Hibe" | "Hukuk & Sözleşme" | "Yazılım & Mimari" | "Yönetici Dokümanı";
  createdAt: string;
  assignedTo: string;
  status: "Düzenlemeye Hazır" | "Eşitlendi" | "İncelemede";
  summary: string;
  fullContent: string;
}

const INITIAL_DOCS: RichDocument[] = [
  {
    id: "doc-1",
    title: "Seed Turu Yatırımcı Bilgi Memorandumu (Executive One-Pager)",
    docType: "google_docs",
    category: "Yatırım & Fon",
    createdAt: "Bugün, 11:20",
    assignedTo: "Kurucu & CEO",
    status: "Düzenlemeye Hazır",
    summary: "Erken aşama VC ve Melek yatırımcılara sunulacak 1 sayfalık pazar, büyüme ve sermaye talep dokümanı.",
    fullContent: `# YATIRIMCI BİLGİ MEMORANDUMU (EXECUTIVE ONE-PAGER)
Tarih: Ekim 2026 | Seri: Seed Turu ($450,000 SAFE)

1. YÜRÜTÜCÜ ÖZETİ
Şirketimiz, kurucuların ve operasyonel ekiplerin en büyük darboğazı olan "manuel yönetim felcini" ortadan kaldıran yeni nesil Operasyon ve İcraat İşletim Sistemi'ni geliştirmektedir.

2. ÇÖZÜLEN DARBOĞAZ (PROBLEM)
- Kurucular zamanlarının %65'ini strateji yerine resmi yazışma, hibe belgeleri ve WhatsApp üzerinden ekip takibi gibi angaryalarla harcamaktadır.
- Mevcut araçlar (Notion, Jira) yüksek öğrenme eğrisi ve login bariyeri nedeniyle saha ekiplerinde ve gönüllülerde dirençle karşılaşmaktadır.

3. ÇÖZÜMÜMÜZ VE HAKSIZ AVANTAJIMIZ
- Sıfır Sürtünmeli İcraat: Saha ekibi veya paydaşlar herhangi bir hesaba girmeden doğrudan WhatsApp ve Google Workspace üzerinden görev teyidi verir.
- Çoklu Dikey Sermaye Motoru: TÜBİTAK, KOSGEB ve AB fonlarını tek tıkla dosyalayan entegre zeka.

4. FİNANSAL GÖSTERGELER & PROJEKSİYON
- Mevcut ARR: $120,000 | Hedef 18. Ay ARR: $750,000
- Brüt Kâr Marjı: %84
- Hedeflenen Fonlama: $450,000 SAFE (Değerleme Tavanı: $4.5M, %20 İndirim).`
  },
  {
    id: "doc-2",
    title: "TÜBİTAK 1507 Ar-Ge Bütçe & Personel Maliyet Tablosu",
    docType: "google_sheets",
    category: "Ar-Ge / Hibe",
    createdAt: "Dün, 16:45",
    assignedTo: "Mali Müşavir & Yürütücü",
    status: "Eşitlendi",
    summary: "PRODİS sistemine yüklenecek 12 aylık araştırmacı adam/ay maliyetleri ve hizmet alımı dökümü.",
    fullContent: `BÖLÜM 1: AR-GE PERSONEL MALİYET TABLOSU
| Personel Unvanı | Projedeki Rolü | Adam/Ay Oranı | Aylık Brüt Maliyet | Toplam Destek Kapsamı |
|---|---|---|---|---|
| Kıdemli Sistem Mimarı | Yürütücü / Mimar | 12 Ay (%100) | ₺80.000 | ₺960.000 |
| Yapay Zeka Araştırmacısı | Doğal Dil Algoritmaları | 12 Ay (%80) | ₺65.000 | ₺624.000 |
| Frontend Geliştirici | Arayüz & Test Mühendisi | 10 Ay (%60) | ₺45.000 | ₺270.000 |

BÖLÜM 2: DANIŞMANLIK VE HİZMET ALIMI
- Bulut Altyapı Güvenlik Denetimi ve Penetrasyon Testi: ₺120.000
- Fikri Mülkiyet ve Patent Başvuru Danışmanlığı: ₺45.000

GENEL BÜTÇE TOPLAMI: ₺2.019.000
TÜBİTAK HİBE DESTEĞİ (%75): ₺1.514.250`
  },
  {
    id: "doc-3",
    title: "Çift Taraflı Gizlilik ve Fikri Mülkiyet Sözleşmesi (Bilingual NDA)",
    docType: "google_docs",
    category: "Hukuk & Sözleşme",
    createdAt: "12 Eki 2026",
    assignedTo: "Hukuk Danışmanı",
    status: "İncelemede",
    summary: "Dış paydaşlar, yatırımcı adayları ve danışmanlarla paylaşılacak standart gizlilik ve IP koruma protokolü.",
    fullContent: `GİZLİLİK VE BİLGİ GÜVENLİĞİ SÖZLEŞMESİ (NON-DISCLOSURE AGREEMENT)

1. TARAFLAR
Bir tarafta [Şirket / Platform Adı] ile diğer tarafta [Paydaş / Karşı Taraf Adı] arasında akdedilmiştir.

2. GİZLİ BİLGİNİN TANIMI
Taraflarca birbirlerine açıklanan her türlü ticari sır, kod tabanı, algoritma mimarisi, finansal modeller ve müşteri listeleri gizli bilgi kapsamında kabul edilir.

3. TAAHHÜTLER VE SÜRE
Alıcı taraf, ifşa eden tarafın önceden yazılı izni olmaksızın gizli bilgileri üçüncü kişilere aktarmayacağını, yalnızca ortak proje amacıyla kullanacağını taahhüt eder. Bu yükümlülük sözleşmenin sona ermesinden itibaren 3 (üç) yıl boyunca yürürlükte kalacaktır.

4. YETKİLİ MAHKEME
İşbu sözleşmenin uygulanmasından doğabilecek uyuşmazlıklarda İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.`
  }
];

import { useToast } from "./ui/ToastNotification";

export function WorkspaceDocsHub() {
  const toast = useToast();
  const [documents, setDocuments] = useState<RichDocument[]>(INITIAL_DOCS);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [readingDoc, setReadingDoc] = useState<RichDocument | null>(null);
  const [copied, setCopied] = useState(false);

  // Yeni Doküman Oluşturma Modalı
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("Yeni Operasyonel Belge");
  const [newDocCategory, setNewDocCategory] = useState<RichDocument["category"]>("Yönetici Dokümanı");
  const [newDocType, setNewDocType] = useState<RichDocument["docType"]>("google_docs");

  const filteredDocs = documents.filter(doc => {
    const matchesCat = activeCategory === "ALL" || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateNewDoc = () => {
    setNewDocTitle("Yeni Operasyonel Belge");
    setIsCreateModalOpen(true);
  };

  const handleConfirmCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedTitle = newDocTitle.trim();
    if (!trimmedTitle) return;

    const newDoc: RichDocument = {
      id: `doc-${Date.now()}`,
      title: trimmedTitle,
      docType: newDocType,
      category: newDocCategory,
      createdAt: "Az önce",
      assignedTo: "Kurucu",
      status: "Düzenlemeye Hazır",
      summary: "Kullanıcı tarafından oluşturulan kurumsal doküman taslağı.",
      fullContent: `# ${trimmedTitle}\n\nOluşturulma Tarihi: ${new Date().toLocaleDateString("tr-TR")}\nHazırlayan: Kurucu\nKategori: ${newDocCategory}\n\n1. AMAÇ VE KAPSAM\nBu belge, operasyonel iş akışlarını standardize etmek ve paydaş onayına sunmak üzere hazırlanmıştır.\n\n2. TEMEL MADDELER VE EYLEMLER\n- Adım 1: Gereksinimlerin tespiti ve paydaş mutabakatı\n- Adım 2: Bütçe ve kaynak onayı\n- Adım 3: İcraatın tamamlanması ve dokümantasyon.`
    };

    setDocuments([newDoc, ...documents]);
    setReadingDoc(newDoc);
    setIsCreateModalOpen(false);
    toast.success("Doküman Oluşturuldu", `"${newDoc.title}" çalışma alanına eklendi.`);
  };

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = (doc: RichDocument) => {
    const blob = new Blob([doc.fullContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/\s+/g, "_")}.md`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Üst Bilgi ve Eylemler */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white font-bold text-xs">
                G
              </span>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Google Workspace Canlı Doküman Fabrikası
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              İçi boş değil; maddeleri ve formülleri eksiksiz yazılmış kurumsal dokümanlar. Tek tıkla inceleyin, kopyalayın veya Drive&apos;da açın.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNewDoc}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-2xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              + Yeni Doküman Oluştur
            </button>
          </div>
        </div>

        {/* Arama ve Filtre */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Doküman başlığı veya içerikte ara..."
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {["ALL", "Yatırım & Fon", "Ar-Ge / Hibe", "Hukuk & Sözleşme", "Yönetici Dokümanı"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-2.5 py-1.5 font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat === "ALL" ? "Tümü" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doküman Kartları Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {doc.category}
                </span>
                <span className="font-mono text-slate-400">{doc.createdAt}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                {doc.title}
              </h4>

              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {doc.summary}
              </p>

              <div className="text-[10px] text-slate-400 font-mono">
                Sorumlu: <strong className="text-slate-700">{doc.assignedTo}</strong>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <button
                onClick={() => setReadingDoc(doc)}
                className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-brand-600"
              >
                <FileText className="h-3.5 w-3.5 text-brand-600" />
                İncele & Kopyala
              </button>

              <a
                href={doc.docType === "google_sheets" 
                  ? `https://docs.google.com/spreadsheets/create?title=${encodeURIComponent(doc.title)}`
                  : `https://docs.google.com/document/create?title=${encodeURIComponent(doc.title)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
              >
                Drive&apos;da Aç ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* DOKÜMAN OKUYUCU VE İNDİRİCİ MODAL */}
      {readingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col max-h-[85vh] animate-fade-in overflow-hidden">
            {/* Modal Başlığı */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                  {readingDoc.category} • {readingDoc.docType === "google_sheets" ? "Google Sheets" : "Google Docs"}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                  {readingDoc.title}
                </h3>
              </div>
              <button 
                onClick={() => setReadingDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* İçerik Alanı */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs font-mono bg-white">
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {readingDoc.fullContent}
              </pre>
            </div>

            {/* Modal Alt Barı */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-sans">
                Tüm bölümler ve maddeler yasal ve kurumsal formatta hazırlandı.
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyContent(readingDoc.fullContent)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors"
                >
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  {copied ? "Kopyalandı! ✓" : "Metni Kopyala"}
                </button>
                <button
                  onClick={() => handleDownloadMarkdown(readingDoc)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  İndir (.md)
                </button>
                <a
                  href={`https://docs.google.com/document/create?title=${encodeURIComponent(readingDoc.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-2xs transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Google Docs&apos;ta Yeni Belge Olarak Aç ↗
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Yeni Doküman Oluşturma Modalı (prompt alternatifi) */}
      {isCreateModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          onClick={() => setIsCreateModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-scale-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Yeni Doküman Oluştur</h3>
                  <p className="text-[11px] text-slate-500">Çalışma alanınıza yeni bir kurumsal taslak ekleyin.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Doküman Başlığı
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="Örn: 2026 Q4 Yatırımcı Bilgilendirme Raporu"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Yönetici Dokümanı">Yönetici Dokümanı</option>
                    <option value="Yatırım & Fon">Yatırım & Fon</option>
                    <option value="Ar-Ge / Hibe">Ar-Ge / Hibe</option>
                    <option value="Hukuk & Sözleşme">Hukuk & Sözleşme</option>
                    <option value="Yazılım & Mimari">Yazılım & Mimari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Doküman Türü
                  </label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="google_docs">Google Docs (Yazı & Sözleşme)</option>
                    <option value="google_sheets">Google Sheets (Tablo & Bütçe)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                >
                  Belgeyi Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
