export const site = {
  name: 'BetterBukidnon.org',
  description:
    'Provincial services, officials, hotlines, and public information for the people of Bukidnon.',
  url: 'https://betterbukidnon.org',
  disclaimer: 'A volunteer civic project, not an official government website.',
} as const

export const navigation = [
  { label: 'nav.services', to: '/services' },
  { label: 'nav.government', to: '/government' },
  { label: 'nav.legislative', to: '/legislative' },
  { label: 'nav.statistics', to: '/statistics' },
  { label: 'nav.transparency', to: '/budget' },
  { label: 'nav.news', to: '/news' },
  { label: 'nav.contact', to: '/contact' },
] as const
