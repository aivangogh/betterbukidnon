import type { Service } from './schemas'
import { services } from './services'

// A port of the legacy assets/js/search.js: same index, fuzzy matching, scores and storage keys,
// so results, recent searches and popular searches carry over from the legacy site.

const ANALYTICS_KEY = 'betterbukidnon_search_analytics'
const RECENT_SEARCHES_KEY = 'betterbukidnon_recent_searches'
const MAX_RECENT_SEARCHES = 10
const MAX_ANALYTICS_ENTRIES = 100

const CURATED_POPULAR = [
  'birth certificate',
  'business permit',
  'real property tax',
  'tax declaration',
  'marriage certificate',
  'death certificate',
  'provincial health office',
  'pswdo',
  'pdrrmd',
  'emergency hotline',
  'provincial engineer',
  'governor',
]

export function tokenize(text: string | undefined) {
  if (!text) return []
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 2)
}

function levenshteinDistance(a: string, b: string) {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  let previous = Array.from({ length: a.length + 1 }, (_, j) => j)
  for (let i = 1; i <= b.length; i++) {
    const current = [i]
    for (let j = 1; j <= a.length; j++) {
      current[j] =
        b[i - 1] === a[j - 1]
          ? (previous[j - 1] ?? 0)
          : Math.min((previous[j - 1] ?? 0) + 1, (current[j - 1] ?? 0) + 1, (previous[j] ?? 0) + 1)
    }
    previous = current
  }
  return previous[a.length] ?? 0
}

export function isFuzzyMatch(term: string, target: string, threshold = 0.3) {
  if (target.includes(term) || term.includes(target)) return true
  if (target.startsWith(term) || term.startsWith(target)) return true
  const similarity = 1 - levenshteinDistance(term, target) / Math.max(term.length, target.length)
  return similarity >= 1 - threshold
}

type Index = Map<string, number[]>

function addTo(index: Index, key: string, position: number) {
  const list = index.get(key)
  if (list) list.push(position)
  else index.set(key, [position])
}

const searchIndex = (() => {
  const titles: Index = new Map()
  const keywords: Index = new Map()
  const categories: Index = new Map()
  const offices: Index = new Map()
  const allTerms = new Set<string>()
  services.forEach((service, position) => {
    for (const word of tokenize(service.title)) {
      addTo(titles, word, position)
      allTerms.add(word)
    }
    for (const keyword of service.keywords) {
      const kw = keyword.toLowerCase()
      addTo(keywords, kw, position)
      allTerms.add(kw)
    }
    for (const word of tokenize(service.category)) addTo(categories, word, position)
    for (const word of tokenize(service.office)) addTo(offices, word, position)
  })
  return { indexes: [titles, keywords, categories, offices], allTerms }
})()

// Exact matches first, then fuzzy ones: this insertion order breaks ties between equal scores.
function fuzzyPositions(term: string, index: Index, into: Set<number>) {
  for (const position of index.get(term) ?? []) into.add(position)
  for (const [key, positions] of index) {
    if (isFuzzyMatch(term, key)) for (const position of positions) into.add(position)
  }
}

function score(service: Service, terms: string[], query: string) {
  let total = 0
  const title = service.title.toLowerCase()
  const category = service.category.toLowerCase()
  const description = (service.description || '').toLowerCase()
  const office = (service.office || '').toLowerCase()
  const processingTime = (service.processingTime || '').toLowerCase()
  const q = query.toLowerCase()

  if (title === q) total += 200
  else if (title.includes(q)) total += 100

  for (const term of terms) {
    if (title === term) total += 80
    else if (title.startsWith(term)) total += 60
    else if (title.includes(term)) total += 40
    else if (isFuzzyMatch(term, title, 0.25)) total += 20

    for (const keyword of service.keywords) {
      const kw = keyword.toLowerCase()
      if (kw === term) total += 35
      else if (kw.includes(term)) total += 20
      else if (isFuzzyMatch(term, kw, 0.3)) total += 10
    }

    if (category.includes(term)) total += 15
    else if (isFuzzyMatch(term, category, 0.3)) total += 8
    if (description.includes(term)) total += 10
    if (office.includes(term)) total += 12
    else if (isFuzzyMatch(term, office, 0.3)) total += 6
    if (processingTime.includes(term)) total += 8
  }

  if (service.fee) total += 2
  if (service.processingTime) total += 2
  if (service.description) total += 1
  return total
}

export function searchServices(
  query: string,
  { category = null, limit = 10 }: { category?: string | null; limit?: number } = {},
): Service[] {
  if (!query || query.length < 2) return []
  const terms = tokenize(query)
  if (terms.length === 0) return []

  const candidates = new Set<number>()
  for (const term of terms) {
    for (const index of searchIndex.indexes) fuzzyPositions(term, index, candidates)
  }

  const results: Array<{ service: Service; score: number }> = []
  for (const position of candidates) {
    const service = services[position]
    if (!service) continue
    if (
      category &&
      service.categoryId !== category &&
      !service.category.toLowerCase().includes(category.toLowerCase())
    ) {
      continue
    }
    const value = score(service, terms, query)
    if (value > 0) results.push({ service, score: value })
  }
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((result) => result.service)
}

/** First five service categories, labelled with the first word of their name (legacy chips). */
export const searchCategories = Array.from(
  new Map(services.map((service) => [service.categoryId, service.category])),
  ([id, name]) => ({ id, label: (name.split(' ')[0] ?? name).replace(/,$/, '') }),
).slice(0, 5)

/** Maps a legacy services.json URL such as `../service-details/pswdo.html` to an app path. */
export function serviceHref(service: Pick<Service, 'url'>) {
  return `/${service.url
    .replace(/^(\.\.\/)+/, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '')}`
}

function readList<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? (value as T[]) : []
  } catch {
    return []
  }
}

function writeList(key: string, value: unknown[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Recent and popular searches are a convenience; search works without storage.
  }
}

export const getRecentSearches = () => readList<string>(RECENT_SEARCHES_KEY)

export function addRecentSearch(query: string) {
  if (!query || query.length < 2) return
  const recent = getRecentSearches().filter((item) => item.toLowerCase() !== query.toLowerCase())
  writeList(RECENT_SEARCHES_KEY, [query, ...recent].slice(0, MAX_RECENT_SEARCHES))
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // Nothing stored to clear.
  }
}

type AnalyticsEntry = { query: string; count: number; resultsCount: number; lastSearched: number }

export function trackSearch(query: string, resultsCount: number) {
  const analytics = readList<AnalyticsEntry>(ANALYTICS_KEY)
  const existing = analytics.find((entry) => entry.query.toLowerCase() === query.toLowerCase())
  if (existing) {
    existing.count++
    existing.lastSearched = Date.now()
  } else {
    analytics.push({ query, count: 1, resultsCount, lastSearched: Date.now() })
  }
  analytics.sort((a, b) => b.count - a.count)
  writeList(ANALYTICS_KEY, analytics.slice(0, MAX_ANALYTICS_ENTRIES))
}

export function getPopularSearches(limit = 5) {
  const popular = readList<AnalyticsEntry>(ANALYTICS_KEY)
    .filter((entry) => entry.count >= 2)
    .slice(0, limit)
    .map((entry) => entry.query)
  for (const term of CURATED_POPULAR) {
    if (popular.length >= limit) break
    if (!popular.includes(term)) popular.push(term)
  }
  return popular
}

export type Suggestions = { popular: string[]; recent: string[]; suggestions: string[] }

export function getSuggestions(query: string): Suggestions {
  if (!query) {
    return {
      popular: getPopularSearches(4),
      recent: getRecentSearches().slice(0, 3),
      suggestions: [],
    }
  }
  const q = query.toLowerCase()
  const suggestions = new Set<string>()
  for (const service of services) {
    if (service.title.toLowerCase().includes(q)) suggestions.add(service.title)
  }
  for (const term of searchIndex.allTerms) {
    if (term.startsWith(q) && term !== q) suggestions.add(term)
  }
  for (const term of CURATED_POPULAR) {
    if (term.includes(q) || isFuzzyMatch(q, term, 0.4)) suggestions.add(term)
  }
  return { popular: [], recent: [], suggestions: Array.from(suggestions).slice(0, 8) }
}
