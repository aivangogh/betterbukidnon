import { site } from '@/content/site'
import { locales } from '@/paraglide/runtime'
import { localizePath } from './i18n'
import { absoluteUrl, jsonLd } from './seo'

/**
 * The legacy homepage's JSON-LD: the site is published by volunteers and is *about* the
 * Provincial Government, never presented as the government itself.
 */
export function homeStructuredData() {
  return [
    jsonLd({
      '@type': 'WebSite',
      name: site.name,
      alternateName: 'Better Bukidnon',
      url: absoluteUrl(localizePath('/')),
      description:
        'Volunteer civic portal for the Province of Bukidnon, Philippines. Not an official government website.',
      inLanguage: [...locales],
      publisher: {
        '@type': 'Organization',
        name: 'BetterBukidnon volunteers',
        url: 'https://github.com/Better-Bukidnon/betterbukidnon',
      },
      about: {
        '@type': 'GovernmentOrganization',
        name: 'Provincial Government of Bukidnon',
        url: 'https://bukidnon.gov.ph',
        telephone: '+63 88 813 5741',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Provincial Capitol Compound, Barangay 9',
          addressLocality: 'Malaybalay City',
          addressRegion: 'Bukidnon',
          postalCode: '8700',
          addressCountry: 'PH',
        },
        geo: { '@type': 'GeoCoordinates', latitude: '8.1575', longitude: '125.1278' },
        areaServed: { '@type': 'AdministrativeArea', name: 'Bukidnon' },
      },
      // /services reads ?q= and opens the search results.
      potentialAction: {
        '@type': 'SearchAction',
        target: `${absoluteUrl('/services')}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
  ]
}

/**
 * BreadcrumbList for a page's breadcrumb trail; the last item is the current page.
 * `href` is the already-localized URL path of each linked crumb.
 */
export function breadcrumbStructuredData(items: ReadonlyArray<{ label: string; href?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  }
}
