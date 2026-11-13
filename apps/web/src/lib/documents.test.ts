import fs from 'node:fs'
import path from 'node:path'
import bootstrapIcons from 'bootstrap-icons/font/bootstrap-icons.json' with { type: 'json' }
import { parse as parseYaml } from 'yaml'
import { describe, expect, it } from 'vite-plus/test'
import { serviceDocumentSchema } from '@/features/services/schemas'
import { blockNames, parseDocumentPath, resolveDocument } from './documents'
import { serviceCategories } from '@/features/services/categories'
import { serviceBySlug } from '@/features/services/services'

const contentDir = new URL('../../../../content/', import.meta.url).pathname
const LOCALES = ['en', 'fil', 'ceb']

const documentFiles = fs
  .readdirSync(contentDir, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => path.join(contentDir, file))

function readDocument(file: string) {
  const source = fs.readFileSync(file, 'utf8')
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source)
  return { frontmatter: match ? parseYaml(match[1] ?? '') : undefined, body: match?.[2] ?? '' }
}

describe('document paths', () => {
  const paths = [
    '../../content/services/pswdo/en.mdx',
    '../../content/services/pswdo/fil.mdx',
    '../../content/services/treasurer/en.mdx',
    '../../content/faq/general/en.mdx',
  ]

  it('reads collection, slug and language from a path', () => {
    expect(parseDocumentPath(paths[1] ?? '')).toEqual({
      collection: 'services',
      slug: 'pswdo',
      locale: 'fil',
    })
    expect(parseDocumentPath('content/services/pswdo.mdx')).toBeUndefined()
  })

  it('picks the translation when there is one', () => {
    expect(resolveDocument(paths, 'services', 'pswdo', 'fil')).toEqual({
      path: paths[1],
      locale: 'fil',
      locales: ['en', 'fil'],
    })
  })

  it('falls back to English when there is no translation', () => {
    expect(resolveDocument(paths, 'services', 'pswdo', 'ceb')).toMatchObject({
      path: paths[0],
      locale: 'en',
    })
    expect(resolveDocument(paths, 'services', 'treasurer', 'fil')?.locales).toEqual(['en'])
  })

  it('finds nothing for pages without a document or in another collection', () => {
    expect(resolveDocument(paths, 'services', 'missing', 'en')).toBeUndefined()
    expect(resolveDocument(paths, 'faq', 'pswdo', 'en')).toBeUndefined()
  })
})

describe('document files', () => {
  it('exist', () => {
    expect(documentFiles.length).toBeGreaterThan(0)
  })

  for (const file of documentFiles) {
    const name = path.relative(contentDir, file)
    const parsed = parseDocumentPath(file)

    it(`${name} is named <collection>/<slug>/<language>.mdx and has an English version`, () => {
      expect(parsed).toBeDefined()
      expect(LOCALES).toContain(parsed?.locale)
      expect(fs.existsSync(path.join(path.dirname(file), 'en.mdx'))).toBe(true)
    })

    it(`${name} has valid frontmatter`, () => {
      const { frontmatter } = readDocument(file)
      expect(frontmatter).toBeDefined()
      if (parsed?.collection !== 'services') return
      const meta = serviceDocumentSchema.parse(frontmatter)
      if (meta.parent?.startsWith('/services/'))
        expect(serviceCategories).toHaveProperty(meta.parent.replace('/services/', ''))
      expect(bootstrapIcons).toHaveProperty(meta.icon)
      expect(serviceBySlug(parsed.slug)).toBeDefined()
    })

    it(`${name} uses only the allowed blocks and existing icons`, () => {
      const { body } = readDocument(file)
      expect(body).not.toMatch(/^\s*(import|export)\s/m)
      for (const [, component] of body.matchAll(/<([A-Z]\w*)/g))
        expect(blockNames).toContain(component)
      for (const [, icon] of body.matchAll(/\b(?:icon|listIcon)="([^"]+)"/g))
        expect(bootstrapIcons).toHaveProperty(icon ?? '')
    })
  }
})
