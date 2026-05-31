"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

const LOCALES = ["en", "pt"] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "pt";
}

function getLocalizedPath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/");
  const currentLocale = segments[1];

  if (isLocale(currentLocale)) {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }

  return `/${nextLocale}${pathname === "/" ? "" : pathname}`;
}

export default function LanguageSelector() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <nav aria-label="Language selector" className="flex items-center gap-2">
      {LOCALES.map((nextLocale) => {
        const isActive = locale === nextLocale;

        return (
          <Link
            key={nextLocale}
            href={getLocalizedPath(pathname, nextLocale)}
            hrefLang={nextLocale}
            aria-current={isActive ? "true" : undefined}
            className={[
              "rounded-md px-3 py-1 text-sm font-semibold uppercase transition-colors",
              isActive
                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                : "bg-slate-200 text-slate-800 hover:bg-slate-300",
            ].join(" ")}
          >
            {nextLocale}
          </Link>
        );
      })}
    </nav>
  );
}
