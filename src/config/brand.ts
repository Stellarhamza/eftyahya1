/** Bump when regenerating `scripts/generate-eft-brand.mjs` output so browsers refetch icons. */
export const BRAND_LOGO_ASSET_VERSION = 12;

const v = BRAND_LOGO_ASSET_VERSION;

/** Navbar logo (same SVG source as favicon — run `node scripts/generate-eft-brand.mjs`). */
export const BRAND_LOGO_MASTER = `/images/brand/brand-logo.webp?v=${v}`;

/** Used in Organization / publisher schema (≥112px recommended). */
export const BRAND_LOGO_SCHEMA = `/images/brand/brand-logo-512.webp?v=${v}`;

export const FAVICON_ICO = `/favicon.ico?v=${v}`;
export const FAVICON_32 = `/images/brand/favicon-32.png?v=${v}`;
export const FAVICON_16 = `/images/brand/favicon-16.png?v=${v}`;
export const APPLE_TOUCH_ICON = `/images/brand/apple-touch-icon.png?v=${v}`;

/** Short, descriptive, and identical on every page. Seobility flags alts over ~100 characters. */
export const BRAND_LOGO_ALT = 'eft-cheats.net logo';
