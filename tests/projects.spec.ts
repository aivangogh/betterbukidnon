import { expect, type Page, test } from '@playwright/test'

const EXTERNAL = [
  { name: 'Budget Tracker', href: 'https://budget.betterbukidnon.org' },
  { name: 'SALN Tracker', href: 'https://saln.betterbukidnon.org' },
  { name: 'Infrastructure Tracker', href: 'https://infra.betterbukidnon.org' },
]

/** The "Our Projects" nav item (the dropdown trigger link). */
const trigger = (page: Page) =>
  page.locator('.main-nav > ul > li.has-dropdown > a[data-i18n="nav-projects"]')
const item = (page: Page) =>
  page.locator('.main-nav > ul > li.has-dropdown:has(> a[data-i18n="nav-projects"])')

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bb-vol-popup-v1', '1'))
})

test.describe('Our Projects nav item', () => {
  for (const path of [
    '/index.html',
    '/contact/',
    '/legislative/ordinance-framework.html',
    '/404.html',
  ]) {
    test(`sits between Transparency and Contact on ${path}`, async ({ page }) => {
      await page.goto(path)
      const labels = await page
        .locator('.main-nav > ul > li > a')
        .evaluateAll((as) => as.map((a) => a.getAttribute('data-i18n')))
      const projects = labels.indexOf('nav-projects')
      expect(projects).toBeGreaterThan(-1)
      expect(labels[projects - 1]).toMatch(/transparency$/)
      expect(labels[projects + 1]).toMatch(/contact$/)
    })
  }

  test('dropdown lists the external projects and the Our Projects page', async ({ page }, info) => {
    test.skip(info.project.name.startsWith('mobile'), 'desktop hover behaviour')
    await page.goto('/index.html')
    await trigger(page).hover()
    const menu = item(page).locator('.dropdown-menu')
    await expect(menu).toBeVisible()

    for (const { name, href } of EXTERNAL) {
      const link = menu.locator(`a[href="${href}"]`)
      await expect(link).toContainText(name)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
    await expect(menu.locator('a[data-i18n="nav-projects-all"]')).toHaveAttribute(
      'href',
      'projects/',
    )
  })

  test('keyboard: ArrowDown opens the menu', async ({ page }, info) => {
    test.skip(info.project.name.startsWith('mobile'), 'desktop keyboard behaviour')
    await page.goto('/index.html')
    await trigger(page).focus()
    await page.keyboard.press('ArrowDown')
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true')
  })

  test('mobile: tapping the trigger opens the submenu instead of navigating', async ({
    page,
  }, info) => {
    test.skip(!info.project.name.startsWith('mobile'), 'mobile only')
    await page.goto('/index.html')
    await page.locator('.mobile-menu-toggle').click()
    await trigger(page).tap()
    await expect(page).toHaveURL(/index\.html$/)
    await expect(item(page).locator('.dropdown-menu')).toBeVisible()
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true')
  })

  for (const [lang, expected] of [
    ['en', 'Our Projects'],
    ['fil', 'Mga Proyekto Namin'],
    ['ceb', 'Among mga Proyekto'],
  ]) {
    test(`nav label is translated (${lang})`, async ({ page }) => {
      await page.addInitScript((l) => localStorage.setItem('selectedLang', l), lang)
      await page.goto('/index.html')
      await expect(trigger(page)).toHaveText(expected)
    })
  }
})

test.describe('Our Projects page', () => {
  const counts = (page: Page) =>
    page.locator('.projects-tab-count').evaluateAll((els) => els.map((e) => e.textContent))
  const titles = (page: Page) =>
    page.locator('#projects-grid .project-card-title').allTextContents()

  test('shows all projects under Active with tab counts', async ({ page }) => {
    await page.goto('/projects/')
    await expect(page.locator('#projects-grid .project-card')).toHaveCount(3)
    expect(await counts(page)).toEqual(['3', '0', '0'])
    expect((await titles(page)).sort()).toEqual([
      'Budget Tracker',
      'Infrastructure Tracker',
      'SALN Tracker',
    ])
    await expect(page.locator('#tab-active')).toHaveAttribute('aria-selected', 'true')
  })

  test('cards show badges, repo path and the live site host', async ({ page }) => {
    await page.goto('/projects/')
    const budget = page.locator('.project-card', { hasText: 'Budget Tracker' })
    await expect(budget.locator('.project-badge--active')).toBeVisible()
    await expect(budget.locator('.project-badge--type')).toHaveText('Org Projects')
    await expect(budget.locator('.project-badge--category')).toHaveText('Transparency')
    await expect(budget.locator('.project-card-repo-label')).toHaveText('Better-Bukidnon / budget')
    await expect(budget.locator('.project-card-repo')).toHaveText(
      'github.com/Better-Bukidnon/budget',
    )
    await expect(budget.locator('.project-card-host')).toHaveText('budget.betterbukidnon.org')
  })

  test('View Details opens a dialog with about, repository and visit link', async ({ page }) => {
    await page.goto('/projects/')
    const budget = page.locator('.project-card', { hasText: 'Budget Tracker' })
    const opener = budget.locator('.project-card-details')
    await opener.click()

    const dialog = page.locator('#project-dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAccessibleName('Budget Tracker')
    await expect(dialog.locator('#pd-url')).toHaveAttribute(
      'href',
      'https://budget.betterbukidnon.org',
    )
    await expect(dialog.locator('#pd-desc')).toContainText('Budget transparency portal')
    await expect(dialog.locator('#pd-repos a')).toHaveAttribute(
      'href',
      'https://github.com/Better-Bukidnon/budget',
    )
    await expect(dialog.locator('#pd-repos a')).toHaveAttribute('rel', /noopener/)
    await expect(dialog.locator('#pd-contributors')).toHaveAttribute(
      'href',
      'https://github.com/Better-Bukidnon/budget/graphs/contributors',
    )
    await expect(dialog.locator('#pd-count')).toHaveText('1 repository')
    await expect(dialog.locator('#pd-visit')).toHaveAttribute(
      'href',
      'https://budget.betterbukidnon.org',
    )
    await expect(dialog.locator('#pd-visit')).toHaveAttribute('target', '_blank')
  })

  test('dialog closes with Escape, the close button and the backdrop, and restores focus', async ({
    page,
  }) => {
    await page.goto('/projects/')
    const opener = page
      .locator('.project-card', { hasText: 'SALN Tracker' })
      .locator('.project-card-details')
    const dialog = page.locator('#project-dialog')

    await opener.click()
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(opener).toBeFocused()

    await opener.click()
    await page.locator('#pd-close').click()
    await expect(dialog).toBeHidden()

    await opener.click()
    await expect(dialog).toBeVisible()
    await page.mouse.click(5, 5) // outside the dialog box = on the backdrop
    await expect(dialog).toBeHidden()
  })

  test('dialog text follows the language', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('selectedLang', 'fil'))
    await page.goto('/projects/')
    await page
      .locator('.project-card', { hasText: 'Budget Tracker' })
      .locator('.project-card-details')
      .click()
    const dialog = page.locator('#project-dialog')
    await expect(dialog.locator('#pd-visit')).toContainText('Bisitahin ang Proyekto')
    await expect(dialog.locator('.project-dialog-heading').first()).toHaveText('Tungkol dito')
    await expect(dialog.locator('#pd-count')).toHaveText('1 repository')
  })

  test('search narrows cards and tab counts', async ({ page }) => {
    await page.goto('/projects/')
    await page.fill('#projects-search', 'saln')
    expect(await titles(page)).toEqual(['SALN Tracker'])
    expect(await counts(page)).toEqual(['1', '0', '0'])

    await page.fill('#projects-search', 'dpwh')
    expect(await titles(page)).toEqual(['Infrastructure Tracker'])

    await page.fill('#projects-search', 'nothing-matches-this')
    await expect(page.locator('#projects-grid .project-card')).toHaveCount(0)
    await expect(page.locator('#projects-empty')).toBeVisible()
    expect(await counts(page)).toEqual(['0', '0', '0'])
  })

  test('repo and category filters combine with search', async ({ page }) => {
    await page.goto('/projects/')
    await page.selectOption('#projects-repo', 'Better-Bukidnon/budget')
    expect(await titles(page)).toEqual(['Budget Tracker'])

    await page.selectOption('#projects-category', 'transparency')
    expect(await titles(page)).toEqual(['Budget Tracker'])

    await page.fill('#projects-search', 'saln')
    await expect(page.locator('#projects-grid .project-card')).toHaveCount(0)
  })

  test('other tabs are empty and tabs work with the keyboard', async ({ page }) => {
    await page.goto('/projects/')
    await page.locator('#tab-active').focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#tab-development')).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#projects-grid .project-card')).toHaveCount(0)
    await expect(page.locator('#projects-empty')).toBeVisible()
    await page.locator('#tab-archived').click()
    await expect(page.locator('#projects-panel')).toHaveAttribute('aria-labelledby', 'tab-archived')
  })

  for (const [lang, title, tab] of [
    ['fil', 'Mga Proyekto Namin', 'Aktibo'],
    ['ceb', 'Among mga Proyekto', 'Aktibo'],
  ]) {
    test(`page text is translated (${lang})`, async ({ page }) => {
      await page.addInitScript((l) => localStorage.setItem('selectedLang', l), lang)
      await page.goto('/projects/')
      await expect(page.locator('h1')).toHaveText(title)
      await expect(page.locator('#tab-active')).toContainText(tab)
      await expect(page.locator('#projects-search')).toHaveAttribute(
        'placeholder',
        lang === 'fil' ? 'Maghanap ng proyekto...' : 'Pangitaa ang mga proyekto...',
      )
      const budget = page.locator('.project-card', { hasText: 'Budget Tracker' })
      await expect(budget.locator('.project-card-desc')).toContainText(
        lang === 'fil' ? 'Portal para sa transparensiya' : 'Portal alang sa transparensya',
      )
    })
  }

  test('switching language re-renders the cards', async ({ page }) => {
    await page.goto('/projects/')
    await page.evaluate(() => window.TranslationEngine!.switchLanguage('ceb'))
    await expect(
      page.locator('.project-card', { hasText: 'Budget Tracker' }).locator('.project-card-desc'),
    ).toContainText('Portal alang sa')
  })
})
