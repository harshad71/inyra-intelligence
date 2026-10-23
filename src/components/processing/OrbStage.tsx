"use client";

import React, { useRef, useEffect } from "react";
import { JobStage } from "@/types";

interface OrbStageProps {
  stage?: JobStage;
  progress?: number;
  reducedMotion?: boolean;
}

export function OrbStage({ stage, progress, reducedMotion = false }: OrbStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (reducedMotion) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Autoplay handled safely by browser policy
        });
      }
    }
  }, [reducedMotion]);

  return (
    <div className="relative w-full h-44 sm:h-52 flex items-center justify-center my-2 select-none">
      {reducedMotion ? (
        /* Lightweight animated CSS radial-blur fallback */
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#FF4500] via-[#FF5E2A] to-[#FFA040] blur-xl opacity-80 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-[#121316] border border-[#FF5E2A]/40 flex items-center justify-center shadow-[inset_0_0_30px_rgba(255,94,42,0.4)]">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FF5E2A] animate-ping" />
          </div>
        </div>
      ) : (
        /* High-Definition Orb Video: Seamlessly merged into dark canvas */
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
          <video
            ref={videoRef}
            src="/orb.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain mix-blend-screen pointer-events-none"
            aria-label="Lead generation intelligence engine processing"
          />
        </div>
      )}
    </div>
  );
}
