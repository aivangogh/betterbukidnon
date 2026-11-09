// Phone-size screenshots of the site's pages, for checking layout changes and
// for before/after images in pull requests. Also reports pages that scroll
// sideways.
//
//   npm run screenshots:mobile
//   npm run screenshots:mobile -- --pages=home,services --widths=320,412
//   npm run screenshots:mobile -- --browser=firefox --out=screenshots/before
//
// Options:
//   --pages=a,b     Page folders to capture; "home" is the homepage (default: all)
//   --widths=a,b    Viewport widths in CSS pixels (default: 320,375,412)
//   --out=dir       Output folder (default: screenshots)
//   --browser=name  chrome (installed Google Chrome, the default), chromium or
//                   firefox (both from `npx playwright install`)

import { chromium, firefox } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = new URL('..', import.meta.url).pathname;
const PORT = 8912;
const BASE = `http://localhost:${PORT}`;
const HEIGHT = 800;

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value = ''] = arg.replace(/^--/, '').split('=');
    return [key, value];
  })
);

const allPages = [
  'home',
  ...readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(ROOT, d.name, 'index.html')))
    .map((d) => d.name)
    .filter((name) => !['admin', 'docs', 'node_modules', 'dist', 'react-app'].includes(name))
    .sort(),
];
const pages = args.pages ? args.pages.split(',') : allPages;
const widths = (args.widths || '320,375,412').split(',').map(Number);
const outDir = resolve(ROOT, args.out || 'screenshots');
const browserName = args.browser || 'chrome';

const unknown = pages.filter((p) => !allPages.includes(p));
if (unknown.length) {
  console.error(`Unknown page(s): ${unknown.join(', ')}\nAvailable: ${allPages.join(', ')}`);
  process.exit(1);
}

function launch() {
  if (browserName === 'firefox') return firefox.launch();
  if (browserName === 'chromium') return chromium.launch();
  return chromium.launch({ channel: 'chrome' }).catch((err) => {
    console.error(
      'Could not start Google Chrome. Install it, or use --browser=chromium after\n' +
        '`npx playwright install chromium`.\n'
    );
    throw err;
  });
}

mkdirSync(outDir, { recursive: true });
const server = spawn('python3', ['-m', 'http.server', String(PORT)], {
  cwd: ROOT,
  stdio: 'ignore',
});
await sleep(1000);

const browser = await launch();
const overflowing = [];
try {
  for (const width of widths) {
    // Firefox does not support isMobile; it still lays out at the given width
    const context = await browser.newContext({
      viewport: { width, height: HEIGHT },
      deviceScaleFactor: 2,
      ...(browserName === 'firefox' ? {} : { isMobile: true, hasTouch: true }),
    });
    // Mark the volunteer popup as seen so it does not cover the page
    await context.addInitScript(() => {
      try {
        localStorage.setItem('bb-vol-popup-v1', '1');
      } catch (e) {}
    });
    const page = await context.newPage();

    for (const name of pages) {
      const path = name === 'home' ? 'index.html' : `${name}/index.html`;
      await page.goto(`${BASE}/${path}`, { waitUntil: 'load' });
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

      await page.screenshot({ path: join(outDir, `${name}-${width}.png`) });

      // Scroll through the page so scroll-triggered reveals and lazy content
      // render before the full-page capture
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += HEIGHT / 2) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await sleep(100);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(500);
      await page.screenshot({ path: join(outDir, `${name}-${width}-full.png`), fullPage: true });

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      if (overflow > 0)
        overflowing.push(`${name} at ${width}px: ${overflow}px wider than the screen`);
      console.log(
        `  ${name} @ ${width}px${overflow > 0 ? `  (scrolls sideways by ${overflow}px)` : ''}`
      );
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.kill();
}

console.log(`\nSaved ${pages.length * widths.length * 2} screenshots to ${outDir}`);
if (overflowing.length) {
  console.log(`\nPages that scroll sideways:\n  ${overflowing.join('\n  ')}`);
}
