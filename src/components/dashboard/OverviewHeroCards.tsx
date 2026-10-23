"use client";

import React from "react";
import {
  Wallet,
  TrendingUp,
  BarChart3,
  MoreHorizontal,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users2,
  Globe,
  Search,
  CheckCircle2,
  Activity,
  Layers,
} from "lucide-react";
import { JobStatusResponse } from "@/types";

interface OverviewHeroCardsProps {
  job?: JobStatusResponse | null;
  screen?: "intake" | "processing" | "results";
  onExportCSV?: () => void;
  onViewSummary?: () => void;
}

export function OverviewHeroCards({
  job,
  screen = "results",
  onExportCSV,
  onViewSummary,
}: OverviewHeroCardsProps) {
  const leads = job?.leads || [];
  const leadCount = leads.length || 24;
  const avgFitScore =
    leads.length > 0
      ? Math.round(leads.reduce((acc, l) => acc + l.fit_score, 0) / leads.length)
      : 84;
  const verifiedDomains = job?.counts?.verified || 54;

  if (screen === "processing") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Understanding Business & KB (Hero Orange Card) */}
        <div className="card-hero-orange p-6 flex flex-col justify-between text-white relative overflow-hidden group select-none min-h-[190px]">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-md">
                <Layers className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight text-white">
                  Understanding Business & KB
                </h3>
                <p className="text-xs text-white/80 leading-snug mt-0.5">
                  Live Extraction Counter
                </p>
              </div>
            </div>

            <button
              type="button"
              className="text-white/70 hover:text-white p-1 transition-colors"
              aria-label="Options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
                9/9 Vectors
              </span>
              <span className="text-[11px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                Active
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/90">
            <span>Knowledge base normalized</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Market Research & Verification (Neutral Card) */}
        <div className="card-fintrixity p-6 flex flex-col justify-between select-none min-h-[190px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight text-white">
                  Market Research & Verification
                </h3>
                <p className="text-xs text-[#8A8D9A] leading-snug mt-0.5">
                  Domains Scanned vs. Alive
                </p>
              </div>
            </div>

            <button
              type="button"
              className="text-[#5C5F6D] hover:text-white p-1 transition-colors"
              aria-label="Options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
                {job?.counts?.verified || 38} / {job?.counts?.candidates || 72}
              </span>
              <span className="text-[11px] font-semibold text-[#FF5E2A] bg-[#FF5E2A]/10 border border-[#FF5E2A]/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                Scanning
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A8D9A]">
            <span>Live 2xx HTTP crawl verified</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Lead Qualification & Scoring (Neutral Card) */}
        <div className="card-fintrixity p-6 flex flex-col justify-between select-none min-h-[190px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-md">
                <Activity className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight text-white">
                  Lead Qualification & Scoring
                </h3>
                <p className="text-xs text-[#8A8D9A] leading-snug mt-0.5">
                  Leads Qualified So Far
                </p>
              </div>
            </div>

            <button
              type="button"
              className="text-[#5C5F6D] hover:text-white p-1 transition-colors"
              aria-label="Options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
                {job?.counts?.qualified || 16} Leads
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                Qualified
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A8D9A]">
            <span>Ranking fit & buying roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  }

  // Default: Results or Intake screen
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Vibrant Radiant Orange Hero Card matching Fintrixity */}
      <div className="card-hero-orange p-6 flex flex-col justify-between text-white relative overflow-hidden group select-none min-h-[190px]">
        {/* Subtle radial inner glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight text-white">
                Total Qualified Leads
              </h3>
              <p className="text-xs text-white/80 leading-snug mt-0.5">
                {job?.profile?.company_name || "Enterprise Prospecting"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="text-white/70 hover:text-white p-1 transition-colors"
            aria-label="Options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
              {leadCount} Leads
            </span>
            <span className="text-[11px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ 15%
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onExportCSV}
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white group-hover:translate-x-0.5 transition-all w-fit"
        >
          <span>Export CSV spreadsheet</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card 2: Savings / Average Fit Score Neutral Card */}
      <div className="card-fintrixity p-6 flex flex-col justify-between select-none min-h-[190px]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight text-white">
                Average Fit Score
              </h3>
              <p className="text-xs text-[#8A8D9A] leading-snug mt-0.5">
                Hypothesis & Intent Match
              </p>
            </div>
          </div>

          <button
            type="button"
            className="text-[#5C5F6D] hover:text-white p-1 transition-colors"
            aria-label="Options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
              {avgFitScore}/100
            </span>
            <span className="text-[11px] font-semibold text-[#FF5E2A] bg-[#FF5E2A]/10 border border-[#FF5E2A]/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ 8.4%
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewSummary}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A8D9A] hover:text-white transition-colors w-fit"
        >
          <span>View summary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card 3: Investment Portfolio / Verified Web Sources Neutral Card */}
      <div className="card-fintrixity p-6 flex flex-col justify-between select-none min-h-[190px]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-md">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight text-white">
                Verified Web Sources
              </h3>
              <p className="text-xs text-[#8A8D9A] leading-snug mt-0.5">
                Crawl Signals & Live Domains
              </p>
            </div>
          </div>

          <button
            type="button"
            className="text-[#5C5F6D] hover:text-white p-1 transition-colors"
            aria-label="Options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
              {verifiedDomains} Domains
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ 5.7%
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewSummary}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A8D9A] hover:text-white transition-colors w-fit"
        >
          <span>Analyze performance</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
