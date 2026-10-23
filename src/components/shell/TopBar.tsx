"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, ExternalLink, Command } from "lucide-react";
import { JobStatusResponse } from "@/types";
import { MobileHeader } from "./MobileHeader";

interface TopBarProps {
  currentJob?: JobStatusResponse | null;
  demoMode: boolean;
  onToggleDemoMode: () => void;
  reducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
  activeScreen?: "intake" | "processing" | "results";
  onOpenNavDrawer?: () => void;
}

export function TopBar({
  currentJob,
  demoMode,
  onToggleDemoMode,
  activeScreen = "intake",
  onOpenNavDrawer,
}: TopBarProps) {
  const pathname = usePathname();
  const isPastDemosPage = pathname === "/past-demos";

  // Keyboard shortcut listener for ⌘D / Ctrl+D to toggle Demo Mode instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        onToggleDemoMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggleDemoMode]);

  return (
    <>
      {/* Mobile-Specific Header with Hamburger & Touch-Optimized Layout */}
      <div className="md:hidden">
        <MobileHeader
          demoMode={demoMode}
          onToggleDemoMode={onToggleDemoMode}
          onOpenNavDrawer={onOpenNavDrawer || (() => {})}
          currentJob={currentJob}
        />
      </div>

      {/* Desktop & Tablet Header */}
      <header className="hidden md:flex sticky top-0 z-40 w-full h-14 border-b border-white/[0.1] bg-black/90 backdrop-blur-xl px-4 lg:px-8 select-none shadow-[0_1px_0_0_rgba(255,255,255,0.02)]">
        <div className="max-w-7xl h-full mx-auto w-full flex items-center justify-between gap-4">
          {/* Brand Area */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex flex-col group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF5E2A] rounded-lg p-0.5 truncate"
            >
              <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-[#FF5E2A] transition-colors leading-tight">
                iNyra
              </span>
              <span className="text-[10px] text-[#8A8D9A] leading-none truncate">
                Lead Intelligence
              </span>
            </Link>
          </div>

          {/* Action Controls & Navigation */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Past Demos Navigation */}
            <Link
              href={isPastDemosPage ? "/" : "/past-demos"}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                isPastDemosPage
                  ? "bg-[#17181D] border-[#FF5E2A] text-white"
                  : "bg-[#121316] border-white/[0.04] text-[#8A8D9A] hover:text-white hover:border-white/[0.08]"
              }`}
            >
              <History className="w-3.5 h-3.5 text-[#FF5E2A]" />
              <span className="font-medium">
                {isPastDemosPage ? "Live Engine" : "Past Demos"}
              </span>
            </Link>

            {/* Direct Airtable Base Link */}
            <a
              href="https://airtable.com/appINyraLeadGen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-[#121316] border border-white/[0.04] hover:border-white/[0.08] text-[#8A8D9A] hover:text-white transition-all"
              title="Open Airtable CRM"
            >
              <span>Airtable</span>
              <ExternalLink className="w-3 h-3 text-[#5C5F6D]" />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
