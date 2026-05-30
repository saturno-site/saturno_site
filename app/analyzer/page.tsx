"use client";

import React, { useState } from "react";
import OrbitQuiz from "@/components/analyzer/OrbitQuiz";
import AiChatSession from "@/components/analyzer/AiChatSession";
import ChronosReport from "@/components/analyzer/ChronosReport";
import { type QuizResult } from "@/lib/scoring-engine";
import { motion, AnimatePresence } from "framer-motion";

type Act = "orbit" | "deep-dive" | "chronos";

export default function AnalyzerPage() {
  const [currentAct, setCurrentAct] = useState<Act>("orbit");
  const [quizData, setQuizData] = useState<QuizResult | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  function handleQuizComplete(result: QuizResult) {
    setQuizData(result);
    setCurrentAct("deep-dive");
  }


  function handleChatComplete(history: any[]) {
    setChatHistory(history);
    setCurrentAct("chronos");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(2,6,23,1)_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
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
