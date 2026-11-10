/**
 * One 301 from http, www, and legacy hosts onto https://SITE_DOMAIN
 * and the final path (slash, case, and path redirects included).
 */
import { SITE_DOMAIN } from '../src/config/site-url.mjs';
import { resolveLocaleForumRedirect } from '../src/config/locale-routing.mjs';
import { isLocalPreviewHost, parseHostname } from './local-preview-host.mjs';
import { resolvePathRedirect } from './redirects.mjs';

export function requestPublicHost(url, headerHost = '') {
  const urlHost = parseHostname(url.hostname);
  const hinted = parseHostname(headerHost);
  if (isLocalPreviewHost(urlHost) && hinted && !isLocalPreviewHost(hinted)) return hinted;
  return urlHost || hinted;
}

function finalizePath(pathname) {
  let path = pathname || '/';
  if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length) || '/';
  if (!path.includes('%')) path = path.toLowerCase();
  const redirected = resolvePathRedirect(path);
  if (redirected && redirected !== path) path = redirected;
  if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length) || '/';
  return path;
}

/** Locale, forum-query, slash, and legacy path rules in one pass. */
export function settleRequestPath(pathname, query = '') {
  const searchIn = query.startsWith('?') || query === '' ? query : `?${query}`;
  const localeForum = resolveLocaleForumRedirect(pathname, searchIn);
  if (localeForum?.status === 404) return { status: 404 };

  let path = pathname || '/';
  let search = searchIn;
  if (localeForum?.status === 301) {
    if (localeForum.location.includes('?')) {
      const [nextPath, nextQuery = ''] = localeForum.location.split('?');
      path = nextPath || '/';
      search = nextQuery ? `?${nextQuery}` : '';
    } else {
      path = localeForum.location || '/';
    }
  }

  return { pathname: finalizePath(path), search };
}

/**
 * @returns {{ status: 301, location: string } | { status: 404 } | null}
 * null means the request is already on https://SITE_DOMAIN or a local preview host.
 */
export function canonicalHostRedirect(url, headerHost = '') {
  const host = requestPublicHost(url, headerHost);
  if (!host || isLocalPreviewHost(host)) return null;
  if (url.protocol === 'https:' && host === SITE_DOMAIN) return null;

  const settled = settleRequestPath(url.pathname, url.search);
  if (settled.status === 404) return { status: 404 };
  return {
    status: 301,
    location: `https://${SITE_DOMAIN}${settled.pathname}${settled.search}`,
  };
}
