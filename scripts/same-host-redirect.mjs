import { resolveCheckoutPathRedirect } from '../src/config/checkout-redirects.mjs';
import { resolveLocaleForumRedirect } from '../src/config/locale-routing.mjs';
import { resolvePathRedirect } from './redirects.mjs';

/**
 * Checkout, locale, and path redirects for a request already on the canonical host.
 * Locale prefixes are handled here, not inside checkout, so /es/go/… cannot skip to the wrong product.
 * @returns {{ status: number, location?: string, robots?: string } | null}
 */
export function resolveSameHostRedirect(pathname, query = '', fragment = '') {
  const suffix = `${query}${fragment}`;
  const checkout = resolveCheckoutPathRedirect(pathname);
  if (checkout) {
    const location =
      query && checkout.includes('?') ? `${checkout}${query.replace('?', '&')}` : `${checkout}${query}`;
    return { status: 302, location, robots: 'noindex, follow' };
  }

  const localeForum = resolveLocaleForumRedirect(pathname, query);
  if (localeForum?.status === 404) return { status: 404 };
  if (localeForum?.status === 301) {
    const location = localeForum.location.includes('?')
      ? `${localeForum.location}${fragment}`
      : `${localeForum.location}${query}${fragment}`;
    return { status: 301, location };
  }

  const pathRedirect = resolvePathRedirect(pathname);
  if (pathRedirect && pathRedirect !== pathname) {
    return { status: 301, location: `${pathRedirect}${suffix}` };
  }

  const cleanPagePath = pathname.endsWith('/index.html')
    ? pathname.slice(0, -'index.html'.length)
    : !pathname.split('/').pop()?.includes('.') && !pathname.includes('%') && pathname !== pathname.toLowerCase()
      ? `${pathname.toLowerCase().replace(/\/?$/, '/')}`
      : null;
  if (cleanPagePath && cleanPagePath !== pathname) {
    return { status: 301, location: `${cleanPagePath}${suffix}` };
  }

  return null;
}
