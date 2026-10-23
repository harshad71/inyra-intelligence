"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users2,
  FileText,
  Search,
  Command,
  Sliders,
  ShieldCheck,
  MessageSquare,
  Zap,
  ExternalLink,
} from "lucide-react";

interface SidebarProps {
  demoMode: boolean;
  onToggleDemoMode: () => void;
  leadCount?: number;
  activeScreen?: "intake" | "processing" | "results";
}

export function Sidebar({
  demoMode,
  onToggleDemoMode,
  leadCount = 24,
  activeScreen = "intake",
}: SidebarProps) {
  const pathname = usePathname();
  const isPastDemos = pathname === "/past-demos";

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#0D0E11] border-r border-white/[0.04] p-5 h-screen sticky top-0 select-none z-30">
      {/* Top Brand Logo matching Fintrixity */}
      <Link href="/" className="flex flex-col mb-6 group">
        <span className="font-bold text-xl tracking-tight text-white group-hover:text-zinc-200 transition-colors">
          iNyra
        </span>
        <span className="text-[11px] text-[#8A8D9A] leading-tight font-medium mt-0.5">
          Lead Intelligence
        </span>
      </Link>

      {/* Quick Command Search Pill with ⌘K Badge */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5F6D]" />
        <input
          type="text"
          placeholder="Search..."
          readOnly
          className="w-full bg-[#121316] text-[#EDEDEF] placeholder-[#5C5F6D] text-xs rounded-xl pl-9 pr-11 py-2.5 border border-white/[0.04] cursor-pointer hover:border-white/[0.08] transition-colors"
          onClick={() => {
            const el = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (el) el.focus();
          }}
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#17181D] border border-white/[0.06] text-[10px] font-mono text-[#8A8D9A]">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </div>

      {/* Main Nav Items Group */}
      <div className="space-y-1">
        <Link
          href="/"
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            !isPastDemos
              ? "bg-white/[0.08] text-white shadow-sm"
              : "text-[#8A8D9A] hover:text-white hover:bg-white/[0.03]"
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard
              className={`w-4 h-4 ${
                !isPastDemos ? "text-[#FF5E2A]" : "text-[#8A8D9A]"
              }`}
            />
            <span>Dashboard</span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#8A8D9A] hover:text-white hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-[#8A8D9A]" />
            <span>Analytics</span>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.08] text-white">
            {leadCount}
          </span>
        </Link>

        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#8A8D9A] hover:text-white hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users2 className="w-4 h-4 text-[#8A8D9A]" />
            <span>Accounts</span>
          </div>
        </Link>

        <Link
          href="/past-demos"
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isPastDemos
              ? "bg-white/[0.08] text-white shadow-sm"
              : "text-[#8A8D9A] hover:text-white hover:bg-white/[0.03]"
          }`}
        >
          <div className="flex items-center gap-3">
            <FileText
              className={`w-4 h-4 ${
                isPastDemos ? "text-[#FF5E2A]" : "text-[#8A8D9A]"
              }`}
            />
            <span>Past Runs</span>
          </div>
        </Link>
      </div>

      {/* Grouped Section: FEATURES */}
      <div className="mt-6 mb-2 px-3 text-[11px] font-semibold tracking-wider text-[#5C5F6D] uppercase">
        Features
      </div>

      <div className="space-y-1">
        <button
          type="button"
          onClick={() => {}}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-[#8A8D9A] hover:text-white hover:bg-white/[0.03] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-[#8A8D9A]" />
            <span>ICP Matrix</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {}}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-[#8A8D9A] hover:text-white hover:bg-white/[0.03] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#8A8D9A]" />
            <span>Verification</span>
          </div>
        </button>

        <Link
          href="/past-demos"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-[#8A8D9A] hover:text-white hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-[#8A8D9A]" />
            <span>Meeting Notes</span>
          </div>
        </Link>
      </div>

      {/* Bottom Elevated Upgrade / Status Card matching Fintrixity */}
      <div className="mt-auto p-4 rounded-2xl bg-[#121316] border border-white/[0.05] shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white">Demo Mode</span>
            <span className="text-sm">⚡</span>
          </div>
          <span
            className={`w-2 h-2 rounded-full ${
              demoMode ? "bg-[#FF5E2A] animate-ping" : "bg-emerald-400"
            }`}
          />
        </div>
        <p className="text-[11px] text-[#8A8D9A] leading-relaxed">
          Autonomous public web extraction ready.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onToggleDemoMode}
            className="flex-1 btn-vibrant-orange text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md"
          >
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
            <span>{demoMode ? "Demo ON" : "Live Mode"}</span>
          </button>
          <a
            href="https://airtable.com/appINyraLeadGen"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#17181D] hover:bg-[#1C1D23] border border-white/[0.05] text-[#8A8D9A] hover:text-white transition-colors"
            title="Open Airtable System of Record"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
