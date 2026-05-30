"use client";

import { motion } from "framer-motion";
import { typeColors, type EnneagramTypeId } from "@/data/enneagram-system";

const glyphPaths: Record<EnneagramTypeId, string> = {
  one: "M12 3 L12 21 M8 7 L12 3 L16 7",
  two: "M7 8 C7 4 17 4 17 9 C17 14 8 15 7 21 L18 21",
  three: "M7 5 H17 L12 11 C17 11 18 19 11 20 C8 20 6 18 6 18",
  four: "M16 21 V3 L5 15 H19",
  five: "M17 4 H7 L6 11 C14 9 19 12 18 17 C17 22 9 22 6 18",
  six: "M17 5 C9 4 6 10 7 16 C8 22 18 21 18 15 C18 10 10 10 7 15",
  seven: "M6 4 H18 L10 21",
  eight: "M12 12 C6 10 7 4 12 4 C17 4 18 10 12 12 C18 14 17 20 12 20 C7 20 6 14 12 12 Z",
  nine: "M17 9 C16 15 8 14 7 9 C6 4 16 3 17 9 Z M7 19 C15 20 18 14 17 8",
};

export default function TypeGlyph({ type, className = "h-8 w-8", active = false }: { type: EnneagramTypeId; className?: string; active?: boolean }) {
  const color = typeColors[type]?.primary ?? "#818CF8";

  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      initial={false}
      animate={{ scale: active ? [1, 1.12, 1] : 1, rotate: active ? [0, 3, -3, 0] : 0 }}
      transition={{ duration: 1.4, repeat: active ? Infinity : 0, repeatDelay: 1.2 }}
    >
      <motion.path
        d={glyphPaths[type]}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeOpacity="0.18"
        strokeWidth="1"
        initial={{ opacity: 0.25 }}
        animate={{ opacity: active ? [0.2, 0.55, 0.2] : 0.25 }}
        transition={{ duration: 1.6, repeat: active ? Infinity : 0 }}
      />
    </motion.svg>
  );
}
