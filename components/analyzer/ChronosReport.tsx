"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Lightbulb, RefreshCcw, Share2 } from "lucide-react";
import { LazyTypeRevealScene } from "@/components/analyzer/three/Lazy3D";
import AnimatedIcon from "@/components/analyzer/icons/AnimatedIcon";
import TypeGlyph from "@/components/analyzer/icons/TypeGlyph";
import { useSound } from "@/components/analyzer/SoundProvider";
import type { EnneagramTypeId } from "@/data/enneagram-system";

interface ChronosReportProps {
  history: ChatHistoryItem[];
}

type ChatPart = { text: string };
type ChatHistoryItem = { role: string; parts: ChatPart[] };

type ReportFigure = { name: string; reason: string };
type ChronosReportData = {
  type: string | number;
  wing?: string | number;
  summary: string;
  historicalFigures?: ReportFigure[];
  growthPrompt: string;
  error?: string;
};

const numberToType: Record<string, EnneagramTypeId> = {
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
};

function normalizeTypeId(value: string | number | undefined): EnneagramTypeId {
  const raw = String(value ?? "").toLowerCase();
  const digit = raw.match(/[1-9]/)?.[0];
  if (digit) return numberToType[digit];
  const word = (["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"] as EnneagramTypeId[]).find((type) => raw.includes(type));
  return word ?? "nine";
}

export default function ChronosReport({ history }: ChronosReportProps) {
  const [report, setReport] = useState<ChronosReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { play } = useSound();

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch("/api/analyzer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "report", history }),
        });
        const data = await res.json();
        setReport(data.report);
      } catch (error) {
        console.error("Failed to generate report", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReport();
  }, [history]);

  async function handleShare() {
    if (!report) return;
    play("select");
    const text = `My Saturno Chronos Report: Type ${report.type}${report.wing ? `w${report.wing}` : ""}. ${report.summary}`;
    if (navigator.share) {
      await navigator.share({ title: "Saturno Chronos Report", text }).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(text).catch(() => undefined);
  }

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full max-w-3xl flex-col items-center justify-center rounded-[2.5rem] bg-slate-950 text-white border border-slate-800">
        <div className="relative h-24 w-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-b-2 border-t-2 border-indigo-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatedIcon icon={History} className="h-8 w-8 text-indigo-400" spin />
          </div>
        </div>
        <p className="mt-8 text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
          Synthesizing your profile...
        </p>
      </div>
    );
  }

  if (!report || report.error) {
    return (
      <div className="p-8 text-center text-white">
        <p>There was an error generating your report. Please try again.</p>
        <button onClick={() => window.location.reload()} className="mt-4 flex items-center gap-2 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
          <AnimatedIcon icon={RefreshCcw} className="h-4 w-4" /> Restart
        </button>
      </div>
    );
  }

  const typeId = normalizeTypeId(report.type);
  const figures = report.historicalFigures ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl space-y-8 rounded-[2.5rem] bg-white p-6 text-slate-950 shadow-2xl sm:p-10"
    >
      <LazyTypeRevealScene type={typeId} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="text-center space-y-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-950">
          <TypeGlyph type={typeId} className="h-8 w-8" active />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-slate-500">The Chronos Report</h2>
        <h3 className="text-5xl font-light tracking-tight">
          {report.type} {report.wing ? <><span className="text-slate-400">w</span>{report.wing}</> : null}
        </h3>
      </motion.div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-3xl bg-slate-50 p-8 border border-slate-100 italic text-lg leading-relaxed text-slate-700 text-center">
        &ldquo;{report.summary}&rdquo;
      </motion.div>

      {/* Historical Figures */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <AnimatedIcon icon={History} className="h-5 w-5 text-slate-400" />
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Historical Peers</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {figures.map((figure, i) => (
            <motion.div
              key={`${figure.name}-${i}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              whileHover={{ y: -5 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h5 className="font-semibold text-slate-950">{figure.name}</h5>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{figure.reason}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Growth Prompt */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="rounded-3xl bg-slate-950 p-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <AnimatedIcon icon={Lightbulb} className="h-5 w-5 text-indigo-400" />
          <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Saturno Growth Prompt</h4>
        </div>
        <p className="text-lg font-light leading-relaxed text-slate-200">
          {report.growthPrompt}
        </p>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 rounded-full bg-slate-950 py-4 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
          <AnimatedIcon icon={Share2} className="h-4 w-4" /> Share Experience
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="flex-1 flex items-center justify-center gap-2 rounded-full border border-slate-200 py-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <AnimatedIcon icon={RefreshCcw} className="h-4 w-4" /> Take Again
        </button>
      </div>
    </motion.div>
  );
}
