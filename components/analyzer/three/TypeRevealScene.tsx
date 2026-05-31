"use client";

import { Canvas } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { typeColors, type EnneagramTypeId } from "@/data/enneagram-system";
import { EnneagramBoard3D } from "@/components/analyzer/three/EnneagramBoard3D";
import { TypeAvatar3D } from "@/components/analyzer/three/TypeAvatar3D";
import { useSound } from "@/components/analyzer/SoundProvider";
import TypeGlyph from "@/components/analyzer/icons/TypeGlyph";

function AvatarCanvas({ type }: { type: EnneagramTypeId }) {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance", alpha: true }} camera={{ position: [0, 0, 4.6], fov: 42 }}>
      <ambientLight intensity={0.9} />
      <pointLight position={[2, 3, 4]} intensity={1.35} />
      <TypeAvatar3D type={type} />
    </Canvas>
  );
}

export function TypeRevealScene({ type }: { type: EnneagramTypeId }) {
  const reducedMotion = useReducedMotion();
  const { play } = useSound();
  const color = typeColors[type]?.primary ?? "#818CF8";

  useEffect(() => {
    play("reveal");
    if (!reducedMotion) {
      const timeout = window.setTimeout(() => {
        void confetti({ particleCount: 80, spread: 60, origin: { y: 0.3 }, colors: [color, "#818cf8", "#ffffff"] });
      }, 420);
      return () => window.clearTimeout(timeout);
    }
  }, [color, play, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="flex h-[260px] flex-col items-center justify-center rounded-[2rem] bg-slate-950 text-white">
        <TypeGlyph type={type} className="h-20 w-20" active />
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Your orbit is revealed</p>
      </div>
    );
  }

  return (
    <div className="relative h-[360px] overflow-hidden rounded-[2rem] bg-slate-950 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
        animate={{ opacity: 0.5, scale: 1.08, rotate: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <EnneagramBoard3D primaryType={type} activeTypes={[type]} className="h-full w-full" />
      </motion.div>
      <motion.div
        initial={{ y: 90, opacity: 0, scale: 0.7 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.55, duration: 0.8, type: "spring", bounce: 0.35 }}
        className="absolute inset-x-0 bottom-8 mx-auto h-48 w-48"
      >
        <AvatarCanvas type={type} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.45 }}
        className="absolute inset-x-0 top-8 text-center"
      >
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Chronos signal locked</p>
      </motion.div>
    </div>
  );
}

export default TypeRevealScene;
