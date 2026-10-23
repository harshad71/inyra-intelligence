"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { JobStatusResponse } from "@/types";

interface MobileHeaderProps {
  demoMode?: boolean;
  onToggleDemoMode?: () => void;
  onOpenNavDrawer: () => void;
  currentJob?: JobStatusResponse | null;
}

export function MobileHeader({
  onOpenNavDrawer,
  currentJob,
}: MobileHeaderProps) {
  const isRunning = currentJob?.status === "running";

  return (
    <div className="flex md:hidden items-center justify-between w-full h-14 px-3.5 bg-black/90 backdrop-blur-xl border-b border-white/[0.08] select-none sticky top-0 z-40">
      {/* Left: Brand Name */}
      <Link href="/" className="flex flex-col min-w-0">
        <span className="font-bold text-base tracking-tight text-white leading-tight">
          iNyra
        </span>
        <span className="text-[9px] text-[#8A8D9A] leading-none font-mono">
          Lead Intelligence
        </span>
      </Link>

      {/* Right: Hamburger Menu */}
      <div className="flex items-center shrink-0">
        {/* Hamburger Menu Trigger */}
        <button
          type="button"
          onClick={onOpenNavDrawer}
          className="min-h-[38px] min-w-[38px] w-9 h-9 rounded-xl bg-[#17181D] border border-white/[0.06] text-white flex items-center justify-center transition-colors active:scale-95 shadow-sm"
          aria-label="Open mobile navigation drawer"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
