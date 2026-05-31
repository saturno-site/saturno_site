import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSelector from "@/components/LanguageSelector";

const FEATURES = ["cosmic", "insights", "reveal"] as const;
const PREVIEW_SECTIONS = ["intro", "highlights", "deploy"] as const;

export default function Home() {
  const t = useTranslations("HomePage");
  const ctaTags = t.raw("cta.tags") as string[];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(70,60,230,0.12),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f9f8ff_100%)] text-slate-950">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-10 lg:px-12">
        <header className="flex flex-col gap-8 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft shadow-slate-900/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <Image
              src="/images/owner-logo.png"
              alt={t("header.ownerAltText")}
              width={80}
              height={80}
              priority
              sizes="80px"
              className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-lg"
            />
            <div className="max-w-xl space-y-3 text-center sm:text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{t("header.superTitle")}</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {t("welcome")}
              </h1>
              <p className="text-lg leading-8 text-slate-600 sm:text-xl">
                {t("header.description")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <LanguageSelector />
            <Link
              href="/analyzer"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
            >
              {t("header.analyzerButton")}
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              {t("header.quizButton")}
            </Link>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-950">{t(`features.${feature}.title`)}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{t(`features.${feature}.description`)}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 rounded-[2rem] bg-slate-950 px-8 py-12 text-white shadow-2xl shadow-slate-900/20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{t("cta.superTitle")}</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              {t("cta.description")}
            </p>
            <div className="flex flex-wrap gap-4">
              {ctaTags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">{tag}</span>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-8 text-slate-950 shadow-xl shadow-slate-200/70">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{t("preview.superTitle")}</p>
            <div className="mt-6 space-y-6">
              {PREVIEW_SECTIONS.map((section) => (
                <div key={section}>
                  <h3 className="text-xl font-semibold">{t(`preview.sections.${section}.title`)}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {t(`preview.sections.${section}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
