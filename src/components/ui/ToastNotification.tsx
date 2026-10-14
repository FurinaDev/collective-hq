"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "info" | "warning" | "error";
  duration?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { showToast, removeToast, toasts } = context;

  const toastHelpers = {
    showToast,
    removeToast,
    toasts,
    success: (title: string, description?: string, duration?: number) =>
      showToast({ title, description, type: "success", duration }),
    info: (title: string, description?: string, duration?: number) =>
      showToast({ title, description, type: "info", duration }),
    warning: (title: string, description?: string, duration?: number) =>
      showToast({ title, description, type: "warning", duration }),
    error: (title: string, description?: string, duration?: number) =>
      showToast({ title, description, type: "error", duration }),
  };

  return toastHelpers;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        );
      case "warning":
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-4 w-4" />
          </div>
        );
      case "error":
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="h-4 w-4" />
          </div>
        );
      case "info":
      default:
        return (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Info className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <div
      role="alert"
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-700/80 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md transition-all duration-200 animate-fade-in hover:border-slate-600"
    >
      {getIcon()}
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-xs font-bold text-white tracking-tight truncate">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-300 break-words">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        aria-label="Kapat"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5 toasts
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Floating HUD Container */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
