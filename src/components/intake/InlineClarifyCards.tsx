"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ArrowRight, SkipForward, Tag, Sparkles } from "lucide-react";

interface InlineClarifyCardsProps {
  questions: string[];
  assumptions: string[];
  confidence: number;
  onProceed: (answers: string[]) => void;
  onSkip: () => void;
}

export function InlineClarifyCards({
  questions,
  assumptions,
  confidence,
  onProceed,
  onSkip,
}: InlineClarifyCardsProps) {
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ""));

  const suggestedPresets = [
    [
      "Mid-to-large commercial plants (100+ staff)",
      "Dairy and beverage factories",
      "Automotive & engineering OEMs",
    ],
    [
      "20 to 100 KLD plant capacity",
      "Turnkey on-site mobile camps",
      "Budget >= ₹10 Lakhs",
    ],
  ];

  const handleChipClick = (questionIndex: number, chipText: string) => {
    const updated = [...answers];
    updated[questionIndex] = chipText;
    setAnswers(updated);
  };

  const handleInputChange = (questionIndex: number, val: string) => {
    const updated = [...answers];
    updated[questionIndex] = val;
    setAnswers(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
      className="card-fintrixity p-4 sm:p-6 space-y-4 select-none shadow-xl"
    >
      {/* Header Glass Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-white/[0.04]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#17181D] border border-white/[0.06] flex items-center justify-center shrink-0 shadow-md">
            <HelpCircle className="w-5 h-5 text-[#FF5E2A]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Market Hypothesis Clarification
              </h3>
              <span className="badge-active text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold">
                Confidence: {Math.round(confidence * 100)}%
              </span>
            </div>
            <p className="text-xs text-[#8A8D9A] mt-1 leading-relaxed">
              We formulated initial assumptions from your input. Select below to sharpen search vectors or proceed directly.
            </p>
          </div>
        </div>

        {/* Proceed with assumptions link */}
        <button
          type="button"
          onClick={onSkip}
          className="group relative text-xs text-[#8A8D9A] hover:text-white flex items-center gap-1 shrink-0 py-1 select-none transition-colors self-end sm:self-auto"
        >
          <span>Proceed with assumptions</span>
          <SkipForward className="w-3.5 h-3.5 text-[#FF5E2A] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Clarifying Questions Cards */}
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#17181D] border border-white/[0.04] space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-xl bg-white text-black text-xs font-mono font-bold flex items-center justify-center shadow-sm">
                {idx + 1}
              </span>
              <p className="text-sm font-medium text-white">{q}</p>
            </div>

            {/* Suggested Chip Buttons (Snap-scrollable on mobile) */}
            {suggestedPresets[idx] && (
              <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-2 pt-0.5 pb-1 -mx-1 px-1">
                {suggestedPresets[idx].map((chip, cIdx) => {
                  const isSelected = answers[idx] === chip;
                  return (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={() => handleChipClick(idx, chip)}
                      className={`snap-start min-h-[44px] text-xs px-3.5 py-2 rounded-xl border transition-all active:scale-[0.98] select-none whitespace-nowrap shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "bg-[#FF5E2A]/15 border-[#FF5E2A] text-white font-semibold shadow-[0_0_12px_rgba(255,94,42,0.3)]"
                          : "bg-[#121316] border-white/[0.04] text-[#8A8D9A] hover:text-white hover:border-white/[0.08]"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Custom Input */}
            <input
              type="text"
              value={answers[idx]}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              placeholder="Or specify custom customer criteria..."
              className="w-full min-h-[44px] bg-[#121316] text-white placeholder-[#5C5F6D] text-base md:text-xs rounded-xl px-3 py-2 border border-white/[0.04] focus:outline-none focus:border-[#FF5E2A]"
            />
          </div>
        ))}
      </div>

      {/* Assumptions Tags Card */}
      {assumptions.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.04] flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8A8D9A] flex items-center gap-1 mr-1">
            <Tag className="w-3.5 h-3.5 text-[#5C5F6D]" />
            Operating Assumptions:
          </span>
          {assumptions.map((item, aIdx) => (
            <span
              key={aIdx}
              className="text-[11px] text-[#FF5E2A] bg-[#FF5E2A]/10 px-2.5 py-0.5 rounded-lg border border-[#FF5E2A]/20 font-mono"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Proceed CTA Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => onProceed(answers)}
          className="w-full sm:w-auto min-h-[44px] btn-vibrant-orange text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-hero-glow active:scale-[0.98]"
        >
          <span>Apply Hypotheses & Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
