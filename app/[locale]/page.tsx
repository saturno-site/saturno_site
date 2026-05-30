import Link from "next/link";
import { useTranslations } from "next-intl";

import LanguageSelector from "@/components/LanguageSelector";

const features = [
  {
    title: "Animated cosmic quiz experience",
    description:
      "A playful personality test experience with concise insights and growth prompts.",
  },
  {
    title: "Deep Enneagram insights with triads, wings & growth paths",
    description:
      "Responsive cards, motion-ready layout, and brand-friendly contrast for every screen.",
  },
  {
    title: "Moment-of-truth reveal with particle celebration",
    description:
      "Clear content, reusable quiz components, and production-ready automation for every release.",
  },
];

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(70,60,230,0.12),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f9f8ff_100%)] text-slate-950">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-10 lg:px-12">
        <header className="flex flex-col gap-8 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft shadow-slate-900/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Saturno</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {t("welcome")}
            </h1>
            <p className="text-lg leading-8 text-slate-600 sm:text-xl">
              Build trust, collect insights, and help visitors discover their personality type with a playful test and modern storytelling.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <LanguageSelector />
            <Link
              href="/analyzer"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
            >
              Start AI Analyzer
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              Quick Test
            </Link>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-950">{feature.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 rounded-[2rem] bg-slate-950 px-8 py-12 text-white shadow-2xl shadow-slate-900/20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Next-level personality testing</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Modern, engaging, and designed to make personality discovery feel effortless.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              From the first question to the final result, the quiz experience is crafted to feel playful, trustworthy, and easy to complete.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">Animated cosmic quiz experience</span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">Deep Enneagram insights with triads, wings & growth paths</span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">Moment-of-truth reveal with particle celebration</span>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-8 text-slate-950 shadow-xl shadow-slate-200/70">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Live product preview</p>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold">Quiz intro</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  A fast personality test that encourages curiosity and invites users to learn more about their Enneagram type.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Result highlights</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Personalized growth prompts, type strengths, and next-step suggestions for meaningful engagement.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Deployment-ready</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Includes automated build, lint, test, and Vercel production deployment workflows.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
