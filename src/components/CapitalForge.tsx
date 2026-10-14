"use client";

import React, { useState } from "react";
import { Zap, FileText, Download, ExternalLink, CheckCircle2, DollarSign, Layers } from "lucide-react";
import { IndustryVertical } from "../types/venturi";
import { useToast } from "./ui/ToastNotification";

export function CapitalForge() {
  const toast = useToast();
  const [selectedVertical, setSelectedVertical] = useState<IndustryVertical>("tech_ai");
  const [generating, setGenerating] = useState(false);
  const [generatedDocUrl, setGeneratedDocUrl] = useState<string | null>(null);

  const verticals: Record<IndustryVertical, {
    title: string;
    authority: string;
    maxBudget: string;
    badge: string;
    description: string;
    templateType: string;
    sampleOutline: string[];
  }> = {
    tech_ai: {
      title: "TÜBİTAK 1507 Ar-Ge Başvuru Dosyası & Seed Turu Pitch Memorandum",
      authority: "TÜBİTAK TEYDEB & Melek Yatırımcı Ağı",
      maxBudget: "2.400.000 TL Hibe + $250.000 Seed",
      badge: "BT & Yapay Zeka Dikeyi",
      description: "Yenilikçi yön, TRL seviyesi, teknik riskler ve pazar birim ekonomisi (CAC/LTV) şablonu.",
      templateType: "Google Docs & Bütçe Sheets",
      sampleOutline: [
        "1. Projenin Ar-Ge ve İnovatif Niteliği",
        "2. İş Paketleri (WP1 Mimari, WP2 Model Eğitimi, WP3 Güvenlik)",
        "3. TÜBİTAK Uyumlu Personel & Donanım Bütçesi (Sheets Formüllü)",
        "4. Risk Analizi ve Alternatif Çözüm Planı"
      ]
    },
    ecommerce: {
      title: "KOSGEB Yurt Dışı Pazar Destek & Lojistik Projeksiyonu",
      authority: "KOSGEB & Ticaret Bakanlığı",
      maxBudget: "3.000.000 TL Destek",
      badge: "E-Ticaret & İhracat Dikeyi",
      description: "Hedef pazar analizleri, dijital reklam bütçelendirmesi ve yurt dışı fulfilment planlaması.",
      templateType: "Google Sheets Mali Tablo",
      sampleOutline: [
        "1. Hedef Pazar Demografisi ve Rakip Fiyatlandırma Endeksi",
        "2. Lojistik ve Gümrük Maliyet Simülasyonu",
        "3. Meta & Google Ads İhracat Dönüşüm Bütçesi",
        "4. 12 Aylık Nakit Akış ve Kârlılık Projeksiyonu"
      ]
    },
    ngo: {
      title: "AB Sivil Düşün / Elçilik Hibe Başvuru Dosyası",
      authority: "Avrupa Birliği & Sivil Toplum Destek Programı",
      maxBudget: "60.000 EUR Hibe",
      badge: "STK & Hak Temelli Çevre/İklim",
      description: "Değişim Teorisi (Theory of Change), sosyal etki göstergeleri ve şeffaf harcama planı.",
      templateType: "Google Docs Hibe Şablonu",
      sampleOutline: [
        "1. Sorun Analizi ve Doğrudan Yararlanıcı Kitle",
        "2. Değişim Teorisi ve Faaliyet Takvimi",
        "3. Görünürlük, İletişim ve Savunuculuk Çıktıları",
        "4. İzleme, Değerlendirme ve Etki Ölçüm Raporu"
      ]
    },
    creative: {
      title: "Kültür Fonu & Festival Sponsorluk Hak Matrisi",
      authority: "İKSV, Kültür Bakanlığı & Kurumsal Sponsorlar",
      maxBudget: "1.500.000 TL Sponsorluk",
      badge: "Kültür, Sanat & Kolektifler",
      description: "Sanatçı manifestosu, sahne/sergi prodüksiyon bütçesi ve sponsor hakları katalog şablonu.",
      templateType: "Google Docs + Portfolyo Sunumu",
      sampleOutline: [
        "1. Küratöryel Metin & Sanatsal Vizyon",
        "2. Katılımcı Sanatçı / İnisiyatif Listesi",
        "3. Sponsorluk İsim Hakkı & Marka Entegrasyon Matrisi",
        "4. Prodüksiyon, Sahne & Mekan Gider Dökümü"
      ]
    }
  };

  const current = verticals[selectedVertical];

  const handleGenerateDoc = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      // Gerçek Google Docs oluşturma simülasyonu
      const newUrl = `https://docs.google.com/document/create?title=${encodeURIComponent(current.title)}`;
      setGeneratedDocUrl(newUrl);
      toast.success(
        "Belge Başarıyla Derlendi",
        "Google Workspace hesabınızda açılmaya hazır. 📄"
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Sektörel Dikey Seçim Sekmeleri */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(Object.keys(verticals) as IndustryVertical[]).map((vKey) => (
          <button
            key={vKey}
            onClick={() => {
              setSelectedVertical(vKey);
              setGeneratedDocUrl(null);
            }}
            className={`rounded-xl border p-3.5 text-left transition-all ${
              selectedVertical === vKey
                ? "border-brand-600 bg-white shadow-2xs text-brand-900 ring-1 ring-brand-600"
                : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {vKey === "tech_ai" && "Yapay Zeka & BT"}
              {vKey === "ecommerce" && "E-Ticaret & D2C"}
              {vKey === "ngo" && "STK & İklim"}
              {vKey === "creative" && "Kültür-Sanat"}
            </div>
            <div className="text-xs font-bold mt-1 text-slate-900 truncate">
              {verticals[vKey].badge}
            </div>
          </button>
        ))}
      </div>

      {/* Seçili Dikeyin Başvuru & Dosya Detayı */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 border border-brand-100">
              {current.badge}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1.5">{current.title}</h3>
            <p className="text-xs text-slate-500">{current.authority} • {current.description}</p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium">Azami Fon Hacmi:</span>
            <div className="text-base font-black text-emerald-600 font-mono">{current.maxBudget}</div>
          </div>
        </div>

        {/* Belge İskeleti */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Otomatik Derlenecek Belge İçeriği:
          </h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {current.sampleOutline.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Biçim: <b>{current.templateType}</b> (Kurumsal Kimlik ve Formüller Dahil)
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {generatedDocUrl && (
              <a
                href={generatedDocUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100 shadow-2xs transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Google Docs&apos;ta Canlı Aç
              </a>
            )}

            <button
              onClick={handleGenerateDoc}
              disabled={generating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-2xs"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              {generating ? "Google Docs / Sheets Derleniyor..." : "Dosyayı Google Workspace'te Oluştur"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
