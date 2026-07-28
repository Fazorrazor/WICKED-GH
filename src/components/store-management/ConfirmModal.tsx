import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  requireString?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirming = false,
  requireString,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isButtonDisabled =
    isConfirming || (requireString ? inputValue !== requireString : false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white border border-black/10 shadow-2xl max-w-md w-full flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-6 border-b border-black/5">
          <h2 className="font-display text-2xl font-light uppercase tracking-widest text-black mb-4">
            {title}
          </h2>
          <p className="font-sans text-[0.65rem] tracking-[0.15em] text-black/60 uppercase leading-relaxed mb-6">
            {message}
          </p>

          {requireString && (
            <div className="flex flex-col gap-2 animate-in fade-in zoom-in duration-500">
              <label className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase text-black/80">
                Type "{requireString}" to confirm
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={requireString}
                className="w-full border-b border-black/20 pb-2 bg-transparent text-sm font-mono tracking-wider outline-none focus:border-red-600 transition-colors text-black placeholder:text-black/20"
                autoComplete="off"
              />
            </div>
          )}
        </div>
        <div className="flex">
          <button
            onClick={onCancel}
            disabled={isConfirming}
            className="flex-1 py-4 font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase text-black hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isButtonDisabled}
            className="flex-1 py-4 font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase bg-black text-white hover:bg-black/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConfirming ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            {isConfirming ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
