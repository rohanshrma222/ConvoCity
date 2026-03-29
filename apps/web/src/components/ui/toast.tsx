"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ToastItem = {
  id: number;
  title: string;
  variant: "success" | "error";
};

type ToastContextValue = {
  toast: (input: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [items, setItems] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toast = React.useCallback((input: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((current) => [...current, { ...input, id }]);

    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted
        ? createPortal(
            <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-full max-w-sm flex-col gap-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_18px_48px_rgba(3,4,12,0.45)] backdrop-blur-xl",
                    "translate-y-0 opacity-100 transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    item.variant === "success"
                      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                      : "border-rose-400/20 bg-rose-500/10 text-rose-100",
                  )}
                  style={{
                    animationDelay: `${index * 45}ms`,
                  }}
                >
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
