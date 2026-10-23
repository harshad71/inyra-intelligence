"use client";

import React, { useState } from "react";
import { Download, ExternalLink, RefreshCw, ShieldCheck, Clock, Award, Users, Check, Sparkles, Database } from "lucide-react";
import { JobStatusResponse } from "@/types";
import { useToast } from "@/components/ui/Toast";

interface ResultsHeaderProps {
  job: JobStatusResponse;
  onNewSearch: () => void;
}

export function ResultsHeader({ job, onNewSearch }: ResultsHeaderProps) {
  const { success } = useToast();
  const [downloading, setDownloading] = useState(false);

  const leads = job.leads || [];
  const leadCount = leads.length;

  const avgFitScore =
    leadCount > 0
      ? Math.round(leads.reduce((acc, l) => acc + l.fit_score, 0) / leadCount)
      : 0;

  let durationStr = "3m 14s";
  if (job.started_at && job.finished_at) {
    const diffSec = Math.max(
      15,
      Math.floor(
        (new Date(job.finished_at).getTime() - new Date(job.started_at).getTime()) / 1000
      )
    );
    const m = Math.floor(diffSec / 60);
    const s = diffSec % 60;
    durationStr = m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    setDownloading(true);

    const headers = [
      "Company",
      "Domain",
      "Location",
      "Industry",
      "Segment",
      "Fit Score",
      "Buyer Role",
      "Secondary Role",
      "Why It Fits",
      "Evidence URLs",
      "Outreach Angle",
      "Verified",
    ];

    const rows = leads.map((l) => [
      `"${(l.company || "").replace(/"/g, '""')}"`,
      `"${(l.domain || "").replace(/"/g, '""')}"`,
      `"${(l.location || "").replace(/"/g, '""')}"`,
      `"${(l.industry || "").replace(/"/g, '""')}"`,
      `"${(l.segment || "").replace(/"/g, '""')}"`,
      l.fit_score,
      `"${(l.buyer_role || "").replace(/"/g, '""')}"`,
      `"${(l.secondary_role || "").replace(/"/g, '""')}"`,
      `"${(l.fit_reasons?.map((r) => `${r.reason} (${r.quote || ""})`).join("; ") || "").replace(/"/g, '""')}"`,
      `"${(l.source_urls?.join(", ") || "").replace(/"/g, '""')}"`,
      `"${(l.outreach_angle || "").replace(/"/g, '""')}"`,
      l.verified ? "Yes" : "No",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `iNyra_Leads_${job.profile?.company_name?.replace(/\s+/g, "_") || "Export"}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
      success("Export Complete", `Exported ${leads.length} verified accounts to CSV.`);
    }, 600);
  };

  return (
    <div className="w-full space-y-4">
      {/* Title & Top Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 truncate">
            <span className="truncate">{job.profile?.company_name || "Enterprise Prospecting Report"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8D9A] mt-0.5 line-clamp-1">
            {job.profile?.offer || "Targeted Account Mining & Buyer Role Mapping"}
          </p>
        </div>

        {/* Action Controls with min 44px touch targets */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={downloading}
            className="flex-1 sm:flex-initial min-h-[44px] flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#121316] hover:bg-[#17181D] text-white border border-white/[0.08] hover:border-white/[0.16] shadow-sm active:scale-[0.98] transition-all whitespace-nowrap"
            title="Download formatted CSV spreadsheet"
          >
            {downloading ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Download className="w-4 h-4 text-[#FF5E2A]" />
            )}
            <span>{downloading ? "Exporting..." : "Export CSV"}</span>
          </button>

          {/* New Search */}
          <button
            type="button"
            onClick={onNewSearch}
            className="flex-1 sm:flex-initial min-h-[44px] flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#121316] hover:bg-[#17181D] text-white border border-white/[0.08] hover:border-white/[0.16] shadow-sm active:scale-[0.98] transition-all whitespace-nowrap"
            title="Start new lead search"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FF5E2A]" />
            <span>New search</span>
          </button>
        </div>
      </div>

      {/* Executive Market Intelligence Summary Card */}
      {job.summary && (
        <div className="p-3.5 sm:p-4 rounded-2xl card-fintrixity space-y-1.5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Award className="w-4 h-4 text-[#FF5E2A]" />
            <span>Executive Synthesis</span>
          </div>
          <p className="text-xs text-[#8A8D9A] leading-relaxed">
            {job.summary}
          </p>
        </div>
      )}

      {/* Metrics Strip: Compact 4-Card 2x2 Grid on Mobile, 4-Col Grid on Desktop (Non-scrollable) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {/* Card 1: Verified Accounts & Leads */}
        <div className="p-2.5 sm:p-3.5 rounded-2xl card-fintrixity flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] text-[#8A8D9A] block truncate">Verified Accounts</span>
            <span className="text-sm sm:text-base font-bold font-mono text-white block truncate">
              {leadCount}
            </span>
          </div>
        </div>

        {/* Card 2: Average Fit Score */}
        <div className="p-2.5 sm:p-3.5 rounded-2xl card-fintrixity flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FF5E2A]/10 border border-[#FF5E2A]/25 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,94,42,0.25)]">
            <Sparkles className="w-4 h-4 text-[#FF5E2A]" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] text-[#8A8D9A] block truncate">Average Fit Score</span>
            <span className="text-sm sm:text-base font-bold font-mono text-[#FF5E2A] block truncate">
              {avgFitScore}/100
            </span>
          </div>
        </div>

        {/* Card 3: Pipeline Latency */}
        <div className="p-2.5 sm:p-3.5 rounded-2xl card-fintrixity flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#17181D] border border-white/[0.04] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-[#8A8D9A]" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] text-[#8A8D9A] block truncate">Pipeline Latency</span>
            <span className="text-sm sm:text-base font-bold font-mono text-white block truncate">
              {durationStr}
            </span>
          </div>
        </div>

        {/* Card 4: Privacy Standard */}
        <div className="p-2.5 sm:p-3.5 rounded-2xl card-fintrixity flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] text-[#8A8D9A] block truncate">Privacy Standard</span>
            <span className="text-[11px] sm:text-xs font-semibold text-white block truncate">
              Public web only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
