/** When false, hide the language switcher and emit English-only hreflang (locales stay in Astro for build stability). */
export function isPublicI18nEnabled(): boolean {
  const raw =
    typeof import.meta !== 'undefined'
      ? (import.meta.env?.PUBLIC_I18N_ENABLED as string | undefined)
      : process.env.PUBLIC_I18N_ENABLED;
  return raw === 'true' || raw === '1';
}
