import fs from 'node:fs'
import { generateSW } from 'workbox-build'

const clientDirectory = new URL('../apps/web/dist/client/', import.meta.url).pathname

// The offline page is shown at whatever URL failed to load, where the app would expect that
// URL's page and fail to hydrate. Serve a copy without scripts: styled, with plain links.
const offlinePage = fs.readFileSync(`${clientDirectory}offline/index.html`, 'utf8')
fs.writeFileSync(
  `${clientDirectory}offline.html`,
  offlinePage
    .replace(/<script\b[\s\S]*?<\/script>/g, '')
    .replace(/<link rel="modulepreload"[^>]*>/g, ''),
)

const result = await generateSW({
  globDirectory: clientDirectory,
  globPatterns: ['**/*.{css,html,ico,js,json,png,svg,webmanifest}'],
  // Lottie animations are large and only decorative, so they are fetched on demand.
  // Filipino and Cebuano pages are cached as they are visited (below) instead of on install,
  // so a first visit does not download every page three times.
  globIgnores: ['sw.js', 'workbox-*.js', 'animations/**', 'fil/**', 'ceb/**'],
  swDest: `${clientDirectory}sw.js`,
  // Pages are served without a trailing slash and may carry a query (/services?q=birth), so
  // precache each page under its URL (/services, not /services/index.html) and match it
  // without the query. Otherwise such navigations got the home page's HTML.
  manifestTransforms: [
    async (entries) => ({
      manifest: entries.map((entry) => ({
        ...entry,
        url: entry.url.endsWith('/index.html')
          ? entry.url.slice(0, -'/index.html'.length)
          : entry.url,
      })),
      warnings: [],
    }),
  ],
  ignoreURLParametersMatching: [/./],
  runtimeCaching: [
    {
      urlPattern: ({ request, url }) =>
        request.mode === 'navigate' && /^\/(fil|ceb)(\/|$)/.test(url.pathname),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'localized-pages',
        expiration: { maxEntries: 60 },
        precacheFallback: { fallbackURL: '/offline.html' },
      },
    },
    {
      // Any other navigation is not a prerendered page: ask the network (which answers with
      // the 404 page) and show the offline page when there is no connection.
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkOnly',
      options: { precacheFallback: { fallbackURL: '/offline.html' } },
    },
  ],
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: false,
})

console.log(`Generated service worker for ${result.count} files (${result.size} bytes).`)
