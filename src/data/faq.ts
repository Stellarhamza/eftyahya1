import type { IconName } from '../components/icons/types';
import { normalizeInternalPath, ROUTES } from '../utils/path';
import type { SiteLocale } from '../i18n/locales';
import { getSiteFaqs as getSiteFaqsForLocale } from './faq/locale';
import { isUtilityEnabled } from '../config/catalog';
import { applySiteTokens } from '../i18n/brandTokens';

export type FaqTopic =
  | 'all'
  | 'plans'
  | 'esp'
  | 'aim'
  | 'safety'
  | 'products'
  | 'blog'
  | 'setup';

export interface SiteFaqItem {
  id: string;
  topic: FaqTopic;
  icon: IconName;
  q: string;
  a: string;
  aHtml?: string;
  scopes?: string[];
  /** Utility slugs the answer talks about; the item is hidden when any of them is not sold. */
  requires?: string[];
}

function a(text: string): string {
  return text;
}

function link(text: string, href: string): string {
  return `<a href="${normalizeInternalPath(href)}">${text}</a>`;
}

const cheatLink = (label: string) => link(label, ROUTES.cheats);
const hwid = link('HWID Spoofer', ROUTES.hwidSpoofer);
const allProducts = link('products page', ROUTES.productsHub);
const faqPage = link('full FAQ', ROUTES.faq);
const blog = link('blog guides', ROUTES.blog);

export const siteFaqs: SiteFaqItem[] = [
  {
    id: 'status',
    topic: 'setup',
    icon: 'faqStatus',
    q: 'Where can I review current Escape from Tarkov product information?',
    a: a('Review the relevant product page and contact support for current availability or requirement questions before checkout.'),
  },
  {
    id: 'after-buy',
    topic: 'setup',
    icon: 'faqAfterBuy',
    q: 'What happens after I buy?',
    a: a('Checkout opens the current purchase flow. Review its current terms and requirements before payment.'),
  },
  {
    id: 'ban-risk',
    topic: 'safety',
    icon: 'faqBanRisk',
    q: 'Can third-party Escape from Tarkov software lead to account action?',
    a: a('Yes. Battlestate Games and BattlEye can restrict unauthorized third-party software. Read official EFT and platform terms before checkout.'),
    aHtml:
      'Yes. Battlestate Games and BattlEye can restrict unauthorized third-party software. Read official EFT and platform terms before checkout.',
  },
  {
    id: 'platforms',
    topic: 'setup',
    icon: 'faqPlatforms',
    q: 'Which platforms are supported?',
    a: a('Check the current product page and vendor documentation for supported operating systems and requirements.'),
  },
  {
    id: 'license-move',
    topic: 'setup',
    icon: 'faqLicenseMove',
    q: 'Can I move my license to a new PC?',
    a: a('License and device policies are not documented on this site. Ask support for the current transfer, reset, or hardware rules before you pay.'),
  },
  {
    id: 'products-page',
    topic: 'products',
    icon: 'faqProductsPage',
    q: 'Where are products and utilities listed?',
    a: `Every product is on the ${allProducts}: {productList}. Each page lists its features and opens checkout.`,
  },
  {
    id: 'ugc-what',
    topic: 'products',
    icon: 'accountRecovery',
    q: 'What does UGC do with a restricted account?',
    a: `${link('UGC account-appeal workflow', ROUTES.ugc)} (Unban & Governance Control) helps organize an appeal. A publisher controls each outcome; no reversal is promised.`,
    scopes: ['ugc'],
    requires: ['ugc'],
  },
  {
    id: 'ugc-guarantee',
    topic: 'safety',
    icon: 'faqBanRisk',
    q: 'Does UGC promise to lift a suspension?',
    a: a('No. UGC formats the evidence and the message. A reviewer decides each case. Some suspensions never lift. A reversal is not promised.'),
    scopes: ['ugc'],
    requires: ['ugc'],
  },
  {
    id: 'ugc-vs-hwid',
    topic: 'products',
    icon: 'faqHwidWhen',
    q: 'Is this an account limit or a block on this PC?',
    a: `A profile or account restriction is an appeal matter within the ${link('UGC account-appeal scope', ROUTES.ugc)}. Hardware questions are separate; the ${link('HWID Spoofer hardware scope', ROUTES.hwidSpoofer)} does not promise any account outcome.`,
    scopes: ['ugc', 'hwid-spoofer'],
    requires: ['ugc', 'hwid-spoofer'],
  },
  {
    id: 'utility-requirements',
    topic: 'setup',
    icon: 'faqPlatforms',
    q: 'What Windows setup do the utilities need?',
    a: a('Requirements vary by product. Check the current vendor product page and ask support before changing Windows or firmware settings.'),
    scopes: ['hwid-spoofer', 'ugc', 'skin-changer'],
  },
  {
    id: 'what-is-esp',
    topic: 'esp',
    icon: 'faqWhatIsEsp',
    q: 'What do Tarkov ESP and wallhack search terms mean?',
    a: `ESP usually means player, loot, or extraction overlays in raids. It is not a promise of detection status. Read the ${cheatLink('Escape from Tarkov ESP scope')} on the main product page.`,
    scopes: ['elite'],
  },
  {
    id: 'esp-vs-aim',
    topic: 'esp',
    icon: 'faqEspVsScripts',
    q: 'What is the difference between ESP and aimbot?',
    a: `ESP covers raid information (players, loot, exfils). Aimbot covers silent aim, soft aim, and recoil helpers. The ${cheatLink('current Escape from Tarkov Cheats listing')} names what your plan includes after each BattlEye update.`,
  },
  {
    id: 'elite-slots',
    topic: 'plans',
    icon: 'faqEliteSlots',
    q: 'Why is the cheat sold as a private build?',
    a: a('“Private” is usually a marketing label. This site does not verify slot counts, patch speed, or developer support; ask support what the label means on the current listing before checkout.'),
    scopes: ['elite'],
  },
  {
    id: 'stream-proof',
    topic: 'esp',
    icon: 'faqStreamProof',
    q: 'Can OBS capture my overlay?',
    a: a('Capture behavior depends on how a product is implemented and is not verified here. Assume streaming or recording may show overlays until support confirms otherwise for your setup.'),
  },
  {
    id: 'build-status',
    topic: 'safety',
    icon: 'faqUndetected',
    q: 'Will the build stay online after every patch?',
    a: a('No. Game and protection updates can change availability at any time. Read the current listing and any status notice before you start a session; if status is unclear, ask support.'),
  },
  {
    id: 'esp-safer',
    topic: 'safety',
    icon: 'faqEspSafer',
    q: 'Is ESP lower-profile than aimbot?',
    a: a('ESP can be less obvious than a maxed aimbot. It is still a cheat. Leaving aim assist off does not remove it from anti-cheat review.'),
  },
  {
    id: 'hwid-when',
    topic: 'products',
    icon: 'faqHwidWhen',
    q: 'When is the HWID Spoofer the product to open?',
    a: `${link('HWID Spoofer product details', ROUTES.hwidSpoofer)} is for a hardware ID flag: other PCs accept the login and this one refuses it. Disk serials are refreshed. MAC addresses, GPU IDs, and related values are refreshed too. A cleaner is included. An account that stays sanctioned is not cleared.`,
    scopes: ['hwid-spoofer'],
    requires: ['hwid-spoofer'],
  },
  {
    id: 'external-loader',
    topic: 'products',
    icon: 'faqExternalLoader',
    q: 'Is the loader injected into the game folder?',
    a: `The private loader runs outside the BSG game folder. Review the ${cheatLink('Escape from Tarkov software scope')}; BattlEye penalties can still follow.`,
  },
  {
    id: 'blog-vs-cheats',
    topic: 'blog',
    icon: 'faqBlogVsCheats',
    q: 'Does this article replace the live status banner?',
    a: `No. Guides explain a topic. Review ${cheatLink('Escape from Tarkov product requirements')} and official game rules before making a decision.`,
  },
  {
    id: 'blog-setup',
    topic: 'blog',
    icon: 'faqBlogSetup',
    q: 'Where do blog setup guides point for purchase?',
    a: `Guides link to ${cheatLink('Escape from Tarkov purchase information')}. Checkout runs through our secure redirect. Follow whatever delivery path the current product documentation describes.`,
  },
  {
    id: 'who-cheats',
    topic: 'plans',
    icon: 'faqWhoElite',
    q: 'Who should review Escape from Tarkov Cheats?',
    a: `People researching the stated product scope, requirements, terms, and risks before deciding whether to checkout.`,
    scopes: ['elite'],
  },
  {
    id: 'anticheat-update',
    topic: 'safety',
    icon: 'faqVacUpdate',
    q: 'What should I do after a BattlEye or game update?',
    a: a('Read the current listing and any official game or platform notices. Assume compatibility and status can change; if something is unclear after an update, wait and ask support before launching.'),
  },
  {
    id: 'discord-help',
    topic: 'setup',
    icon: 'headphones',
    q: 'How do I get install help?',
    a: a('For support, include the order email, Windows version, exact product, and visible error text. Do not share credentials.'),
  },
  {
    id: 'pmc-scav-raids',
    topic: 'plans',
    icon: 'faqTurboRanked',
    q: 'Does the cheat apply to PMC and Scav raids?',
    a: `Most shoppers use the suite in online PMC raids. Confirm Scav, offline, and co-op scope on the ${cheatLink('live listing')} before checkout.`,
  },
  {
    id: 'zoom-hack',
    topic: 'esp',
    icon: 'faqZoomHack',
    q: 'Which options cover ESP and wallhack?',
    a: `Wallhack searches usually mean player boxes, skeletons, or chams. The ${cheatLink('Escape from Tarkov Cheats listing')} names current overlay fields; check the status banner after wipes.`,
    scopes: ['elite'],
  },
  {
    id: 'trigger-bot',
    topic: 'aim',
    icon: 'faqAutoFarm',
    q: 'Does the product include silent aimbot?',
    a: `Silent aim and soft aim are common Tarkov toggles. Confirm what your plan includes on the ${cheatLink('current Escape from Tarkov Cheats listing')} and in the loader after patches.`,
    scopes: ['elite'],
  },
  {
    id: 'private-cheats',
    topic: 'safety',
    icon: 'faqPrivateCheats',
    q: 'What should “private cheat” mean on a Tarkov product page?',
    a: a('Treat “private” as a marketing label unless the product page explains its precise scope, terms, and limitations.'),
  },
  {
    id: 'skin-visible',
    topic: 'products',
    icon: 'cosmetic',
    q: 'Can other players see my Skin Changer visuals?',
    a: `${link('Skin Changer', ROUTES.skinChanger)} edits your client view. Unless the listing states otherwise, others usually see default kits in raid.`,
    scopes: ['skin-changer'],
    requires: ['skin-changer'],
  },
  {
    id: 'skin-vs-cheats',
    topic: 'products',
    icon: 'faqProductsPage',
    q: 'Is Skin Changer included with Escape from Tarkov Cheats?',
    a: `No. Skins use a separate license on the ${link('Skin Changer page', ROUTES.skinChanger)}. The main ${cheatLink('cheat suite')} covers ESP, aimbot, and radar.`,
    scopes: ['skin-changer', 'elite'],
    requires: ['skin-changer'],
  },
  {
    id: 'dma-keyword',
    topic: 'products',
    icon: 'featureUtilitySuite',
    q: 'Do you sell a tarkov DMA cheat?',
    a: `This shop lists a ${cheatLink('software loader')} for standard Windows PCs. Hardware DMA setups are not sold here—ask support if you run DMA gear.`,
    scopes: ['elite'],
  },
  {
    id: 'faq-more',
    topic: 'all',
    icon: 'faqMore',
    q: 'Where is the full FAQ?',
    a: `Short answers sit on the homepage and on each product page. The ${faqPage} holds the full set, and ${blog} is where longer guides go when they are published.`,
  },
];

/** Shared FAQ block copy + filters (home, /faq/, products, blog). */
export const SITE_FAQ_SECTION_COPY = {
  eyebrow: 'All topics',
  title: 'Faq: Browse by category',
  subtitle: 'Plans, ESP, aim, products, setup, and the longer answers.',
} as const;

export const SITE_FAQ_FILTER_TOPICS: FaqTopic[] = [
  'all',
  'plans',
  'esp',
  'aim',
  'safety',
  'products',
  'blog',
  'setup',
];

/** Section copy when FAQ list is scoped to the current page (not /faq/). */
export const CONTEXTUAL_FAQ_SECTION_COPY = {
  eyebrow: 'FAQ',
  title: 'Questions about this page',
  subtitle: 'Answers for this page. The FAQ page holds the rest.',
} as const;

export function faqFilterTopicsForItems(items: SiteFaqItem[]): FaqTopic[] {
  const present = new Set(items.map((item) => item.topic));
  const topics: FaqTopic[] = ['all'];
  for (const topic of SITE_FAQ_FILTER_TOPICS) {
    if (topic !== 'all' && present.has(topic)) topics.push(topic);
  }
  return topics;
}

export { getProductFaqs, getSiteFaqs, getLandingFaqs, getAllFaqs } from './faq/locale';

const blogTopicFaqs: Record<string, SiteFaqItem[]> = {
  'Buyer Guides': [
    {
      id: 'blog-buyer-start',
      topic: 'blog',
      icon: 'faqBlogGuideStart',
      q: 'Do buyer guides replace the live product page?',
      a: a('No. Guides explain what to check before checkout. Review current product information and official rules before you decide.'),
    },
    {
      id: 'blog-buyer-tier',
      topic: 'blog',
      icon: 'faqBlogGuideTier',
      q: 'Which product matches a buyer guide checklist?',
      a: `Feature checklists map to the ${link('listed combat modules', ROUTES.cheats)}. Recovery or hardware topics point to the matching utility on the ${allProducts}.`,
    },
    {
      id: 'blog-buyer-status',
      topic: 'blog',
      icon: 'faqBlogGuideStatus',
      q: 'Is this buyer guide still valid after a patch?',
      a: a('Check the article date and the live status banner. Patch-day notes on {siteDomain} override older screenshots.'),
    },
  ],
  Features: [
    {
      id: 'blog-features-esp',
      topic: 'blog',
      icon: 'faqBlogSlugEsp',
      q: 'Which product includes ESP from this article?',
      a: `The ${link('stated product scope page', ROUTES.cheats)} lists the current scope. It does not guarantee compatibility, safety, or a game-account outcome.`,
    },
    {
      id: 'blog-features-docs',
      topic: 'blog',
      icon: 'faqBlogGuideTier',
      q: 'Where is the authoritative feature list?',
      a: `Articles summarize options. The ${link('live module list', ROUTES.cheats)} is what checkout covers.`,
    },
  ],
  Comparisons: [
    {
      id: 'blog-compare-paid',
      topic: 'blog',
      icon: 'faqBlogGuideStart',
      q: 'Do comparison articles change enforcement risk?',
      a: a('No. Comparisons explain tradeoffs. Any third-party tool can still lead to enforcement. Read status before you launch.'),
    },
    {
      id: 'blog-compare-checkout',
      topic: 'blog',
      icon: 'faqBlogSetup',
      q: 'Where do comparison guides link for purchase?',
      a: `Guides link to product pages such as the ${link('Escape from Tarkov product listing', ROUTES.cheats)}. Checkout runs through our secure redirect, not random file shares.`,
    },
  ],
  Tools: [
    {
      id: 'blog-tools-hwid',
      topic: 'blog',
      icon: 'faqBlogSlugHwid',
      q: 'Can a spoofer article replace the HWID product page?',
      a: `Articles teach ideas only. Pricing, requirements, and workflow scope stay on ${hwid}.`,
      requires: ['hwid-spoofer'],
    },
    {
      id: 'blog-tools-support',
      topic: 'blog',
      icon: 'faqBlogSetupLoader',
      q: 'Need help after reading a tools article?',
      a: a('Open a support ticket with your order email and the article slug. Staff reference the same portal steps as product pages.'),
    },
  ],
  Troubleshooting: [
    {
      id: 'blog-trouble-status',
      topic: 'blog',
      icon: 'faqBlogSecVac',
      q: 'Does this troubleshooting article mean the build is online?',
      a: a('No article replaces the live status banner. Check {siteDomain} after every patch before you launch.'),
    },
    {
      id: 'blog-trouble-support',
      topic: 'blog',
      icon: 'headphones',
      q: 'Still stuck after the checklist?',
      a: a('Contact support with your game build, Windows version and the exact error text. Include what you already tried from the article.'),
    },
  ],
  Guides: [
    {
      id: 'blog-guide-start',
      topic: 'blog',
      icon: 'faqBlogGuideStart',
      q: 'Does this guide replace the live status banner?',
      a: a('No. Guides explain a topic. Live play still uses the product on {siteDomain} when the banner says online.'),
    },
    {
      id: 'blog-guide-tier',
      topic: 'blog',
      icon: 'faqBlogGuideTier',
      q: 'Which tier matches this guide?',
      a: `Setup and feature guides map to ${link('modules on the main product page', ROUTES.cheats)}. Ban recovery articles point to the matching utility on the ${allProducts}.`,
    },
    {
      id: 'blog-guide-status',
      topic: 'blog',
      icon: 'faqBlogGuideStatus',
      q: 'Is this guide still valid after a patch?',
      a: a('Check the article date and the live status banner. Patch-day articles note when modules change. The status banner has the latest build notes.'),
    },
  ],
  Setup: [
    {
      id: 'blog-setup-loader',
      topic: 'blog',
      icon: 'faqBlogSetupLoader',
      q: 'Where do I download the loader?',
      a: a('Only from your operator portal after checkout, not from third-party links in comments or DMs.'),
    },
    {
      id: 'blog-setup-lobby',
      topic: 'blog',
      icon: 'faqBlogSetupLobby',
      q: 'Does a guide prove a product is safe to use?',
      a: a('No. A guide cannot establish safety, compatibility, or a publisher’s enforcement decision.'),
    },
  ],
  Security: [
    {
      id: 'blog-sec-vac',
      topic: 'blog',
      icon: 'faqBlogSecVac',
      q: 'Does this article mean the build stays online?',
      a: a('No article replaces the live status banner. Check {siteDomain} after every patch before you launch.'),
    },
  ],
};

const defaultBlogFaqs: SiteFaqItem[] = [
  {
    id: 'blog-default-1',
    topic: 'blog',
    icon: 'faqBlogDefault1',
    q: 'Are blog guides official product documentation?',
    a: `Articles explain workflows and link to product pages such as the ${link('authoritative feature list', ROUTES.cheats)}. Feature lists on those pages are authoritative for checkout.`,
  },
  {
    id: 'blog-default-2',
    topic: 'blog',
    icon: 'faqBlogDefault2',
    q: 'Need help applying this guide?',
    a: a('Open a support ticket with your order email and the article slug. Staff reference the same portal presets mentioned in guides.'),
  },
  {
    id: 'blog-default-3',
    topic: 'blog',
    icon: 'faqBlogDefault3',
    q: 'Will settings in this article work next patch?',
    a: a('Re-check article dates, product information, and official rules after a Tarkov wipe or BattlEye update.'),
  },
];

const BLOG_FAQ_IDS: Record<string, string[]> = {
  'best-tarkov-cheats-2026': ['after-buy', 'platforms', 'products-page', 'blog-setup', 'status'],
  'tarkov-cheats-guide': ['status', 'ban-risk', 'platforms', 'blog-vs-cheats'],
  'hwid-spoofer-guide': ['hwid-when', 'ugc-vs-hwid', 'license-move', 'after-buy', 'platforms'],
  'eft-skin-changer': ['skin-visible', 'skin-vs-cheats', 'utility-requirements'],
  'ugc-appeal-automation': ['ugc-what', 'ugc-guarantee', 'ugc-vs-hwid', 'after-buy'],
};

const DEFAULT_BLOG_FAQ_IDS = ['blog-vs-cheats', 'blog-setup', 'status', 'after-buy', 'platforms'];

function pickFaqItems(ids: string[], locale: SiteLocale): SiteFaqItem[] {
  const localized = getSiteFaqsForLocale(locale);
  const seen = new Set<string>();
  return ids
    .map((id) => localized.find((item) => item.id === id))
    .filter((item): item is SiteFaqItem => Boolean(item))
    .filter((item) => (item.requires ?? []).every(isUtilityEnabled))
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, 5)
    .map((item) => ({ ...item, q: applySiteTokens(item.q), a: applySiteTokens(item.a) }));
}

export function getBlogFaqs(_tag: string, slug: string, locale: SiteLocale = 'en'): SiteFaqItem[] {
  return pickFaqItems(BLOG_FAQ_IDS[slug] ?? DEFAULT_BLOG_FAQ_IDS, locale);
}

export function getForumFaqs(slug: string, locale: SiteLocale = 'en'): SiteFaqItem[] {
  const ids = ['status', 'after-buy', 'ban-risk', 'platforms'];
  if (slug.includes('hwid')) ids.unshift('hwid-when');
  if (slug.includes('skin')) ids.unshift('skin-visible');
  if (slug.includes('ugc')) ids.unshift('ugc-what');
  if (slug.includes('esp') || slug.includes('minimap')) ids.unshift('what-is-esp');
  if (slug.includes('aim')) ids.unshift('esp-vs-aim');
  if (slug.includes('license') || slug.includes('lifetime')) ids.unshift('elite-slots');
  if (slug.includes('ban-risk') || slug.includes('cheat-ban')) ids.unshift('build-status');
  return pickFaqItems(ids, locale);
}

