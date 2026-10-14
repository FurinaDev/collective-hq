"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, Sparkles, FileText, ArrowRight, X, Zap, Calendar, CheckSquare, Shield } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onSelectAction: (actionKey: string, payload?: any) => void;
}

export function CommandPalette({ isOpen, onClose, onOpen, onSelectAction }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener that functions whether the palette is open or closed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else if (onOpen) {
          onOpen();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onOpen]);

  const quickActions = [
    { id: "docs_investor", title: "Google Docs Belgesi Aç: Tohum Yatırım Notu (Seed Memorandum)", group: "Google Workspace", icon: FileText, tag: "Docs API" },
    { id: "docs_tubitak", title: "TÜBİTAK 1507 Ar-Ge Proje Başvuru Dosyası Oluştur", group: "Fon & Hibe", icon: Zap, tag: "Tech AI" },
    { id: "docs_kosgeb", title: "KOSGEB Yurt Dışı Pazar Gider Projeksiyonu (Sheets)", group: "Fon & Hibe", icon: Zap, tag: "E-Ticaret" },
    { id: "matrix_pivot", title: "Stratejik İkilem Çöz: B2B Enterprise vs Product-Led Growth", group: "Stratejik Mentörlük", icon: Sparkles, tag: "Decision" },
    { id: "timeline_unblock", title: "Darboğaz Çöz: Backend API Teslimatını Bugün 14:00'e Çek", group: "Timeline & Delegasyon", icon: CheckSquare, tag: "Critical Path" },
    { id: "calendar_book", title: "Google Calendar Tanışma Slotlarını Güncelle", group: "Google Workspace", icon: Calendar, tag: "Calendar API" }
  ];

  const filtered = quickActions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.group.toLowerCase().includes(query.toLowerCase()) ||
      a.tag.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDownInDialog = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectAction(filtered[selectedIndex].id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-hud overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownInDialog}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3.5 bg-white dark:bg-slate-900">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bir komut yazın veya işlem arayın (ör: 'Docs oluştur', 'TÜBİTAK', 'Takvim')..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100/50 dark:divide-slate-800/50">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              Eşleşen komut bulunamadı.
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    onSelectAction(item.id);
                    onClose();
                  }}
                  className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isSelected
                          ? "bg-slate-900 text-white dark:bg-brand-600"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold tracking-tight">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        {item.group}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700">
                      {item.tag}
                    </span>
                    <ArrowRight className={`h-3.5 w-3.5 transition-colors ${isSelected ? "text-slate-700 dark:text-slate-200" : "text-slate-300 dark:text-slate-600"}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 px-4 py-2.5 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>Seçmek için <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300">↵ Enter</kbd></span>
            <span>Gezinmek için <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300">↑</kbd> <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300">↓</kbd></span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300">ESC</kbd> Kapat
          </div>
        </div>
      </div>
    </div>
  );
}
