import { generateSW } from 'workbox-build'

const clientDirectory = new URL('../apps/web/dist/client/', import.meta.url).pathname

const result = await generateSW({
  globDirectory: clientDirectory,
  globPatterns: ['**/*.{css,html,ico,js,json,png,svg,webmanifest}'],
  globIgnores: ['sw.js', 'workbox-*.js'],
  swDest: `${clientDirectory}sw.js`,
  navigateFallback: '/index.html',
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: false,
})

console.log(`Generated service worker for ${result.count} files (${result.size} bytes).`)
