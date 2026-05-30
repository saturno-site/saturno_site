"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions } from "@/data/enneagram";
import { scoreQuiz, type QuizScore } from "@/lib/enneagram";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface OrbitQuizProps {
  onComplete: (score: QuizScore) => void;
}

export default function OrbitQuiz({ onComplete }: OrbitQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [direction, setDirection] = useState(0); // For slide animations

  const currentQuestion = quizQuestions[currentIndex];

  const progress = ((currentIndex + 1) / quizQuestions.length) * 100;

  function handleSelect(answerId: string) {
    const newAnswers = { ...answers, [currentQuestion.id]: answerId };
    setAnswers(newAnswers);
    
    // Auto-advance after a brief delay for better flow
    setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        setDirection(1);
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete(scoreQuiz(newAnswers));
      }
    }, 300);
  }

  function handleBack() {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3, ease: "easeIn" },
    }),
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-3xl overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl shadow-indigo-500/10">
      {/* Starfield Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-indigo-500/10 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
              Act I: The Orbit
            </span>
          </div>
          <div className="text-xs font-mono text-indigo-300">
            {Math.round(progress)}% ALIGNED
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Question Area */}
        <div className="flex-grow">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-8"
            >
              <h2 className="text-2xl font-light leading-snug sm:text-3xl">
                {currentQuestion.prompt}
              </h2>

              <div className="grid gap-4 sm:grid-cols-1">
                {currentQuestion.answers.map((answer) => {
                  const isSelected = answers[currentQuestion.id] === answer.id;
                  return (
                    <button
                      key={answer.id}
                      onClick={() => handleSelect(answer.id)}
                      className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800"
                      }`}
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-lg font-light text-slate-200 group-hover:text-white">
                          {answer.label}
                        </span>
                        {isSelected && (
                          <motion.div
                            layoutId="check"
                            className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          
          <div className="text-xs text-slate-500">
            {currentIndex + 1} of {quizQuestions.length}
          </div>
        </div>
      </div>
    </div>
  );
}
