"use client";

import React, { useState } from "react";
import { IntakeProfile } from "@/types";
import {
  CheckCircle2,
  Edit3,
  Play,
  Sparkles,
  Building2,
  Target,
  MapPin,
  Check,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface ProfileCardProps {
  profile: IntakeProfile;
  assumptions: string[];
  onStartResearch: (editedProfile: IntakeProfile) => Promise<void>;
  isStarting: boolean;
  onEditAgain?: () => void;
}

export function ProfileCard({
  profile,
  assumptions,
  onStartResearch,
  isStarting,
  onEditAgain,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<IntakeProfile>({ ...profile });

  const handleLaunch = () => {
    onStartResearch(edited);
  };

  return (
    <div className="card-fintrixity p-4 sm:p-6 space-y-4 sm:space-y-5 select-none shadow-xl w-full flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#17181D] border border-white/[0.06] flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Prospecting Profile Target
              </h3>
              <span className="badge-completed text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold tracking-wider">
                Synthesized
              </span>
            </div>
            <p className="text-xs text-[#8A8D9A] mt-0.5">
              Review ICP hypothesis before initiating web research pipeline.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="self-start xs:self-auto flex items-center gap-1.5 text-xs text-[#8A8D9A] hover:text-white bg-[#17181D] hover:bg-[#1E2026] px-3 py-1.5 rounded-xl border border-white/[0.04] transition-all select-none"
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Done</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-[#FF5E2A]" />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>

      {/* Profile Content Body */}
      <div className="space-y-3 text-xs flex-1">
        {/* Company Name */}
        <div className="p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.04] flex items-start gap-3">
          <Building2 className="w-4 h-4 text-[#FF5E2A] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-[#8A8D9A] font-medium block mb-0.5 text-[11px]">
              Client Company
            </span>
            {isEditing ? (
              <input
                type="text"
                value={edited.company_name}
                onChange={(e) =>
                  setEdited({ ...edited, company_name: e.target.value })
                }
                className="w-full min-h-[40px] bg-[#121316] text-white px-3 py-2 rounded-xl border border-white/[0.06] text-base md:text-xs focus:outline-none focus:border-[#FF5E2A]"
              />
            ) : (
              <p className="text-white font-semibold text-sm truncate">
                {edited.company_name || "Enterprise Client"}
              </p>
            )}
          </div>
        </div>

        {/* Core Offer */}
        <div className="p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.04] flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#FF5E2A] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-[#8A8D9A] font-medium block mb-0.5 text-[11px]">
              Core Offer & Solution
            </span>
            {isEditing ? (
              <textarea
                rows={2}
                value={edited.offer}
                onChange={(e) =>
                  setEdited({ ...edited, offer: e.target.value })
                }
                className="w-full bg-[#121316] text-white p-2.5 rounded-xl border border-white/[0.06] text-base md:text-xs focus:outline-none focus:border-[#FF5E2A] resize-none"
              />
            ) : (
              <p className="text-white leading-relaxed line-clamp-2">
                {edited.offer}
              </p>
            )}
          </div>
        </div>

        {/* Target Market & Geography Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.04] flex items-start gap-3">
            <Target className="w-4 h-4 text-[#FF5E2A] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-[#8A8D9A] font-medium block mb-0.5 text-[11px]">
                Target Market
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={edited.target_market}
                  onChange={(e) =>
                    setEdited({ ...edited, target_market: e.target.value })
                  }
                  className="w-full min-h-[40px] bg-[#121316] text-white px-3 py-2 rounded-xl border border-white/[0.06] text-base md:text-xs focus:outline-none focus:border-[#FF5E2A]"
                />
              ) : (
                <p className="text-white truncate">{edited.target_market}</p>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.04] flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#FF5E2A] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-[#8A8D9A] font-medium block mb-0.5 text-[11px]">
                Geography
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={edited.geography}
                  onChange={(e) =>
                    setEdited({ ...edited, geography: e.target.value })
                  }
                  className="w-full min-h-[40px] bg-[#121316] text-white px-3 py-2 rounded-xl border border-white/[0.06] text-base md:text-xs focus:outline-none focus:border-[#FF5E2A]"
                />
              ) : (
                <p className="text-white truncate">{edited.geography}</p>
              )}
            </div>
          </div>
        </div>

        {/* Assumptions Pills */}
        {assumptions && assumptions.length > 0 && (
          <div className="p-3 rounded-2xl bg-[#17181D] border border-white/[0.04] flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-[#8A8D9A] uppercase tracking-wider font-mono mr-1">
              Hypotheses:
            </span>
            {assumptions.map((assump, i) => (
              <span
                key={i}
                className="text-[10px] text-white bg-[#121316] px-2 py-0.5 rounded-lg border border-white/[0.04]"
              >
                {assump}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Launch CTA Button Row */}
      <div className="pt-2 flex flex-col-reverse xs:flex-row items-stretch xs:items-center gap-2 sm:gap-2.5">
        {onEditAgain && (
          <button
            type="button"
            onClick={onEditAgain}
            className="w-full xs:w-auto min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-medium text-[#8A8D9A] hover:text-white bg-[#17181D] hover:bg-[#1E2026] border border-white/[0.04] transition-all text-center active:scale-[0.98]"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleLaunch}
          disabled={isStarting}
          className="w-full xs:flex-1 min-h-[48px] btn-vibrant-orange py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-hero-glow active:scale-[0.98]"
        >
          {isStarting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Launching Autonomous Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Confirm & Start Research</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
