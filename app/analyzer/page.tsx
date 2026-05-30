"use client";

import React, { useEffect, useState } from "react";
import OrbitQuiz from "@/components/analyzer/OrbitQuiz";
import AiChatSession from "@/components/analyzer/AiChatSession";
import ChronosReport from "@/components/analyzer/ChronosReport";
import SoundToggle from "@/components/analyzer/SoundToggle";
import { SoundProvider, useSound } from "@/components/analyzer/SoundProvider";
import { LazyEnneagramBoard3D } from "@/components/analyzer/three/Lazy3D";
import { type QuizResult } from "@/lib/scoring-engine";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type Act = "orbit" | "deep-dive" | "chronos";
type ChatPart = { text: string };
type ChatHistoryItem = { role: string; parts: ChatPart[] };

function AnalyzerExperience() {
  const [currentAct, setCurrentAct] = useState<Act>("orbit");
  const [quizData, setQuizData] = useState<QuizResult | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const { play } = useSound();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (currentAct !== "orbit") play("actTransition");
  }, [currentAct, play]);

  function handleQuizComplete(result: QuizResult) {
    setQuizData(result);
    setCurrentAct("deep-dive");
  }

  function handleChatComplete(history: ChatHistoryItem[]) {
    setChatHistory(history);
    setCurrentAct("chronos");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8">
      <SoundToggle />
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(2,6,23,1)_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        {!reducedMotion && (
          <div className="absolute inset-0 opacity-30">
            <LazyEnneagramBoard3D
              ambient
              primaryType={quizData?.primary.typeId}
              activeTypes={quizData ? [quizData.primary.typeId, quizData.secondary.typeId] : []}
              className="h-full w-full"
            />
          </div>
        )}
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          {currentAct === "orbit" && (
            <motion.div
              key="orbit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex justify-center"
            >
              <OrbitQuiz onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {currentAct === "deep-dive" && quizData && (
            <motion.div
              key="deep-dive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex justify-center"
            >
              <AiChatSession quizData={quizData} onComplete={handleChatComplete} />
            </motion.div>
          )}

          {currentAct === "chronos" && (
            <motion.div
              key="chronos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex justify-center"
            >
              <ChronosReport history={chatHistory} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Branding Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-slate-600">
            Saturno Brand Experience &copy; 2026
          </p>
        </footer>
      </div>
    </main>
  );
}

export default function AnalyzerPage() {
  return (
    <SoundProvider>
      <AnalyzerExperience />
    </SoundProvider>
  );
}
