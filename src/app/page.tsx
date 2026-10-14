"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  UserCheck, 
  Mail, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  Calendar,
  Layers,
  Settings,
  Bot,
  Plus,
  Trash2,
  CheckSquare,
  AlertCircle,
  FileText,
  Upload,
  MessageCircle,
  FileSpreadsheet,
  ArrowRight,
  Zap,
  ExternalLink,
  Sliders,
  Key,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Scale,
  DollarSign,
  Compass,
  FileCode,
  LayoutDashboard,
  X,
  Copy
} from "lucide-react";
import { CommandPalette } from "../components/CommandPalette";
import { ExecutiveHeader } from "../components/ExecutiveHeader";
import { ExecutiveFooter } from "../components/ExecutiveFooter";
import { StrategicLab } from "../components/StrategicLab";
import { InteractiveTimeline } from "../components/InteractiveTimeline";
import { CapitalForge } from "../components/CapitalForge";
import { DeBottleneckEngine } from "../components/DeBottleneckEngine";
import { CommsStudio } from "../components/CommsStudio";
import { TeamCapacityMatrix } from "../components/TeamCapacityMatrix";
import { WorkspaceDocsHub } from "../components/WorkspaceDocsHub";
import { SystemSettings, AppSettings } from "../components/SystemSettings";
import { ToastProvider, useToast } from "../components/ui/ToastNotification";

function VortexAppShell() {
  const toast = useToast();

  // Aktif Çalışma Ekranı
  const [activeTab, setActiveTab] = useState<
    "pulse" | "strategic_lab" | "timeline" | "capital_forge" | "workspace_docs" | "team_matrix" | "comms" | "settings"
  >("pulse");

  // Komut Paleti (⌘+K) & Mobil Menü
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Google Calendar Scheduler Modalı
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [bookingUrl, setBookingUrl] = useState("https://calendar.app.google/sample");
  const [calendarSlots, setCalendarSlots] = useState([
    { id: "slot-1", title: "Stratejik Tanışma & De-bottleneck (30 Dk)", timing: "Salı & Perşembe 14:00 - 17:00", active: true },
    { id: "slot-2", title: "Acil Kriz & Senkronizasyon (15 Dk)", timing: "Hafta içi her gün 11:00 - 11:30", active: true },
    { id: "slot-3", title: "Yatırımcı & Danışman Brifi (45 Dk)", timing: "Cuma 15:00 - 17:00", active: true }
  ]);

  // Sistem ve Marka Ayarları (VORTEX Default)
  const [settings, setSettings] = useState<AppSettings>({
    brandChoice: "VORTEX",
    platformName: "Çağdaş Müzik Platformu",
    founderName: "Efe (Kurucu & Koordinatör)",
    founderEmail: "koordinasyon@platform.org",
    apiKey: "",
    driveFolderUrl: "https://drive.google.com"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bottlenex_settings");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSettings(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const getModuleTitle = () => {
    switch (activeTab) {
      case "pulse": return "Darboğaz Çözücü & Operasyonel Nabız";
      case "strategic_lab": return "Stratejik Fikir Lab & Karar Matrisi";
      case "timeline": return "Teslimat Zaman Çizelgesi & Kritik Yol";
      case "capital_forge": return "Çok Dikey Fon, Hibe & Yatırım Motoru";
      case "workspace_docs": return "Google Workspace Canlı Doküman Fabrikası";
      case "team_matrix": return "Kadro, Kapasite & WhatsApp Görev Matrisi";
      case "comms": return "Kurumsal İletişim & Yazışma Stüdyosu";
      case "settings": return "Sistem, Marka & API Yapılandırması (BYOK)";
      default: return "Genel Bakış";
    }
  };

  const handleCopyBookingUrl = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(bookingUrl);
      toast.success("Bağlantı Kopyalandı", "Google Calendar randevu linki panoya alındı.");
    }
  };

  const handleSaveCalendarSlots = () => {
    setCalendarModalOpen(false);
    toast.success("Takvim Slotları Güncellendi", "Google Calendar entegrasyonuyla yeni uygunluk pencereleri eşitlendi.");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Komut Paleti (⌘+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onOpen={() => setCommandPaletteOpen(true)}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectAction={(actionKey) => {
          if (actionKey === "docs_investor" || actionKey === "docs_tubitak" || actionKey === "docs_kosgeb") {
            setActiveTab("workspace_docs");
          } else if (actionKey === "matrix_pivot") {
            setActiveTab("strategic_lab");
          } else if (actionKey === "timeline_unblock") {
            setActiveTab("timeline");
          } else if (actionKey === "calendar_book") {
            setCalendarModalOpen(true);
          }
        }}
      />

      {/* Mobil Backdrop Scrim (<640px) */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity sm:hidden"
          aria-hidden="true"
        />
      )}

      {/* ================================================================ */}
      {/* 1. SOL MENÜ (MOBİL OFF-CANVAS DRAWER + MASAÜSTÜ RAIL)             */}
      {/* ================================================================ */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out sm:static sm:z-20 sm:w-64 sm:shrink-0 sm:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        {/* Üst Logo ve Marka */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 font-black text-xs text-white shadow-2xs">
              {settings.brandChoice.charAt(0)}
            </div>
            <div>
              <h1 className="text-xs font-black text-slate-900 tracking-tight">{settings.brandChoice}</h1>
              <p className="text-[10px] text-brand-600 font-bold tracking-wide">FOUNDER OS</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-500 font-semibold">
              v3.0
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 sm:hidden"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Ana Navigasyon */}
        <nav className="flex-1 space-y-1 p-2 text-xs font-medium overflow-y-auto">
          <div className="px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Kriz & Karar Kokpiti
          </div>

          <button
            onClick={() => { setActiveTab("pulse"); setMobileMenuOpen(false); }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all ${
              activeTab === "pulse" ? "bg-slate-100 font-semibold text-slate-900 shadow-2xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <TrendingUp className="h-4 w-4 text-rose-600" />
            Darboğaz Çözücü
            <span className="ml-auto rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
              Canlı
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("strategic_lab"); setMobileMenuOpen(false); }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all ${
              activeTab === "strategic_lab" ? "bg-brand-50 font-semibold text-brand-900 shadow-2xs border border-brand-200/60" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Scale className="h-4 w-4 text-brand-600" />
            Fikir Lab & Karar Matrisi
          </button>

          <button
            onClick={() => { setActiveTab("timeline"); setMobileMenuOpen(false); }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all ${
              activeTab === "timeline" ? "bg-slate-100 font-semibold text-slate-900 shadow-2xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Clock className="h-4 w-4 text-slate-500" />
            Teslimat Zaman Çizelgesi
          </button>

          <div className="px-2 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            İcraat & Otomasyon
          </div>

          <button
            onClick={() => { setActiveTab("workspace_docs"); setMobileMenuOpen(false); }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all ${
              activeTab === "workspace_docs" ? "bg-slate-100 font-semibold text-slate-900 shadow-2xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText className="h-4 w-4 text-emerald-600" />
            Google Docs & Sheets Hub
            <span className="ml-auto font-mono text-[11px] text-slate-400 tabular-nums">
              3 Dosya
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("capital_forge"); setMobileMenuOpen(false); }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all ${
              activeTab === "capital_forge" ? "bg-slate-100 font-semibold text-slate-900 shadow-2xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Zap className="h-4 w-4 text-amber-500" />
            Fon, Hibe & Yatırım Motoru
          </button>

          <button
            onClick={() => { setActiveTab("team_matrix"); setMobileMenuOpen(false); }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all ${
              activeTab === "team_matrix" ? "bg-slate-100 font-semibold text-slate-900 shadow-2xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users className="h-4 w-4 text-slate-500" />
            Kadro & WhatsApp Matrisi
          </button>

          <button
            onClick={() => { setActiveTab("comms"); setMobileMenuOpen(false); }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all ${
              activeTab === "comms" ? "bg-slate-100 font-semibold text-slate-900 shadow-2xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Mail className="h-4 w-4 text-slate-500" />
            Kurumsal Yazışma Stüdyosu
          </button>
        </nav>

        {/* Alt Kullanıcı Bilgisi ve Ayarlar */}
        <div className="border-t border-slate-200 p-3 bg-white">
          <button
            onClick={() => { setActiveTab("settings"); setMobileMenuOpen(false); }}
            className={`flex w-full items-center justify-between rounded-lg p-2 text-xs transition-colors ${
              activeTab === "settings" ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                {settings.founderName.charAt(0)}
              </div>
              <div className="truncate text-left">
                <div className="font-bold text-slate-900 truncate text-[11px]">{settings.platformName}</div>
                <div className="text-[10px] text-slate-500 truncate">{settings.founderName.split(" ")[0]}</div>
              </div>
            </div>
            <Settings className="h-4 w-4 text-slate-400 shrink-0" />
          </button>
        </div>
      </aside>

      {/* ================================================================ */}
      {/* 2. SAĞ İÇERİK ALANI                                              */}
      {/* ================================================================ */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
        {/* Üst Header */}
        <ExecutiveHeader
          onOpenCommand={() => setCommandPaletteOpen(true)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeModuleTitle={getModuleTitle()}
          brandName={settings.brandChoice}
        />

        {/* Ana İçerik Kaydırıcı */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-6">

            {/* MODÜL 1: DARBOĞAZ ÇÖZÜCÜ (DE-BOTTLENECK ENGINE) */}
            {activeTab === "pulse" && (
              <div className="animate-fade-in">
                <DeBottleneckEngine 
                  onCreateDoc={(title, type) => {
                    setActiveTab("workspace_docs");
                  }}
                />
              </div>
            )}

            {/* MODÜL 2: STRATEJİK FİKİR LABORATUVARI */}
            {activeTab === "strategic_lab" && (
              <div className="animate-fade-in">
                <StrategicLab />
              </div>
            )}

            {/* MODÜL 3: PROJE & TESLİMAT ZAMAN ÇİZELGESİ */}
            {activeTab === "timeline" && (
              <div className="animate-fade-in">
                <InteractiveTimeline />
              </div>
            )}

            {/* MODÜL 4: FON & HİBE MOTORU */}
            {activeTab === "capital_forge" && (
              <div className="animate-fade-in">
                <CapitalForge />
              </div>
            )}

            {/* MODÜL 5: GOOGLE WORKSPACE CANLI DOKÜMAN MERKEZİ */}
            {activeTab === "workspace_docs" && (
              <div className="animate-fade-in">
                <WorkspaceDocsHub />
              </div>
            )}

            {/* MODÜL 6: KADRO, KAPASİTE & WHATSAPP GÖREV MATRİSİ */}
            {activeTab === "team_matrix" && (
              <div className="animate-fade-in">
                <TeamCapacityMatrix />
              </div>
            )}

            {/* MODÜL 7: KURUMSAL İLETİŞİM & YAZIŞMA STÜDYOSU */}
            {activeTab === "comms" && (
              <div className="animate-fade-in">
                <CommsStudio 
                  onSaveToDocs={() => {
                    setActiveTab("workspace_docs");
                  }}
                />
              </div>
            )}

            {/* MODÜL 8: SİSTEM & MARKA YAPILANDIRMASI (BYOK) */}
            {activeTab === "settings" && (
              <div className="animate-fade-in">
                <SystemSettings 
                  onSettingsChange={(newSettings) => setSettings(newSettings)}
                />
              </div>
            )}

          </div>
        </main>

        {/* Kurumsal Footer */}
        <ExecutiveFooter brandName={settings.brandChoice} />
      </div>

      {/* Google Calendar Scheduler Modalı */}
      {calendarModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setCalendarModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-scale-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-brand-200">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Google Calendar Slotları & Müsaitlik Pencereleri
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Kurucu tanışma ve de-bottleneck görüşme slotlarınızı yapılandırın.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCalendarModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Doğrudan Randevu Alma Linki (Google Appointment Schedule)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={bookingUrl}
                    onChange={(e) => setBookingUrl(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 font-mono text-[11px] text-slate-800 focus:border-brand-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyBookingUrl}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    Kopyala
                  </button>
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Aç
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                  Aktif Görüşme Slot Şablonları:
                </label>
                <div className="space-y-2">
                  {calendarSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{slot.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{slot.timing}</div>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Aktif
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCalendarModalOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={handleSaveCalendarSlots}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
              >
                Slotları Kaydet & Senkronize Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BottlenexApp() {
  return (
    <ToastProvider>
      <VortexAppShell />
    </ToastProvider>
  );
}
