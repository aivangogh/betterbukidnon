#!/usr/bin/env -S pnpm exec tsx
/**
 * Keeps the shared page chrome (skip link, hotline bar, header, footer) identical on every page.
 *
 * The single source for each block is a template in scripts/chrome/. Every static page keeps a
 * complete copy of the block between two marker comments, so the site works without a build,
 * without JavaScript and without layout shift. This script rewrites those copies.
 *
 *   pnpm chrome           rewrite every page from the templates
 *   pnpm chrome:check     change nothing; exit 1 if any page is out of date
 *
 * Markers in a page:
 *
 *   <!-- chrome:header -->
 *   ...generated, do not edit...
 *   <!-- /chrome:header -->
 *
 * Options go after the block name: `<!-- chrome:footer no-margin-top -->`.
 *
 * Template tokens:
 *   {{root}}        path from the page to the site root ('' , '../' or '/' for the error pages)
 *   {{home}}        link to the homepage ('./', '../' or '/')
 *   {{version}}     version from version.json
 *   {{active:key}}  ` class="active"` when the page belongs to nav item `key`, otherwise nothing
 *   {{opt name}}    ` name` when the page's marker lists the option `name`, otherwise nothing
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as prettier from 'prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const ROOT = path.join(__dirname, '..')
const TEMPLATE_DIR = path.join(__dirname, 'chrome')

/** Blocks in page order. The marker name matches the template file name. */
const BLOCKS = ['skip-link', 'hotline', 'header', 'footer']

/** Pages that intentionally have no shared chrome (standalone offline fallback). */
const EXEMPT = new Set(['offline.html'])

/** Folders that never hold site pages. */
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  'apps',
  'docs',
  'admin',
  'scripts',
  'tests',
  'test-results',
  'playwright-report',
  'screenshots',
  'release',
  '.git',
  '.claude',
  '.wrangler',
])

/** The error pages are served from any URL, so their links must be absolute. */
const ABSOLUTE_ROOT_PAGES = new Set(['403.html', '404.html', '500.html'])

/** First folder of a page -> the top-level nav item that is highlighted on it. */
const SECTION_NAV: Record<string, string> = {
  services: 'services',
  'service-details': 'services',
  government: 'government',
  statistics: 'statistics',
  legislative: 'legislative',
  budget: 'transparency',
  projects: 'projects',
  contact: 'contact',
}

/** Pages that also highlight an entry inside a dropdown. */
const PAGE_NAV: Record<string, string[]> = {
  'index.html': ['home'],
  'legislative/ordinance-framework.html': ['ordinance-framework'],
  'legislative/resolution-framework.html': ['resolution-framework'],
}

export function findPages(dir: string, out: string[]): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) findPages(path.join(dir, entry.name), out)
    } else if (entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name))
    }
  }
  return out
}

interface PageContext {
  root: string
  home: string
  version: string
  active: Set<string>
}

function pageContext(rel: string, version: string): PageContext {
  const depth = rel.split('/').length - 1
  const absolute = ABSOLUTE_ROOT_PAGES.has(rel)
  const root = absolute ? '/' : '../'.repeat(depth)
  const home = absolute ? '/' : depth === 0 ? './' : root
  const active = new Set(PAGE_NAV[rel] || [])
  const section = SECTION_NAV[rel.split('/')[0]]
  if (depth > 0 && section) active.add(section)
  return { root, home, version, active }
}

function render(
  template: string,
  ctx: PageContext,
  options: string[],
  rel: string,
  name: string,
): string {
  return template.replace(
    /\{\{\s*([a-z-]+)(?:[: ]([a-z-]+))?\s*\}\}/g,
    (token, key: string, arg?: string) => {
      if (key === 'root') return ctx.root
      if (key === 'home') return ctx.home
      if (key === 'version') return ctx.version
      if (key === 'active' && arg) return ctx.active.has(arg) ? ' class="active"' : ''
      if (key === 'opt' && arg) return options.includes(arg) ? ' ' + arg : ''
      throw new Error(`${rel}: unknown token ${token} in chrome/${name}.html`)
    },
  )
}

async function main() {
  const check = process.argv.includes('--check')
  const prettierConfig = (await prettier.resolveConfig(path.join(ROOT, 'index.html'))) || {}
  const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'version.json'), 'utf8')).version
  const templates = Object.fromEntries(
    BLOCKS.map((name) => [name, fs.readFileSync(path.join(TEMPLATE_DIR, `${name}.html`), 'utf8')]),
  )

  const stale: string[] = []
  const problems: string[] = []
  const pages = findPages(ROOT, []).sort()

  for (const file of pages) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/')
    if (EXEMPT.has(rel)) continue

    const ctx = pageContext(rel, version)
    const original = fs.readFileSync(file, 'utf8')
    let content = original

    for (const name of BLOCKS) {
      const marker = new RegExp(
        `^([ \\t]*)<!-- chrome:${name}((?: [a-z-]+)*) -->\\n(?:[\\s\\S]*?\\n)?[ \\t]*<!-- /chrome:${name} -->`,
        'm',
      )
      const found = content.match(marker)
      if (!found) {
        problems.push(
          `${rel}: missing <!-- chrome:${name} --> ... <!-- /chrome:${name} --> markers`,
        )
        continue
      }
      const indent = found[1]
      const options = found[2].trim().split(/\s+/).filter(Boolean)
      const rendered = render(templates[name], ctx, options, rel, name)
      const formatted = await prettier.format(rendered, {
        ...prettierConfig,
        parser: 'html',
        printWidth: (prettierConfig.printWidth || 80) - indent.length,
      })
      const body = formatted
        .trimEnd()
        .split('\n')
        .map((line) => (line ? indent + line : line))
        .join('\n')
      const open = `${indent}<!-- chrome:${name}${options.map((o) => ' ' + o).join('')} -->`
      const close = `${indent}<!-- /chrome:${name} -->`
      content = content.replace(marker, () => `${open}\n${body}\n${close}`)
    }

    if (content !== original) {
      stale.push(rel)
      if (!check) fs.writeFileSync(file, content)
    }
  }

  if (problems.length) {
    console.error(problems.join('\n'))
    process.exitCode = 1
  }
  if (check) {
    if (stale.length) {
      console.error(
        `Shared page chrome is out of date in ${stale.length} file(s):\n  ` +
          stale.join('\n  ') +
          '\nRun `pnpm chrome` and commit the result.',
      )
      process.exitCode = 1
    } else if (!problems.length) {
      console.log(`Shared page chrome is up to date (${pages.length - EXEMPT.size} pages).`)
    }
  } else {
    console.log(`Synced shared page chrome: ${stale.length} page(s) changed.`)
  }
}

// bump-version.ts imports findPages, so only run when executed directly.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
