"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function ShimmerButton({
  children,
  className,
  glow = true,
  disabled,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-lg font-medium text-sm transition-all duration-200 select-none",
        "bg-gradient-to-r from-[#7C5CFF] via-[#8F72FF] to-[#7C5CFF] text-white",
        "border border-white/15",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28)]",
        glow && "shadow-[0_0_24px_-4px_rgba(124,92,255,0.45)] hover:shadow-[0_0_32px_-2px_rgba(124,92,255,0.6)]",
        "hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        className
      )}
      {...props}
    >
      {/* Light sweep shimmer beam */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.8s_infinite_linear] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Content wrapper */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
