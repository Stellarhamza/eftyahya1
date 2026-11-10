import { BLOG_PRIMARY_KEYWORD_BY_SLUG } from './keywordMap';

export interface ClusterLink {
  href: string;
  anchor: string;
}

const CHEATS: ClusterLink = { href: '/cheats/', anchor: 'Escape from Tarkov cheats' };
const HWID: ClusterLink = { href: '/hwid-spoofer/', anchor: 'Tarkov HWID spoofer' };
const SKIN: ClusterLink = { href: '/skin-changer/', anchor: 'Escape from Tarkov skin changer' };
const UGC: ClusterLink = { href: '/ugc/', anchor: 'Tarkov UGC account appeal' };

const BY_SLUG: Record<string, ClusterLink> = {
  'tarkov-cheats-guide': CHEATS,
  'esp-vs-wallhack': CHEATS,
  'loot-esp-guide': CHEATS,
  'tarkov-aimbot-guide': CHEATS,
  'best-tarkov-cheats-2026': CHEATS,
  'eft-skin-changer': SKIN,
  'weapon-skin-changer': SKIN,
  'skin-changer-vs-official': SKIN,
  'skin-changer-troubleshoot': SKIN,
  'skin-changer-faq': SKIN,
  'hwid-spoofer-guide': HWID,
  'hwid-ban-vs-account': HWID,
  'hwid-spoofer-types': HWID,
  'hwid-error-codes': HWID,
  'hwid-spoofer-faq': HWID,
  'ugc-appeal-automation': UGC,
  'unban-tarkov-2026': UGC,
  'battleye-appeal': UGC,
  'ban-appeal-mistakes': UGC,
  'account-security': UGC,
};

/** One product URL per guide, using the primary query as the anchor. */
export function clusterLinkForSlug(slug: string): ClusterLink {
  return BY_SLUG[slug] ?? CHEATS;
}

export function primaryKeywordForSlug(slug: string): string {
  return BLOG_PRIMARY_KEYWORD_BY_SLUG[slug] ?? slug;
}
