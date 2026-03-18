"use client";
import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  const confirmStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    default: "bg-gray-900 hover:bg-gray-800 text-white",
  };

  const iconStyles = {
    danger: "bg-red-50 text-red-600",
    warning: "bg-amber-50 text-amber-600",
    default: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-sm mx-4 p-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconStyles[variant]}`}
          >
            <AlertTriangle size={16} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onCancel}
                className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                <X size={15} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-5 ml-13">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 text-sm py-2 rounded-lg font-medium disabled:opacity-50 transition-colors ${confirmStyles[variant]}`}
          >
            {isLoading ? "Please wait..." : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 text-sm py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
