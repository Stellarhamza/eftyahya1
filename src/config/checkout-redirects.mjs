/**
 * External checkout destinations (302 targets only).
 * Visible buy buttons use `/go/…` from `checkout.ts`; hover stays on-site.
 */
export const CHECKOUT_URLS = {
  escapeFromTarkov: 'https://zadeyo.com/go/SKY?to=%2Fproducts%2Fescape-from-tarkov',
  hwidSpoofer: 'https://zadeyo.com/go/SKY?to=%2Fproducts%2Fhwid-spoofer',
  skinChanger: 'https://zadeyo.com/go/SKY?to=%2Fproducts%2Fskin-changer',
  ugc: 'https://zadeyo.com/go/SKY?to=%2Fproducts%2Fugc',
  partnerShop: 'https://zadeyo.com/go/SKY?to=%2Fshop',
};

const MAIN_CHECKOUT = CHECKOUT_URLS.escapeFromTarkov;

/** Checkout paths → external product URLs (Node serve, Astro middleware, static `_redirects`). */
export const CHECKOUT_PATH_REDIRECTS = new Map([
  ['/go/escape-from-tarkov', MAIN_CHECKOUT],
  ['/go/escape-from-tarkov/', MAIN_CHECKOUT],
  ['/go/hwid-spoofer', CHECKOUT_URLS.hwidSpoofer],
  ['/go/hwid-spoofer/', CHECKOUT_URLS.hwidSpoofer],
  ['/go/skin-changer', CHECKOUT_URLS.skinChanger],
  ['/go/skin-changer/', CHECKOUT_URLS.skinChanger],
  ['/go/ugc', CHECKOUT_URLS.ugc],
  ['/go/ugc/', CHECKOUT_URLS.ugc],
  ['/go/shop', CHECKOUT_URLS.partnerShop],
  ['/go/shop/', CHECKOUT_URLS.partnerShop],
]);

export function resolveCheckoutPathRedirect(pathname) {
  const path = pathname;
  const direct = CHECKOUT_PATH_REDIRECTS.get(path);
  if (direct) return direct;

  if (path !== '/' && !path.endsWith('/')) {
    return CHECKOUT_PATH_REDIRECTS.get(`${path}/`) ?? null;
  }

  return null;
}
