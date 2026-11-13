import { site } from '@/content/site'
import { baseLocale, getLocale, locales as allLocales, type Locale } from '@/paraglide/runtime'
import { localizePath } from './i18n'

const ogLocale: Record<Locale, string> = { en: 'en_PH', fil: 'fil_PH', ceb: 'ceb_PH' }
const defaultImage = '/og/default.png'

/** An absolute production URL. Canonical and alternate links always point to production. */
export const absoluteUrl = (path: string) => (path === '/' ? site.url : `${site.url}${path}`)

export type SeoInput = {
  /** Page name; rendered as "Title | BetterBukidnon.org". Omit on the home page. */
  title?: string
  description: string
  /** The route path without a language prefix, e.g. `/services/health`. */
  path: string
  image?: string
  /** Pages that should not appear in search results (admin tools, the offline fallback). */
  noindex?: boolean
  /**
   * The languages the page is written in (default: all). In any other language the page
   * shows the English text, so its canonical URL is the English page.
   */
  locales?: readonly Locale[]
}

/**
 * Head tags for a route: title, description, canonical and hreflang links for every language,
 * and Open Graph / Twitter cards. Used as `head: () => seo({...})`.
 */
export function seo({
  title,
  description,
  path,
  image = defaultImage,
  noindex = false,
  locales = allLocales,
}: SeoInput) {
  const locale = getLocale()
  const canonicalLocale = locales.includes(locale) ? locale : baseLocale
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | Bukidnon Civic Portal`
  const url = absoluteUrl(localizePath(path, canonicalLocale))
  const imageUrl = absoluteUrl(image)

  const meta = [
    { title: fullTitle },
    { name: 'description', content: description },
    { name: 'robots', content: noindex ? 'noindex, follow' : 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: site.name },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    // No og:locale:alternate: head tags are de-duplicated by property, and hreflang links
    // already list every language version.
    { property: 'og:locale', content: ogLocale[canonicalLocale] },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]

  const links = noindex
    ? []
    : [
        { rel: 'canonical', href: url },
        ...locales.map((other) => ({
          rel: 'alternate',
          hrefLang: other,
          href: absoluteUrl(localizePath(path, other)),
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: absoluteUrl(localizePath(path, 'en')) },
      ]

  return { meta, links }
}

/** JSON for a <script> element; escaping `<` keeps text from closing the script early. */
export const scriptJson = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

/** A JSON-LD script for a route's `head().scripts`. */
export const jsonLd = (data: Record<string, unknown>) => ({
  type: 'application/ld+json',
  children: scriptJson({ '@context': 'https://schema.org', ...data }),
})
