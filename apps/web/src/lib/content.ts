import type { MDXContent } from 'mdx/types'
import type { z } from 'zod'
import { resolveDocument } from './documents'
import { parseContent } from './schemas'
import { baseLocale, getLocale, type Locale } from '@/paraglide/runtime'

type DocumentModule = { default: MDXContent; frontmatter?: unknown }

/** Each document is its own chunk, loaded only by the page that shows it. */
const modules = import.meta.glob<DocumentModule>('../../../../content/*/*/*.mdx')
const paths = Object.keys(modules)

// React's `use()` reads `status`/`value` to render an already-loaded document without
// suspending, so client navigation does not flash an empty page.
type Tracked<T> = Promise<T> & { status?: 'fulfilled'; value?: T }
const loaded = new Map<string, Tracked<DocumentModule>>()

export function loadDocumentModule(path: string): Promise<DocumentModule> {
  let promise = loaded.get(path)
  if (!promise) {
    const importer = modules[path]
    if (!importer) throw new Error(`No document at ${path}`)
    const tracked: Tracked<DocumentModule> = importer()
    void tracked.then((module) => {
      tracked.status = 'fulfilled'
      tracked.value = module
    })
    loaded.set(path, tracked)
    promise = tracked
  }
  return promise
}

/**
 * A document in the current language (English when it has no translation), with its
 * frontmatter validated against `schema` and the languages it exists in.
 */
export async function loadDocument<T>(collection: string, slug: string, schema: z.ZodType<T>) {
  const found = resolveDocument(paths, collection, slug, getLocale(), baseLocale)
  if (!found) return undefined
  const module = await loadDocumentModule(found.path)
  return {
    path: found.path,
    locale: found.locale as Locale,
    locales: found.locales as Locale[],
    meta: parseContent(schema, module.frontmatter, found.path),
  }
}
