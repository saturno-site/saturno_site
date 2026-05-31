"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { enneagramTypesFull } from "@/data/enneagram-system";
import type { EnneagramTypeFull } from "@/data/enneagram-system";
import { TypeCharacter } from "@/components/characters";
import { TypeBadge } from "@/components/icons";
import { staggerContainer, staggerItem, springTransition } from "@/lib/animations";

type TriadFilter = "all" | "body" | "heart" | "head";

function triadLabel(triad: string): string {
  switch (triad) {
    case "body":
      return "Body";
    case "heart":
      return "Heart";
    case "head":
      return "Head";
    default:
      return "";
  }
}

const FILTERS: { key: TriadFilter; label: string }[] = [
  { key: "all", label: "All Types" },
  { key: "body", label: "Body" },
  { key: "heart", label: "Heart" },
  { key: "head", label: "Head" },
];

export default function CharacterGallery() {
  const [filter, setFilter] = useState<TriadFilter>("all");
  const [selected, setSelected] = useState<EnneagramTypeFull | null>(null);

  const filteredTypes = useMemo(() => {
    if (filter === "all") return enneagramTypesFull;
    return enneagramTypesFull.filter((t) => t.triad === filter);
  }, [filter]);

  return (
    <>
      {/* ── Filter pills ─────────────────────────────────────── */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-saturno-500 text-white shadow-lg shadow-saturno-500/30"
                : "border border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Character grid ───────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        layout
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredTypes.map((type) => (
            <motion.div
              key={type.id}
              variants={staggerItem}
              layout
              className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.08]"
              onClick={() => setSelected(type)}
            >
              {/* Character */}
              <div className="mb-4 flex justify-center">
                <div className="h-32 w-32">
                  <TypeCharacter typeId={type.id} animation="idle" />
                </div>
              </div>

              {/* Badge + Name */}
              <div className="mb-3 flex items-center gap-3">
                <TypeBadge typeId={type.id} size="md" variant="filled" />
                <div>
                  <h3 className="text-lg font-semibold">{type.name}</h3>
                  <p className="text-sm text-white/50">{type.headline}</p>
                </div>
              </div>

              {/* Archetype */}
              <p className="mb-2 text-sm text-saturno-300">{type.archetype}</p>

              {/* Summary */}
              <p className="text-sm leading-relaxed text-white/60">
                {type.summary.length > 100
                  ? type.summary.slice(0, 100) + "..."
                  : type.summary}
              </p>

              {/* Triad badge */}
              <div className="mt-4">
                <span className="inline-block rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
                  {triadLabel(type.triad)} Triad
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── Detail Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelected(null)}
            />

            {/* Modal card */}
            <motion.div
              key="modal-card"
              className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0f0720] p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={springTransition}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="grid gap-8 md:grid-cols-2">
                {/* Left: Character */}
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 h-48 w-48">
                    <TypeCharacter typeId={selected.id} animation="idle" />
                  </div>
                  <div className="flex gap-2">
                    <TypeBadge typeId={selected.id} size="lg" variant="filled" />
                  </div>
                </div>

                {/* Right: Details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold">{selected.name}</h2>
                    <p className="text-lg text-saturno-300">{selected.headline}</p>
                    <p className="text-sm text-white/40">{selected.archetype}</p>
                  </div>

                  {/* Core stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-white/40">Core Fear</p>
                      <p className="mt-1 text-sm font-medium">{selected.coreFear}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-white/40">Core Desire</p>
                      <p className="mt-1 text-sm font-medium">{selected.coreDesire}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-white/40">Weakness</p>
                      <p className="mt-1 text-sm font-medium">{selected.coreWeakness}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-white/40">Virtue</p>
                      <p className="mt-1 text-sm font-medium">{selected.virtue}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-white/70">
                    {selected.description}
                  </p>

                  {/* CTA */}
                  <Link
                    href="/quiz"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saturno-500 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    Discover your type →
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
