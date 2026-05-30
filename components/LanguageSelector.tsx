// saturno/components/LanguageSelector.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    // This regex replaces the current locale in the path with the new one.
    // e.g., /en/about -> /pt/about
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 text-sm rounded-md ${locale === 'en' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800'}`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('pt')}
        className={`px-3 py-1 text-sm rounded-md ${locale === 'pt' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800'}`}
      >
        PT
      </button>
    </div>
  );
}
