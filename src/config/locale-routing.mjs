/** Shared locale path rules for Astro middleware and scripts/serve.mjs (English-only). */
import { resolvePathRedirect } from '../../scripts/redirects.mjs';

const LEGACY_PREFIXES = ['es', 'de', 'fr'];

/** Collapse `/en/`, `/en/about/`, and `/en/en/..` to unprefixed English. */
export function stripEnglishLocalePrefix(pathname) {
  if (!pathname.startsWith('/en')) return null;

  let path = pathname;
  while (true) {
    if (path === '/en' || path === '/en/') return '/';
    if (path.startsWith('/en/')) {
      path = path.slice('/en'.length);
      if (!path) return '/';
      continue;
    }
    return path.startsWith('/') ? path : `/${path}`;
  }
}

/** `/es/go/..` → `/go/..` */
export function stripPrefixedLocaleFromGo(pathname) {
  for (const locale of LEGACY_PREFIXES) {
    const prefix = `/${locale}/go`;
    if (pathname === prefix || pathname === `${prefix}/`) return '/go/';
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(`/${locale}`.length);
    }
  }
  return null;
}

export function isPrefixedLocale(value) {
  return LEGACY_PREFIXES.includes(value);
}

/** Reject nested locale segments such as `/es/fr/about/`. */
export function hasNestedLocalePrefix(pathname) {
  const match = pathname.match(/^\/([^/]+)\/([^/]+)(\/|$)/);
  if (!match) return false;
  const first = match[1];
  const second = match[2];
  if (first === 'en' && isPrefixedLocale(second)) return true;
  if (isPrefixedLocale(first) && second === 'en') return true;
  return isPrefixedLocale(first) && isPrefixedLocale(second);
}

/**
 * @returns {{ status: 301, location: string } | { status: 404 } | null}
 */
export function isErrorDocumentPath(pathname) {
  const bare = (pathname || '/').replace(/\/+$/, '') || '/';
  return bare === '/404' || bare === '/404.html';
}

const FORUM_FILTER_PARAMS = new Set(['category', 'sort', 'page']);

function isForumIndexPath(pathname) {
  const bare = (pathname || '/').replace(/\/+$/, '') || '/';
  return bare === '/forum';
}

/**
 * Filtered forum URLs (`?category=`, `?sort=`, `?page=`) 301 to the listing page.
 */
export function resolveForumQueryRedirect(pathname, query = '') {
  if (!query || !isForumIndexPath(pathname)) return null;
  const raw = query.startsWith('?') ? query.slice(1) : query;
  if (!raw) return null;

  const params = new URLSearchParams(raw);
  let changed = false;
  for (const key of [...params.keys()]) {
    if (FORUM_FILTER_PARAMS.has(key.toLowerCase())) {
      params.delete(key);
      changed = true;
    }
  }
  if (!changed) return null;

  const slashPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const remaining = params.toString();
  return remaining ? `${slashPath}?${remaining}` : slashPath;
}

function stripLegacyLocalePrefix(pathname) {
  for (const locale of LEGACY_PREFIXES) {
    if (pathname === `/${locale}` || pathname === `/${locale}/`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(`/${locale}`.length) || '/';
  }
  return null;
}

/**
 * Single-hop locale strip + forum query cleanup (avoids `/es/forum/?category=` → `/forum/?category=` → `/forum/`).
 * @returns {{ status: 301, location: string } | { status: 404 } | null}
 */
export function resolveLocaleForumRedirect(pathname, query = '') {
  const localeRoute = resolveLocaleRoutingRedirect(pathname);
  if (localeRoute?.status === 404) return localeRoute;

  const pathAfterLocale = localeRoute?.status === 301 ? localeRoute.location : pathname;
  const forumQuery = resolveForumQueryRedirect(pathAfterLocale, query);
  if (forumQuery) return { status: 301, location: forumQuery };
  if (localeRoute?.status === 301) return localeRoute;
  return null;
}

export function resolveLocaleRoutingRedirect(pathname) {
  const englishFromPrefixed = stripLegacyLocalePrefix(pathname);
  if (englishFromPrefixed !== null) {
    const settled = resolvePathRedirect(englishFromPrefixed) || englishFromPrefixed;
    if (settled !== pathname) return { status: 301, location: settled };
  }

  const unprefixedGo = stripPrefixedLocaleFromGo(pathname);
  if (unprefixedGo) {
    return { status: 301, location: unprefixedGo };
  }

  const englishCanonical = stripEnglishLocalePrefix(pathname);
  if (englishCanonical !== null) {
    const settled = resolvePathRedirect(englishCanonical) || englishCanonical;
    if (settled !== pathname) return { status: 301, location: settled };
  }

  if (hasNestedLocalePrefix(pathname)) {
    return { status: 404 };
  }

  return null;
}
