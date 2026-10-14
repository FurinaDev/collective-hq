"use client";

import React, { useState } from "react";
import { Sparkles, Scale, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, TrendingUp } from "lucide-react";
import { DecisionOption } from "../types/venturi";
import { useToast } from "./ui/ToastNotification";

export function StrategicLab() {
  const toast = useToast();
  const [dilemma, setDilemma] = useState(
    "Erken aşamada B2B Enterprise satış modeliyle doğrudan kurumlara mı gitmeliyiz, yoksa Self-Serve PLG (Product-Led Growth) ile son kullanıcıya mı açılmalıyız?"
  );
  const [analyzing, setAnalyzing] = useState(false);

  const [options, setOptions] = useState<DecisionOption[]>([
    {
      id: "opt-1",
      name: "B2B Enterprise Satış Modeli (Yüksek ACV, Uzun Satış Döngüsü)",
      speedScore: 5,
      cashflowScore: 9,
      effortScore: 4,
      teamLoadScore: 6,
      totalScore: 7.2,
      verdict: "RECOMMENDED",
      rationale: "İlk 6 ayda nakit akışını güvenceye almak ve kurucu darboğazını yüksek sözleşme bedeliyle finanse etmek için en sağlam yol."
    },
    {
      id: "opt-2",
      name: "Product-Led Growth / Self-Serve Freemium",
      speedScore: 8,
      cashflowScore: 3,
      effortScore: 3,
      teamLoadScore: 4,
      totalScore: 4.8,
      verdict: "HIGH_RISK",
      rationale: "Ödeme altyapısı ve viralite gerektirir. Küçük ekipte müşteri destek yükü kurucuyu tamamen kilitler."
    }
  ]);

  const [devilsAdvocateOutput, setDevilsAdvocateOutput] = useState<string>(
    "YC / Sequoia Perspektifi: Eğer B2B Enterprise modelini seçerseniz satış döngüsü 3-6 ay sürer. Kurucu olarak haftada en az 15 demo toplantısı yapmanız gerekir. Satış tarafına bir SDR alana kadar ürün geliştirme durma noktasına gelecektir. Bu riski hafifletmek için ilk 3 pilot müşteriyi peşin yıllık ödemeyle bağlamalısınız."
  );

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      toast.success(
        "Stratejik Analiz Güncellendi",
        "Karar Matrisi ve Ters Köşe (Devil's Advocate) analizi güncellendi! 🎯"
      );
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Soru / İkilem Giriş Alanı */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Stratejik Karar Laboratuvarı & Devil&apos;s Advocate</h3>
          </div>
          <span className="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-100">
            Kurucu Mentörlük Modülü
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Tıkandığınız, ekiple veya yatırımcıyla henüz tartışamadığınız stratejik ikilemi yazın. Sistem ters köşe sorularla zayıf noktaları test eder:
        </p>
        <textarea
          rows={3}
          value={dilemma}
          onChange={(e) => setDilemma(e.target.value)}
          className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {analyzing ? "Analiz Ediliyor..." : "Stratejik Analizi Çalıştır ⚖️"}
          </button>
        </div>
      </div>

      {/* Devil's Advocate (Ters Köşe Analiz Kutusu) */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-amber-900">Devil&apos;s Advocate: Zayıf Noktalar & Kör Nokta Taraması</h4>
            <p className="text-amber-800 leading-relaxed">{devilsAdvocateOutput}</p>
          </div>
        </div>
      </div>

      {/* Ağırlıklı Karar Matrisi Tablosu */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="border-b border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Ağırlıklı Karar Matrisi</h4>
            <p className="text-[11px] text-slate-500">Hız, Nakit Akışı, Kurucu Eforu ve Ekip Yükü kriterlerine göre puanlanmıştır.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">Seçenek</th>
                <th className="p-3 text-center">Hız (1-10)</th>
                <th className="p-3 text-center">Nakit (1-10)</th>
                <th className="p-3 text-center">Efor Avantajı</th>
                <th className="p-3 text-center">Genel Skor</th>
                <th className="p-3">Öneri Kararı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {options.map((opt) => (
                <tr key={opt.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-semibold text-slate-900 max-w-sm">
                    {opt.name}
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">{opt.rationale}</div>
                  </td>
                  <td className="p-3 text-center font-mono tabular-nums">{opt.speedScore}/10</td>
                  <td className="p-3 text-center font-mono tabular-nums font-bold text-emerald-600">{opt.cashflowScore}/10</td>
                  <td className="p-3 text-center font-mono tabular-nums">{opt.effortScore}/10</td>
                  <td className="p-3 text-center font-mono font-bold text-sm text-slate-900">{opt.totalScore}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      opt.verdict === "RECOMMENDED" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {opt.verdict === "RECOMMENDED" ? "Önerilen Yol" : "Yüksek Risk"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
