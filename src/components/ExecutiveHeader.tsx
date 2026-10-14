"use client";

import React from "react";
import { Search, Command, Menu, X, CheckCircle2, ShieldCheck } from "lucide-react";

interface ExecutiveHeaderProps {
  onOpenCommand: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeModuleTitle: string;
  brandName?: string;
}

export function ExecutiveHeader({
  onOpenCommand,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeModuleTitle,
  brandName = "VORTEX"
}: ExecutiveHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 sm:px-6 backdrop-blur-xs">
      {/* Sol: Aktif Modül Başlığı ve Mobil Hamburger Buton */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 sm:hidden transition-colors"
          aria-label={mobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2 truncate">
          <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">
            {brandName}
          </span>
          <span className="text-slate-300 dark:text-slate-700 font-normal">/</span>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
            {activeModuleTitle}
          </span>
        </div>
      </div>

      {/* Sağ: ⌘+K Komut Paleti & Sistem Sağlığı */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Raycast-Style Command Trigger */}
        <button
          type="button"
          onClick={onOpenCommand}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-2xs"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden sm:inline">Kriz veya İşlem Ara...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:text-slate-400 font-bold shadow-2xs">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>

        {/* Canlı Statü Rozeti */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Google Workspace Bağlı
        </div>
      </div>
    </header>
  );
}
