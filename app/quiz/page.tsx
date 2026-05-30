import QuizApp from "@/components/quiz/QuizApp";
import Link from "next/link";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(70,60,230,0.12),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f7f5ff_100%)] text-slate-950">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:px-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-soft sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Enneagram quiz</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Find your personality type with a quick, insightful test.
              </h1>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Back to home
            </Link>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            This quiz is designed to help people identify which Enneagram personality style resonates most strongly, then offer a practical growth prompt to explore next.
          </p>
        </div>
        <QuizApp />
      </main>
    </div>
  );
}
