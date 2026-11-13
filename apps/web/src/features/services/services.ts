import rawServices from '../../../../../data/services.json'
import { parseContent } from '@/lib/schemas'
import { servicesDataSchema } from './schemas'

export const services = parseContent(servicesDataSchema, rawServices, 'data/services.json').services

export function servicesForCategory(category: string) {
  return services.filter(
    (service) => service.categoryId === category && service.url.includes('service-details'),
  )
}

export function serviceBySlug(slug: string) {
  return services.find((service) => service.id === slug && service.url.includes('service-details'))
}
