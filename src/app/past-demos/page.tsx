"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  ExternalLink,
  Save,
  FileText,
  RotateCcw,
  Loader2,
  ChevronDown,
  MoreHorizontal,
  ArrowLeft,
  Sparkles,
  Users2,
  Clock,
} from "lucide-react";
import { TopBar } from "@/components/shell/TopBar";
import { MobileNavDrawer } from "@/components/shell/MobileNavDrawer";
import { DemoSession, SessionDetailResponse } from "@/types";
import { formatDateTimeIST, getFaviconUrl } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function PastDemosPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [sessions, setSessions] = useState<DemoSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SessionDetailResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        setLoading(true);
        const res = await fetch("/api/sessions");
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
        }
      } catch (err) {
        console.warn("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.customer_company.toLowerCase().includes(q) ||
        (s.website && s.website.toLowerCase().includes(q)) ||
        (s.raw_input && s.raw_input.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q))
    );
  }, [sessions, searchQuery]);

  const handleSelectSession = async (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (res.ok) {
        const data: SessionDetailResponse = await res.json();
        setSessionDetail(data);
        setNotes(data.session.notes || "");
      }
    } catch (err) {
      console.warn("Failed to load session detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSessionId) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/sessions/${selectedSessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        success("Notes Synchronized", "Meeting notes updated in session record.");
        setSessions((prev) =>
          prev.map((s) =>
            s.session_id === selectedSessionId ? { ...s, notes } : s
          )
        );
      }
    } catch {
      error("Save Failed", "Could not save notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEDEF] flex flex-col font-sans selection:bg-[#FF5E2A]/30 selection:text-white">
      {/* TopBar Navigation across entire width */}
      <TopBar
        demoMode={true}
        onToggleDemoMode={() => {}}
        activeScreen="results"
        onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6 pb-8 sm:pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 select-none">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs text-[#8A8D9A] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Live Engine</span>
              </Link>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
              Past Demo Sessions
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8D9A] mt-0.5">
              Review and reopen historical client presentations
            </p>
          </div>

          <Link
            href="/"
            className="btn-vibrant-orange text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-hero-glow w-full sm:w-fit active:scale-95 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start New Demo</span>
          </Link>
        </div>

        {/* Sessions Container with Fintrixity styling */}
        <div className="card-fintrixity p-3.5 sm:p-6 select-none shadow-xl space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h3 className="font-semibold text-base sm:text-lg text-white">All Sessions</h3>
              <p className="text-xs text-[#8A8D9A] mt-0.5">
                Saved runs and notes from live client meetings
              </p>
            </div>

            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5F6D]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions..."
                className="bg-[#17181D] text-white placeholder-[#5C5F6D] text-base md:text-xs rounded-xl pl-9 pr-3.5 py-2.5 border border-white/[0.04] focus:outline-none focus:border-[#FF5E2A] w-full sm:w-64 min-h-[44px]"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF5E2A]" />
              <p className="text-xs text-[#8A8D9A]">Loading past demo records...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-10 text-center space-y-2 border border-white/[0.04] rounded-2xl bg-[#121316]">
              <p className="text-sm font-semibold text-white">No sessions found</p>
              <p className="text-xs text-[#8A8D9A]">
                Try adjusting your search query or start a new demo run.
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE HISTORY CARD LIST (< 768px): Stacked Touch Cards */}
              <div className="space-y-3 md:hidden">
                {filteredSessions.map((session) => {
                  const favicon = getFaviconUrl(
                    session.website || session.customer_company
                  );

                  return (
                    <div
                      key={session.session_id}
                      onClick={() => handleSelectSession(session.session_id)}
                      className="p-4 rounded-2xl bg-[#121316] border border-white/[0.06] hover:border-white/[0.12] active:scale-[0.99] transition-all cursor-pointer shadow-md space-y-3"
                    >
                      {/* Header: Favicon + Company Name + Lead Count Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#17181D] border border-white/[0.08] p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                            <Image
                              src={favicon}
                              alt={session.customer_company}
                              width={22}
                              height={22}
                              className="rounded object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                              unoptimized
                            />
                            <span className="text-xs font-bold text-white hidden first:inline font-mono">
                              {session.customer_company.slice(0, 1)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-white truncate hover:text-[#FF5E2A] transition-colors">
                              {session.customer_company}
                            </h4>
                            <span className="text-xs text-[#8A8D9A] truncate block font-mono">
                              {session.session_id}
                            </span>
                          </div>
                        </div>

                        {/* Leads Count Badge */}
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-full badge-completed shrink-0">
                          <Users2 className="w-3 h-3 text-emerald-400" />
                          <span>{session.lead_count || 0} Leads</span>
                        </span>
                      </div>

                      {/* Snippet / Offer */}
                      <p className="text-xs text-[#EDEDEF] line-clamp-2 leading-relaxed bg-[#17181D]/60 p-2.5 rounded-xl border border-white/[0.03]">
                        {session.offer || session.raw_input || "Commercial B2B Campaign"}
                      </p>

                      {/* Footer: Date + Status + Action CTA */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.04]">
                        <span className="text-[#8A8D9A] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#5C5F6D]" />
                          <span>{formatDateTimeIST(session.created_at)}</span>
                        </span>

                        <span className="text-[#FF5E2A] font-semibold flex items-center gap-1">
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TABLE VIEW (>= 768px): High-Density Grid */}
              <div className="hidden md:block overflow-x-auto -mx-3.5 sm:mx-0 px-3.5 sm:px-0">
                <table className="w-full text-left border-collapse min-w-[580px]">
                  <thead>
                    <tr className="text-xs text-[#8A8D9A] border-b border-white/[0.04]">
                      <th className="pb-3.5 pt-1 px-3 font-medium">Customer Company</th>
                      <th className="pb-3.5 pt-1 px-3 font-medium">Session ID</th>
                      <th className="pb-3.5 pt-1 px-3 font-medium">Date (IST)</th>
                      <th className="pb-3.5 pt-1 px-3 font-medium">Status</th>
                      <th className="pb-3.5 pt-1 px-3 font-medium">Verified Leads</th>
                      <th className="pb-3.5 pt-1 px-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {filteredSessions.map((session) => {
                      const favicon = getFaviconUrl(
                        session.website || session.customer_company
                      );
                      return (
                        <tr
                          key={session.session_id}
                          onClick={() => handleSelectSession(session.session_id)}
                          className="group cursor-pointer hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-[#17181D] border border-white/[0.05] p-2 flex items-center justify-center shrink-0">
                                <Image
                                  src={favicon}
                                  alt={session.customer_company}
                                  width={22}
                                  height={22}
                                  className="rounded object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                  unoptimized
                                />
                                <span className="text-xs font-bold text-white hidden first:inline font-mono">
                                  {session.customer_company.slice(0, 1)}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-white block group-hover:text-[#FF5E2A] transition-colors">
                                  {session.customer_company}
                                </span>
                                <span className="text-xs text-[#8A8D9A] block mt-0.5 line-clamp-1 max-w-[280px]">
                                  {session.website || session.offer || "Commercial Offering"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-xs font-mono text-[#8A8D9A]">
                            {session.session_id}
                          </td>

                          <td className="py-3.5 px-3 text-xs text-[#8A8D9A] whitespace-nowrap">
                            {formatDateTimeIST(session.created_at)}
                          </td>

                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block ${
                                session.status === "done"
                                  ? "badge-completed"
                                  : "badge-active"
                              }`}
                            >
                              {session.status === "done" ? "Completed" : "Active"}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 text-xs font-mono font-semibold text-white whitespace-nowrap">
                            {session.lead_count || 0} Leads
                          </td>

                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              className="text-xs text-[#8A8D9A] group-hover:text-white px-3 py-1.5 rounded-lg bg-[#17181D] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                            >
                              Open Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Session Detail Modal */}
        {selectedSessionId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-4">
            <div className="w-full max-w-2xl bg-[#121316] border border-white/[0.08] rounded-2xl shadow-2xl p-4 sm:p-7 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150">
              {loadingDetail ? (
                <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#FF5E2A]" />
                  <p className="text-xs text-[#8A8D9A]">Loading session intelligence...</p>
                </div>
              ) : sessionDetail ? (
                <>
                  <div className="flex items-start justify-between gap-3 sm:gap-4 border-b border-white/[0.05] pb-3 sm:pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="badge-active text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                          {sessionDetail.session.session_id}
                        </span>
                        <span className="text-xs text-[#8A8D9A]">
                          {formatDateTimeIST(sessionDetail.session.created_at)}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">
                        {sessionDetail.session.customer_company}
                      </h2>
                      <p className="text-xs text-[#8A8D9A] mt-0.5">
                        {sessionDetail.session.offer}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedSessionId(null)}
                      className="text-[#8A8D9A] hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#17181D]"
                      aria-label="Close session modal"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#17181D] border border-white/[0.04] space-y-1">
                    <span className="text-[#8A8D9A] text-xs font-medium block">
                      ICP Hypothesis
                    </span>
                    <p className="text-white text-xs italic leading-relaxed">
                      &ldquo;{sessionDetail.session.icp_hypothesis}&rdquo;
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#FF5E2A]" />
                        <span>Meeting Notes</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        disabled={isSavingNotes}
                        className="btn-vibrant-orange text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                      >
                        {isSavingNotes ? "Saving..." : "Save Notes"}
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Type client reaction, questions asked, or follow-up commitments..."
                      className="w-full bg-[#17181D] text-white text-base md:text-xs rounded-xl p-3 border border-white/[0.04] focus:outline-none focus:border-[#FF5E2A] resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-white/[0.05] flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-2.5 sm:gap-0">
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="min-h-[44px] flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-[#17181D] hover:bg-[#1E2026] text-white border border-white/[0.04] active:scale-95 transition-transform"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#FF5E2A]" />
                      <span>Reopen in Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSessionId(null)}
                      className="min-h-[44px] px-5 py-2 text-xs font-semibold bg-[#17181D] hover:bg-[#1E2026] text-white rounded-xl active:scale-95 transition-transform text-center"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* Slide-out Navigation Drawer from Left */}
      <MobileNavDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        demoMode={true}
        onToggleDemoMode={() => {}}
        onNavigateScreen={() => router.push("/")}
      />
    </div>
  );
}
