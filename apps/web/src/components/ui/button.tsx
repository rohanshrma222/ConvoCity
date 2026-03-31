"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "destructive" | "ghost";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-[#6c63ff] text-white shadow-[0_12px_28px_rgba(108,99,255,0.22)] hover:bg-[#7a72ff]",
  secondary: "bg-white/[0.08] text-[#f0f2ff] hover:bg-white/[0.12]",
  outline: "border border-white/12 bg-transparent text-[#f0f2ff] hover:bg-white/[0.06]",
  destructive: "bg-[#8f2948] text-white hover:bg-[#a63255]",
  ghost: "bg-transparent text-[#cfd4ff] hover:bg-white/[0.06]",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "size-10",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "default", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[transform,background-color,color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a2e]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
});
