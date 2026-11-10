import type { Translations } from './types';
import { DEFAULT_LOCALE, type SiteLocale } from './locales';
import { localizePath } from './paths';
import { finalizeLocaleDictionary } from './brandTokens';
import { en } from './en';

const dictionary: Translations = finalizeLocaleDictionary(en);

export function getTranslations(_locale?: string): Translations {
  return dictionary;
}

/** Locale + dictionary + path localizer for Astro frontmatter. */
export function useLocale(_currentLocale?: string) {
  const locale = DEFAULT_LOCALE as SiteLocale;
  const t = getTranslations(locale);
  const lp = (path: string) => localizePath(path, locale);
  return { locale, t, lp };
}

export type { Translations } from './types';
export type { NavId, NavLink } from './types';
export { LOCALES, DEFAULT_LOCALE, type SiteLocale } from './locales';
export { localizePath, stripLocalePrefix, getLocalizedPath, localeFromPathname } from './paths';
export { isPrefixedLocale } from './locales';
