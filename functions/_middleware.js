import { canonicalHostRedirect } from '../scripts/canonical-host.mjs';
import { resolveSameHostRedirect } from '../scripts/same-host-redirect.mjs';

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self'; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
};

function redirectResponse(location, status, robots) {
  const headers = {
    Location: location,
    'Cache-Control': status === 302 ? 'no-store' : 'public, max-age=3600',
    ...SECURITY_HEADERS,
  };
  if (robots) headers['X-Robots-Tag'] = robots;
  return new Response(null, { status, headers });
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const headerHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const jump = canonicalHostRedirect(url, headerHost);
  if (jump?.status === 404) {
    return new Response('Not found', {
      status: 404,
      headers: { 'X-Robots-Tag': 'noindex, follow', 'Cache-Control': 'no-store', ...SECURITY_HEADERS },
    });
  }
  if (jump?.status === 301 && jump.location) return redirectResponse(jump.location, 301);

  const sameHost = resolveSameHostRedirect(url.pathname, url.search, url.hash);
  if (sameHost?.status === 404) {
    return new Response('Not found', {
      status: 404,
      headers: { 'X-Robots-Tag': 'noindex, follow', 'Cache-Control': 'no-store', ...SECURITY_HEADERS },
    });
  }
  if (sameHost?.location) return redirectResponse(sameHost.location, sameHost.status, sameHost.robots);

  return next();
}
