import { localized } from '@/lib/i18n'
import { getLocale, type Locale } from '@/paraglide/runtime'

export type { Locale }

/** Names shown in the language menu, in each language's own spelling. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  fil: 'Filipino',
  ceb: 'Cebuano (Binisaya)',
}

/**
 * The page's language comes from its URL (/, /fil/..., /ceb/...), so it is fixed for a render.
 * Interface text uses Paraglide's `m.*()`; `l()` picks the language from content data.
 */
export function useLocale() {
  const locale = getLocale()
  return {
    locale,
    l: localized,
  }
}
