"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Target,
  Sparkles,
  Globe,
  MapPin,
  Quote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lead } from "@/types";
import { getFaviconUrl } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface LeadDrawerProps {
  lead: Lead | null;
  onClose: () => void;
}

export function LeadDrawer({ lead, onClose }: LeadDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(lead);
  const [isMobile, setIsMobile] = useState(false);
  const { success } = useToast();

  // Detect mobile viewport (< 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync activeLead when lead changes
  useEffect(() => {
    if (lead) {
      setActiveLead(lead);
      setImgError(false);
    }
  }, [lead]);

  // Lock canvas and background scroll when open
  useEffect(() => {
    if (lead) {
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
  }, [lead]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lead) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lead, onClose]);

  const current = lead || activeLead;
  if (!current) return null;

  const handleCopyAngle = () => {
    navigator.clipboard.writeText(current.outreach_angle);
    setCopied(true);
    success("Outreach Hook Copied", `Copied tailored hook for ${current.company}.`);
    setTimeout(() => setCopied(false), 2400);
  };

  const favicon = getFaviconUrl(current.domain || current.website);

  // Common inner content renderer for both Mobile Sheet and Desktop Drawer
  const renderDrawerBody = () => (
    <>
      {/* Top Quick Status Metric Tiles */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        <div className="p-2.5 sm:p-3 rounded-2xl bg-[#17181D] border border-white/[0.04]">
          <span className="text-[9px] sm:text-[10px] text-[#8A8D9A] block uppercase font-mono tracking-wider truncate">
            Est. Deal
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5 block truncate">
            ${(current.fit_score * 310).toLocaleString()}
          </span>
        </div>

        <div className="p-2.5 sm:p-3 rounded-2xl bg-[#17181D] border border-white/[0.04]">
          <span className="text-[9px] sm:text-[10px] text-[#8A8D9A] block uppercase font-mono tracking-wider truncate">
            Status
          </span>
          <span className="mt-0.5 block">
            {current.fit_score >= 80 ? (
              <span className="badge-completed text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md inline-block">
                Done
              </span>
            ) : (
              <span className="badge-active text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md inline-block">
                Active
              </span>
            )}
          </span>
        </div>

        <div className="p-2.5 sm:p-3 rounded-2xl bg-[#17181D] border border-white/[0.04]">
          <span className="text-[9px] sm:text-[10px] text-[#8A8D9A] block uppercase font-mono tracking-wider truncate">
            Web Status
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-emerald-400 flex items-center gap-1 mt-0.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Live 2xx</span>
          </span>
        </div>
      </div>

      {/* Industry & Segment Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-white bg-[#17181D] px-3 py-1 rounded-xl border border-white/[0.05] font-medium">
          Industry: {current.industry}
        </span>
        <span className="text-[11px] text-[#8A8D9A] bg-[#17181D] px-3 py-1 rounded-xl border border-white/[0.05]">
          Segment: {current.segment}
        </span>
      </div>

      {/* Section 1: Tailored Outreach Angle & Hook (Highlighted Hero Container) */}
      <div className="rounded-2xl bg-[#17181D] border border-white/[0.08] p-4 space-y-3 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-white flex items-center gap-1.5 text-xs truncate">
            <Sparkles className="w-4 h-4 text-[#FF5E2A] shrink-0" />
            <span className="truncate">Tailored Outreach Angle & Hook</span>
          </span>

          {/* Fit Score Tag placed in Hook section in place of the old copy angle button */}
          <span
            className={`text-[10px] sm:text-[11px] font-mono font-bold px-2.5 py-1 rounded-full shrink-0 shadow-sm ${
              current.fit_score >= 80
                ? "badge-completed"
                : current.fit_score >= 65
                ? "badge-active"
                : "badge-pending"
            }`}
          >
            {current.fit_score}/100 Fit
          </span>
        </div>

        <div className="bg-[#121316] p-3.5 rounded-xl border border-white/[0.04]">
          <p className="text-xs text-[#EDEDEF] leading-relaxed">
            &ldquo;{current.outreach_angle}&rdquo;
          </p>
        </div>
      </div>

      {/* Section 2: Buyer Role Targets (Strictly Role Intelligence) */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white text-xs flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#FF5E2A]" />
          Buyer Role Intelligence (Target Role Only)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.04]">
            <span className="text-[11px] text-[#8A8D9A] block mb-1">
              Primary Decision Maker
            </span>
            <p className="font-semibold text-sm text-white">
              {current.buyer_role}
            </p>
          </div>

          {current.secondary_role && (
            <div className="p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.04]">
              <span className="text-[11px] text-[#8A8D9A] block mb-1">
                Secondary Influencer
              </span>
              <p className="font-semibold text-sm text-[#8A8D9A]">
                {current.secondary_role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Evidence & Qualification Dossier */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white text-xs flex items-center gap-1.5">
          <Quote className="w-4 h-4 text-[#FF5E2A]" />
          Why It Fits & Verified Excerpts
        </h3>

        <div className="space-y-2.5">
          {current.fit_reasons && current.fit_reasons.length > 0 ? (
            current.fit_reasons.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#17181D] border border-white/[0.04] space-y-2.5"
              >
                <p className="text-xs text-[#EDEDEF] leading-relaxed font-medium">
                  {item.reason}
                </p>

                {item.quote && (
                  <blockquote className="text-[11px] text-[#8A8D9A] italic border-l-2 border-[#FF5E2A] pl-3 py-1 bg-[#121316] rounded-r-xl">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                )}

                {item.evidence_url && (
                  <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                    <span className="text-[#8A8D9A]">Public Source:</span>
                    <a
                      href={item.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5E2A] hover:underline flex items-center gap-1 truncate max-w-[280px]"
                    >
                      <span className="truncate">{item.evidence_url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-[#17181D] border border-white/[0.04]">
              <p className="text-xs text-[#EDEDEF]">Qualified against ICP signals.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {Boolean(lead) && (
        isMobile ? (
          /* MOBILE VIEW: Bottom Pop-up Sheet (< 768px) with Smooth Spring Transition */
          <div className="fixed inset-0 z-50 flex items-end md:hidden">
            {/* Dark Frosted Backdrop with minimal blur and subtle visibility (Requirement 3) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
              onClick={onClose}
              aria-label="Close bottom sheet"
            />

            {/* Bottom Sheet Drawer */}
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
                  onClose();
                }
              }}
              className="relative w-full max-h-[88vh] bg-[#121316] border-t border-white/[0.1] rounded-t-[28px] z-10 flex flex-col focus:outline-none shadow-[0_-12px_45px_rgba(0,0,0,0.95)] pb-safe"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-3 shrink-0 cursor-grab active:cursor-grabbing" />

              {/* Mobile Sheet Header: Company info without fit tag (Requirement 5) */}
              <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between gap-3 bg-[#0E0F12]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#17181D] border border-white/[0.08] p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                    {!imgError ? (
                      <Image
                        src={favicon}
                        alt={current.company}
                        width={24}
                        height={24}
                        className="rounded object-contain"
                        onError={() => setImgError(true)}
                        unoptimized
                      />
                    ) : (
                      <span className="text-xs font-bold text-white font-mono">
                        {current.company.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-white truncate">
                      {current.company}
                    </h2>
                    <span className="text-xs text-[#8A8D9A] truncate block">
                      {current.location}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-[#8A8D9A] hover:text-white bg-[#17181D] border border-white/[0.05] active:scale-95 transition-all shrink-0"
                  aria-label="Close bottom sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs overscroll-contain">
                {renderDrawerBody()}
              </div>

              {/* Mobile Sheet Sticky Footer Actions: Open Website primary + Copy secondary (with generous bottom padding & margin) */}
              <div className="p-4 pt-3.5 pb-8 sm:pb-6 border-t border-white/[0.06] bg-[#0E0F12] pb-safe">
                <div className="flex items-center gap-2.5 w-full mb-1.5 sm:mb-0">
                  {/* Primary Button: Open Website */}
                  <a
                    href={current.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[44px] btn-vibrant-orange flex items-center justify-center gap-2 text-xs font-semibold rounded-xl shadow-hero-glow active:scale-[0.98] transition-all text-white"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Open Website</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  {/* Secondary Button: Copy with icon */}
                  <button
                    type="button"
                    onClick={handleCopyAngle}
                    className="min-h-[44px] px-4 flex items-center justify-center gap-2 text-xs font-medium text-white rounded-xl bg-[#17181D] hover:bg-[#202228] border border-white/[0.08] active:scale-[0.98] transition-all shrink-0 shadow-sm"
                    title="Copy outreach text"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#8A8D9A]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* DESKTOP VIEW: Slide-in Side Drawer (>= 768px) */
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop with minimal blur and subtle visibility (Requirement 3) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
              onClick={onClose}
              aria-label="Close dossier drawer"
            />

            {/* Desktop Side Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 350, mass: 0.8 }}
              className="relative w-full sm:max-w-lg md:max-w-xl h-full bg-[#121316] border-l border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-6 border-b border-white/[0.05] flex items-start justify-between gap-3 sm:gap-4 bg-[#0E0F12]">
                <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#17181D] border border-white/[0.06] p-1.5 sm:p-2 flex items-center justify-center shrink-0 shadow-md">
                    {!imgError ? (
                      <Image
                        src={favicon}
                        alt={current.company}
                        width={28}
                        height={28}
                        className="rounded object-contain"
                        onError={() => setImgError(true)}
                        unoptimized
                      />
                    ) : (
                      <span className="text-sm sm:text-base font-bold text-white font-mono">
                        {current.company.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-white truncate">
                      {current.company}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5 text-xs text-[#8A8D9A]">
                      <a
                        href={current.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white flex items-center gap-1 hover:underline truncate max-w-[160px] sm:max-w-none"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#5C5F6D] shrink-0" />
                        <span className="truncate">{current.domain || current.website}</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 shrink-0" />
                      </a>

                      <span className="flex items-center gap-1 text-[#8A8D9A] truncate max-w-[130px] sm:max-w-none">
                        <MapPin className="w-3.5 h-3.5 text-[#5C5F6D] shrink-0" />
                        <span className="truncate">{current.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-[#8A8D9A] hover:text-white hover:bg-[#17181D] transition-colors shrink-0"
                  aria-label="Close detail drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs">
                {renderDrawerBody()}
              </div>

              {/* Desktop Drawer Footer Actions */}
              <div className="p-3.5 sm:p-4 pb-5 sm:pb-5 border-t border-white/[0.05] bg-[#0E0F12] flex items-center justify-between gap-3">
                <a
                  href={current.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[42px] btn-vibrant-orange flex items-center justify-center gap-2 text-xs font-semibold rounded-xl shadow-hero-glow active:scale-[0.98] transition-all text-white"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Open Website</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyAngle}
                  className="min-h-[42px] px-4 flex items-center justify-center gap-2 text-xs font-medium text-white rounded-xl bg-[#17181D] hover:bg-[#202228] border border-white/[0.08] active:scale-[0.98] transition-all shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#8A8D9A]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )
      )}
    </AnimatePresence>
  );
}
