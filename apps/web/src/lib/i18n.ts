import type { LocalizedText } from '@/content/schemas'
import { getLocale, localizeHref, type Locale } from '@/paraglide/runtime'

/**
 * The URL of an app path in a language (current language by default): `/budget` stays
 * `/budget` in English and becomes `/fil/budget` in Filipino. Locale roots have no trailing
 * slash, matching how the pages are served.
 */
export function localizePath(path: string, locale?: Locale) {
  const href = localizeHref(path, locale ? { locale } : undefined)
  return href.replace(/^(\/(?:fil|ceb))\/(?=$|[?#])/, '$1')
}

/** A Paraglide message without inputs, e.g. `m.nav_home`; call it to get the text. */
export type Message = () => string

/** Renders data that is either a message (translated) or literal text such as a year. */
export const text = (value: string | Message) => (typeof value === 'function' ? value() : value)

/** Picks the current language from content data, falling back to English. */
export const localized = (value: LocalizedText) => value[getLocale()] ?? value.en
