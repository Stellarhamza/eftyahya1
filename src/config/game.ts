/**
 * The game this site sells cheats for. Change these values when re-using the template for another title.
 *
 * Shared copy (utility products, catalog page, legal footer) reads these through the
 * `{gameName}`, `{gameShort}`, `{gamePublisher}` and `{antiCheat}` tokens. Game-specific
 * marketing copy (homepage, cheat product page, blog, forum) still has to be rewritten per game.
 */
export const GAME = {
  name: 'Escape from Tarkov',
  shortName: 'EFT',
  publisher: 'Battlestate Games',
  antiCheat: 'BattlEye',
  officialUrl: 'https://www.escapefromtarkov.com/',
  /** Player support and help on the official site. */
  supportUrl: 'https://www.escapefromtarkov.com/support',
  /** Official store listing for PC (Battlestate launcher). */
  steamStoreUrl: 'https://store.steampowered.com/app/3932890/Escape_from_Tarkov/',
  publisherUrl: 'https://www.battlestategames.com/',
  battlEyeUrl: 'https://www.battleye.com/',
} as const;

/** Display name of the main cheat product, used in menus, cards and comparison headers. */
export const CHEAT_PRODUCT_NAME = 'Escape from Tarkov Cheats';
