import type { SiteLocale } from '../../i18n/locales';

const es: Record<string, string> = {};
const de: Record<string, string> = {};
const fr: Record<string, string> = {};

const byLocale: Record<Exclude<SiteLocale, 'en'>, Record<string, string>> = { es, de, fr };

export function localeMetaDescriptionOverride(slug: string, locale: SiteLocale): string | undefined {
  if (locale === 'en') return undefined;
  return byLocale[locale]?.[slug];
}
