"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Mail,
  Bell,
  Share2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface HeaderNavProps {
  onNewSearch?: () => void;
  title?: string;
  breadcrumbs?: string[];
}

export function HeaderNav({
  onNewSearch,
  title = "Dashboard",
  breadcrumbs = ["iNyra", "Lead Generation", "Demo Session"],
}: HeaderNavProps) {
  return (
    <header className="w-full flex items-center justify-between py-4 px-2 select-none">
      {/* Left: History controls & Breadcrumb trail */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="w-8 h-8 rounded-xl bg-[#121316] hover:bg-[#17181D] border border-white/[0.04] text-[#8A8D9A] hover:text-white flex items-center justify-center transition-colors"
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-xl bg-[#121316] hover:bg-[#17181D] border border-white/[0.04] text-[#8A8D9A] hover:text-white flex items-center justify-center transition-colors opacity-50 cursor-not-allowed"
            title="Forward"
            disabled
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Breadcrumb text */}
        <div className="flex items-center gap-2 text-xs text-[#8A8D9A] ml-2">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? "text-white font-medium"
                    : "hover:text-[#EDEDEF] transition-colors"
                }
              >
                {crumb}
              </span>
              {idx < breadcrumbs.length - 1 && (
                <span className="text-[#5C5F6D] text-[10px]">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right: Utility Tray & Primary Gradient Action */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="w-8 h-8 rounded-xl bg-[#121316] hover:bg-[#17181D] border border-white/[0.04] text-[#8A8D9A] hover:text-white flex items-center justify-center transition-colors"
          title="Help & Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          type="button"
          className="w-8 h-8 rounded-xl bg-[#121316] hover:bg-[#17181D] border border-white/[0.04] text-[#8A8D9A] hover:text-white flex items-center justify-center transition-colors"
          title="Activity Log"
        >
          <Mail className="w-4 h-4" />
        </button>

        <button
          type="button"
          className="w-8 h-8 rounded-xl bg-[#121316] hover:bg-[#17181D] border border-white/[0.04] text-[#8A8D9A] hover:text-white flex items-center justify-center transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF5E2A] rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF5E2A] to-[#FF4500] p-0.5 flex items-center justify-center cursor-pointer shadow-md">
          <div className="w-full h-full rounded-[10px] bg-[#121316] flex items-center justify-center text-xs font-bold text-white font-mono">
            HS
          </div>
        </div>

        {/* Primary Glowing Action Button */}
        {onNewSearch ? (
          <button
            type="button"
            onClick={onNewSearch}
            className="btn-vibrant-orange text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-hero-glow"
          >
            <span>New Run</span>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            href="/"
            className="btn-vibrant-orange text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-hero-glow"
          >
            <span>Share</span>
            <Share2 className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </header>
  );
}
