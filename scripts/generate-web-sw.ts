import { generateSW } from 'workbox-build'

const clientDirectory = new URL('../apps/web/dist/client/', import.meta.url).pathname

const result = await generateSW({
  globDirectory: clientDirectory,
  globPatterns: ['**/*.{css,html,ico,js,json,png,svg,webmanifest}'],
  // Lottie animations are large and only decorative, so they are fetched on demand.
  // Filipino and Cebuano pages are cached as they are visited (below) instead of on install,
  // so a first visit does not download every page three times.
  globIgnores: ['sw.js', 'workbox-*.js', 'animations/**', 'fil/**', 'ceb/**'],
  swDest: `${clientDirectory}sw.js`,
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/(fil|ceb)(\/|$)/],
  runtimeCaching: [
    {
      urlPattern: ({ request, url }) =>
        request.mode === 'navigate' && /^\/(fil|ceb)(\/|$)/.test(url.pathname),
      handler: 'NetworkFirst',
      options: { cacheName: 'localized-pages', expiration: { maxEntries: 60 } },
    },
  ],
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: false,
})

console.log(`Generated service worker for ${result.count} files (${result.size} bytes).`)
