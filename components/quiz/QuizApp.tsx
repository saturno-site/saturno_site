"use client";

import { useMemo, useState } from "react";
import { quizQuestions } from "@/data/enneagram";
import { getTypeDetails, scoreQuiz } from "@/lib/enneagram";

const buttonStyle =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saturno-500";

export default function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];

  const result = useMemo(() => {
    if (!submitted) {
      return null;
    }
    const score = scoreQuiz(answers);
    return getTypeDetails(score.selectedType);
  }, [answers, submitted]);

  function handleSelect(answerId: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerId }));
  }

  function handleNext() {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }
    setSubmitted(true);
  }

  function handleBack() {
    if (currentIndex === 0) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
  }

  function handleReset() {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
  }

  return (
    <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Enneagram quiz</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Discover the core pattern that shapes how you show up.
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Answer a few thoughtful prompts and get a personality result with practical growth guidance.
        </p>
      </div>

      {submitted && result ? (
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-saturno-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-saturno-800">
              {result.name}
            </span>
            <h3 className="text-2xl font-semibold text-slate-950">{result.headline}</h3>
            <p className="text-sm leading-7 text-slate-600">{result.summary}</p>
          </div>
          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg shadow-slate-900/10">
            <h4 className="text-lg font-semibold">Growth prompt</h4>
            <p className="mt-3 text-sm leading-7 text-slate-200">{result.growthTip}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={`${buttonStyle} bg-slate-950 text-white hover:bg-slate-800`} onClick={handleReset}>
              Retake quiz
            </button>
            <a href="#" className={`${buttonStyle} border border-slate-200 text-slate-950 hover:bg-slate-100`}>
              Explore your type
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-slate-50 p-6">
            <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
              <span>{currentIndex + 1}/{quizQuestions.length} questions</span>
              <span>Pick the answer that feels most like you.</span>
            </div>
          </div>

          <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              {currentQuestion.prompt}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {currentQuestion.answers.map((answer) => {
                const selected = answers[currentQuestion.id] === answer.id;
                return (
                  <button
                    key={answer.id}
                    type="button"
                    onClick={() => handleSelect(answer.id)}
                    className={`rounded-3xl border p-5 text-left transition ${
                      selected
                        ? "border-saturno-500 bg-saturno-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-slate-950">{answer.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="inline-flex items-center justify-center rounded-full bg-saturno-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-saturno-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {currentIndex < quizQuestions.length - 1 ? "Next question" : "See result"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
