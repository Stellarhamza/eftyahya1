import { CHEATS_PRIMARY_SLUG, SKIN_CHANGER_SLUG, HWID_SPOOFER_SLUG, UGC_SLUG } from '../config/catalog';
import type { SiteLocale } from '../i18n/locales';
import { deepApplySiteTokens } from '../i18n/brandTokens';
/** UI copy for the /products/ catalog page and the header products menu. */
export interface CatalogCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  trust: string[];
  featuredEyebrow: string;
  from: string;
  priceLabel: string;
  lifetime: string;
  perMonth: string;
  utilitiesEyebrow: string;
  utilitiesTitle: string;
  utilitiesDesc: string;
  chooserEyebrow: string;
  chooserTitle: string;
  chooserDesc: string;
  scenarios: { slug: string; need: string; answer: string }[];
  compareEyebrow: string;
  compareTitle: string;
  compareDesc: string;
  compareRows: { label: string; values: Record<string, string> }[];
  ctaTitle: string;
  ctaDesc: string;
  ctaSupport: string;
  menuHeading: string;
  menuViewAll: string;
  menuTaglines: Record<string, string>;
}

const en: CatalogCopy = {
  eyebrow: 'Store',
  title: '{gameName} cheat shop',
  subtitle:
    'Four products for {gameShort}: private cheat, HWID Spoofer, Skin Changer, and UGC. Compare plans before checkout.',
  trust: ['BattlEye-aware listings', 'Monthly or lifetime', 'Secure /go checkout', 'Dedicated support desk'],
  featuredEyebrow: 'Main product',
  from: 'From',
  priceLabel: 'Price',
  lifetime: 'Lifetime',
  perMonth: '/ month',
  utilitiesEyebrow: 'Utilities',
  utilitiesTitle: 'HWID, skins, and appeals',
  utilitiesDesc:
    'Each utility has its own license, loader rules, and checkout. A hardware ban needs HWID Spoofer; stash visuals use Skin Changer; account mail uses UGC.',
  chooserEyebrow: 'Not sure?',
  chooserTitle: 'Which Tarkov product do I need?',
  chooserDesc: 'Pick by problem: raid advantage, hardware block, visuals only, or account appeal.',
  scenarios: [
    {
      slug: CHEATS_PRIMARY_SLUG,
      need: 'I want ESP, aimbot, and radar for online raids.',
      answer: '{cheatProduct}',
    },
    {
      slug: HWID_SPOOFER_SLUG,
      need: 'BattlEye blocked my PC and the launcher will not start.',
      answer: 'HWID Spoofer',
    },
    {
      slug: SKIN_CHANGER_SLUG,
      need: 'I want weapon skins and visual unlocks without touching stash data.',
      answer: 'Skin Changer',
    },
    { slug: UGC_SLUG, need: 'My Battlestate account was banned and I need an appeal packet.', answer: 'UGC' },
  ],
  compareEyebrow: 'Compare',
  compareTitle: 'Compare all four products',
  compareDesc: 'Plan prices are fixed on each page. Features differ: raid software, hardware IDs, visuals, and appeals.',
  compareRows: [
    {
      label: 'Best for',
      values: {
        [CHEATS_PRIMARY_SLUG]: 'ESP, aimbot, radar, private loader',
        [HWID_SPOOFER_SLUG]: 'Hardware ID / BattlEye PC block',
        [SKIN_CHANGER_SLUG]: 'Weapon & gear visuals',
        [UGC_SLUG]: 'Account appeal workflow',
      },
    },
    {
      label: 'Monthly from',
      values: {
        [CHEATS_PRIMARY_SLUG]: '$35',
        [HWID_SPOOFER_SLUG]: '$50',
        [SKIN_CHANGER_SLUG]: '$35',
        [UGC_SLUG]: '$35',
      },
    },
    {
      label: 'Lifetime',
      values: {
        [CHEATS_PRIMARY_SLUG]: '$150',
        [HWID_SPOOFER_SLUG]: '$150',
        [SKIN_CHANGER_SLUG]: '$150',
        [UGC_SLUG]: '$150',
      },
    },
    {
      label: 'Online raids',
      values: {
        [CHEATS_PRIMARY_SLUG]: 'Primary use case',
        [HWID_SPOOFER_SLUG]: 'Prep step only',
        [SKIN_CHANGER_SLUG]: 'Policy risk',
        [UGC_SLUG]: 'Not applicable',
      },
    },
  ],
  ctaTitle: 'Still comparing?',
  ctaDesc: 'Open support with your ban notice, Windows build, and raid mode so we can point you to the right license.',
  ctaSupport: 'Support desk',
  menuHeading: 'Products',
  menuViewAll: 'Compare all products',
  menuTaglines: {
    [CHEATS_PRIMARY_SLUG]: 'Best tarkov cheats — ESP & aimbot',
    [HWID_SPOOFER_SLUG]: 'Tarkov hwid spoof tool',
    [SKIN_CHANGER_SLUG]: 'Visual skins & presets',
    [UGC_SLUG]: 'Legit tarkov assist / appeals',
  },
};

export function getCatalogCopy(_locale: SiteLocale = 'en'): CatalogCopy {
  return deepApplySiteTokens(en) as CatalogCopy;
}
