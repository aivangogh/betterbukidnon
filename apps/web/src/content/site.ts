export const site = {
  name: 'BetterBukidnon.org',
  description:
    'Provincial services, officials, hotlines, and public information for the people of Bukidnon.',
  url: 'https://betterbukidnon.org',
  disclaimer: 'A volunteer civic project, not an official government website.',
} as const

export const navigation = [
  { label: 'Services', to: '/services' },
  { label: 'Government', to: '/government' },
  { label: 'Legislative', to: '/legislative' },
  { label: 'Statistics', to: '/statistics' },
  { label: 'Transparency', to: '/budget' },
  { label: 'News', to: '/news' },
  { label: 'Contact', to: '/contact' },
] as const
