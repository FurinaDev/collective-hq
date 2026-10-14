"use client";

import React, { useEffect } from "react";
import { AlertTriangle, AlertCircle, HelpCircle, X } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = "Onayla",
  cancelText = "Vazgeç",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
          iconBg: "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50",
          confirmButton: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow",
        };
      case "warning":
        return {
          icon: <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
          iconBg: "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50",
          confirmButton: "bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow",
        };
      case "primary":
      default:
        return {
          icon: <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
          iconBg: "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50",
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow",
        };
    }
  };

  const { icon, iconBg, confirmButton } = getVariantStyles();

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl transition-all animate-scale-in"
      >
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            {icon}
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
