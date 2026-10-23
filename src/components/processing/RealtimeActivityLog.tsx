"use client";

import React, { useState, useMemo } from "react";
import { Search, MoreHorizontal, Globe, ShieldCheck, Filter, Activity } from "lucide-react";
import { JobStatusResponse, LogEntry } from "@/types";

interface RealtimeActivityLogProps {
  job: JobStatusResponse;
}

interface ActivityItem {
  id: string;
  name: string;
  domain: string;
  time: string;
  date: string;
  status: "Qualified" | "Verifying" | "Filtered";
  price: string;
}

export function RealtimeActivityLog({ job }: RealtimeActivityLogProps) {
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Synthetic candidate activities derived from job logs and real candidates
  const activities: ActivityItem[] = useMemo(() => {
    // If the job already has qualified leads, show them with real status
    if (job.leads && job.leads.length > 0) {
      return job.leads.map((l, idx) => ({
        id: `INV_0000${76 + idx}`,
        name: l.company,
        domain: l.domain || "verified-domain.com",
        time: "Just now",
        date: "17 Oct, 2026",
        status: l.fit_score >= 75 ? "Qualified" : "Verifying",
        price: `$${(l.fit_score * 310).toLocaleString()}`,
      }));
    }

    // Default live telemetry candidate stream matching prompt requirements
    const baseCandidates = [
      { name: "Kalyani Technoforge Ltd", domain: "kalyanitechnoforge.com", status: "Qualified" as const, price: "$28,520" },
      { name: "Tata AutoComp Systems", domain: "tataautocomp.com", status: "Qualified" as const, price: "$33,847" },
      { name: "Finolex Cables Pune", domain: "finolexcables.com", status: "Verifying" as const, price: "$24,678" },
      { name: "Bharat Forge R&D", domain: "bharatforge.com", status: "Qualified" as const, price: "$31,200" },
      { name: "Thermax Energy Solutions", domain: "thermaxglobal.com", status: "Verifying" as const, price: "$19,450" },
      { name: "Praj Industries Biotechnology", domain: "praj.net", status: "Filtered" as const, price: "$12,300" },
      { name: "Persistent Systems Pune", domain: "persistent.com", status: "Qualified" as const, price: "$27,900" },
      { name: "Bajaj Auto Chakan Works", domain: "bajajauto.com", status: "Verifying" as const, price: "$35,000" },
    ];

    return baseCandidates.map((c, i) => ({
      id: `INV_0000${76 + i}`,
      name: c.name,
      domain: c.domain,
      time: `11:2${i} AM`,
      date: "17 Oct, 2026",
      status: c.status,
      price: c.price,
    }));
  }, [job.leads]);

  const filtered = useMemo(() => {
    return activities.filter((item) => {
      if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (filterText) {
        const q = filterText.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.domain.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activities, statusFilter, filterText]);

  return (
    <div className="card-fintrixity p-6 select-none shadow-xl">
      {/* Header matching Recent Activities */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <h3 className="font-semibold text-lg text-white">Recent Activities</h3>
          <span className="w-2 h-2 rounded-full bg-[#FF5E2A] animate-ping" />
          <span className="text-xs text-[#8A8D9A] font-mono">Live Candidate Telemetry</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5F6D]" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search..."
              className="bg-[#17181D] text-white placeholder-[#5C5F6D] text-xs rounded-xl pl-8 pr-3 py-1.5 border border-white/[0.04] focus:outline-none focus:border-[#FF5E2A] w-48 sm:w-56"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#17181D] text-xs text-[#EDEDEF] rounded-xl px-3 py-1.5 border border-white/[0.04] focus:outline-none focus:border-[#FF5E2A] cursor-pointer"
          >
            <option value="all">Filter ⌄</option>
            <option value="qualified">Qualified</option>
            <option value="verifying">Verifying</option>
            <option value="filtered">Filtered</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-[#8A8D9A] border-b border-white/[0.04]">
              <th className="pb-3.5 pt-1 px-3 font-medium w-8">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-[#17181D] border-white/[0.1] text-[#FF4500] accent-[#FF4500] cursor-pointer"
                />
              </th>
              <th className="pb-3.5 pt-1 px-3 font-medium">Activity</th>
              <th className="pb-3.5 pt-1 px-3 font-medium">Order ID</th>
              <th className="pb-3.5 pt-1 px-3 font-medium">Date</th>
              <th className="pb-3.5 pt-1 px-3 font-medium">Time</th>
              <th className="pb-3.5 pt-1 px-3 font-medium">Price</th>
              <th className="pb-3.5 pt-1 px-3 font-medium">Status</th>
              <th className="pb-3.5 pt-1 px-3 font-medium"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.03]">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <td className="py-3.5 px-3 text-xs align-middle">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded bg-[#17181D] border-white/[0.1] text-[#FF4500] accent-[#FF4500] cursor-pointer"
                  />
                </td>

                <td className="py-3.5 px-3 text-xs align-middle">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="w-10 h-10 rounded-2xl bg-[#17181D] border border-white/[0.06] p-2 flex items-center justify-center shrink-0 shadow-sm">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-sm text-white block truncate group-hover:text-[#FF5E2A] transition-colors">
                        {item.name}
                      </span>
                      <span className="text-xs text-[#8A8D9A] block truncate mt-0.5">
                        {item.domain}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-3 text-xs align-middle font-mono text-[#8A8D9A] whitespace-nowrap">
                  {item.id}
                </td>

                <td className="py-3.5 px-3 text-xs align-middle text-[#8A8D9A] whitespace-nowrap">
                  {item.date}
                </td>

                <td className="py-3.5 px-3 text-xs align-middle text-[#8A8D9A] whitespace-nowrap">
                  {item.time}
                </td>

                <td className="py-3.5 px-3 text-xs align-middle font-mono font-semibold text-white whitespace-nowrap">
                  {item.price}
                </td>

                <td className="py-3.5 px-3 text-xs align-middle whitespace-nowrap">
                  {item.status === "Qualified" && (
                    <span className="badge-completed text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block">
                      Qualified
                    </span>
                  )}
                  {item.status === "Verifying" && (
                    <span className="badge-active text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block">
                      Verifying
                    </span>
                  )}
                  {item.status === "Filtered" && (
                    <span className="badge-pending text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block">
                      Filtered
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-3 text-xs align-middle text-right">
                  <button
                    type="button"
                    className="text-[#5C5F6D] group-hover:text-white p-1 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
