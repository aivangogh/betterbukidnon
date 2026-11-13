import { z } from 'zod'

/**
 * Documents: pages read top to bottom, written in MDX at
 * `content/<collection>/<slug>/<locale>.mdx` (see docs/content-guide.md).
 */

/** Components a document may use; `components/blocks` implements each one. */
export const blockNames = [
  'Box',
  'Card',
  'Cards',
  'CharterNote',
  'Columns',
  'LinkButton',
  'OfficeInfo',
  'Prose',
  'Section',
  'Stat',
  'Stats',
] as const
export type BlockName = (typeof blockNames)[number]

export const serviceDocumentSchema = z
  .object({
    /** The page heading. */
    title: z.string().min(1),
    /** The breadcrumb and the browser/search title, when shorter than `title`. */
    shortTitle: z.string().min(1),
    /** Meta description for search results and link previews. */
    description: z.string().min(50).max(300),
    /** The line under the heading. */
    summary: z.string().min(1),
    badge: z.string().min(1),
    /** Bootstrap Icons name for the badge. */
    icon: z.string().min(1),
    /** The service category the page belongs to, for the breadcrumb. */
    category: z.string().min(1),
  })
  .strict()
export type ServiceDocument = z.infer<typeof serviceDocumentSchema>

/** `…/content/services/pswdo/fil.mdx` -> { collection: 'services', slug: 'pswdo', locale: 'fil' } */
export function parseDocumentPath(path: string) {
  const match = /(?:^|\/)content\/([^/]+)\/([^/]+)\/([^/]+)\.mdx$/.exec(path)
  if (!match) return undefined
  const [, collection = '', slug = '', locale = ''] = match
  return { collection, slug, locale }
}

/**
 * The file to show for a page in a language, and the languages the page exists in. Falls back
 * to English when there is no translation; `undefined` when the page has no document at all.
 */
export function resolveDocument(
  paths: readonly string[],
  collection: string,
  slug: string,
  locale: string,
  baseLocale = 'en',
) {
  const files = new Map<string, string>()
  for (const path of paths) {
    const parsed = parseDocumentPath(path)
    if (parsed?.collection === collection && parsed.slug === slug) files.set(parsed.locale, path)
  }
  const shown = files.has(locale) ? locale : baseLocale
  const path = files.get(shown)
  if (!path) return undefined
  return { path, locale: shown, locales: [...files.keys()].sort() }
}
