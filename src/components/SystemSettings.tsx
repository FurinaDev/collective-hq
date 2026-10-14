"use client";

import React, { useState, useEffect } from "react";
import { 
  Sliders, 
  Key, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  User, 
  Mail, 
  ExternalLink,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { useToast } from "./ui/ToastNotification";

export interface AppSettings {
  brandChoice: "VORTEX" | "BOTTLENEX" | "AXIS" | "HELM" | "UNCLOQ";
  platformName: string;
  founderName: string;
  founderEmail: string;
  apiKey: string;
  driveFolderUrl: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  brandChoice: "VORTEX",
  platformName: "Çağdaş Müzik Platformu",
  founderName: "Efe (Kurucu & Genel Koordinatör)",
  founderEmail: "koordinasyon@platform.org",
  apiKey: "",
  driveFolderUrl: "https://drive.google.com"
};

export function SystemSettings({
  onSettingsChange
}: {
  onSettingsChange?: (settings: AppSettings) => void;
}) {
  const toast = useToast();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("bottlenex_settings", JSON.stringify(settings));
    }
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
    setSaved(true);
    toast.success("Ayarlar Kaydedildi", "Sistem ve marka yapılandırması yerel depolamaya yazıldı.");
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setConfirmResetOpen(true);
  };

  const executeReset = () => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== "undefined") {
      localStorage.setItem("bottlenex_settings", JSON.stringify(DEFAULT_SETTINGS));
    }
    if (onSettingsChange) onSettingsChange(DEFAULT_SETTINGS);
    setConfirmResetOpen(false);
    toast.info("Varsayılan Ayarlar Yüklendi", "Tüm sistem yapılandırması fabrika ayarlarına döndürüldü.");
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Üst Bilgi */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white font-bold text-xs">
            ⚙
          </span>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Sistem, Marka & API Yapılandırması (BYOK)
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Platform adını, kurucu kimliğini ve yapay zeka anahtarınızı (Bring Your Own Key) yapılandırın. Verileriniz yalnızca yerel tarayıcınızda saklanır.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6 text-xs">
        
        {/* Marka İsmi Seçimi */}
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <label className="font-bold text-slate-900 block">
            Tercih Edilen Marka Kimliği (Aktif Test):
          </label>
          <p className="text-[11px] text-slate-500">
            Arayüzde ve başlıklarda görmek istediğiniz tescillenebilir marka adını seçin:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
            {[
              { id: "VORTEX", name: "VORTEX", sub: "Executive Operating System" },
              { id: "BOTTLENEX", name: "BOTTLENEX", sub: "De-Bottleneck Engine" },
              { id: "AXIS", name: "AXIS", sub: "Executive Ops Engine" },
              { id: "HELM", name: "HELM", sub: "Founder's Cockpit" },
              { id: "UNCLOQ", name: "UNCLOQ", sub: "Execution OS" },
            ].map((b) => (
              <button
                type="button"
                key={b.id}
                onClick={() => setSettings({ ...settings, brandChoice: b.id as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.brandChoice === b.id
                    ? "border-slate-900 bg-slate-900 text-white shadow-2xs"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="font-black text-xs">{b.name}</div>
                <div className={`text-[9px] mt-0.5 truncate ${settings.brandChoice === b.id ? "text-slate-300" : "text-slate-400"}`}>
                  {b.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Kurum & Kurucu Bilgileri */}
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <h3 className="font-bold text-slate-900 text-xs">Kurumsal Profil</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kurum / Startup Adı</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kurucu / Koordinatör Adı</label>
              <input
                type="text"
                value={settings.founderName}
                onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Resmi İletişim E-Postası</label>
              <input
                type="email"
                value={settings.founderEmail}
                onChange={(e) => setSettings({ ...settings, founderEmail: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Google Drive Klasör Linki</label>
              <input
                type="url"
                value={settings.driveFolderUrl}
                onChange={(e) => setSettings({ ...settings, driveFolderUrl: e.target.value })}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* API Anahtarları (BYOK) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-amber-500" />
              Yapay Zeka API Anahtarı (Google Gemini / OpenRouter)
            </h3>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              İsteğe Bağlı
            </span>
          </div>

          <div>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="sk-or-v1-... veya AIzaSy..."
              className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-800 font-mono focus:border-brand-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Kendi API anahtarınızı girdiğinizde hiçbir kullanım limiti olmadan tüm strateji ve doküman motorları çalışır.
            </span>
          </div>
        </div>

        {/* Kaydetme Butonu */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Varsayılana Dön
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 shadow-2xs transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? "Ayarlar Kaydedildi! ✓" : "Yapılandırmayı Kaydet"}
          </button>
        </div>
      </form>

      {/* Varsayılana Dönüş Onay Modalı */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        title="Varsayılan Ayarlara Dönüş"
        description="Tüm marka, profil ve API anahtarı ayarlarınız sıfırlanacaktır. Bu işlemi onaylıyor musunuz?"
        confirmText="Sıfırla"
        cancelText="Vazgeç"
        variant="danger"
        onConfirm={executeReset}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  );
}
