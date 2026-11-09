// The skip link, hotline bar, header and footer come from scripts/chrome/ (see docs/architecture.md).
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { expect, test } from '@playwright/test'

const { version } = JSON.parse(fs.readFileSync(new URL('../version.json', import.meta.url), 'utf8'))

// One page per depth and per kind of header: root, section index, nested page, service page, error page
const PAGES = [
  '/index.html',
  '/faq/',
  '/services/health.html',
  '/service-details/pswdo.html',
  '/legislative/ordinance-framework.html',
  '/404.html',
]

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bb-vol-popup-v1', '1'))
})

test('every page matches the templates in scripts/chrome/', async ({}, info) => {
  test.skip(info.project.name !== 'chrome', 'file check, run once')
  // Throws (and prints the stale pages) if a page was edited by hand
  execFileSync('pnpm', ['exec', 'tsx', 'scripts/sync-chrome.ts', '--check'], {
    encoding: 'utf8',
  })
})

test.describe('shared header and footer', () => {
  for (const url of PAGES) {
    test(`${url}: same nav, working links, current version`, async ({ page }) => {
      await page.goto(url)

      const top = await page
        .locator('.main-nav > ul > li > a')
        .evaluateAll((as) => as.map((a) => a.getAttribute('data-i18n')))
      expect(top).toEqual([
        'nav-home',
        'nav-services',
        'nav-government',
        'nav-statistics',
        'nav-legislative',
        'nav-transparency',
        'nav-projects',
        'nav-contact',
      ])

      // Every internal chrome link resolves to a real page on this server
      const hrefs = await page
        .locator('.site-header a[href], .site-footer a[href]')
        .evaluateAll((as) =>
          as.map((a) => (a as HTMLAnchorElement).href).filter((h) => h.startsWith(location.origin)),
        )
      for (const href of new Set(hrefs)) {
        // Cloudflare maps /services/health to services/health.html; python's server does not
        let res = await page.request.get(href)
        if (res.status() === 404 && !href.endsWith('/'))
          res = await page.request.get(href + '.html')
        expect(res.status(), href).toBeLessThan(400)
      }

      await expect(page.locator('.hotline-bar a[href="tel:911"]').first()).toBeAttached()
      await expect(page.locator('.footer-version')).toContainText(`Ver. ${version}`)
      await expect(page.locator('.site-footer a', { hasText: 'FAQ' })).toHaveAttribute(
        'href',
        /(^|\/)faq\/$/,
      )
    })
  }

  for (const [url, activeLabel] of [
    ['/index.html', 'Home'],
    ['/services/health.html', 'Services'],
    ['/service-details/pswdo.html', 'Services'],
    ['/legislative/ordinance-framework.html', 'Legislative'],
    ['/budget/', 'Transparency'],
    ['/projects/', 'Our Projects'],
    ['/contact/', 'Contact'],
  ]) {
    test(`${url}: highlights ${activeLabel}`, async ({ page }) => {
      await page.goto(url)
      await expect(page.locator('.main-nav > ul > li > a.active')).toHaveText(activeLabel)
    })
  }

  test('pages outside the nav highlight nothing', async ({ page }) => {
    await page.goto('/faq/')
    await expect(page.locator('.main-nav a.active')).toHaveCount(0)
  })

  test('error pages use absolute links so they work from any URL', async ({ page }) => {
    await page.goto('/404.html')
    await expect(page.locator('.main-nav a[data-i18n="nav-contact"]')).toHaveAttribute(
      'href',
      '/contact/',
    )
    await expect(page.locator('.logo-container a')).toHaveAttribute('href', '/')
  })

  test('footer on a service page has no top margin', async ({ page }) => {
    await page.goto('/service-details/pswdo.html')
    await expect(page.locator('.site-footer')).toHaveClass(/no-margin-top/)
  })

  for (const [lang, certificates, quickLinks, skip] of [
    ['fil', 'Mga Sertipiko', 'Mga Mabilisang Link', 'Lumaktaw sa pangunahing nilalaman'],
    ['ceb', 'Mga Sertipiko', 'Dali nga mga Link', 'Laktaw sa panguna nga sulod'],
  ]) {
    test(`header, footer and skip link are translated (${lang})`, async ({ page }) => {
      await page.addInitScript((l) => localStorage.setItem('selectedLang', l), lang)
      await page.goto('/services/health.html')
      await expect(page.locator('.dropdown-menu a[data-i18n="nav-certificates"]')).toHaveText(
        certificates,
      )
      await expect(page.locator('.site-footer h4[data-i18n="footer-quick-links"]')).toHaveText(
        quickLinks,
      )
      await expect(page.locator('.skip-link')).toHaveText(skip)
    })
  }

  test('every translation key used by the chrome exists in all languages', async ({ page }) => {
    await page.goto('/index.html')
    const missing = await page.evaluate(() => {
      const engine = window.TranslationEngine!
      const keys = new Set(
        Array.from(
          document.querySelectorAll(
            '.skip-link [data-i18n], .skip-link[data-i18n], .site-header [data-i18n], .site-footer [data-i18n]',
          ),
        ).map((el) => el.getAttribute('data-i18n')),
      )
      const out: string[] = []
      for (const lang of ['en', 'fil', 'ceb'])
        for (const key of keys) if (!engine.hasTranslation(key, lang)) out.push(`${lang}:${key}`)
      return out
    })
    expect(missing).toEqual([])
  })

  test('language menu still switches the header', async ({ page }) => {
    await page.goto('/services/health.html')
    await page.evaluate(() => window.TranslationEngine!.switchLanguage('fil'))
    await expect(page.locator('.main-nav > ul > li > a[data-i18n="nav-home"]')).toHaveText(
      'Tahanan',
    )
  })
})
