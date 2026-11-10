/**
 * Keyword homes (see product/blog routing in this file).
 * Primary aligns with homepage H1. These constants are not rendered on pages.
 */
export const PRIMARY_KEYWORD = 'Escape from Tarkov Cheats';

/** One representative angle per page that has one. */
export const SECONDARY_KEYWORD_BY_PATH: Record<string, string> = {
  '/': 'escape from tarkov cheats',
  '/cheats/': 'buy tarkov cheats',
  '/skin-changer/': 'tarkov unlock all',
  '/ugc/': 'legit tarkov assist',
  '/hwid-spoofer/': 'tarkov hwid spoof',
};

/** Each mapped angle points at one existing page. */
export const SECONDARY_KEYWORD_HOME: Record<string, string> = {
  'escape from tarkov cheats': '/',
  'buy tarkov cheats': '/cheats/',
  'best tarkov cheats': '/cheats/',
  'tarkov private cheat': '/cheats/',
  'tarkov cheat shop': '/cheats/',
  'best tarkov aimbot': '/cheats/',
  'tarkov soft aim': '/cheats/',
  'tarkov radar hack': '/cheats/',
  'tarkov spoof tool': '/hwid-spoofer/',
  'tarkov unlock all': '/skin-changer/',
  'tarkov wallhack 2026': '/cheats/',
  'tarkov premium loader': '/cheats/',
  'tarkov hwid spoof': '/hwid-spoofer/',
  'legit tarkov assist': '/ugc/',
  'tarkov esp': '/cheats/',
  'tarkov aimbot': '/cheats/',
  'buy hwid spoofer cheats': '/hwid-spoofer/',
  'hwid spoofer private cheat': '/hwid-spoofer/',
  'buy ugc cheats': '/ugc/',
  'ugc private cheat': '/ugc/',
  // Blog primary keywords → product homes
  'escape from tarkov esp': '/cheats/',
  'tarkov loot esp': '/cheats/',
  'best tarkov cheats 2026': '/cheats/',
  'escape from tarkov skin changer': '/skin-changer/',
  'tarkov weapon skin changer': '/skin-changer/',
  'tarkov hwid spoofer': '/hwid-spoofer/',
  'tarkov ugc account appeal': '/ugc/',
};
