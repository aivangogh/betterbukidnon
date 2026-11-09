import { linkOptions, type LinkOptions } from '@tanstack/react-router'
import type { IconName } from '@/components/ui/icon'
import { contactDirectory } from './contact'
import type { TranslationKey } from './translations'

export type InternalNavLink = {
  label: TranslationKey
  link: LinkOptions
}
export type ExternalNavLink = { label: TranslationKey; href: string }
export type NavItem = {
  label: TranslationKey
  /** First path segments that mark this item as current (legacy SECTION_NAV). */
  sections: readonly string[]
  link?: LinkOptions
  children?: ReadonlyArray<InternalNavLink | ExternalNavLink>
}

const service = (label: TranslationKey, category: string): InternalNavLink => ({
  label,
  link: linkOptions({ to: '/services/$category', params: { category } }),
})

// Same items and order as the legacy scripts/chrome/header.html.
export const primaryNavigation: readonly NavItem[] = [
  { label: 'nav-home', sections: [''], link: linkOptions({ to: '/' }) },
  {
    label: 'nav-services',
    sections: ['services', 'service-details'],
    link: linkOptions({ to: '/services' }),
    children: [
      service('nav-certificates', 'certificates'),
      service('nav-business', 'business'),
      service('nav-tax-payments', 'tax-payments'),
      service('nav-social-services', 'social-services'),
      service('nav-health', 'health'),
      service('nav-agriculture', 'agriculture'),
      service('nav-infrastructure', 'infrastructure'),
      service('nav-education', 'education'),
      service('nav-public-safety', 'public-safety'),
      service('nav-environment', 'environment'),
    ],
  },
  { label: 'nav-government', sections: ['government'], link: linkOptions({ to: '/government' }) },
  { label: 'nav-statistics', sections: ['statistics'], link: linkOptions({ to: '/statistics' }) },
  {
    label: 'nav-legislative',
    sections: ['legislative'],
    link: linkOptions({ to: '/legislative' }),
    children: [
      {
        label: 'nav-ordinance-framework',
        link: linkOptions({ to: '/legislative/ordinance-framework' }),
      },
      {
        label: 'nav-resolution-framework',
        link: linkOptions({ to: '/legislative/resolution-framework' }),
      },
    ],
  },
  { label: 'nav-transparency', sections: ['budget'], link: linkOptions({ to: '/budget' }) },
  {
    // No link or "All Projects" entry until the Projects route exists.
    label: 'nav-projects',
    sections: ['projects'],
    children: [
      { label: 'nav-projects-budget', href: 'https://budget.betterbukidnon.org' },
      { label: 'nav-projects-saln', href: 'https://saln.betterbukidnon.org' },
      { label: 'nav-projects-infra', href: 'https://infra.betterbukidnon.org' },
    ],
  },
  { label: 'nav-contact', sections: ['contact'], link: linkOptions({ to: '/contact' }) },
]

export const footerQuickLinks: ReadonlyArray<InternalNavLink | ExternalNavLink> = [
  { label: 'footer-sitemap', link: linkOptions({ to: '/sitemap' }) },
  { label: 'footer-citizens-charter', href: 'https://bukidnon.gov.ph/' },
  { label: 'footer-terms-of-use', link: linkOptions({ to: '/terms' }) },
  { label: 'footer-privacy-policy', link: linkOptions({ to: '/privacy' }) },
  { label: 'footer-accessibility', link: linkOptions({ to: '/accessibility' }) },
  { label: 'footer-faq', link: linkOptions({ to: '/faq' }) },
]

export const footerResources: readonly ExternalNavLink[] = [
  { label: 'footer-open-data-philippines', href: 'https://data.gov.ph' },
  { label: 'footer-freedom-of-information', href: 'https://www.foi.gov.ph/' },
  { label: 'footer-official-lgu-bukidnon-portal', href: 'https://bukidnon.gov.ph/' },
  { label: 'footer-sangguniang-bayan', href: 'https://bukidnon.gov.ph/' },
  { label: 'footer-lgu-bukidnon-facebook', href: 'https://www.facebook.com/lgubukidnon' },
  { label: 'footer-blgf-portal', href: 'https://blgf.gov.ph/' },
  { label: 'footer-cmci-dti-portal', href: 'https://cmci.dti.gov.ph/' },
]

type HotlineLabel = (typeof contactDirectory.hotlines)[number]['label']

const hotlineBarLabels: Record<HotlineLabel, { short: string; icon: IconName }> = {
  Emergency: { short: 'Emergency', icon: 'telephone-fill' },
  PDRRMD: { short: 'PDRRMD', icon: 'exclamation-triangle-fill' },
  Police: { short: 'Police', icon: 'shield-fill' },
  Fire: { short: 'Fire', icon: 'fire' },
  'Provincial Health Office': { short: 'PHO', icon: 'heart-pulse-fill' },
  'Provincial Social Welfare': { short: 'PSWDO', icon: 'heart-fill' },
}

export const hotlineBarItems = contactDirectory.hotlines.map((hotline) => ({
  ...hotline,
  ...hotlineBarLabels[hotline.label],
}))

export const repositoryUrl = 'https://github.com/Better-Bukidnon/betterbukidnon'
export const volunteerEmail = 'volunteer@betterbukidnon.org'
