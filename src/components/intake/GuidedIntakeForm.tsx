"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Globe,
  Building2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { IntakeRequest } from "@/types";

interface GuidedIntakeFormProps {
  onSubmit: (data: IntakeRequest) => Promise<void>;
  isLoading: boolean;
  onLoadSample?: (sampleNumber: 1 | 2) => void;
}

export function GuidedIntakeForm({
  onSubmit,
  isLoading,
  onLoadSample,
}: GuidedIntakeFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [text, setText] = useState("");
  const [product, setProduct] = useState("");
  const [geography, setGeography] = useState("India");
  const [leadCount, setLeadCount] = useState(25);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<1 | 2 | null>(null);

  // Keyboard shortcut listener for ⌘+Enter to run intake
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        const form = document.getElementById("guided-intake-form") as HTMLFormElement;
        if (form) form.requestSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectPreset = (sampleNum: 1 | 2) => {
    setActivePreset(sampleNum);
    setValidationError(null);

    if (sampleNum === 1) {
      setCompanyName("Apex Diagnostics & Wellness");
      setWebsite("https://apexdiagnostics.in");
      setText(
        "We provide corporate annual health checkups, executive wellness screening, and on-site mobile medical camps for IT parks and factories in Maharashtra."
      );
      setProduct("Corporate Health Packages");
      setGeography("Pune & Maharashtra, India");
      setLeadCount(24);
    } else {
      setCompanyName("JalShakti Water Technologies");
      setWebsite("https://jalshaktiwater.com");
      setText(
        "We make turnkey industrial RO water plants for dairies and beverage bottling facilities in Maharashtra."
      );
      setProduct("Turnkey 50 KLD RO Plant");
      setGeography("Maharashtra, India");
      setLeadCount(22);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedText = text.trim();
    const trimmedUrl = website.trim();

    if (!trimmedText && !trimmedUrl) {
      setValidationError("Please enter what the company sells, or provide a website URL.");
      return;
    }

    if (trimmedUrl && !/^https?:\/\//i.test(trimmedUrl) && !trimmedUrl.includes(".")) {
      setValidationError("Please enter a valid website URL (e.g. https://company.com).");
      return;
    }

    let normalizedUrl = trimmedUrl;
    if (normalizedUrl && !/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    await onSubmit({
      text:
        trimmedText ||
        (companyName ? `${companyName} corporate commercial offerings` : undefined),
      url: normalizedUrl || undefined,
      product: product.trim() || undefined,
      geography: geography.trim() || "India",
      lead_count: leadCount,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Main Centered Intake Card */}
      <div className="card-fintrixity p-4 sm:p-7 md:p-8 space-y-5 sm:space-y-6 shadow-2xl">
        {/* Card Header with enhanced typography and contrast */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-[28px] font-bold tracking-tight text-white leading-tight">
            Who are we finding customers for?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
            Enter what the company sells or paste their website URL. Our engine scrapes public data, resolves company domains, and constructs an ICP hypothesis.
          </p>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        <form
          id="guided-intake-form"
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5"
        >
          {/* Row 1: Company Name & Website URL (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                Company Name <span className="text-zinc-400 font-normal text-[11px]">(optional)</span>
              </label>
              <div className="relative group">
                <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#FF5E2A] transition-colors pointer-events-none" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (activePreset) setActivePreset(null);
                  }}
                  placeholder="e.g. Apex Diagnostics"
                  disabled={isLoading}
                  className="w-full min-h-[44px] bg-[#17181D] hover:bg-[#1A1B22] focus:bg-[#1A1B22] text-white placeholder-zinc-500 text-base md:text-sm rounded-xl pl-10 pr-3.5 py-2.5 border border-white/[0.08] hover:border-white/[0.16] focus:border-[#FF5E2A] focus:ring-1 focus:ring-[#FF5E2A]/30 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Website URL <span className="text-zinc-400 font-normal text-[11px]">(optional)</span>
                </label>
                {website && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Scrape Ready
                  </span>
                )}
              </div>
              <div className="relative group">
                <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#FF5E2A] transition-colors pointer-events-none" />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    if (activePreset) setActivePreset(null);
                  }}
                  placeholder="e.g. apexdiagnostics.in"
                  disabled={isLoading}
                  className="w-full min-h-[44px] bg-[#17181D] hover:bg-[#1A1B22] focus:bg-[#1A1B22] text-white placeholder-zinc-500 text-base md:text-sm rounded-xl pl-10 pr-8 py-2.5 border border-white/[0.08] hover:border-white/[0.16] focus:border-[#FF5E2A] focus:ring-1 focus:ring-[#FF5E2A]/30 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: What do they sell / who do they target? (Textarea) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                <span>What do they sell / who do they target?</span>
                <span className="text-[10px] font-bold text-[#FF5E2A] bg-[#FF5E2A]/10 border border-[#FF5E2A]/25 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Required
                </span>
              </label>
              <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-400">
                ⌘+Enter to run
              </kbd>
            </div>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (activePreset) setActivePreset(null);
              }}
              placeholder="e.g. We provide turnkey industrial RO water plants for dairy processing facilities and beverage bottlers in Maharashtra..."
              disabled={isLoading}
              className="w-full bg-[#17181D] hover:bg-[#1A1B22] focus:bg-[#1A1B22] text-white placeholder-zinc-500 text-base md:text-sm rounded-xl p-3.5 border border-white/[0.08] hover:border-white/[0.16] focus:border-[#FF5E2A] focus:ring-1 focus:ring-[#FF5E2A]/30 resize-none leading-relaxed transition-all outline-none min-h-[100px]"
            />
          </div>

          {/* Row 3: Target Geography & Specific Product Focus (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                Target Geography <span className="text-zinc-400 font-normal text-[11px]">(default: India)</span>
              </label>
              <div className="relative group">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#FF5E2A] transition-colors pointer-events-none" />
                <input
                  type="text"
                  value={geography}
                  onChange={(e) => {
                    setGeography(e.target.value);
                    if (activePreset) setActivePreset(null);
                  }}
                  placeholder="India (default)"
                  disabled={isLoading}
                  className="w-full min-h-[44px] bg-[#17181D] hover:bg-[#1A1B22] focus:bg-[#1A1B22] text-white placeholder-zinc-500 text-base md:text-sm rounded-xl pl-10 pr-3.5 py-2.5 border border-white/[0.08] hover:border-white/[0.16] focus:border-[#FF5E2A] focus:ring-1 focus:ring-[#FF5E2A]/30 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                Specific Product Focus <span className="text-zinc-400 font-normal text-[11px]">(optional)</span>
              </label>
              <input
                type="text"
                value={product}
                onChange={(e) => {
                  setProduct(e.target.value);
                  if (activePreset) setActivePreset(null);
                }}
                placeholder="e.g. 50 KLD RO Plant, Corporate Wellness"
                disabled={isLoading}
                className="w-full min-h-[44px] bg-[#17181D] hover:bg-[#1A1B22] focus:bg-[#1A1B22] text-white placeholder-zinc-500 text-base md:text-sm rounded-xl px-3.5 py-2.5 border border-white/[0.08] hover:border-white/[0.16] focus:border-[#FF5E2A] focus:ring-1 focus:ring-[#FF5E2A]/30 transition-all outline-none"
              />
            </div>
          </div>

          {/* Advanced Pipeline Parameters Collapsible */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors min-h-[36px]"
            >
              {showAdvanced ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              <span>Advanced Pipeline Parameters</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 rounded-xl bg-[#17181D] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
                <div>
                  <span className="text-xs text-white font-semibold block">
                    Target Verified Accounts
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Number of qualified prospects to retrieve
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#FF5E2A] bg-[#FF5E2A]/10 border border-[#FF5E2A]/25 px-2.5 py-1 rounded-md min-w-[70px] text-center">
                    {leadCount} Leads
                  </span>
                  <input
                    type="range"
                    min="15"
                    max="40"
                    step="5"
                    value={leadCount}
                    onChange={(e) => setLeadCount(Number(e.target.value))}
                    className="w-24 accent-[#FF4500] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA Button (Sticky on Mobile, Standard on Desktop) */}
          <div className="sticky bottom-3 sm:static z-20 bg-gradient-to-t from-[#121316] via-[#121316]/95 to-transparent pt-3 pb-1 sm:p-0 sm:bg-none">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] btn-vibrant-orange py-3.5 px-5 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-hero-glow disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Prospecting Hypothesis...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-white" />
                  <span>Find leads</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Demo Presets Section: Vertical Stack on Mobile, Inline on Desktop */}
      <div className="pt-2 px-0.5 space-y-2 select-none">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5E2A]" />
          <span>Demo Presets (Instant Replay):</span>
        </div>

        {/* MOBILE VIEW: Non-scrollable vertical stacked cards (< 640px) */}
        <div className="flex flex-col gap-2 sm:hidden w-full">
          <button
            type="button"
            onClick={() => handleSelectPreset(1)}
            className={`w-full min-h-[50px] p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all active:scale-[0.98] ${
              activePreset === 1
                ? "bg-[#FF5E2A]/15 border-[#FF5E2A]/60 shadow-[0_0_14px_rgba(255,94,42,0.2)]"
                : "bg-[#121316] hover:bg-[#17181D] border-white/[0.06] hover:border-white/[0.12]"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  activePreset === 1 ? "bg-[#FF5E2A] animate-pulse" : "bg-emerald-400"
                }`}
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  Sample 1: Pune Diagnostics
                </span>
                <span className="text-[11px] text-[#8A8D9A] block truncate">
                  Corporate executive wellness & on-site camps
                </span>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                activePreset === 1
                  ? "bg-[#FF5E2A]/20 text-[#FF5E2A] border border-[#FF5E2A]/30"
                  : "bg-[#17181D] text-[#8A8D9A] border border-white/[0.04]"
              }`}
            >
              {activePreset === 1 ? "Active" : "Load"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPreset(2)}
            className={`w-full min-h-[50px] p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all active:scale-[0.98] ${
              activePreset === 2
                ? "bg-[#FF5E2A]/15 border-[#FF5E2A]/60 shadow-[0_0_14px_rgba(255,94,42,0.2)]"
                : "bg-[#121316] hover:bg-[#17181D] border-white/[0.06] hover:border-white/[0.12]"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  activePreset === 2 ? "bg-[#FF5E2A] animate-pulse" : "bg-emerald-400"
                }`}
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  Sample 2: Industrial RO Plants
                </span>
                <span className="text-[11px] text-[#8A8D9A] block truncate">
                  Turnkey water plants for dairy & beverages
                </span>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                activePreset === 2
                  ? "bg-[#FF5E2A]/20 text-[#FF5E2A] border border-[#FF5E2A]/30"
                  : "bg-[#17181D] text-[#8A8D9A] border border-white/[0.04]"
              }`}
            >
              {activePreset === 2 ? "Active" : "Load"}
            </span>
          </button>
        </div>

        {/* DESKTOP VIEW: Sleek horizontal pills (>= 640px) */}
        <div className="hidden sm:flex items-center justify-end">
          <div className="flex items-center p-1 rounded-2xl bg-[#121316] border border-white/[0.08] shadow-lg gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectPreset(1)}
              className={`min-h-[38px] flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 active:scale-95 ${
                activePreset === 1
                  ? "bg-[#FF5E2A]/15 border border-[#FF5E2A]/70 text-white shadow-[0_0_12px_rgba(255,94,42,0.25)] font-semibold"
                  : "text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activePreset === 1 ? "bg-[#FF5E2A] animate-pulse" : "bg-emerald-400"
                }`}
              />
              <span>Sample 1: Pune Diagnostics</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset(2)}
              className={`min-h-[38px] flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 active:scale-95 ${
                activePreset === 2
                  ? "bg-[#FF5E2A]/15 border border-[#FF5E2A]/70 text-white shadow-[0_0_12px_rgba(255,94,42,0.25)] font-semibold"
                  : "text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activePreset === 2 ? "bg-[#FF5E2A] animate-pulse" : "bg-emerald-400"
                }`}
              />
              <span>Sample 2: Industrial RO Plants</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
