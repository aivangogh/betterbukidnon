import { describe, expect, it } from 'vite-plus/test'
import { demographics, fiscalData, news, officials, ordinances, resolutions } from './civic-data'
import { searchServices, serviceBySlug, services, servicesForCategory } from './services'
import bootstrapIcons from 'bootstrap-icons/font/bootstrap-icons.json' with { type: 'json' }
import { projectIcon, projects } from './projects'
import { isTranslationKey, translate } from './translations'
import { contactDirectory } from './contact'

describe('civic content contracts', () => {
  it('validates all current datasets at import time', () => {
    expect(officials.governor.name).toBeTruthy()
    expect(demographics.lgus).toHaveLength(22)
    expect(fiscalData.fiscal_years).toEqual([])
    expect(ordinances.ordinances).toEqual([])
    expect(resolutions.resolutions).toEqual([])
    expect(news.news).toEqual([])
  })

  it('keeps every service id unique', () => {
    const ids = services.map((service) => service.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('resolves every service-detail slug', () => {
    const detailServices = services.filter((service) => service.url.includes('service-details'))
    expect(detailServices.length).toBeGreaterThan(0)
    for (const service of detailServices) {
      expect(serviceBySlug(service.id)).toEqual(service)
    }
  })

  it('does not include category overview records in category detail lists', () => {
    expect(
      servicesForCategory('health').every((service) => service.url.includes('service-details')),
    ).toBe(true)
  })

  it('ranks service search results by title relevance', () => {
    expect(searchServices('birth certificate')[0]?.id).toBe('birth-certificate')
    expect(searchServices('zzzz')).toEqual([])
  })

  it('provides localized shell labels with English fallback contracts', () => {
    expect(translate('fil', 'nav-services')).toBe('Mga Serbisyo')
    expect(translate('fil', 'nav-home')).toBe('Tahanan')
    expect(translate('en', 'nav-projects')).toBe('Our Projects')
  })

  it('keeps the public hotline directory complete and callable', () => {
    expect(contactDirectory.hotlines).toHaveLength(6)
    expect(contactDirectory.hotlines.every((hotline) => hotline.href.startsWith('tel:'))).toBe(true)
  })

  it('uses only Bootstrap Icons that exist for projects', () => {
    for (const project of projects) expect(bootstrapIcons).toHaveProperty(projectIcon(project))
  })

  it('has translated names and descriptions for every project', () => {
    for (const project of projects) {
      expect(isTranslationKey(`proj-${project.id}-name`)).toBe(true)
      expect(isTranslationKey(`proj-${project.id}-desc`)).toBe(true)
    }
  })

  it('fills count placeholders in translations', () => {
    expect(translate('ceb', 'proj-showing', { count: 3 })).toBe('Gipakita ang 3 ka proyekto')
    expect(translate('en', 'proj-repos-count', { count: 1 })).toBe('1 repository')
  })
})
