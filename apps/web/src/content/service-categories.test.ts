import bootstrapIcons from 'bootstrap-icons/font/bootstrap-icons.json' with { type: 'json' }
import { describe, expect, it } from 'vite-plus/test'
import { appPath } from '../lib/paths'
import { serviceCategories, serviceCategoryIds } from './service-categories'
import { serviceBySlug } from './services'

// Pages that exist outside the data-driven service routes.
const staticRoutes = new Set([
  '/',
  '/budget',
  '/contact',
  '/government',
  '/government/officials',
  '/services',
])

function resolves(href: string) {
  const path = appPath(href).split('#')[0] ?? ''
  if (path.startsWith('/service-details/')) return Boolean(serviceBySlug(path.split('/')[2] ?? ''))
  if (path.startsWith('/services/')) return (path.split('/')[2] ?? '') in serviceCategories
  return staticRoutes.has(path)
}

describe('service category pages', () => {
  it('has a page for every legacy category', () => {
    expect(serviceCategoryIds).toEqual([
      'certificates',
      'business',
      'tax-payments',
      'social-services',
      'health',
      'agriculture',
      'infrastructure',
      'education',
      'public-safety',
      'environment',
    ])
  })

  it('links only to pages that exist', () => {
    for (const [id, page] of Object.entries(serviceCategories)) {
      const hrefs = [
        ...page.contacts.map((contact) => contact.href),
        ...page.sections.flatMap((section) =>
          section.cards.flatMap((card) => (card.link ? [card.link.href] : [])),
        ),
        page.note.link.href,
      ]
      for (const href of hrefs.filter((h) => h.startsWith('/'))) {
        expect(resolves(href), `${id}: ${href}`).toBe(true)
      }
    }
  })

  it('uses only Bootstrap Icons that exist', () => {
    for (const page of Object.values(serviceCategories)) {
      const icons = [
        page.icon,
        ...page.contacts.map((contact) => contact.icon),
        ...page.sections.flatMap((section) => section.cards.map((card) => card.icon)),
      ]
      for (const icon of icons) expect(bootstrapIcons).toHaveProperty(icon)
    }
  })
})
