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
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
      },
      pages: serviceDetailPages,
    }),
    viteReact(),
  ],
})
