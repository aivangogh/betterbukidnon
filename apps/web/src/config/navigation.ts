import { linkOptions, type LinkOptions } from '@tanstack/react-router'
import type { IconName } from '@/components/ui/icon'
import { contactDirectory } from './contact'
import { m } from '@/paraglide/messages'
import type { Message } from '@/lib/i18n'

export type InternalNavLink = {
  label: Message
  link: LinkOptions
}
export type ExternalNavLink = { label: Message; href: string }
export type NavItem = {
  label: Message
  /** First path segments that mark this item as current (legacy SECTION_NAV). */
  sections: readonly string[]
  link?: LinkOptions
  children?: ReadonlyArray<InternalNavLink | ExternalNavLink>
}

const service = (label: Message, category: string): InternalNavLink => ({
  label,
  link: linkOptions({ to: '/services/$category', params: { category } }),
})

// Same items and order as the legacy scripts/chrome/header.html.
export const primaryNavigation: readonly NavItem[] = [
  { label: m.nav_home, sections: [''], link: linkOptions({ to: '/' }) },
  {
    label: m.nav_services,
    sections: ['services', 'service-details'],
    link: linkOptions({ to: '/services' }),
    children: [
      service(m.nav_certificates, 'certificates'),
      service(m.nav_business, 'business'),
      service(m.nav_tax_payments, 'tax-payments'),
      service(m.nav_social_services, 'social-services'),
      service(m.nav_health, 'health'),
      service(m.nav_agriculture, 'agriculture'),
      service(m.nav_infrastructure, 'infrastructure'),
      service(m.nav_education, 'education'),
      service(m.nav_public_safety, 'public-safety'),
      service(m.nav_environment, 'environment'),
    ],
  },
  { label: m.nav_government, sections: ['government'], link: linkOptions({ to: '/government' }) },
  { label: m.nav_statistics, sections: ['statistics'], link: linkOptions({ to: '/statistics' }) },
  {
    label: m.nav_legislative,
    sections: ['legislative'],
    link: linkOptions({ to: '/legislative' }),
    children: [
      {
        label: m.nav_ordinance_framework,
        link: linkOptions({ to: '/legislative/ordinance-framework' }),
      },
      {
        label: m.nav_resolution_framework,
        link: linkOptions({ to: '/legislative/resolution-framework' }),
      },
    ],
  },
  { label: m.nav_transparency, sections: ['budget'], link: linkOptions({ to: '/budget' }) },
  {
    label: m.nav_projects,
    sections: ['projects'],
    link: linkOptions({ to: '/projects' }),
    children: [
      { label: m.nav_projects_budget, href: 'https://budget.betterbukidnon.org' },
      { label: m.nav_projects_saln, href: 'https://saln.betterbukidnon.org' },
      { label: m.nav_projects_infra, href: 'https://infra.betterbukidnon.org' },
      { label: m.nav_projects_all, link: linkOptions({ to: '/projects' }) },
    ],
  },
  { label: m.nav_contact, sections: ['contact'], link: linkOptions({ to: '/contact' }) },
]

export const footerQuickLinks: ReadonlyArray<InternalNavLink | ExternalNavLink> = [
  { label: m.footer_sitemap, link: linkOptions({ to: '/sitemap' }) },
  { label: m.footer_citizens_charter, href: 'https://bukidnon.gov.ph/' },
  { label: m.footer_terms_of_use, link: linkOptions({ to: '/terms' }) },
  { label: m.footer_privacy_policy, link: linkOptions({ to: '/privacy' }) },
  { label: m.footer_accessibility, link: linkOptions({ to: '/accessibility' }) },
  { label: m.footer_faq, link: linkOptions({ to: '/faq' }) },
]

export const footerResources: readonly ExternalNavLink[] = [
  { label: m.footer_open_data_philippines, href: 'https://data.gov.ph' },
  { label: m.footer_freedom_of_information, href: 'https://www.foi.gov.ph/' },
  { label: m.footer_official_lgu_bukidnon_portal, href: 'https://bukidnon.gov.ph/' },
  { label: m.footer_sangguniang_bayan, href: 'https://bukidnon.gov.ph/' },
  { label: m.footer_lgu_bukidnon_facebook, href: 'https://www.facebook.com/lgubukidnon' },
  { label: m.footer_blgf_portal, href: 'https://blgf.gov.ph/' },
  { label: m.footer_cmci_dti_portal, href: 'https://cmci.dti.gov.ph/' },
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
