import { BRAND_LOGO_ALT } from './brand';
import type { SiteLocale } from '../i18n/locales';

/** Logo alt describes the image, not the page keyword. */
export function resolveBrandLogoAlt(_pathname: string, _locale: SiteLocale = 'en'): string {
  return BRAND_LOGO_ALT;
}
