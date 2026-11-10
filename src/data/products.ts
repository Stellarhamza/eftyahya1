import {
  ALL_UTILITY_PRODUCT_SLUGS,
  CHEAT_PRODUCT_SLUGS,
  CHEATS_PRIMARY_SLUG,
  HWID_SPOOFER_SLUG,
  SKIN_CHANGER_SLUG,
  UGC_SLUG,
  UTILITY_PRODUCT_PATHS,
  UTILITY_PRODUCT_SLUGS,
  type UtilityProductSlug,
} from '../config/catalog';
import { PRODUCT_BASE } from '../config/site';
import { CHEAT_PRODUCT_NAME, GAME } from '../config/game';
import { getTranslations } from '../i18n';
import { deepApplySiteTokens } from '../i18n/brandTokens';
import type { SiteLocale } from '../i18n/locales';
import type { Translations } from '../i18n/types';
import { checkoutForSlug } from '../config/checkout';
import { SHOWCASE_GALLERY_KEYS } from '../config/gameplayMedia';
import { HWID_GALLERY_KEYS } from '../config/hwidMedia';
import type { IconName } from '../components/icons/types';
import { getProductCopyBundle, registerProductCopyBundle, type ProductCopyBundle } from './products/exportCopy';
export interface ProductSlide {
  src: string;
  alt: string;
  caption: string;
  captionDesc: string;
  width?: number;
  height?: number;
  kind?: 'image' | 'video';
  videoSrc?: string;
}

export interface ProductOverview {
  title: string;
  paragraphs: string[];
}

export interface AcquisitionStep {
  num: string;
  title: string;
  desc: string;
}

export interface ProductAcquisition {
  title: string;
  steps: AcquisitionStep[];
}

export interface SystemRequirement {
  icon: IconName;
  text: string;
}

export interface ProductPage {
  slug: string;
  kind: 'tier' | 'utility';
  badge: string;
  category?: string;
  tier?: string;
  name: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
  more: number;
  variant?: 'essential' | 'popular' | 'limited';
  buyUrl: string;
  images: ProductSlide[];
  overview: ProductOverview;
  acquisition: ProductAcquisition;
  goodToKnow: string;
  limitations: string;
  fullFeatures: string[];
  systemRequirements: SystemRequirement[];
  about?: { type: 'h2' | 'p'; text: string }[];
  body: { type: 'h2' | 'p'; text: string }[];
  relatedBlogSlugs: string[];
  relatedForumSlugs: string[];
}

/** Guides paired with each product detail page (blog slugs unchanged until new posts ship). */
export const productRelatedBlogSlugs: Record<string, string[]> = {
  elite: [
    'tarkov-cheats-guide',
    'esp-vs-wallhack',
    'loot-esp-guide',
    'best-tarkov-cheats-2026',
    'tarkov-aimbot-guide',
  ],
  'hwid-spoofer': ['hwid-spoofer-guide', 'hwid-ban-vs-account', 'hwid-spoofer-faq'],
  ugc: ['ugc-appeal-automation', 'unban-tarkov-2026', 'battleye-appeal'],
  'skin-changer': ['eft-skin-changer', 'skin-changer-faq', 'weapon-skin-changer'],
};

export const productRelatedForumSlugs: Record<string, string[]> = {
  elite: ['tarkov-esp-raid-question', 'tarkov-aimbot-soft-aim-question', 'tarkov-patch-status-question'],
  'hwid-spoofer': ['tarkov-hwid-ban-question', 'tarkov-hwid-vs-account-question'],
  ugc: ['tarkov-ugc-appeal-question', 'tarkov-appeal-evidence-question'],
  'skin-changer': ['tarkov-skin-changer-scope-question', 'tarkov-unlock-all-meaning-question'],
};

const productBase = PRODUCT_BASE;
const imgBase = '/images/escape-from-tarkov';

const hwidAcquisitionSteps: AcquisitionStep[] = [
  {
    num: '01',
    title: 'Confirm BattlEye context',
    desc: 'Hardware ID sanctions on {gameName} are separate from account or profile actions. Read the notice and support guidance before choosing HWID Spoofer.',
  },
  {
    num: '02',
    title: 'Pick a plan',
    desc: 'Monthly is $50 for 30 days. Lifetime is $150. Confirm what lifetime includes with support before payment.',
  },
  {
    num: '03',
    title: 'Check Windows setup',
    desc: 'Review current requirements for your motherboard, disk serials, and network adapter in the portal guide.',
  },
  {
    num: '04',
    title: 'Follow portal order',
    desc: 'Run the identifier change and cleanup steps in the documented order before launching the BSG launcher.',
  },
];

const ugcAcquisitionSteps: AcquisitionStep[] = [
  {
    num: '01',
    title: 'Understand UGC',
    desc: 'UGC means Unban & Governance Control. It organizes account appeals; it does not bypass BattlEye or guarantee restoration.',
  },
  {
    num: '02',
    title: 'Select a plan',
    desc: 'Monthly is $35 for 30 days. Lifetime is $150. Confirm plan terms before payment.',
  },
  {
    num: '03',
    title: 'Prepare records',
    desc: 'Keep the Battlestate notice, email, purchase receipts, and a short factual timeline.',
  },
  {
    num: '04',
    title: 'Submit through support',
    desc: 'Battlestate Games decides every appeal. UGC is not a promise of approval.',
  },
];

const skinChangerAcquisitionSteps: AcquisitionStep[] = [
  {
    num: '01',
    title: 'Read the scope',
    desc: 'Skin Changer adjusts client-side visuals for weapons, gear, and attachments. It is not the main raid cheat and does not change server-side stash ownership.',
  },
  {
    num: '02',
    title: 'Choose a term',
    desc: 'Monthly is $35 for 30 days. Lifetime is $150. Match the product name at checkout.',
  },
  {
    num: '03',
    title: 'Confirm launcher build',
    desc: 'Verify the current supported game branch and loader version on the product page before buying.',
  },
  {
    num: '04',
    title: 'Use current documentation',
    desc: 'Follow the supplied setup guide after payment. Visual mods can still carry policy risk in online raids.',
  },
];

const defaultAcquisitionSteps: AcquisitionStep[] = [
  {
    num: '01',
    title: 'Read the listing',
    desc: 'Review ESP, aimbot, radar, and loader notes on the product page. Patch days can change compatibility.',
  },
  {
    num: '02',
    title: 'Match your raid mode',
    desc: 'Confirm whether your plan covers PMC, Scav, and the modes you play before checkout.',
  },
  {
    num: '03',
    title: 'Contact support',
    desc: 'Ask about BattlEye status, Windows build, and delivery if anything is unclear.',
  },
  {
    num: '04',
    title: 'Complete setup',
    desc: 'After payment, install through the private loader and apply only documented settings.',
  },
];

function acquisitionFor(productName: string): ProductAcquisition {
  return {
    title: `How to get ${productName}`,
    steps: defaultAcquisitionSteps,
  };
}

const sharedGoodToKnow =
  '{gameName} wipes, {antiCheat} updates, and listing details change. Read the current page on {siteDomain} before payment.';

const sharedLimitations =
  'Third-party software conflicts with Battlestate Games terms. We do not promise permanence, detection resistance, or a specific account outcome.';

const mainProductSystemRequirements: SystemRequirement[] = [
  { icon: 'reqWindows', text: 'Windows 10 or 11 64-bit (64-bit build of the game).' },
  { icon: 'reqSettings', text: 'Battlestate launcher installed; secure boot and HVCI settings per loader guide.' },
  { icon: 'reqWifi', text: 'Stable connection for loader updates and license checks.' },
];

const galleryRaw = {
  gpVisualsMenu: {
    width: 1330,
    height: 840,
    src: `${imgBase}/zadeyo-escapefromtarkov-1-visuals.webp`,
    alt: 'Escape from Tarkov cheat visuals menu with player ESP, loot, and bone options.',
    caption: 'Visuals panel',
    captionDesc: 'Player ESP, loot filters, and chams-style options for raids.',
  },
  gpWorldMenu: {
    width: 1330,
    height: 840,
    src: `${imgBase}/zadeyo-escapefromtarkov-2-world.webp`,
    alt: 'Escape from Tarkov world overlay with extractions, loot, and quest markers.',
    caption: 'World / radar layer',
    captionDesc: 'Exfil points, loot highlights, and map-aware overlays.',
  },
  gpAimMenu: {
    width: 1330,
    height: 840,
    src: `${imgBase}/zadeyo-escapefromtarkov-3-aimbot.webp`,
    alt: 'Escape from Tarkov aimbot menu with silent aim and bone selection.',
    caption: 'Aimbot panel',
    captionDesc: 'Soft aim, silent aim, and recoil-related toggles.',
  },
} satisfies Record<
  string,
  { src: string; alt: string; caption: string; captionDesc: string; width: number; height: number }
>;

type GalleryKey = keyof typeof galleryRaw;

function slide(...keys: GalleryKey[]): ProductSlide[] {
  return keys.map((key) => {
    const item = galleryRaw[key];
    const { src, alt, caption, captionDesc, width, height } = item;
    return { src, alt, caption, captionDesc, width, height };
  });
}

const showcaseSlides = slide(...SHOWCASE_GALLERY_KEYS);

const eliteProductSlides: ProductSlide[] = [
  {
    src: `${imgBase}/ancient-eft-s1.webp`,
    width: 1672,
    height: 941,
    alt: 'Escape from Tarkov Cheats product artwork with tactical raid theme.',
    caption: CHEAT_PRODUCT_NAME,
    captionDesc: 'Marketing visual for the main {gameShort} cheat product.',
  },
  {
    src: `${imgBase}/ancient-eft-s2.webp`,
    width: 1672,
    height: 941,
    alt: 'Escape from Tarkov private loader promotional frame.',
    caption: 'Private loader',
    captionDesc: 'Premium loader access with monthly and lifetime plans.',
  },
  ...showcaseSlides,
  {
    src: `${imgBase}/screenshot-3.webp`,
    width: 1330,
    height: 840,
    alt: 'In-raid Escape from Tarkov overlay screenshot.',
    caption: 'In-raid overlay',
    captionDesc: 'Combined ESP and world information during a raid.',
  },
  {
    src: `${imgBase}/screenshot-5.webp`,
    width: 1330,
    height: 840,
    alt: 'Escape from Tarkov cheat configuration screenshot.',
    caption: 'Configuration',
    captionDesc: 'Tunable filters for loot, players, and aim settings.',
  },
];

const hwidGalleryRaw = {
  hwidSerialCheck: {
    src: '/images/hwid-spoofer/hwid-spoofer-serial-check-panel.webp',
    width: 1024,
    height: 576,
    alt: 'HWID spoofer serial check showing disk, motherboard, and network rows.',
    caption: 'Serial check rows',
    captionDesc: 'Verify which hardware values changed after a spoof cycle.',
  },
  hwidUefiSpoof: {
    src: '/images/hwid-spoofer/hwid-spoofer-uefi-spoof-panel.webp',
    width: 1024,
    height: 576,
    alt: 'HWID firmware panel with permanent spoof and seed controls.',
    caption: 'Firmware controls',
    captionDesc: 'Toggle GPU or MAC spoofing and apply a permanent change.',
  },
};

type HwidGalleryKey = keyof typeof hwidGalleryRaw;

function hwidSlide(...keys: HwidGalleryKey[]): ProductSlide[] {
  return keys.map((key) => {
    const item = hwidGalleryRaw[key];
    const { src, alt, caption, captionDesc, width, height } = item;
    return { src, alt, caption, captionDesc, width, height };
  });
}

const hwidShowcaseSlides = hwidSlide(...HWID_GALLERY_KEYS);

const ugcShowcaseSlides: ProductSlide[] = [
  {
    src: '/images/ugc/ugc.webp',
    width: 960,
    height: 540,
    alt: 'UGC product mark for account appeal workflows.',
    caption: 'UGC mark',
    captionDesc: 'Account appeal and governance tooling.',
  },
];

const skinChangerShowcaseSlides: ProductSlide[] = [
  {
    src: `${imgBase}/screenshot-2.webp`,
    width: 1330,
    height: 840,
    alt: 'Tarkov weapon skin preview in the skin changer interface.',
    caption: 'Weapon skins',
    captionDesc: 'Client-side weapon and gear visual presets.',
  },
  {
    src: `${imgBase}/screenshot-4.webp`,
    width: 1330,
    height: 840,
    alt: 'Attachment and apparel skin selection for Escape from Tarkov.',
    caption: 'Gear skins',
    captionDesc: 'Preview camos and attachments locally.',
  },
  {
    src: `${imgBase}/screenshot-7.webp`,
    width: 1330,
    height: 840,
    alt: 'Skin changer save slots and quick apply controls.',
    caption: 'Presets',
    captionDesc: 'Save and swap visual loadouts without touching server stash data.',
  },
];

function slugFromHref(href: string): string {
  const normalized = href.replace(/^\//, '').replace(/\/$/, '');
  for (const slug of ALL_UTILITY_PRODUCT_SLUGS) {
    if (normalized === slug || normalized.endsWith(`/${slug}`)) return slug;
  }
  const segment = href.replace(productBase, '').replace(/^\//, '').replace(/\/$/, '');
  if (!segment || segment === 'cheats' || segment === 'product') {
    return CHEATS_PRIMARY_SLUG;
  }
  return segment;
}

const tierAbout: Record<string, ProductPage['about']> = {
  elite: [
    {
      type: 'p',
      text: `${CHEAT_PRODUCT_NAME} is the primary software suite for ${GAME.name}. The loader ships ESP, aimbot, loot filters, and radar-style overlays tuned for live raids.`,
    },
    { type: 'h2', text: 'BattlEye and wipes' },
    {
      type: 'p',
      text: '{antiCheat} runs on online raids. Major patches and wipes can change memory layouts. Check the status banner on the product page the same day you play.',
    },
  ],
};

const tierBodies: Record<string, ProductPage['body']> = {
  elite: [
    { type: 'h2', text: 'Plans and private loader' },
    {
      type: 'p',
      text: 'Monthly access is $35 for 30 days. Lifetime access is $150. Checkout keeps your selected plan through the secure redirect. Delivery is instant through the premium loader after payment.',
    },
    { type: 'h2', text: 'Feature focus' },
    {
      type: 'p',
      text: 'Typical modules include player ESP with distance and health, loot and container ESP, skeleton or box chams, extraction helpers, silent or soft aim, and configurable recoil control. Exact toggles depend on the current build—use the menus shown in the gallery as reference.',
    },
    { type: 'h2', text: 'DMA searches' },
    {
      type: 'p',
      text: 'Many shoppers search for a tarkov DMA cheat. This listing is a software loader for standard Windows PCs, not a hardware DMA bundle. If you run a DMA setup, confirm compatibility with support before buying.',
    },
  ],
};

const utilityBodies: Record<string, ProductPage['body']> = {
  'hwid-spoofer': [
    { type: 'h2', text: 'When HWID Spoofer applies' },
    {
      type: 'p',
      text: 'BattlEye can tie a hardware fingerprint to a block that survives reinstalling Windows. HWID Spoofer refreshes serials so a clean install can pass the launcher check again. It does not remove an active account ban.',
    },
    { type: 'h2', text: 'Plan terms' },
    {
      type: 'p',
      text: 'Monthly access is $50 for 30 days; lifetime access is $150. Lifetime covers the license term stated at checkout, not every future anti-cheat change.',
    },
  ],
  ugc: [
    { type: 'h2', text: 'Account appeals for {gameShort}' },
    {
      type: 'p',
      text: 'UGC packages evidence for Battlestate support tickets: notice screenshots, purchase history, and timeline notes. The publisher reviewer makes the final call.',
    },
    { type: 'h2', text: 'Plan terms' },
    { type: 'p', text: 'UGC is $35 for 30 days or $150 lifetime. Neither plan guarantees account recovery.' },
  ],
  'skin-changer': [
    { type: 'h2', text: 'Client-side visuals only' },
    {
      type: 'p',
      text: 'Skin Changer swaps how weapons, rigs, and clothing look on your client. Other players see default items unless the mod states otherwise. It does not add items to your stash or flea listings.',
    },
    { type: 'h2', text: 'Unlock-all searches' },
    {
      type: 'p',
      text: 'Searchers often type tarkov unlock all. Here that means visual unlocks and presets—not server-side progression. Read the feature list before expecting stash changes.',
    },
    { type: 'h2', text: 'Plan terms' },
    { type: 'p', text: 'Monthly is $35 for 30 days. Lifetime is $150. Visual mods in online raids still violate game rules; use at your own risk.' },
  ],
};

const productContent: Record<
  string,
  Pick<ProductPage, 'overview' | 'images' | 'fullFeatures' | 'goodToKnow' | 'limitations' | 'systemRequirements'>
> = {
  elite: {
    images: eliteProductSlides,
    goodToKnow: sharedGoodToKnow,
    limitations: sharedLimitations,
    systemRequirements: mainProductSystemRequirements,
    fullFeatures: [
      'Player & loot ESP',
      'Extraction / world overlay',
      'Aimbot & soft aim',
      'Private premium loader',
      'Monthly $35 / 30 days',
      'Lifetime $150',
    ],
    overview: {
      title: `${CHEAT_PRODUCT_NAME} for live raids`,
      paragraphs: [
        `${CHEAT_PRODUCT_NAME} is a private loader with a fast update channel and menus built for Woods, Customs, Streets, and Labs-style PvP. Detection is not guaranteed.`,
        'Compare ESP, aimbot, and radar options in the screenshots, then open checkout when your plan and Windows build match the current listing.',
      ],
    },
  },
  'hwid-spoofer': {
    images: hwidShowcaseSlides,
    goodToKnow: 'Spoof before launching the BSG launcher if BattlEye flagged your PC. Re-read anti-cheat notes on the status banner before you pay.',
    limitations:
      'HWID tools target hardware blocks. Active account bans remain. Spoofing violates publisher terms and can trigger new penalties if detected.',
    systemRequirements: [
      { icon: 'reqWindows', text: 'Windows 10/11 64-bit with admin access for driver steps.' },
      { icon: 'reqShieldGuide', text: 'Disable conflicting VPN or virtual disk tools during spoof.' },
      { icon: 'reqSettings', text: 'UEFI or BIOS access when permanent spoof is required.' },
      { icon: 'reqWifi', text: 'Ethernet or Wi-Fi MAC listed in the serial checker.' },
    ],
    fullFeatures: ['BattlEye HWID context', 'Serial checker UI', 'Monthly $50 / 30 days', 'Lifetime $150', 'Portal-guided order'],
    overview: {
      title: 'Tarkov HWID Spoofer',
      paragraphs: [
        'Refresh disk, board, and adapter identifiers after a BattlEye hardware ban so you can install the launcher on the same PC again.',
        'Monthly is $50 for 30 days and lifetime is $150. Pair with UGC if you also need an account appeal.',
      ],
    },
  },
  ugc: {
    images: ugcShowcaseSlides,
    goodToKnow: 'Gather receipts, email access, and the original ban email before tickets run.',
    limitations: 'Outcomes are not guaranteed. A BattlEye or Battlestate account ban can remain in place. UGC does not spoof hardware.',
    systemRequirements: [
      { icon: 'reqWindows', text: 'Any modern browser for ticket uploads.' },
      { icon: 'reqSettings', text: 'Access to the banned account email.' },
      { icon: 'reqWifi', text: 'Stable connection for support portal.' },
    ],
    fullFeatures: ['Appeal packet templates', 'Not a spoofer', 'Monthly $35 / 30 days', 'Lifetime $150', 'BSG decides outcomes'],
    overview: {
      title: 'UGC for Battlestate appeals',
      paragraphs: [
        'Organize Unban & Governance Control workflows when your Escape from Tarkov account receives a platform sanction.',
        'Monthly is $35 for 30 days and lifetime is $150. Prepare factual evidence—support cannot promise approval.',
      ],
    },
  },
  'skin-changer': {
    images: skinChangerShowcaseSlides,
    goodToKnow: 'Skin Changer is separate from the main cheat license. Confirm both builds match your game version.',
    limitations: 'Visual-only changes. Online use breaks game rules. Other players may still see default kits.',
    systemRequirements: [
      { icon: 'reqWindows', text: 'Same Windows build as the main loader when bundled.' },
      { icon: 'reqSettings', text: 'Battlestate launcher installed.' },
      { icon: 'reqWifi', text: 'License check requires network access.' },
    ],
    fullFeatures: ['Weapon & gear skins', 'Preset slots', 'Monthly $35 / 30 days', 'Lifetime $150', 'Visual-only scope'],
    overview: {
      title: 'Tarkov Skin Changer',
      paragraphs: [
        'Preview weapon camos, armbands, and attachments locally—popular with unlock-all and style searches.',
        'Plans are $35 monthly or $150 lifetime. Pair with Escape from Tarkov Cheats only if support confirms compatibility.',
      ],
    },
  },
};

const utilityAcquisitionSteps: Record<UtilityProductSlug, AcquisitionStep[]> = {
  [HWID_SPOOFER_SLUG]: hwidAcquisitionSteps,
  [UGC_SLUG]: ugcAcquisitionSteps,
  [SKIN_CHANGER_SLUG]: skinChangerAcquisitionSteps,
};

const utilityAcquisitionTitles: Record<UtilityProductSlug, string> = {
  [HWID_SPOOFER_SLUG]: 'Order HWID Spoofer',
  [UGC_SLUG]: 'Start UGC',
  [SKIN_CHANGER_SLUG]: 'Before Skin Changer setup',
};

function buildTierPages(t: Translations): ProductPage[] {
  return t.cheats.items.map((cheat) => {
    const slug = slugFromHref(cheat.href);
    const content = productContent[slug];
    const displayName = CHEAT_PRODUCT_NAME;
    return {
      slug,
      kind: 'tier',
      badge: cheat.badge,
      tier: cheat.tier,
      name: cheat.name,
      title: cheat.title,
      subtitle: cheat.heroDesc ?? cheat.desc,
      desc: cheat.desc,
      features: cheat.features,
      more: cheat.more,
      variant: cheat.variant,
      buyUrl: checkoutForSlug(slug),
      images: content.images,
      overview: content.overview,
      acquisition: acquisitionFor(displayName),
      goodToKnow: content.goodToKnow,
      limitations: content.limitations,
      fullFeatures: content.fullFeatures,
      systemRequirements: content.systemRequirements,
      about: tierAbout[slug],
      body: tierBodies[slug] ?? [],
      relatedBlogSlugs: productRelatedBlogSlugs[slug] ?? [],
      relatedForumSlugs: productRelatedForumSlugs[slug] ?? [],
    };
  });
}

function findProductCard(t: Translations, slug: UtilityProductSlug) {
  const match = (items: Translations['products']['items']) =>
    items.find((item) => slugFromHref(item.href) === slug);
  return match(t.products.items) ?? match(getTranslations('en').products.items);
}

function buildUtilityPages(t: Translations): ProductPage[] {
  return UTILITY_PRODUCT_SLUGS.flatMap((slug) => {
    const product = findProductCard(t, slug);
    const content = productContent[slug];
    if (!product || !content) return [];

    return [
      {
        slug,
        kind: 'utility' as const,
        badge: product.badge,
        category: product.category,
        name: product.title,
        title: product.title,
        subtitle: product.subtitle,
        desc: product.desc,
        features: product.features,
        more: Math.max(0, content.fullFeatures.length - product.features.length),
        buyUrl: checkoutForSlug(slug),
        images: content.images,
        overview: content.overview,
        acquisition: {
          title: utilityAcquisitionTitles[slug],
          steps: utilityAcquisitionSteps[slug],
        },
        goodToKnow: content.goodToKnow,
        limitations: content.limitations,
        fullFeatures: content.fullFeatures,
        systemRequirements: content.systemRequirements,
        body: utilityBodies[slug] ?? [],
        relatedBlogSlugs: productRelatedBlogSlugs[slug] ?? [],
        relatedForumSlugs: productRelatedForumSlugs[slug] ?? [],
      },
    ];
  });
}

export function getProductPages(locale: SiteLocale): ProductPage[] {
  const t = getTranslations(locale);
  return [...buildTierPages(t), ...buildUtilityPages(t)].map((page) =>
    deepApplySiteTokens(applyProductCopy(page, locale)),
  );
}

export function getCheatPages(locale: SiteLocale) {
  return getProductPages(locale).filter((p) => p.kind === 'tier');
}

export function getProductPage(slug: string, locale: SiteLocale) {
  return getProductPages(locale).find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  const slugs = getAllCheatSlugs();
  const catalog = new Set<string>(CHEAT_PRODUCT_SLUGS);
  for (const slug of slugs) {
    if (!catalog.has(slug as (typeof CHEAT_PRODUCT_SLUGS)[number])) {
      throw new Error(`Cheat slug "${slug}" missing from CHEAT_PRODUCT_SLUGS in src/config/catalog.ts`);
    }
  }
  return [];
}

export function getHwidSpooferPage(locale: SiteLocale) {
  return getProductPage(HWID_SPOOFER_SLUG, locale);
}

export function getUtilityPages(locale: SiteLocale) {
  return getProductPages(locale).filter((p) => p.kind === 'utility');
}

export function utilityProductPath(slug: UtilityProductSlug): string {
  return UTILITY_PRODUCT_PATHS[slug];
}

export function getAllCheatSlugs() {
  return getCheatPages('en').map((p) => p.slug);
}

export function getHeroSlides(locale: SiteLocale): ProductSlide[] {
  void locale;
  return showcaseSlides;
}

function acquisitionTitleFor(productName: string) {
  return `How to get ${productName}`;
}

function buildEnglishProductCopyBundle(): ProductCopyBundle {
  const tierSlugs = ['elite'] as const;
  const utilitySlugs = ALL_UTILITY_PRODUCT_SLUGS;

  const tiers = Object.fromEntries(
    tierSlugs.map((slug) => {
      const content = productContent[slug];
      const displayName = CHEAT_PRODUCT_NAME;
      return [
        slug,
        {
          about: tierAbout[slug],
          body: tierBodies[slug] ?? [],
          overview: content.overview,
          goodToKnow: content.goodToKnow,
          limitations: content.limitations,
          acquisitionTitle: acquisitionTitleFor(displayName),
        },
      ];
    }),
  ) as ProductCopyBundle['tiers'];

  const utilities = Object.fromEntries(
    utilitySlugs.map((slug) => {
      const content = productContent[slug];
      return [
        slug,
        {
          body: utilityBodies[slug] ?? [],
          overview: content.overview,
          goodToKnow: content.goodToKnow,
          limitations: content.limitations,
          acquisitionTitle: utilityAcquisitionTitles[slug],
          acquisitionSteps: utilityAcquisitionSteps[slug],
          systemRequirements: content.systemRequirements.map((r) => r.text),
        },
      ];
    }),
  ) as ProductCopyBundle['utilities'];

  return {
    sharedGoodToKnow,
    sharedLimitations,
    acquisitionSteps: defaultAcquisitionSteps.map(({ num, title, desc }) => ({ num, title, desc })),
    systemRequirements: mainProductSystemRequirements.map((r) => r.text),
    gallery: Object.values(galleryRaw).map(({ alt, caption, captionDesc }) => ({
      alt,
      caption,
      captionDesc,
    })),
    tiers,
    utilities,
  };
}

registerProductCopyBundle(buildEnglishProductCopyBundle());

export const heroSlides = getHeroSlides('en');

function applyProductCopy(page: ProductPage, _locale: SiteLocale): ProductPage {
  return page;
}
