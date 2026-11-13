import { describe, expect, it } from 'vite-plus/test'
import { serviceBySlug, services, servicesForCategory } from './services'

describe('services data', () => {
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
})
