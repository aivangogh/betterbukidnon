import rawServices from '../../../data/services.json'
import { parseContent, servicesDataSchema } from './schemas'
import { site } from './site'

export const services = parseContent(
  servicesDataSchema,
  rawServices,
  'data/services.json',
).services

export function servicesForCategory(category: string) {
  return services.filter((service) => service.categoryId === category)
}

export function canonicalServicePath(url: string) {
  const path = `/${url.replace(/^\.\.\//, '').replace(/\.html$/, '')}`
  return new URL(path, site.url).toString()
}
