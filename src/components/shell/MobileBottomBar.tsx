"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Terminal, Users2, History } from "lucide-react";
import { JobStatusResponse } from "@/types";

interface MobileBottomBarProps {
  activeScreen: "intake" | "processing" | "results";
  onSelectScreen: (screen: "intake" | "processing" | "results") => void;
  currentJob?: JobStatusResponse | null;
}

export function MobileBottomBar({
  activeScreen,
  onSelectScreen,
  currentJob,
}: MobileBottomBarProps) {
  const pathname = usePathname();
  const isPastDemos = pathname === "/past-demos";
  const isRunning = currentJob?.status === "running";
  const leadCount = currentJob?.leads?.length || 0;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0D0E11]/95 backdrop-blur-2xl border-t border-white/[0.08] pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
      role="navigation"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {/* Destination 1: Intake / New Search */}
        <button
          type="button"
          onClick={() => onSelectScreen("intake")}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] transition-all relative group select-none active:scale-95 ${
            !isPastDemos && activeScreen === "intake"
              ? "text-[#FF5E2A]"
              : "text-[#8A8D9A] hover:text-white"
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 mb-0.5" />
            {!isPastDemos && activeScreen === "intake" && (
              <span className="absolute -inset-1 bg-[#FF5E2A]/20 blur-sm rounded-full -z-10" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight">Intake</span>
          {!isPastDemos && activeScreen === "intake" && (
            <span className="absolute top-0 w-8 h-0.5 bg-[#FF5E2A] rounded-full shadow-[0_0_8px_#FF5E2A]" />
          )}
        </button>

        {/* Destination 2: Telemetry / Live */}
        <button
          type="button"
          onClick={() => onSelectScreen("processing")}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] transition-all relative group select-none active:scale-95 ${
            !isPastDemos && activeScreen === "processing"
              ? "text-[#FF5E2A]"
              : "text-[#8A8D9A] hover:text-white"
          }`}
        >
          <div className="relative">
            <Terminal className="w-5 h-5 mb-0.5" />
            {isRunning && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF5E2A] animate-ping" />
            )}
            {!isPastDemos && activeScreen === "processing" && (
              <span className="absolute -inset-1 bg-[#FF5E2A]/20 blur-sm rounded-full -z-10" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight">Telemetry</span>
          {!isPastDemos && activeScreen === "processing" && (
            <span className="absolute top-0 w-8 h-0.5 bg-[#FF5E2A] rounded-full shadow-[0_0_8px_#FF5E2A]" />
          )}
        </button>

        {/* Destination 3: Results / Leads */}
        <button
          type="button"
          onClick={() => onSelectScreen("results")}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] transition-all relative group select-none active:scale-95 ${
            !isPastDemos && activeScreen === "results"
              ? "text-[#FF5E2A]"
              : "text-[#8A8D9A] hover:text-white"
          }`}
        >
          <div className="relative">
            <Users2 className="w-5 h-5 mb-0.5" />
            {leadCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-mono font-bold bg-[#FF5E2A] text-white rounded-full leading-none py-0.5 shadow-sm">
                {leadCount}
              </span>
            )}
            {!isPastDemos && activeScreen === "results" && (
              <span className="absolute -inset-1 bg-[#FF5E2A]/20 blur-sm rounded-full -z-10" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight">Leads</span>
          {!isPastDemos && activeScreen === "results" && (
            <span className="absolute top-0 w-8 h-0.5 bg-[#FF5E2A] rounded-full shadow-[0_0_8px_#FF5E2A]" />
          )}
        </button>

        {/* Destination 4: Past Demos Archive */}
        <Link
          href={isPastDemos ? "/" : "/past-demos"}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] transition-all relative group select-none active:scale-95 ${
            isPastDemos
              ? "text-[#FF5E2A]"
              : "text-[#8A8D9A] hover:text-white"
          }`}
        >
          <div className="relative">
            <History className="w-5 h-5 mb-0.5" />
            {isPastDemos && (
              <span className="absolute -inset-1 bg-[#FF5E2A]/20 blur-sm rounded-full -z-10" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight">History</span>
          {isPastDemos && (
            <span className="absolute top-0 w-8 h-0.5 bg-[#FF5E2A] rounded-full shadow-[0_0_8px_#FF5E2A]" />
          )}
        </Link>
      </div>
    </nav>
  );
}
