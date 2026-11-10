import type { LinkItem } from '@astrojs/sitemap';
import { stripLocalePrefix } from '../i18n/paths';
import { canonicalUrl } from './seo';

export type HreflangAlternate = { hreflang: string; href: string };

/** English page must list itself. `en` and `x-default` both use that exact URL. */
export function hreflangAlternatesForUrl(href: string): HreflangAlternate[] {
  return [
    { hreflang: 'en', href },
    { hreflang: 'x-default', href },
  ];
}

/** English-only: single canonical alternate per path. */
export function hreflangAlternatesForPath(pathname: string): HreflangAlternate[] {
  return hreflangAlternatesForUrl(canonicalUrl(stripLocalePrefix(pathname)));
}

/** Sitemap `xhtml:link` alternates for the same pathname cluster. */
export function sitemapAlternateLinks(pathname: string): LinkItem[] {
  return hreflangAlternatesForPath(pathname).map(({ hreflang, href }) => ({
    lang: hreflang,
    url: href,
  }));
}

export function isIndexablePath(pathname: string): boolean {
  let path = pathname || '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path !== '/' && !path.endsWith('/')) path = `${path}/`;

  if (path.includes('/404') || path.startsWith('/go/') || path.includes('/rss.xml')) {
    return false;
  }
  if (path === '/en/' || path.startsWith('/en/')) return false;
  if (/^\/(es|de|fr)(\/|$)/.test(path)) return false;

  return true;
}
