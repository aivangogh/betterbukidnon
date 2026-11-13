#!/usr/bin/env -S pnpm exec tsx
/**
 * Writes sitemap.xml, robots.txt and (outside production) a noindex _headers file into the
 * built site, from the prerendered pages themselves.
 *
 * Production is a Workers Builds run on `main` (WORKERS_CI_BRANCH) or SITE_ENV=production.
 * Every other build (develop, previews, local) asks search engines not to index it, so the
 * dev site does not compete with betterbukidnon.org.
 */
import fs from 'node:fs'
import path from 'node:path'

const SITE_URL = 'https://betterbukidnon.org'
const LOCALES = ['en', 'fil', 'ceb'] as const
const clientDir = new URL('../apps/web/dist/client/', import.meta.url).pathname
const production = process.env.SITE_ENV === 'production' || process.env.WORKERS_CI_BRANCH === 'main'

function pages(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) pages(full, out)
    else if (entry.name === 'index.html') out.push(full)
  }
  return out
}

/** `/fil/services/health` -> { locale: 'fil', route: '/services/health' } */
function parse(urlPath: string) {
  const [, first = '', ...rest] = urlPath.split('/')
  const locale = (LOCALES as readonly string[]).includes(first) ? first : 'en'
  const route = locale === 'en' ? urlPath : `/${rest.join('/')}`
  return { locale, route: route === '' ? '/' : route }
}

const localized = (route: string, locale: string) =>
  locale === 'en' ? route : route === '/' ? `/${locale}` : `/${locale}${route}`
const absolute = (urlPath: string) => (urlPath === '/' ? SITE_URL : `${SITE_URL}${urlPath}`)

const indexable = new Map<string, Set<string>>()
for (const file of pages(clientDir)) {
  const urlPath = `/${path.relative(clientDir, path.dirname(file))}`.replace(/\/$/, '') || '/'
  const html = fs.readFileSync(file, 'utf8')
  if (/<meta name="robots" content="noindex/.test(html)) continue
  // An untranslated page shows English and names the English page as canonical; leave it out.
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1]
  if (canonical && canonical !== absolute(urlPath)) continue
  const { locale, route } = parse(urlPath)
  if (!indexable.has(route)) indexable.set(route, new Set())
  indexable.get(route)?.add(locale)
}

const escape = (text: string) => text.replace(/&/g, '&amp;')
const entries = [...indexable.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([route, locales]) =>
    LOCALES.filter((locale) => locales.has(locale)).map((locale) => {
      const alternates = LOCALES.filter((other) => locales.has(other))
        .map(
          (other) =>
            `    <xhtml:link rel="alternate" hreflang="${other}" href="${escape(absolute(localized(route, other)))}"/>`,
        )
        .concat(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(absolute(route))}"/>`,
        )
      return `  <url>\n    <loc>${escape(absolute(localized(route, locale)))}</loc>\n${alternates.join('\n')}\n  </url>`
    }),
  )

fs.writeFileSync(
  path.join(clientDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`,
)

fs.writeFileSync(
  path.join(clientDir, 'robots.txt'),
  production
    ? `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n',
)

const headersFile = path.join(clientDir, '_headers')
if (production) fs.rmSync(headersFile, { force: true })
else fs.writeFileSync(headersFile, '/*\n  X-Robots-Tag: noindex\n')

console.log(
  `SEO files: ${entries.length} sitemap URLs (${indexable.size} pages), ${production ? 'production' : 'non-production (noindex)'} robots.txt`,
)
