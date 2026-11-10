import type { SiteLocale } from '../../i18n/locales';
import type { SiteFaqItem } from '../faq';
import { localizeInlineHtmlLinks } from '../../utils/localizeHtmlLinks';
import { siteFaqs as siteFaqsEn } from '../faq';
import { getCatalog } from '../catalog';
import { isUtilityEnabled } from '../../config/catalog';

function productListHtml(locale: SiteLocale): string {
  const links = getCatalog(locale).map((entry) => `<a href="${entry.path}">${entry.shortName} overview</a>`);
  return new Intl.ListFormat(locale, { type: 'conjunction' }).format(links);
}

export function getSiteFaqs(locale: SiteLocale = 'en'): SiteFaqItem[] {
  const productList = productListHtml(locale);
  return siteFaqsEn
    .filter((item) => (item.requires ?? []).every(isUtilityEnabled))
    .map((item) => ({
      ...item,
      a: localizeInlineHtmlLinks(item.a.replace('{productList}', productList), locale),
      aHtml: item.aHtml
        ? localizeInlineHtmlLinks(item.aHtml.replace('{productList}', productList), locale)
        : undefined,
    }));
}

export function getLandingFaqs(locale: SiteLocale = 'en'): SiteFaqItem[] {
  return getSiteFaqs(locale).filter((f) =>
    ['status', 'after-buy', 'ban-risk', 'platforms', 'license-move', 'products-page'].includes(f.id),
  );
}

export function getAllFaqs(locale: SiteLocale = 'en'): SiteFaqItem[] {
  return getSiteFaqs(locale).filter((f) => f.topic !== 'all');
}

export function getProductFaqs(locale: SiteLocale, slug: string, kind: 'tier' | 'utility'): SiteFaqItem[] {
  const siteFaqsLocalized = getSiteFaqs(locale);
  const general = siteFaqsLocalized.filter(
    (f) => kind === 'tier' && !f.scopes && ['setup', 'safety', 'plans', 'esp', 'aim'].includes(f.topic),
  );
  const scoped = siteFaqsLocalized.filter((f) => f.scopes?.includes(slug));
  const tierCompare = siteFaqsLocalized.filter((f) =>
    ['build-status', 'anticheat-update', 'who-cheats'].includes(f.id),
  );

  const combined =
    kind === 'tier'
      ? [...scoped, ...tierCompare, ...general.slice(0, 8)]
      : [...scoped, ...general.slice(0, 6)];

  const seen = new Set<string>();
  return combined.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
