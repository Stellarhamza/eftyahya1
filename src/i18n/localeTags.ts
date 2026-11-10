import type { SiteLocale } from './locales';

/** BCP 47 tags for HTML `lang`, Open Graph, and JSON-LD `inLanguage`. */
export const LOCALE_LANGUAGE_TAGS: Record<SiteLocale, string> = {
  en: 'en-US',
};

export function schemaLanguage(_locale?: SiteLocale | string): string {
  return LOCALE_LANGUAGE_TAGS.en;
}
