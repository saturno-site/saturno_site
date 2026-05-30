"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/components/analyzer/SoundProvider";

export default function SoundToggle() {
  const { muted, toggleMuted, play } = useSound();
  const Icon = muted ? VolumeX : Volume2;

  return (
    <motion.button
      type="button"
      aria-label={muted ? "Enable analyzer sound" : "Mute analyzer sound"}
      aria-pressed={!muted}
      onClick={() => {
        toggleMuted();
        if (muted) setTimeout(() => play("select"), 0);
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed right-4 top-4 z-30 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-200 shadow-lg backdrop-blur transition hover:border-indigo-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {muted ? "Sound off" : "Sound on"}
    </motion.button>
  );
}
