"use client";

import React from "react";
import { Plus, MoreVertical, Globe, Building2, Target, ShieldAlert, Sparkles, MapPin } from "lucide-react";
import { IntakeProfile } from "@/types";

interface ProfileWalletCardProps {
  profile?: IntakeProfile | null;
  onEdit?: () => void;
  onStartNew?: () => void;
}

export function ProfileWalletCard({
  profile,
  onEdit,
  onStartNew,
}: ProfileWalletCardProps) {
  const company = profile?.company_name || "Apex Diagnostics & Wellness";
  const offer = profile?.offer || "Corporate Health Checks & Executive Wellness Screening";
  const targetMarket = profile?.target_market || "IT Tech Parks & Manufacturing OEMs (>200 staff)";
  const geography = profile?.geography || "Pune & Maharashtra, India";

  const tiles = [
    {
      label: "Client Target",
      flag: "🇮🇳",
      code: "COMPANY",
      value: company,
      sub: "B2B Enterprise Account",
      status: "Active",
    },
    {
      label: "Core Offer",
      flag: "⚡",
      code: "SOLUTION",
      value: offer.slice(0, 24) + "...",
      sub: "Primary Value Proposition",
      status: "Active",
    },
    {
      label: "Target Market",
      flag: "🎯",
      code: "ICP SECTOR",
      value: targetMarket.slice(0, 22) + "...",
      sub: "Qualified Buyer Industries",
      status: "Active",
    },
    {
      label: "Geography Scope",
      flag: "📍",
      code: "REGION",
      value: geography,
      sub: "Industrial Corridor",
      status: "Active",
    },
  ];

  return (
    <div className="card-fintrixity p-6 flex flex-col justify-between h-full min-h-[340px] select-none">
      {/* Top Header matching My Wallet */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-white">Target ICP Profile</h3>
          <p className="text-xs text-[#8A8D9A] mt-0.5">
            Hypothesis: Enterprise Accounts in Maharashtra
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit || onStartNew}
          className="btn-vibrant-orange text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Target</span>
        </button>
      </div>

      {/* 2x2 Modular Tiles matching Fintrixity Currency Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
        {tiles.map((tile, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.04] flex flex-col justify-between hover:border-white/[0.08] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base select-none">{tile.flag}</span>
                <span className="text-xs font-bold text-white tracking-wide">
                  {tile.code}
                </span>
              </div>
              <button
                type="button"
                className="text-[#5C5F6D] group-hover:text-[#8A8D9A] p-0.5 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="my-2">
              <span className="font-semibold text-sm text-white block truncate">
                {tile.value}
              </span>
              <span className="text-[11px] text-[#8A8D9A] block truncate mt-0.5">
                {tile.sub}
              </span>
            </div>

            <div>
              <span className="badge-active text-[10px] font-mono font-bold px-2 py-0.5 rounded-md inline-block">
                {tile.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
