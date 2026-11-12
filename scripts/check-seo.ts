#!/usr/bin/env -S pnpm exec tsx
/**
 * Validates the SEO of the built site (apps/web/dist/client) and exits non-zero on problems:
 * - every page has a title and <html lang> matching its URL language
 * - indexable pages have a description, a canonical URL equal to their own URL, hreflang links
 *   for en/fil/ceb/x-default that point to built pages, Open Graph tags, and unique titles
 * - every JSON-LD block is valid JSON
 * - sitemap.xml lists exactly the indexable pages
 */
import fs from 'node:fs'
import path from 'node:path'

const SITE_URL = 'https://betterbukidnon.org'
const LOCALES = ['en', 'fil', 'ceb']
const clientDir = new URL('../apps/web/dist/client/', import.meta.url).pathname
const problems: string[] = []

function pages(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) pages(full, out)
    else if (entry.name === 'index.html') out.push(full)
  }
  return out
}

const attr = (html: string, pattern: RegExp) => pattern.exec(html)?.[1]
const absolute = (urlPath: string) => (urlPath === '/' ? SITE_URL : `${SITE_URL}${urlPath}`)

const built = new Map<string, string>()
for (const file of pages(clientDir)) {
  const urlPath = `/${path.relative(clientDir, path.dirname(file))}`.replace(/\/$/, '') || '/'
  built.set(urlPath, fs.readFileSync(file, 'utf8'))
}
const builtUrls = new Set([...built.keys()].map(absolute))
const indexable = new Set<string>()
const titles = new Map<string, string>()

for (const [urlPath, html] of built) {
  const fail = (message: string) => problems.push(`${urlPath}: ${message}`)
  const locale =
    LOCALES.find((l) => l !== 'en' && (urlPath === `/${l}` || urlPath.startsWith(`/${l}/`))) ?? 'en'
  const head = html.slice(0, html.indexOf('</head>'))

  if (attr(html, /<html[^>]*\blang="([^"]+)"/) !== locale) fail(`<html lang> is not "${locale}"`)
  const title = attr(head, /<title>([^<]*)<\/title>/)?.trim()
  if (!title) fail('missing <title>')

  for (const block of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(block[1] ?? '')
    } catch {
      fail('invalid JSON-LD')
    }
  }

  if (/<meta name="robots" content="noindex/.test(head)) continue
  indexable.add(absolute(urlPath))

  if (!attr(head, /<meta name="description" content="([^"]+)"/)) fail('missing meta description')
  const canonical = attr(head, /<link rel="canonical" href="([^"]+)"/)
  if (canonical !== absolute(urlPath))
    fail(`canonical is ${canonical ?? 'missing'}, expected ${absolute(urlPath)}`)
  for (const lang of [...LOCALES, 'x-default']) {
    const href = attr(
      head,
      new RegExp(`<link rel="alternate" hrefLang="${lang}" href="([^"]+)"`, 'i'),
    )
    if (!href) fail(`missing hreflang="${lang}"`)
    else if (!builtUrls.has(href))
      fail(`hreflang="${lang}" points to a page that was not built: ${href}`)
  }
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image', 'og:locale']) {
    if (!attr(head, new RegExp(`<meta property="${property}" content="([^"]+)"`)))
      fail(`missing ${property}`)
  }
  if (title) {
    const key = `${locale}|${title}`
    const other = titles.get(key)
    if (other) fail(`same title as ${other}: "${title}"`)
    else titles.set(key, urlPath)
  }
}

const sitemapFile = path.join(clientDir, 'sitemap.xml')
if (!fs.existsSync(sitemapFile)) {
  problems.push('sitemap.xml is missing')
} else {
  const listed = new Set(
    [...fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1] ?? '',
    ),
  )
  for (const url of listed)
    if (!indexable.has(url))
      problems.push(`sitemap.xml lists a page that is missing or noindex: ${url}`)
  for (const url of indexable) if (!listed.has(url)) problems.push(`sitemap.xml is missing ${url}`)
}

if (problems.length) {
  console.error(`SEO check failed (${problems.length}):\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(
  `SEO check passed: ${built.size} pages, ${indexable.size} indexable and in the sitemap.`,
)
