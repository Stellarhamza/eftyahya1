/** English-only site; Astro i18n uses a single locale. */
export const DEFAULT_LOCALE = 'en' as const;

export const LOCALES = ['en'] as const;

export type SiteLocale = (typeof LOCALES)[number];

export const PREFIXED_LOCALES = [] as const;

export type PrefixedLocale = never;

export function isSiteLocale(value: string): value is SiteLocale {
  return value === DEFAULT_LOCALE;
}

export function isPrefixedLocale(_value: string): _value is PrefixedLocale {
  return false;
}
