"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  Users2,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Database,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { JobStatusResponse } from "@/types";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  demoMode: boolean;
  onToggleDemoMode: () => void;
  currentJob?: JobStatusResponse | null;
  onNavigateScreen?: (screen: "intake" | "processing" | "results") => void;
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  demoMode,
  onToggleDemoMode,
  currentJob,
  onNavigateScreen,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const isPastDemos = pathname === "/past-demos";
  const [searchVal, setSearchVal] = useState("");

  // Lock body & HTML scroll when navigation drawer is open (Requirement 3)
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleNav = (screen: "intake" | "processing" | "results") => {
    if (onNavigateScreen) onNavigateScreen(screen);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Frosted Dark Backdrop with minimal blur and subtle background visibility (Requirement 3) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close navigation menu"
          />

          {/* Slide-out Sheet Panel from Left with smooth spring physics (Requirement 1) */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320, mass: 0.8 }}
            className="relative w-4/5 max-w-xs h-full bg-[#0D0E11] border-r border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col z-10 pt-safe pb-safe"
          >
            {/* Header / Brand Area */}
            <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
              <Link href="/" onClick={onClose} className="flex flex-col min-w-0">
                <span className="font-bold text-base text-white block leading-none">
                  iNyra
                </span>
                <span className="text-[10px] text-[#8A8D9A] leading-tight block mt-1 font-mono">
                  Lead Intelligence
                </span>
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-[#17181D] hover:bg-[#1E2026] text-[#8A8D9A] hover:text-white flex items-center justify-center transition-colors active:scale-95"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Command Input */}
            <div className="p-4 border-b border-white/[0.04]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5F6D]" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search leads, commands..."
                  className="w-full bg-[#121316] text-white placeholder-[#5C5F6D] text-base rounded-xl pl-9 pr-3.5 py-2.5 border border-white/[0.06] focus:outline-none focus:border-[#FF5E2A]"
                />
              </div>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
              {/* Main Views */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-[#5C5F6D] px-2 block mb-1 tracking-wider">
                  Workspaces
                </span>

                <button
                  type="button"
                  onClick={() => handleNav("intake")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-all min-h-[44px]"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#FF5E2A]" />
                  <span className="font-medium">Intake & Setup</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav("processing")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-all min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium">Live Telemetry</span>
                  </div>
                  {currentJob?.status === "running" && (
                    <span className="w-2 h-2 rounded-full bg-[#FF5E2A] animate-ping" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNav("results")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-all min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Users2 className="w-4 h-4 text-[#FF5E2A]" />
                    <span className="font-medium">Verified Leads</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF5E2A]/15 text-[#FF5E2A]">
                    {currentJob?.leads?.length || 24}
                  </span>
                </button>

                <Link
                  href="/past-demos"
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all min-h-[44px] ${
                    isPastDemos
                      ? "bg-white/[0.08] text-white"
                      : "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#FF5E2A]" />
                    <span className="font-medium">Past Sessions</span>
                  </div>
                </Link>
              </div>

              {/* External Links & System Status */}
              <div className="space-y-1 pt-2 border-t border-white/[0.04]">
                <span className="text-[10px] uppercase font-mono font-bold text-[#5C5F6D] px-2 block mb-1 tracking-wider">
                  Integration & Storage
                </span>

                <a
                  href="https://airtable.com/appINyraLeadGen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-all min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-[#FF5E2A]" />
                    <span className="font-medium">Open in Airtable</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#5C5F6D]" />
                </a>

                <div className="flex items-center gap-3 px-3 py-2.5 text-xs text-[#8A8D9A]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Public Web Scrape Only (GDPR Compliant)</span>
                </div>
              </div>
            </div>

            {/* Footer Demo Mode Switch Card */}
            <div className="p-4 border-t border-white/[0.06] bg-[#0A0A0C]">
              <div className="p-3 rounded-xl bg-[#121316] border border-white/[0.05] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Demo Mode
                  </span>
                  <span className="text-[10px] text-[#8A8D9A]">
                    {demoMode ? "Instant Replay ON" : "Live Webhooks Active"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onToggleDemoMode}
                  className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    demoMode
                      ? "bg-[#FF5E2A] text-white shadow-[0_0_12px_rgba(255,94,42,0.4)]"
                      : "bg-[#17181D] text-[#8A8D9A] border border-white/[0.06]"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{demoMode ? "ON" : "OFF"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
