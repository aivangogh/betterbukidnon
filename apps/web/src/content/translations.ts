import type { Locale } from './schemas'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fil: 'Filipino',
  ceb: 'Cebuano',
}

const messages = {
  en: {
    'nav.services': 'Services',
    'nav.government': 'Government',
    'nav.legislative': 'Legislative',
    'nav.statistics': 'Statistics',
    'nav.transparency': 'Transparency',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'shell.emergency': 'Emergency',
    'shell.publicService': 'Public service',
    'shell.cost': 'Cost to the people of Bukidnon: ₱0',
    'shell.language': 'Language',
    'shell.skip': 'Skip to main content',
  },
  fil: {
    'nav.services': 'Mga Serbisyo',
    'nav.government': 'Pamahalaan',
    'nav.legislative': 'Lehislatura',
    'nav.statistics': 'Istatistika',
    'nav.transparency': 'Transparency',
    'nav.news': 'Balita',
    'nav.contact': 'Kontak',
    'shell.emergency': 'Emerhensiya',
    'shell.publicService': 'Serbisyong pampubliko',
    'shell.cost': 'Gastos para sa mga taga-Bukidnon: ₱0',
    'shell.language': 'Wika',
    'shell.skip': 'Dumiretso sa pangunahing nilalaman',
  },
  ceb: {
    'nav.services': 'Mga Serbisyo',
    'nav.government': 'Gobyerno',
    'nav.legislative': 'Lehislatura',
    'nav.statistics': 'Istatistika',
    'nav.transparency': 'Transparency',
    'nav.news': 'Balita',
    'nav.contact': 'Kontak',
    'shell.emergency': 'Emerhensiya',
    'shell.publicService': 'Serbisyo publiko',
    'shell.cost': 'Gasto sa mga taga-Bukidnon: ₱0',
    'shell.language': 'Pinulongan',
    'shell.skip': 'Adto sa pangunang sulod',
  },
} as const

export type TranslationKey = keyof (typeof messages)['en']

export function translate(locale: Locale, key: TranslationKey) {
  return messages[locale][key] ?? messages.en[key]
}
