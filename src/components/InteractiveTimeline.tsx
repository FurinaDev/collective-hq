"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, AlertTriangle, MessageCircle, ArrowRight, User, Calendar } from "lucide-react";
import { TimelineMilestone } from "../types/venturi";

export function InteractiveTimeline() {
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([
    {
      id: "m-1",
      title: "Backend API Mimarisi ve Stripe Webhook Entegrasyonu",
      ownerName: "Kerem Ak",
      ownerPhone: "+90 532 111 22 33",
      ownerRole: "Lead Backend Developer",
      startDate: "10 Eki",
      endDate: "15 Eki",
      progress: 85,
      isCriticalPath: true,
      blocker: "Frontend ekibi bu API yanıt şemasını bekliyor",
      verificationChannel: "WhatsApp",
      status: "At_Risk"
    },
    {
      id: "m-2",
      title: "UI/UX Tasarım Sistemi ve Mobil Responsive Optimizasyon",
      ownerName: "Buse Kaya",
      ownerPhone: "+90 533 444 55 66",
      ownerRole: "Design Lead",
      startDate: "12 Eki",
      endDate: "18 Eki",
      progress: 60,
      isCriticalPath: false,
      verificationChannel: "WhatsApp",
      status: "On_Track"
    },
    {
      id: "m-3",
      title: "Seed Turu Pitch Deck & 1-Pager Yatırımcı Raporu",
      ownerName: "Kurucu Ekip",
      ownerPhone: "+90 535 777 88 99",
      ownerRole: "Founder",
      startDate: "14 Eki",
      endDate: "17 Eki",
      progress: 40,
      isCriticalPath: true,
      blocker: "Finansal projeksiyon tablosunun netleşmesi gerekiyor",
      verificationChannel: "Email",
      status: "At_Risk"
    },
    {
      id: "m-4",
      title: "TÜBİTAK 1507 Ar-Ge Proje Metninin E-İmza ile Gönderimi",
      ownerName: "Zeynep Arslan",
      ownerPhone: "+90 536 999 00 11",
      ownerRole: "Hibe & Proje Yöneticisi",
      startDate: "15 Eki",
      endDate: "22 Eki",
      progress: 20,
      isCriticalPath: false,
      verificationChannel: "WhatsApp",
      status: "On_Track"
    }
  ]);

  const handleWhatsAppPing = (m: TimelineMilestone) => {
    const cleanPhone = m.ownerPhone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Sayın ${m.ownerName},\n\n` +
      `Venturi Yönetici Sistemi üzerinden takip edilen kritik yol taahhüdünüz:\n` +
      `• Görev: ${m.title}\n` +
      `• Termin: ${m.endDate}\n` +
      `• Mevcut İlerleme: %${m.progress}\n\n` +
      `Herhangi bir blokaj veya gecikme riski var mı? Durum teyidi için bu mesajı yanıtlayabilirsiniz.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Üst Bilgi Kartı */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-600" />
            Dinamik Teslimat Zaman Çizelgesi (Critical Path Watchdog)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Jira karmaşıklığı olmadan sadece teslimatı engelleyen kritik rotaları ve ekip bağımlılıklarını izleyin.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded bg-rose-50 px-2 py-1 text-rose-700 font-bold border border-rose-200">
            <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
            2 Kritik Yol Riski
          </span>
        </div>
      </div>

      {/* Görsel Timeline & Görev Kartları */}
      <div className="space-y-3">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border p-4 bg-white shadow-2xs transition-all hover:border-slate-300 ${
              m.isCriticalPath ? "border-l-4 border-l-brand-600 border-slate-200" : "border-slate-200"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Sol Başlık ve Sorumlu */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {m.isCriticalPath && (
                    <span className="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-100">
                      Kritik Rota
                    </span>
                  )}
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    m.status === "At_Risk" 
                      ? "bg-rose-50 text-rose-700 border border-rose-200" 
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    {m.status === "At_Risk" ? "Gecikme Riski" : "Takvimde İlerliyor"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {m.startDate} → {m.endDate}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{m.ownerName}</span>
                  <span>({m.ownerRole})</span>
                </div>

                {m.blocker && (
                  <div className="mt-2 rounded bg-amber-50 border border-amber-200 p-2 text-xs text-amber-900 font-medium">
                    ⚠️ <b>Mevcut Blokaj:</b> {m.blocker}
                  </div>
                )}
              </div>

              {/* Sağ İlerleme Çubuğu ve Aksiyon */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:w-80">
                <div className="w-full space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Tamamlanma</span>
                    <span className="font-bold text-slate-800">%{m.progress}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        m.status === "At_Risk" ? "bg-amber-500" : "bg-brand-600"
                      }`}
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleWhatsAppPing(m)}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-2xs flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp Teyidi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
