"use client";

import React from "react";
import { ShieldCheck, Zap, GitBranch, ArrowUpRight } from "lucide-react";

export function ExecutiveFooter({
  brandName = "BOTTLENEX"
}: {
  brandName?: string;
}) {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-white font-black text-[10px]">
            {brandName.charAt(0)}
          </div>
          <span className="font-bold text-slate-900">{brandName} HQ</span>
          <span className="text-slate-300">•</span>
          <span>Founder De-Bottlenecking & Execution Engine</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Google Docs & Sheets Sync: Canlı
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            WhatsApp Zero-Login: Aktif
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-slate-400">v3.0 (Enterprise Ready)</span>
        </div>
      </div>
    </footer>
  );
}
