import { paraglideVitePlugin } from '@inlang/paraglide-js'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { paraglideOptions } from './paraglide.config'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'
import servicesData from '../../data/services.json' with { type: 'json' }

const serviceDetailPages = servicesData.services
  .filter((service) => service.url.includes('service-details'))
  .map((service) => ({
    path: `/service-details/${service.id}`,
    prerender: { enabled: true },
  }))

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
  publicDir: 'public',
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
    tsconfigPaths: true,
  },
  plugins: [
    paraglideVitePlugin(paraglideOptions),
    {
      enforce: 'pre',
      ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    },
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
      },
      // The locale home pages seed the crawl of each language's pages.
      pages: [
        ...serviceDetailPages,
        // Cloudflare serves the nearest 404.html for unknown URLs (not_found_handling).
        ...['', '/fil', '/ceb'].map((prefix) => ({
          path: `${prefix}/404`,
          prerender: { enabled: true, outputPath: `${prefix}/404`, autoSubfolderIndex: false },
        })),
        ...['fil', 'ceb'].flatMap((locale) => [
          { path: `/${locale}`, prerender: { enabled: true } },
          ...serviceDetailPages.map((page) => ({ ...page, path: `/${locale}${page.path}` })),
        ]),
      ],
    }),
    viteReact(),
  ],
})
