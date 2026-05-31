// saturno/components/LanguageSelector.tsx
'use client';

import { Link, usePathname } from 'next-intl/link';
import { useLocale } from 'next-intl';
import clsx from 'clsx';

export default function LanguageSelector() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="flex items-center gap-2">
      <Link
        href={pathname}
        locale="en"
        className={clsx(
          'px-3 py-1 text-sm rounded-md transition-colors',
          locale === 'en' 
            ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
            : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
        )}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="pt"
        className={clsx(
          'px-3 py-1 text-sm rounded-md transition-colors',
          locale === 'pt' 
            ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
            : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
        )}
      >
        PT
      </Link>
    </div>
  );
}
