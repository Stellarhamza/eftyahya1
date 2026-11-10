import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/site.js';
import { SITE_URL } from '../src/config/site-url.mjs';
import { CHECKOUT_PATH_REDIRECTS } from '../src/config/checkout-redirects.mjs';
import { PATH_REDIRECTS } from './redirects.mjs';
import { resolveStaticFile } from './static-path.mjs';
import path from 'node:path';

test('malformed/escaping static paths cannot crash Node preview or read outside dist', () => {
  const root = path.resolve('dist');
  assert.equal(resolveStaticFile(root, '/%ZZ'), null);
  assert.equal(resolveStaticFile(root, '/%00'), null);
  assert.equal(resolveStaticFile(root, '/..%2fdist-private/secret.txt'), null);
  assert.equal(resolveStaticFile(root, '/cheats/'), path.join(root, 'cheats/index.html'));
});

test('Worker forwards every configured checkout destination and plan without external requests', async () => {
  globalThis.caches = { default: { match: async () => undefined } };
  for (const [pathname, target] of CHECKOUT_PATH_REDIRECTS) for (const plan of ['monthly', 'lifetime']) {
    const response = await worker.fetch(new Request(`${SITE_URL}${pathname}?plan=${plan}&campaign=local-test`), {}, {});
    assert.equal(response.status, 302, pathname);
    assert.equal(response.headers.get('Location'), target + `&plan=${plan}&campaign=local-test`);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, follow');
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    const bare = pathname.endsWith('/') ? pathname : `${pathname}/`;
    for (const prefix of ['/en', '/es', '/de', '/fr']) {
      const legacy = await worker.fetch(new Request(`${SITE_URL}${prefix}${pathname}?plan=${plan}&campaign=local-test`), {}, {});
      assert.equal(legacy.status, 301, prefix + pathname);
      assert.equal(legacy.headers.get('Location'), `${bare}?plan=${plan}&campaign=local-test`);
    }
  }
});

test('www, http, and legacy hosts 301 once to the canonical https URL', async () => {
  globalThis.caches = { default: { match: async () => new Response('cached') } };
  const cases = [
    ['https://www.eft-cheats.net/cheats/', 'https://eft-cheats.net/cheats/'],
    ['http://www.eft-cheats.net/cheats', 'https://eft-cheats.net/cheats/'],
    ['https://eft-cheats.com/cheats/', 'https://eft-cheats.net/cheats/'],
    ['http://www.eft-cheats.com/contact', 'https://eft-cheats.net/support/'],
    ['https://www.eft-cheats.net/forum/?category=test&campaign=keep', 'https://eft-cheats.net/forum/?campaign=keep'],
  ];
  for (const [from, to] of cases) {
    const response = await worker.fetch(new Request(from), {}, {});
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get('Location'), to, from);
  }
  const preview = await worker.fetch(
    new Request('https://eft-cheats.workers.dev/cheats/', { headers: { 'X-Forwarded-Host': 'www.eft-cheats.net' } }),
    {},
    {},
  );
  assert.equal(preview.status, 301);
  assert.equal(preview.headers.get('Location'), 'https://eft-cheats.net/cheats/');
});

test('cached documents cannot bypass host or forum-query canonicalization', async () => {
  globalThis.caches = { default: { match: async () => new Response('cached') } };
  for (const prefix of ['', '/es', '/de', '/fr']) {
    const response = await worker.fetch(new Request(`${SITE_URL}${prefix}/forum/?category=test&campaign=keep`), {}, {});
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), '/forum/?campaign=keep');
  }
  const response = await worker.fetch(new Request(SITE_URL.replace('https://', 'http://') + '/'), {}, {});
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('Location'), SITE_URL + '/');
});

test('legacy redirects and English normalization resolve directly to final paths', async () => {
  globalThis.caches = { default: { match: async () => undefined } };
  for (const [from, to] of PATH_REDIRECTS) {
    const response = await worker.fetch(new Request(SITE_URL + from + '?campaign=keep'), { ASSETS: { fetch: async () => new Response('', { status: 404 }) } }, {});
    assert.equal(response.status, 301, from);
    const location = response.headers.get('Location') ?? '';
    assert.ok(location.startsWith(to), `${from} → ${location}`);
    assert.ok(location.includes('campaign=keep'), `${from} dropped query`);
  }
  const response = await worker.fetch(new Request(SITE_URL + '/en/products?campaign=keep'), {}, {});
  assert.equal(response.headers.get('Location'), '/products/?campaign=keep');
});

test('Worker gives actual 404 status/noindex for missing and nested-locale paths', async () => {
  globalThis.caches = { default: { match: async () => undefined } };
  const env = { ASSETS: { fetch: async (request) => new Response('<html>Missing</html>', { status: new URL(request.url).pathname === '/404' ? 200 : 404, headers: { 'Content-Type': 'text/html' } }) } };
  for (const route of ['/not-a-real-page/', '/404.html', '/%ZZ/']) {
    const response = await worker.fetch(new Request(SITE_URL + route), env, {});
    assert.equal(response.status, 404, route);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, follow');
  }
  const es404 = await worker.fetch(new Request(SITE_URL + '/es/404/'), env, {});
  assert.equal(es404.status, 301);
  assert.equal(es404.headers.get('Location'), '/404/');
});

test('Worker lets the asset binding resolve page URLs and preserves the custom 404 body', async () => {
  globalThis.caches = { default: { match: async () => undefined } };
  const env = { ASSETS: { fetch: async request => {
    const path = new URL(request.url).pathname;
    // Cloudflare auto-trailing-slash canonicalizes physical HTML paths.
    if (path.endsWith('/index.html')) return new Response(null, { status: 307, headers: { Location: path.slice(0, -10) } });
    if (path === '/404.html') return new Response(null, { status: 307, headers: { Location: '/404' } });
    return new Response(path === '/404' ? '<h1>Custom missing page</h1>' : '<h1>Page</h1>', {
      status: path === '/missing/' ? 404 : 200, headers: { 'Content-Type': 'text/html' },
    });
  } } };
  for (const path of ['/', '/cheats/']) {
    const response = await worker.fetch(new Request(SITE_URL + path), env, {});
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), /<h1>Page/);
  }
  const legacyLocale = await worker.fetch(new Request(SITE_URL + '/es/ugc/'), env, {});
  assert.equal(legacyLocale.status, 301);
  assert.equal(legacyLocale.headers.get('Location'), '/ugc/');
  const missing = await worker.fetch(new Request(SITE_URL + '/missing/'), env, {});
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Custom missing page/);
});
