import {getRequestConfig} from 'next-intl/server';

type Locale = 'en' | 'pt';

function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'pt';
}

export default getRequestConfig(async ({locale, requestLocale}) => {
  const requested = locale ?? await requestLocale;
  const safeLocale: Locale = isLocale(requested) ? requested : 'en';

  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default
  };
});
