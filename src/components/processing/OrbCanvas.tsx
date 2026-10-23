"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { JobStage } from "@/types";

interface SphereMeshProps {
  stage: JobStage;
  progress: number;
}

// Halo Particle Ring orbiting the sphere in vibrant fiery orange
function HaloParticles({ stage }: { stage: JobStage }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 140;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorIris = new THREE.Color("#FF5E2A");
    const colorHighlight = new THREE.Color("#FFA040");

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.4 + (Math.random() - 0.5) * 0.4;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const mixed = colorIris.clone().lerp(colorHighlight, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.25;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AnimatedSphere({ stage, progress }: SphereMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);

  // Determine distortion and speed according to pipeline stage with vibrant orange colors
  let speed = 1.6;
  let distort = 0.38;
  let color = "#FF5E2A";

  if (stage === "intake" || stage === "kb") {
    speed = 1.5;
    distort = 0.35;
    color = "#FF5E2A";
  } else if (stage === "research" || stage === "extraction") {
    speed = 2.5;
    distort = 0.48;
    color = "#FF4500";
  } else if (stage === "qualification") {
    speed = 3.2;
    distort = 0.56;
    color = "#FF3300";
  } else if (stage === "buyer" || stage === "angle") {
    speed = 3.8;
    distort = 0.64;
    color = "#FF6633";
  } else if (stage === "done") {
    speed = 1.0;
    distort = 0.22;
    color = "#10B981"; // Emerald on completion
  }

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort,
        distort,
        0.05
      );
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.7}>
      <mesh ref={meshRef} scale={1.85}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          ref={materialRef}
          color={color}
          attach="material"
          distort={distort}
          speed={speed}
          roughness={0.15}
          metalness={0.75}
          clearcoat={1.0}
          clearcoatRoughness={0.12}
        />
      </mesh>
      <HaloParticles stage={stage} />
    </Float>
  );
}

export default function OrbCanvas({ stage, progress }: SphereMeshProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.8} color="#FFFFFF" />
        <pointLight position={[-4, -4, -2]} intensity={2.5} color="#FF4500" />
        <pointLight position={[3, -2, 2]} intensity={1.8} color="#FF7744" />
        <AnimatedSphere stage={stage} progress={progress} />
      </Canvas>
    </div>
  );
}
