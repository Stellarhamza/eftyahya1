import { defineMiddleware } from 'astro:middleware';
import { resolveCheckoutPathRedirect } from './config/checkout-redirects.mjs';
import { resolveLocaleForumRedirect } from './config/locale-routing.mjs';
import { resolvePathRedirect } from '../scripts/redirects.mjs';

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  const { pathname, search, hash } = url;

  const checkoutTarget = resolveCheckoutPathRedirect(pathname);
  if (checkoutTarget) {
    const destination = checkoutTarget.includes('?')
      ? `${checkoutTarget}${search.replace('?', '&')}`
      : `${checkoutTarget}${search}`;
    return new Response(null, {
      status: 302,
      headers: { Location: destination, 'Cache-Control': 'no-store' },
    });
  }

  const localeForum = resolveLocaleForumRedirect(pathname, search);
  if (localeForum?.status === 301) {
    const location = localeForum.location.includes('?')
      ? `${localeForum.location}${hash}`
      : `${localeForum.location}${search}${hash}`;
    return context.redirect(location, 301);
  }
  if (localeForum?.status === 404) {
    return new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  const pathRedirect = resolvePathRedirect(pathname);
  if (pathRedirect && pathRedirect !== pathname) {
    return context.redirect(`${pathRedirect}${search}${hash}`, 301);
  }

  return next();
});
