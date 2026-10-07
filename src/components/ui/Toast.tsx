import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id?: string;
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({ type, title, message, onClose, durationMs = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, durationMs);
    return () => clearTimeout(timer);
  }, [onClose, durationMs]);

  const icons = {
    success: <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />,
    error: <AlertCircle size={16} className="text-red-400 shrink-0" />,
    warning: <AlertTriangle size={16} className="text-amber-400 shrink-0" />,
    info: <Info size={16} className="text-blue-400 shrink-0" />,
  };

  const borderColors = {
    success: "border-emerald-500/20 bg-emerald-950/80 text-emerald-100",
    error: "border-red-500/20 bg-slate-950/90 text-red-100",
    warning: "border-amber-500/20 bg-amber-950/80 text-amber-100",
    info: "border-blue-500/20 bg-slate-950/90 text-blue-100",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[110] max-w-sm w-full rounded-2xl border backdrop-blur-2xl p-4 shadow-2xl transition-all duration-300 animate-slide-in flex items-start gap-3 select-none ${borderColors[type]}`}
    >
      <div className="pt-0.5">{icons[type]}</div>
      <div className="flex-1 space-y-0.5">
        <h4 className="text-xs font-bold leading-tight">{title}</h4>
        <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0"
      >
        <X size={12} />
      </button>
    </div>
  );
};
