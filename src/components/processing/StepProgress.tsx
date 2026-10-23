"use client";

import React, { useState, useEffect } from "react";
import { Check, AlertCircle, RefreshCw, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { JobStatusResponse, JobStage } from "@/types";

interface StepProgressProps {
  job: JobStatusResponse;
  onCancel: () => Promise<void>;
  onRetry: () => void;
  onSwitchToDemo: () => void;
}

interface StepDef {
  id: number;
  label: string;
  sublabel: string;
  associatedStages: JobStage[];
}

const STEPS: StepDef[] = [
  {
    id: 1,
    label: "Understanding business",
    sublabel: "Normalizing offer & ICP vectors",
    associatedStages: ["intake", "kb"],
  },
  {
    id: 2,
    label: "Researching market",
    sublabel: "SERP discovery & domain crawling",
    associatedStages: ["research", "extraction"],
  },
  {
    id: 3,
    label: "Qualifying leads",
    sublabel: "Scoring signals against hypothesis",
    associatedStages: ["qualification"],
  },
  {
    id: 4,
    label: "Writing angles",
    sublabel: "Mapping buyer roles & hooks",
    associatedStages: ["buyer", "angle", "saving", "done"],
  },
];

export function StepProgress({
  job,
  onCancel,
  onRetry,
  onSwitchToDemo,
}: StepProgressProps) {
  const [isStalled, setIsStalled] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Monitor stall timer: if no updates for >30s (PRD Section 9a)
  useEffect(() => {
    setIsStalled(false);
    const timer = setTimeout(() => {
      if (job.status === "running") {
        setIsStalled(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [job.log.length, job.progress, job.status]);

  const getStepState = (step: StepDef): "done" | "active" | "pending" => {
    const stageOrder: JobStage[] = [
      "intake",
      "kb",
      "research",
      "extraction",
      "qualification",
      "buyer",
      "angle",
      "saving",
      "done",
    ];

    const currentIdx = stageOrder.indexOf(job.stage);

    if (job.status === "done") return "done";
    if (step.associatedStages.includes(job.stage)) return "active";

    const highestInStep = Math.max(
      ...step.associatedStages.map((s) => stageOrder.indexOf(s))
    );

    if (currentIdx > highestInStep) return "done";
    return "pending";
  };

  const latestLog =
    job.log.length > 0
      ? job.log[job.log.length - 1].msg
      : "Initializing autonomous pipeline...";

  // Calculate elapsed time string
  let durationStr = "0:15 elapsed";
  if (job.started_at) {
    const end = job.finished_at ? new Date(job.finished_at).getTime() : Date.now();
    const diffSec = Math.max(0, Math.floor((end - new Date(job.started_at).getTime()) / 1000));
    const m = Math.floor(diffSec / 60);
    const s = diffSec % 60;
    durationStr = `${m}:${s < 10 ? "0" : ""}${s} elapsed`;
  }

  const handleCancelClick = async () => {
    setCancelling(true);
    await onCancel();
    setCancelling(false);
  };

  return (
    <div className="card-fintrixity p-3.5 sm:p-5 w-full select-none shadow-xl flex flex-col justify-between overflow-hidden">
      {/* Card Header: Synthesizing Lead Intelligence + Progress Bar & Status Text */}
      <div className="space-y-2 mb-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold tracking-tight text-white">
            Synthesizing Lead Intelligence
          </h3>
          <span className="text-xs sm:text-sm font-mono font-bold text-white">
            {job.progress}%
          </span>
        </div>

        {/* Progress Bar & Text replacing former subtext */}
        <div className="space-y-1.5">
          <div className="w-full h-1.5 rounded-full bg-[#17181D] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF5E2A] via-[#FF4500] to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>{job.leads?.length || 0} verified leads qualified</span>
            </span>
            <span className="text-[#8A8D9A] text-[11px]">
              Stage {Math.min(4, Math.max(1, STEPS.findIndex((s) => getStepState(s) === "active") + 1))}/4
            </span>
          </div>
        </div>
      </div>

      {/* 1. MOBILE (< 640px): Single-Column Vertical Connected Stepper */}
      <div className="flex flex-col gap-2.5 w-full sm:hidden">
        {STEPS.map((step) => {
          const state = getStepState(step);
          return (
            <motion.div
              key={step.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                state === "active"
                  ? "bg-white/[0.02] border-[#FF5E2A]/50 shadow-[0_0_15px_rgba(255,94,42,0.15)]"
                  : state === "done"
                  ? "bg-[#121316] border-white/[0.05]"
                  : "bg-[#121316] border-white/[0.03] opacity-45"
              }`}
            >
              {/* Left: Indicator Icon/Dot + Step Name + Short Subtext */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                {state === "done" && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                {state === "active" && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF5E2A] to-[#FF4500] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,69,0,0.5)]">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                )}
                {state === "pending" && (
                  <div className="w-7 h-7 rounded-lg bg-[#17181D] text-[#5C5F6D] border border-white/[0.04] flex items-center justify-center text-[10px] font-mono shrink-0">
                    0{step.id}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-[#EDEDEF] truncate">
                    {step.label}
                  </p>
                  <p className="text-[11px] text-[#8A8A93] truncate">
                    {step.sublabel}
                  </p>
                </div>
              </div>

              {/* Right: Step number pill */}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-[#8A8D9A] shrink-0 border border-white/[0.04]">
                0{step.id}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* 2. TABLET/DESKTOP (>= 640px): 4-Column Grid Stepper */}
      <div className="hidden sm:grid sm:grid-cols-4 gap-2.5 w-full">
        {STEPS.map((step) => {
          const state = getStepState(step);
          return (
            <div
              key={step.id}
              className={`flex flex-col gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                state === "active"
                  ? "bg-[#17181D] border-[#FF5E2A]/50 shadow-[0_0_16px_rgba(255,94,42,0.2)]"
                  : state === "done"
                  ? "bg-[#17181D] border-white/[0.04]"
                  : "bg-[#121316] border-white/[0.03] opacity-60"
              }`}
            >
              {/* Step Badge */}
              <div className="flex items-center justify-between">
                {state === "done" && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                {state === "active" && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#FF5E2A] to-[#FF4500] text-white flex items-center justify-center shadow-[0_0_12px_rgba(255,69,0,0.6)]">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                )}
                {state === "pending" && (
                  <div className="w-7 h-7 rounded-xl bg-[#17181D] text-[#5C5F6D] border border-white/[0.04] flex items-center justify-center text-xs font-mono">
                    0{step.id}
                  </div>
                )}
                <span className="text-[10px] font-mono text-[#5C5F6D]">0{step.id}</span>
              </div>

              {/* Step Text */}
              <div className="min-w-0">
                <p
                  className={`text-xs font-semibold leading-tight truncate ${
                    state === "active"
                      ? "text-white"
                      : state === "done"
                      ? "text-white"
                      : "text-[#8A8D9A]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-[#8A8D9A] truncate mt-0.5">
                  {step.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Live Telemetry Terminal */}
      <div className="w-full mt-4 rounded-xl bg-[#0C0D10] border border-white/[0.06] p-3.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8D9A] border-b border-white/[0.05] pb-2.5 mb-2.5">
          <span className="flex items-center gap-2 text-zinc-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Live Telemetry Feed</span>
          </span>
          <span className="text-[11px] font-mono text-[#71717A] shrink-0">
            {durationStr}
          </span>
        </div>

        <div
          ref={(el) => {
            if (el) el.scrollTop = el.scrollHeight;
          }}
          className="max-h-36 overflow-y-auto overflow-x-hidden flex flex-col gap-1.5 font-mono text-[11px] text-zinc-400 select-text scrollbar-thin scrollbar-thumb-white/10"
        >
          {job.log.map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -3 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-2 break-all sm:break-normal"
            >
              <span className="text-zinc-600 shrink-0 select-none">
                {entry.t ? new Date(entry.t).toLocaleTimeString([], { hour12: false }) : "00:00:00"}
              </span>
              <span className="text-zinc-300 leading-relaxed text-left flex-1 break-words">
                &gt; {entry.msg}
              </span>
            </motion.div>
          ))}
          {job.log.length === 0 && (
            <div className="text-zinc-500 italic text-[11px]">
              &gt; Initializing autonomous worker pipeline...
            </div>
          )}
        </div>
      </div>



      {/* Stall Alert if Pipeline Stalled */}
      {isStalled && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Pipeline Slowdown Detected</p>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Target domains may be rate-limiting. Switch to verified demo data.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSwitchToDemo}
            className="min-h-[38px] text-[11px] font-semibold bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-100 whitespace-nowrap active:scale-95"
          >
            Switch to Demo
          </button>
        </div>
      )}

      {/* 5. Bottom Bar Container: Cancel / Abort Action & Demo Option */}
      <div className="w-full mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
        <button
          type="button"
          onClick={handleCancelClick}
          disabled={cancelling || job.status !== "running"}
          className="text-xs text-zinc-500 hover:text-red-400 underline underline-offset-4 py-2 px-1 transition-colors disabled:opacity-40"
        >
          {cancelling ? "Cancelling..." : "Cancel pipeline"}
        </button>

        <button
          type="button"
          onClick={onSwitchToDemo}
          className="text-xs font-medium text-[#FF5E2A] hover:underline py-2 px-1 transition-colors"
        >
          Instant Demo Replay
        </button>
      </div>
    </div>
  );
}
