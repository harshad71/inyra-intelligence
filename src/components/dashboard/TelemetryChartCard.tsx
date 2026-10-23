"use client";

import React, { useState } from "react";
import { JobStatusResponse } from "@/types";

interface TelemetryChartCardProps {
  job?: JobStatusResponse | null;
}

export function TelemetryChartCard({ job }: TelemetryChartCardProps) {
  const [activeBar, setActiveBar] = useState<number>(2); // March highlighted by default as in reference image
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  const bars = [
    { label: "Jan", height: 42, value: "18 Leads", sub: "Auto Tech" },
    { label: "Feb", height: 35, value: "14 Leads", sub: "Industrial" },
    { label: "Mar", height: 88, value: "24 Leads", sub: "Tier 1 Enterprise", isHero: true },
    { label: "Apr", height: 48, value: "19 Leads", sub: "Pharma Labs" },
    { label: "May", height: 60, value: "22 Leads", sub: "Clean Energy" },
    { label: "Jun", height: 38, value: "15 Leads", sub: "F&B Plants" },
    { label: "Jul", height: 55, value: "21 Leads", sub: "B2B Dairy" },
  ];

  return (
    <div className="card-fintrixity p-6 flex flex-col justify-between h-full min-h-[340px] select-none">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs text-[#8A8D9A] font-medium block">
            Lead Qualification Flow
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1 block">
            {job?.leads?.length ? `${job.leads.length} Verified Accounts` : "24 Verified Accounts"}
          </span>
        </div>

        {/* Period Switch Pills matching Fintrixity */}
        <div className="flex items-center p-1 rounded-xl bg-[#17181D] border border-white/[0.04]">
          <button
            type="button"
            onClick={() => setPeriod("monthly")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              period === "monthly"
                ? "bg-white text-black shadow-sm"
                : "text-[#8A8D9A] hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setPeriod("yearly")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              period === "yearly"
                ? "bg-[#FF5E2A] text-white shadow-sm"
                : "text-[#8A8D9A] hover:text-white"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Bar Chart Visualization matching Fintrixity */}
      <div className="relative pt-12 pb-2">
        {/* Tooltip on Active Hero Bar matching Fintrixity */}
        <div
          className="absolute z-20 transition-all duration-200"
          style={{
            left: `${(activeBar / (bars.length - 1)) * 78 + 4}%`,
            top: "0px",
          }}
        >
          <div className="bg-[#17181D] border border-white/[0.08] shadow-2xl rounded-xl p-2.5 text-xs font-mono min-w-[130px]">
            <p className="text-[10px] text-[#8A8D9A] mb-0.5">October 2026</p>
            <div className="flex items-center justify-between text-white font-semibold">
              <span>Leads</span>
              <span>{bars[activeBar].value}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#34D399] mt-0.5">
              <span>Fit Rate</span>
              <span>88% Match</span>
            </div>
          </div>
        </div>

        {/* Vertical Axis Guidelines */}
        <div className="absolute inset-x-0 bottom-8 h-40 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-white/[0.06] w-full" />
          <div className="border-b border-white/[0.06] w-full" />
          <div className="border-b border-white/[0.06] w-full" />
          <div className="border-b border-white/[0.06] w-full" />
        </div>

        {/* Bars Container */}
        <div className="h-44 flex items-end justify-between gap-3 px-2 pt-6">
          {bars.map((bar, idx) => {
            const isActive = activeBar === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveBar(idx)}
                className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
              >
                {/* Bar element */}
                <div className="w-full max-w-[42px] h-36 flex items-end justify-center">
                  <div
                    className={`w-full rounded-xl transition-all duration-300 relative ${
                      isActive
                        ? "bg-gradient-to-t from-[#FF5E2A] via-[#FF4500] to-[#FF5E2A] shadow-[0_0_24px_-4px_rgba(255,69,0,0.65)]"
                        : "bg-[#1E2026] group-hover:bg-[#282B33]"
                    }`}
                    style={{ height: `${bar.height}%` }}
                  >
                    {isActive && (
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#FF4500] shadow-md" />
                    )}
                  </div>
                </div>

                {/* X-axis label */}
                <span
                  className={`text-[11px] font-mono transition-colors ${
                    isActive ? "text-white font-semibold" : "text-[#5C5F6D] group-hover:text-[#8A8D9A]"
                  }`}
                >
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
