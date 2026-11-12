import { describe, expect, it } from 'vite-plus/test'
import { getSuggestions, searchCategories, searchServices, serviceHref } from './search'

// Recorded by running the legacy assets/js/search.js over the same data/services.json.
const legacy = {
  search: {
    birth: ['birth-certificate', 'certificates'],
    'birth certificate': [
      'birth-certificate',
      'certificates',
      'marriage-certificate',
      'death-certificate',
      'tax-payments',
      'civil-registrar',
    ],
    'birht certficate': [
      'birth-certificate',
      'certificates',
      'marriage-certificate',
      'death-certificate',
      'civil-registrar',
    ],
    tax: [
      'tax-payments',
      'property-declaration',
      'provincial-treasurer',
      'provincial-assessor',
      'provincial-accounting',
      'provincial-budget',
    ],
    'real property tax': [
      'tax-payments',
      'property-declaration',
      'provincial-treasurer',
      'provincial-assessor',
      'provincial-general-services',
      'provincial-accounting',
      'provincial-budget',
    ],
    'business permit': [
      'business-permits-licensing',
      'business',
      'infrastructure',
      'civil-registrar',
    ],
    pswdo: ['pswdo', 'social-services'],
    hospital: ['provincial-health-office', 'health', 'legislative'],
    helth: ['provincial-health-office', 'health'],
    governor: ['government', 'officials'],
    senior: ['pswdo', 'social-services'],
    pwd: ['pswdo', 'social-services'],
    marriage: ['marriage-certificate', 'certificates'],
    death: ['death-certificate', 'certificates'],
    assessor: ['provincial-assessor', 'property-declaration'],
    engineer: ['provincial-engineering', 'infrastructure', 'civil-registrar'],
    farm: ['provincial-agriculture', 'agriculture'],
    scholarship: ['education'],
    disaster: ['pdrrmd', 'public-safety'],
    hotline: ['contact', 'pdrrmd', 'public-safety', 'civil-registrar'],
    zzzz: [],
  },
  filtered: [
    'certificates',
    'birth-certificate',
    'marriage-certificate',
    'death-certificate',
    'civil-registrar',
  ],
  suggest: {
    b: [
      'Birth Certificate',
      'Civil Registration in Bukidnon',
      'Business Permits & Licensing',
      'Business Permits & Licenses',
      'Provincial Budget Office',
      'PDRRMD Bukidnon',
      'Public Safety & Emergency Services',
      'Provincial Government of Bukidnon',
    ],
    bi: ['Birth Certificate', 'birth', 'birth certificate'],
    tax: [
      'Tax Declaration (Property Declaration)',
      'Tax & Payment Services',
      'tax declaration',
      'real property tax',
    ],
    helth: [],
    zzzz: [],
  },
  categories: [
    ['certificates', 'Certificates'],
    ['business', 'Business'],
    ['tax-payments', 'Taxation'],
    ['social-services', 'Social'],
    ['health', 'Health'],
  ],
} as const

const ids = (query: string, category?: string) =>
  searchServices(query, { category }).map((service) => service.id)

describe('service search matches the legacy engine', () => {
  for (const [query, expected] of Object.entries(legacy.search)) {
    it(`ranks "${query}" like legacy`, () => {
      expect(ids(query)).toEqual(expected)
    })
  }

  it('applies a category filter like legacy', () => {
    expect(ids('certificate', 'certificates')).toEqual(legacy.filtered)
  })

  it('offers the same "Did you mean?" suggestions', () => {
    for (const [query, expected] of Object.entries(legacy.suggest)) {
      expect(getSuggestions(query).suggestions).toEqual(expected)
    }
  })

  it('shows the same category chips', () => {
    expect(searchCategories.map((category) => [category.id, category.label])).toEqual(
      legacy.categories,
    )
  })

  it('maps legacy service URLs to app paths', () => {
    expect(serviceHref({ url: '../service-details/pswdo.html' })).toBe('/service-details/pswdo')
    expect(serviceHref({ url: '../services/health.html' })).toBe('/services/health')
    expect(serviceHref({ url: '../government/' })).toBe('/government')
    expect(serviceHref({ url: '../government/officials.html' })).toBe('/government/officials')
  })
})
