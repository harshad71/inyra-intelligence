"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { TopBar } from "@/components/shell/TopBar";
import { GuidedIntakeForm } from "@/components/intake/GuidedIntakeForm";
import { InlineClarifyCards } from "@/components/intake/InlineClarifyCards";
import { ProfileCard } from "@/components/intake/ProfileCard";
import { OrbStage } from "@/components/processing/OrbStage";
import { StepProgress } from "@/components/processing/StepProgress";
import { ResultsHeader } from "@/components/results/ResultsHeader";
import { LeadsTable } from "@/components/results/LeadsTable";
import { LeadDrawer } from "@/components/results/LeadDrawer";
import { MobileNavDrawer } from "@/components/shell/MobileNavDrawer";
import { useToast } from "@/components/ui/Toast";
import { Sparkles } from "lucide-react";
import {
  IntakeRequest,
  IntakeResponse,
  IntakeProfile,
  JobStatusResponse,
  Lead,
} from "@/types";

import sample1Data from "../../public/samples/sample-1.json";
import sample2Data from "../../public/samples/sample-2.json";

export default function LeadGenApp() {
  const { toast, success, error } = useToast();

  const [screen, setScreen] = useState<"intake" | "processing" | "results">("intake");
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);

  // Intake State
  const [intakeLoading, setIntakeLoading] = useState<boolean>(false);
  const [intakeData, setIntakeData] = useState<IntakeResponse | null>(null);
  const [showClarify, setShowClarify] = useState<boolean>(false);
  const [confirmedProfile, setConfirmedProfile] = useState<IntakeProfile | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);

  // Processing & Job State
  const [currentJob, setCurrentJob] = useState<JobStatusResponse | null>(
    sample1Data as unknown as JobStatusResponse
  );
  const [isStartingJob, setIsStartingJob] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = useCallback(
    (runId: string) => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/jobs/${runId}`);
          if (!res.ok) return;

          const data: JobStatusResponse = await res.json();
          setCurrentJob(data);

          if (data.status === "done") {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
            setTimeout(() => {
              setScreen("results");
            }, 500);
          } else if (data.status === "failed" || data.status === "cancelled") {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
          }
        } catch (err) {
          console.warn("Poll fetch error:", err);
        }
      }, 2000);
    },
    [success]
  );

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handleIntakeSubmit = async (request: IntakeRequest) => {
    setIntakeLoading(true);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error?.message || "Failed to process intake");
      }

      const data: IntakeResponse = await res.json();
      setIntakeData(data);
      setConfirmedProfile(data.profile);

      if (data.confidence < 0.6 && data.questions && data.questions.length > 0) {
        setShowClarify(true);
      } else {
        setShowClarify(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Intake request failed";
      error("Intake Error", msg);
    } finally {
      setIntakeLoading(false);
    }
  };

  const handleClarifyProceed = (userAnswers: string[]) => {
    setAnswers(userAnswers);
    setShowClarify(false);
    toast("Hypothesis Updated", "Sharpened target industry criteria.");
  };

  const handleClarifySkip = () => {
    setShowClarify(false);
    toast("Default Assumptions Applied", "Proceeding with standard B2B hypothesis.");
  };

  const handleStartResearch = async (profileToUse: IntakeProfile) => {
    if (!intakeData) return;

    setIsStartingJob(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: intakeData.session_id,
          intake_id: intakeData.intake_id,
          profile: profileToUse,
          answers: answers,
          lead_count: 25,
          mode: demoMode ? "demo" : "live",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize job execution");
      }

      const data = await res.json();
      const initialJobStatus: JobStatusResponse = {
        run_id: data.run_id,
        session_id: data.session_id || intakeData.session_id,
        status: "running",
        stage: "intake",
        stages: [
          "intake",
          "kb",
          "research",
          "extraction",
          "qualification",
          "buyer",
          "angle",
          "saving",
          "done",
        ],
        progress: 10,
        log: [
          {
            t: new Date().toISOString(),
            msg: `Job ${data.run_id} dispatched. Synthesizing search vectors...`,
          },
        ],
        counts: { candidates: 0, verified: 0, qualified: 0 },
        leads: [],
        summary: null,
        airtable_url: data.airtable_url,
        error: null,
        started_at: new Date().toISOString(),
        finished_at: null,
        profile: profileToUse,
      };

      setCurrentJob(initialJobStatus);
      setScreen("processing");
      startPolling(data.run_id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Job start error";
      error("Dispatch Failed", msg);
    } finally {
      setIsStartingJob(false);
    }
  };

  const handleCancelRun = async () => {
    if (!currentJob) return;

    try {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      await fetch(`/api/jobs/${currentJob.run_id}/cancel`, {
        method: "POST",
      });

      setCurrentJob((prev) =>
        prev
          ? {
              ...prev,
              status: "cancelled",
              log: [
                ...prev.log,
                { t: new Date().toISOString(), msg: "Pipeline cancelled by operator." },
              ],
            }
          : null
      );
    } catch (err) {
      console.warn("Cancel failed:", err);
    }
  };

  const handleRetryJob = () => {
    if (confirmedProfile) {
      handleStartResearch(confirmedProfile);
    }
  };

  const handleSwitchToDemoMode = () => {
    setDemoMode(true);
    const sample = sample1Data as unknown as JobStatusResponse;
    setCurrentJob(sample);
    setScreen("results");
  };

  const handleLoadSample = (sampleNum: 1 | 2) => {
    const sample =
      sampleNum === 1
        ? (sample1Data as unknown as JobStatusResponse)
        : (sample2Data as unknown as JobStatusResponse);

    if (sample.profile) {
      setConfirmedProfile(sample.profile);
      setIntakeData({
        intake_id: `int_sample${sampleNum}`,
        session_id: sample.session_id,
        profile: sample.profile,
        assumptions: ["B2B enterprise focus", "Maharashtra regional market"],
        confidence: 0.9,
        questions: [],
      });
      setShowClarify(false);
    }
  };

  const handleNewSearch = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    setScreen("intake");
    setIntakeData(null);
    setShowClarify(false);
    setConfirmedProfile(null);
    setSelectedLead(null);
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEDEF] flex flex-col font-sans selection:bg-[#FF5E2A]/30 selection:text-white relative">
      {/* Canvas wrapper containing TopBar and main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar Navigation pinned across entire screen matching Previous IA */}
        <TopBar
          currentJob={currentJob}
          demoMode={demoMode}
          onToggleDemoMode={() => {
            setDemoMode(!demoMode);
            toast(
              `Demo Mode ${!demoMode ? "Enabled" : "Disabled"}`,
              !demoMode
                ? "Replaying verified offline run with live animations."
                : "Connecting to live webhook pipeline."
            );
          }}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
          activeScreen={screen}
          onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 flex flex-col pb-8 sm:pb-12 ${
            screen === "intake"
              ? "justify-center items-center py-4 sm:py-8"
              : "py-4 sm:py-8"
          }`}
        >
        {/* SCREEN 1 & CONFIRM SCREEN: Guided Intake & ICP Confirmation (Centered in Canvas) */}
        {screen === "intake" && (
          <div className="w-full max-w-2xl mx-auto my-auto space-y-6 animate-in fade-in duration-200">
            {/* Guided Form or Confirmed Profile Card */}
            {!confirmedProfile || showClarify ? (
              <div className="space-y-4">
                <GuidedIntakeForm
                  onSubmit={handleIntakeSubmit}
                  isLoading={intakeLoading}
                  onLoadSample={handleLoadSample}
                />
                {showClarify && intakeData && (
                  <InlineClarifyCards
                    questions={intakeData.questions}
                    assumptions={intakeData.assumptions}
                    confidence={intakeData.confidence}
                    onProceed={handleClarifyProceed}
                    onSkip={handleClarifySkip}
                  />
                )}
              </div>
            ) : (
              <ProfileCard
                profile={confirmedProfile}
                assumptions={intakeData?.assumptions || []}
                onStartResearch={handleStartResearch}
                isStarting={isStartingJob}
                onEditAgain={() => {
                  setConfirmedProfile(null);
                  setIntakeData(null);
                }}
              />
            )}
          </div>
        )}

        {/* SCREEN 2: Cinematic Processing & Shader Orb Stage */}
        {screen === "processing" && currentJob && (
          <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col items-center justify-start overflow-x-hidden animate-in fade-in duration-200">
            {/* Centered Floating WebGL Shader Orb */}
            <OrbStage
              stage={currentJob.stage}
              progress={currentJob.progress}
              reducedMotion={reducedMotion}
            />

            {/* Cinema Headline & Subtitle (Always 1 Line with Shine Revealing Effect) */}
            <div className="text-center w-full px-2 mt-2 mb-4 select-none">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EDEDEF] text-balance break-words">
                We&apos;ll get you the details soon
              </h2>
              <div className="w-full max-w-[320px] xs:max-w-sm sm:max-w-md mx-auto mt-1 px-1">
                <p
                  title={
                    currentJob.log.length > 0
                      ? currentJob.log[currentJob.log.length - 1].msg
                      : "Synthesizing search vectors and domain exclusions for target market..."
                  }
                  className="text-xs sm:text-sm font-medium truncate whitespace-nowrap overflow-hidden text-shine-reveal block"
                >
                  {currentJob.log.length > 0
                    ? currentJob.log[currentJob.log.length - 1].msg
                    : "Synthesizing search vectors and domain exclusions for target market..."}
                </p>
              </div>
            </div>

            {/* 4-Step Progress Card */}
            <div className="w-full text-left">
              <StepProgress
                job={currentJob}
                onCancel={handleCancelRun}
                onRetry={handleRetryJob}
                onSwitchToDemo={handleSwitchToDemoMode}
              />
            </div>
          </div>
        )}

        {/* SCREEN 3: Results Workspace (Header, Filter Bar, Leads Table) */}
        {screen === "results" && currentJob && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Results Header: Run pill, company title, synthesis card, 4 metric pills */}
            <ResultsHeader
              job={currentJob}
              onNewSearch={handleNewSearch}
            />

            {/* Filter Bar & Leads Table matching Previous IA */}
            <LeadsTable
              leads={currentJob.leads || []}
              onSelectLead={(lead) => setSelectedLead(lead)}
              selectedLeadId={selectedLead?.lead_id}
            />
          </div>
        )}
      </main>
      </div>

      {/* Slide-out Navigation Drawer from Left (< 768px) */}
      <MobileNavDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        demoMode={demoMode}
        onToggleDemoMode={() => {
          setDemoMode(!demoMode);
          toast(
            `Demo Mode ${!demoMode ? "Enabled" : "Disabled"}`,
            !demoMode
              ? "Replaying verified offline run with live animations."
              : "Connecting to live webhook pipeline."
          );
        }}
        currentJob={currentJob}
        onNavigateScreen={(s) => setScreen(s)}
      />

      {/* Slide-out Account Dossier Drawer mounted at page root */}
      <LeadDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}
