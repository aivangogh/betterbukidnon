import rawServices from '../../../../data/services.json'
import { parseContent, servicesDataSchema } from './schemas'

export const services = parseContent(servicesDataSchema, rawServices, 'data/services.json').services

export function servicesForCategory(category: string) {
  return services.filter(
    (service) => service.categoryId === category && service.url.includes('service-details'),
  )
}

export function serviceBySlug(slug: string) {
  return services.find((service) => service.id === slug && service.url.includes('service-details'))
}

function tokenize(value: string) {
  return value
    .toLocaleLowerCase('en-PH')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2)
}

export function searchServices(query: string) {
  const terms = tokenize(query)
  if (terms.length === 0) return []

  return services
    .filter((service) => service.url.includes('service-details'))
    .map((service) => {
      const title = tokenize(service.title)
      const searchable = tokenize(
        [service.title, service.description, service.category, service.office, ...service.keywords]
          .filter(Boolean)
          .join(' '),
      )
      const score = terms.reduce((total, term) => {
        if (title.some((word) => word.startsWith(term))) return total + 5
        if (searchable.some((word) => word.startsWith(term))) return total + 2
        return total
      }, 0)
      return { service, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.service.title.localeCompare(b.service.title))
    .slice(0, 8)
    .map(({ service }) => service)
}
