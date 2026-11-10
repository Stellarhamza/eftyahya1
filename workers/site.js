/**
 * Serves the Astro build in ./dist on Cloudflare Workers.
 * Request handling matches scripts/serve.mjs.
 */
import { canonicalHostRedirect } from '../scripts/canonical-host.mjs';
import { resolveSameHostRedirect } from '../scripts/same-host-redirect.mjs';
import { isErrorDocumentPath } from '../src/config/locale-routing.mjs';
/** Served as static files; must not fall through to HTML index resolution. */
const STATIC_FILE_PATH = /^\/(?:robots\.txt|sitemap\.xml|sitemap\.xsl|rss\.xml|[^/]+\.(?:xml|xsl|txt|webmanifest))$/i;

const SECURITY_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

function assetsFetch(env, request, pathname) {
  return env.ASSETS.fetch(new Request(new URL(pathname, 'https://assets.local'), request));
}

function withHtmlCharset(response) {
  const contentType = response.headers.get('content-type') || '';
  const primary = contentType.split(',')[0].trim();
  if (!primary.toLowerCase().startsWith('text/html')) return response;
  if (/charset=/i.test(primary)) return response;
  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Content-Security-Policy', SECURITY_CSP);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function splitUrl(url) {
  const [pathPart, hash = ''] = url.split('#');
  const [pathname, search = ''] = pathPart.split('?');
  return {
    pathname: pathname || '/',
    query: search ? `?${search}` : '',
    fragment: hash ? `#${hash}` : '',
  };
}

function normalizePath(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}

function locationPath(response) {
  const location = response.headers.get('Location');
  if (!location) return '';
  try {
    return new URL(location, 'https://assets.local').pathname;
  } catch {
    return '';
  }
}

async function fetchAsset(env, request, pathname, search) {
  // The binding applies html_handling itself. Requesting /index.html here makes
  // it redirect back to the public URL, creating a self-redirect on every page.
  return assetsFetch(env, request, pathname + search);
}

function isCacheableDocumentRequest(request, pathname) {
  if (request.method !== 'GET') return false;
  if (pathname.startsWith('/go/')) return false;
  return true;
}

function cacheDocumentResponse(request, response) {
  const url = new URL(request.url);
  if (!isCacheableDocumentRequest(request, url.pathname)) return response;
  if (response.status !== 200) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('text/html')) return response;

  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function matchCachedDocument() {
  return null;
}

async function notFound(env, request) {
  // The flat /404.html asset's clean binding URL is /404; /404.html redirects.
  const asset = withHtmlCharset(await assetsFetch(env, request, '/404'));
  const headers = new Headers(asset.headers);
  headers.delete('Link');
  headers.set('X-Robots-Tag', 'noindex, follow');
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return withSecurityHeaders(
    new Response(asset.body, {
      status: 404,
      statusText: 'Not Found',
      headers,
    }),
  );
}

function redirect(location, status) {
  return withSecurityHeaders(
    new Response(null, {
      status,
      headers: {
        Location: location,
        'Cache-Control': status === 302 ? 'no-store' : 'public, max-age=3600',
      },
    }),
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const headerHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
    const hostJump = canonicalHostRedirect(url, headerHost);
    if (hostJump?.status === 404) return notFound(env, request);
    if (hostJump?.status === 301) {
      const response = redirect(hostJump.location, 301);
      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    }

    const { pathname, query, fragment } = splitUrl(`${url.pathname}${url.search}${url.hash}`);
    try {
      const decoded = decodeURIComponent(pathname);
      if (decoded.includes('\0') || decoded.split(/[\\/]/).includes('..')) return notFound(env, request);
    } catch {
      return notFound(env, request);
    }
    if (STATIC_FILE_PATH.test(pathname)) {
      const asset = await assetsFetch(env, request, pathname + query);
      if (asset.status === 200) {
        if (pathname === '/sitemap.xml') {
          const headers = new Headers(asset.headers);
          headers.set('content-type', 'application/xml; charset=utf-8');
          return withSecurityHeaders(new Response(asset.body, { status: 200, statusText: asset.statusText, headers }));
        }
        return withSecurityHeaders(asset);
      }
    }

    const sameHost = resolveSameHostRedirect(pathname, query, fragment);
    if (sameHost?.status === 404) return notFound(env, request);
    if (sameHost?.location) {
      const response = redirect(sameHost.location, sameHost.status);
      if (sameHost.robots) response.headers.set('X-Robots-Tag', sameHost.robots);
      return response;
    }

    // Normalize redirects and indexability before consulting the query-insensitive document cache.
    const cached = await matchCachedDocument(request);
    if (cached) return cached;
    const asset = await fetchAsset(env, request, pathname, query);
    const redirectedTo = locationPath(asset);
    if (
      asset.status === 404 ||
      (asset.status >= 300 &&
        asset.status < 400 &&
        (redirectedTo === '/404' || redirectedTo === '/404.html'))
    ) {
      return notFound(env, request);
    }

    if (isErrorDocumentPath(pathname) && asset.status === 200) {
      const headers = new Headers(withHtmlCharset(asset).headers);
      headers.delete('Link');
      headers.set('X-Robots-Tag', 'noindex, follow');
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      return withSecurityHeaders(
        new Response(asset.body, {
          status: 404,
          statusText: 'Not Found',
          headers,
        }),
      );
    }

    const response = withSecurityHeaders(withHtmlCharset(asset));
    return cacheDocumentResponse(request, response);
  },
};
