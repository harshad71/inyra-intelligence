"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Search,
  ExternalLink,
  ShieldCheck,
  FileQuestion,
  Sparkles,
  ArrowUpDown,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lead } from "@/types";
import { getFaviconUrl } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  selectedLeadId?: string | null;
}

export function LeadsTable({
  leads,
  onSelectLead,
  selectedLeadId,
}: LeadsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "fit_score", desc: true },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minFit, setMinFit] = useState<number>(50);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  // Lock body scroll when mobile filter bottom sheet is open
  useEffect(() => {
    if (showMobileFilters) {
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
  }, [showMobileFilters]);

  // Unique locations and industries for filter dropdowns
  const locations = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.location) set.add(l.location);
    });
    return Array.from(set).sort();
  }, [leads]);

  const industries = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.industry) set.add(l.industry);
    });
    return Array.from(set).sort();
  }, [leads]);

  // Filtered dataset according to Previous IA specification
  const filteredData = useMemo(() => {
    return leads.filter((lead) => {
      // Min Fit filter
      if (lead.fit_score < minFit) return false;

      // Location filter
      if (selectedLocation !== "all" && lead.location !== selectedLocation) {
        return false;
      }

      // Industry filter
      if (selectedIndustry !== "all" && lead.industry !== selectedIndustry) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const comp = lead.company?.toLowerCase() || "";
        const dom = lead.domain?.toLowerCase() || "";
        const ind = lead.industry?.toLowerCase() || "";
        const loc = lead.location?.toLowerCase() || "";
        const role = lead.buyer_role?.toLowerCase() || "";
        const angle = lead.outreach_angle?.toLowerCase() || "";
        const reasons = (lead.fit_reasons || [])
          .map((r) => `${r.reason} ${r.quote || ""}`)
          .join(" ")
          .toLowerCase();

        return (
          comp.includes(q) ||
          dom.includes(q) ||
          ind.includes(q) ||
          loc.includes(q) ||
          role.includes(q) ||
          angle.includes(q) ||
          reasons.includes(q)
        );
      }

      return true;
    });
  }, [leads, minFit, selectedLocation, selectedIndustry, searchQuery]);

  const toggleSelectAll = (checked: boolean) => {
    const updated: Record<string, boolean> = {};
    if (checked) {
      filteredData.forEach((l) => {
        updated[l.lead_id] = true;
      });
    }
    setSelectedRows(updated);
  };

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            className="w-4 h-4 rounded bg-[#17181D] border-white/[0.1] text-[#FF4500] focus:ring-0 cursor-pointer accent-[#FF4500]"
            onChange={(e) => toggleSelectAll(e.target.checked)}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={Boolean(selectedRows[row.original.lead_id])}
            onChange={() => {}}
            onClick={(e) => toggleRow(row.original.lead_id, e)}
            className="w-4 h-4 rounded bg-[#17181D] border-white/[0.1] text-[#FF4500] focus:ring-0 cursor-pointer accent-[#FF4500]"
          />
        ),
      },
      {
        accessorKey: "company",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>Company Account</span>
            <ArrowUpDown className="w-3 h-3 text-[#5C5F6D]" />
          </button>
        ),
        cell: ({ row }) => {
          const lead = row.original;
          const favicon = getFaviconUrl(lead.domain || lead.website);

          return (
            <div className="flex items-center gap-3 min-w-[220px]">
              {/* Rounded Squircle Container matching Fintrixity Activity row */}
              <div className="w-9 h-9 rounded-xl bg-[#17181D] border border-white/[0.06] p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                <Image
                  src={favicon}
                  alt={lead.company}
                  width={20}
                  height={20}
                  className="rounded object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                  unoptimized
                />
                <span className="text-xs font-bold text-white hidden first:inline font-mono">
                  {lead.company.slice(0, 1)}
                </span>
              </div>

              <div className="min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLead(lead);
                  }}
                  className="font-semibold text-sm text-white block truncate text-left hover:text-[#FF5E2A] hover:underline focus:outline-none transition-colors cursor-pointer"
                  title={`Open dossier for ${lead.company}`}
                >
                  {lead.company}
                </button>
                <span className="text-xs text-[#8A8D9A] block truncate mt-0.5">
                  {lead.domain || lead.website || lead.industry}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "location",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>Location</span>
            <ArrowUpDown className="w-3 h-3 text-[#5C5F6D]" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 text-xs text-[#EDEDEF] bg-[#17181D] px-2.5 py-1 rounded-xl border border-white/[0.04] whitespace-nowrap">
            <MapPin className="w-3 h-3 text-[#5C5F6D] shrink-0" />
            <span className="truncate max-w-[170px]">{row.original.location}</span>
          </span>
        ),
      },
      {
        accessorKey: "fit_score",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>Fit Score</span>
            <ArrowUpDown className="w-3 h-3 text-[#5C5F6D]" />
          </button>
        ),
        cell: ({ row }) => {
          const score = row.original.fit_score;
          const isHigh = score >= 80;
          const isMid = score >= 65 && score < 80;

          return (
            <div className="flex items-center whitespace-nowrap">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isHigh
                    ? "bg-[#FF5E2A]/10 text-[#FF5E2A] border-[#FF5E2A]/30 shadow-[0_0_12px_rgba(255,94,42,0.25)]"
                    : isMid
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                    : "bg-white/[0.04] text-[#8A8D9A] border-white/[0.06]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isHigh
                      ? "bg-[#FF5E2A]"
                      : isMid
                      ? "bg-amber-400"
                      : "bg-[#8A8D9A]"
                  }`}
                />
                <span>{score}</span>
              </span>
            </div>
          );
        },
      },
      {
        id: "why_it_fits",
        header: "Why it fits",
        cell: ({ row }) => {
          const lead = row.original;
          const primaryReason =
            lead.fit_reasons && lead.fit_reasons.length > 0
              ? lead.fit_reasons[0].reason
              : lead.outreach_angle || "Matches ICP parameter constraints";

          return (
            <div className="min-w-[260px] max-w-[340px]">
              <p className="text-xs text-[#EDEDEF] line-clamp-1 leading-snug">
                {primaryReason}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLead(lead);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF5E2A] hover:underline mt-0.5 group/link"
              >
                <span>Evidence Quote</span>
                <ExternalLink className="w-2.5 h-2.5 group-hover/link:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: "buyer_role",
        header: "Target Role",
        cell: ({ row }) => (
          <span className="text-xs text-white font-medium block truncate max-w-[180px] bg-[#17181D] px-2.5 py-1 rounded-xl border border-white/[0.04]">
            {row.original.buyer_role}
          </span>
        ),
      },
    ],
    [selectedRows, onSelectLead]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="card-fintrixity p-3.5 sm:p-6 select-none shadow-xl space-y-4 sm:space-y-5">
      {/* Search & Filter Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Search query input with 16px font on mobile to prevent iOS auto-zoom */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C5F6D] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, industry, buyer role..."
              className="w-full min-h-[44px] bg-[#17181D] text-white placeholder-[#5C5F6D] text-base md:text-xs rounded-xl pl-10 pr-3.5 py-2.5 border border-white/[0.05] focus:outline-none focus:border-[#FF5E2A] transition-colors"
            />
          </div>

          {/* Mobile Filter Toggle Button (< md) */}
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className={`md:hidden min-h-[44px] min-w-[44px] h-[44px] px-3.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0 shadow-sm ${
              showMobileFilters || minFit !== 50 || selectedLocation !== "all" || selectedIndustry !== "all"
                ? "bg-[#17181D] border-[#FF5E2A] text-[#FF5E2A]"
                : "bg-[#17181D] border-white/[0.08] text-[#8A8D9A] hover:text-white"
            }`}
            aria-label="Toggle filters"
            title="Filter accounts"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {(minFit !== 50 || selectedLocation !== "all" || selectedIndustry !== "all") && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E2A]" />
            )}
          </button>

          {/* Desktop Filter Controls Row (>= md): Min Fit Slider + Location Dropdown + Industry Dropdown */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Min Fit Slider */}
            <div className="flex items-center gap-2.5 bg-[#17181D] px-3 py-2 min-h-[44px] rounded-xl border border-white/[0.05]">
              <span className="text-xs text-[#8A8D9A] whitespace-nowrap">
                Min Fit:
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={minFit}
                onChange={(e) => setMinFit(Number(e.target.value))}
                className="w-16 sm:w-20 accent-[#FF5E2A] cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-white w-6 text-right">
                {minFit}
              </span>
            </div>

            {/* Location Filter Dropdown */}
            <div className="relative min-w-[130px]">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full min-h-[44px] appearance-none bg-[#17181D] text-xs text-[#EDEDEF] rounded-xl pl-3 pr-7 py-2.5 border border-white/[0.05] focus:outline-none focus:border-[#FF5E2A] cursor-pointer"
              >
                <option value="all">
                  All Locations {leads.length > 0 ? `(${leads.length})` : ""}
                </option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5C5F6D] pointer-events-none" />
            </div>

            {/* Industry Filter Dropdown */}
            <div className="relative min-w-[130px]">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full min-h-[44px] appearance-none bg-[#17181D] text-xs text-[#EDEDEF] rounded-xl pl-3 pr-7 py-2.5 border border-white/[0.05] focus:outline-none focus:border-[#FF5E2A] cursor-pointer"
              >
                <option value="all">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5C5F6D] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile Filter Bottom Pop-up Sheet (< md) with Smooth Spring Transition */}
        <AnimatePresence>
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex items-end md:hidden">
              {/* Dark Frosted Backdrop with minimal blur and subtle visibility (Requirement 3) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filter sheet"
              />

              {/* Bottom Sheet Drawer Panel */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320, mass: 0.8 }}
                drag="y"
                dragConstraints={{ top: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 100 || info.velocity.y > 400) {
                    setShowMobileFilters(false);
                  }
                }}
                className="relative w-full max-h-[85vh] bg-[#121316] border-t border-white/[0.1] rounded-t-[28px] z-10 flex flex-col focus:outline-none shadow-[0_-12px_45px_rgba(0,0,0,0.95)] pb-safe"
              >
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-3 shrink-0 cursor-grab active:cursor-grabbing" />

                {/* Filter Sheet Header */}
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between gap-3 bg-[#0E0F12]">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#FF5E2A]" />
                    <span className="font-bold text-sm text-white">Filter Accounts</span>
                    {(minFit !== 50 || selectedLocation !== "all" || selectedIndustry !== "all") && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E2A]" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {(minFit !== 50 || selectedLocation !== "all" || selectedIndustry !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setMinFit(50);
                          setSelectedLocation("all");
                          setSelectedIndustry("all");
                        }}
                        className="text-xs text-[#FF5E2A] hover:underline font-medium px-2 py-1"
                      >
                        Reset all
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowMobileFilters(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-[#8A8D9A] hover:text-white bg-[#17181D] border border-white/[0.05] active:scale-95 transition-all"
                      aria-label="Close filters"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filter Sheet Body */}
                <div className="p-5 space-y-4 overflow-y-auto">
                  {/* Min Fit Slider */}
                  <div className="p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.04] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#8A8D9A] font-medium">Minimum Fit Score:</span>
                      <span className="text-sm font-bold font-mono text-[#FF5E2A]">{minFit}/100</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={minFit}
                      onChange={(e) => setMinFit(Number(e.target.value))}
                      className="w-full accent-[#FF5E2A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#5C5F6D] font-mono">
                      <span>0 (All)</span>
                      <span>50 (Standard)</span>
                      <span>80+ (High Fit)</span>
                    </div>
                  </div>

                  {/* Location Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8A8D9A] font-medium block">Location</label>
                    <div className="relative">
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full min-h-[46px] appearance-none bg-[#17181D] text-xs text-white rounded-xl pl-3.5 pr-8 py-2.5 border border-white/[0.06] focus:outline-none focus:border-[#FF5E2A] cursor-pointer"
                      >
                        <option value="all">All Locations ({leads.length})</option>
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5F6D] pointer-events-none" />
                    </div>
                  </div>

                  {/* Industry Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8A8D9A] font-medium block">Industry</label>
                    <div className="relative">
                      <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full min-h-[46px] appearance-none bg-[#17181D] text-xs text-white rounded-xl pl-3.5 pr-8 py-2.5 border border-white/[0.06] focus:outline-none focus:border-[#FF5E2A] cursor-pointer"
                      >
                        <option value="all">All Industries</option>
                        {industries.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5F6D] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Filter Sheet Sticky Footer */}
                <div className="p-4 pb-6 border-t border-white/[0.06] bg-[#0E0F12]">
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full min-h-[44px] btn-vibrant-orange text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-hero-glow active:scale-[0.98] transition-transform text-white"
                  >
                    <span>Show {filteredData.length} Matching Accounts</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* MOBILE LEAD CARD LIST (< 768px): Structured High-Density Cards */}
      <div className="space-y-3 md:hidden">
        {filteredData.length > 0 ? (
          filteredData.map((lead) => {
            const favicon = getFaviconUrl(lead.domain || lead.website);
            const isSelected = selectedLeadId === lead.lead_id;
            const isHigh = lead.fit_score >= 80;
            const isMid = lead.fit_score >= 65 && lead.fit_score < 80;
            const primaryReason =
              lead.fit_reasons && lead.fit_reasons.length > 0
                ? lead.fit_reasons[0].reason
                : lead.outreach_angle || "Matches ICP parameter constraints";

            return (
              <div
                key={lead.lead_id}
                onClick={() => onSelectLead(lead)}
                className={`p-4 rounded-2xl bg-[#121316] border transition-all active:scale-[0.99] cursor-pointer shadow-md space-y-3 ${
                  isSelected
                    ? "border-[#FF5E2A]/60 shadow-[0_0_15px_rgba(255,94,42,0.15)]"
                    : "border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                {/* Header: Favicon + Company Name + Fit Score Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#17181D] border border-white/[0.08] p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                      <Image
                        src={favicon}
                        alt={lead.company}
                        width={22}
                        height={22}
                        className="rounded object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                        unoptimized
                      />
                      <span className="text-xs font-bold text-white hidden first:inline font-mono">
                        {lead.company.slice(0, 1)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate hover:text-[#FF5E2A] transition-colors">
                        {lead.company}
                      </h4>
                      <span className="text-xs text-[#8A8D9A] truncate block">
                        {lead.domain || lead.website}
                      </span>
                    </div>
                  </div>

                  {/* Fit Badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      isHigh
                        ? "bg-[#FF5E2A]/10 text-[#FF5E2A] border-[#FF5E2A]/30 shadow-[0_0_10px_rgba(255,94,42,0.25)]"
                        : isMid
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                        : "bg-white/[0.04] text-[#8A8D9A] border-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isHigh ? "bg-[#FF5E2A]" : isMid ? "bg-amber-400" : "bg-[#8A8D9A]"
                      }`}
                    />
                    <span>{lead.fit_score}</span>
                  </span>
                </div>

                {/* Subline: Location + Target Buyer Role Tag */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="inline-flex items-center gap-1 text-xs text-[#EDEDEF] bg-[#17181D] px-2.5 py-1 rounded-lg border border-white/[0.04]">
                    <MapPin className="w-3 h-3 text-[#5C5F6D] shrink-0" />
                    <span className="truncate max-w-[140px]">{lead.location}</span>
                  </span>
                  <span className="text-xs text-white font-medium bg-[#17181D] px-2.5 py-1 rounded-lg border border-white/[0.04] truncate max-w-[170px]">
                    {lead.buyer_role}
                  </span>
                </div>

                {/* Snippet: Why it Fits (Truncated to 2 lines) */}
                <div className="p-3 rounded-xl bg-[#0E0F12] border border-white/[0.04]">
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    &ldquo;{primaryReason}&rdquo;
                  </p>
                </div>

                {/* Action Footer: Source link + View Full Dossier */}
                <div className="flex items-center justify-between pt-1 gap-2 border-t border-white/[0.04]">
                  {lead.source_urls && lead.source_urls.length > 0 ? (
                    <a
                      href={lead.source_urls[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="min-h-[44px] flex items-center gap-1.5 text-xs text-[#8A8D9A] hover:text-white px-2 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#5C5F6D]" />
                      <span>Public Evidence</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-[#5C5F6D]">Verified Pipeline</span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLead(lead);
                    }}
                    className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-[#17181D] hover:bg-[#1E2026] text-[#FF5E2A] text-xs font-semibold border border-[#FF5E2A]/20 shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <span>View Full Dossier</span>
                    <span className="text-xs">&rarr;</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center space-y-2">
            <FileQuestion className="w-8 h-8 text-[#5C5F6D] mx-auto" />
            <p className="text-sm font-semibold text-white">No matching accounts found</p>
            <p className="text-xs text-[#8A8D9A]">Try adjusting your min fit slider or search filters.</p>
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (>= 768px): High-Density TanStack Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="text-xs text-[#8A8D9A] border-b border-white/[0.04]"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="pb-3.5 pt-1 px-3 font-medium select-none whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-white/[0.03]">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const isSelected = selectedLeadId === row.original.lead_id;
                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectLead(row.original)}
                    className={`group cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-white/[0.05]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-3.5 px-3 text-xs align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileQuestion className="w-8 h-8 text-[#5C5F6D]" />
                    <p className="text-sm font-semibold text-white">
                      No matching accounts found
                    </p>
                    <p className="text-xs text-[#8A8D9A]">
                      Try adjusting your min fit slider or search filters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
