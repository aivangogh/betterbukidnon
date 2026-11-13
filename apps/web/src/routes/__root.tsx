import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { SiteShell } from '@/components/layout/site-shell'
import { PwaUpdateNotice } from '@/features/pwa/update-notice'
import { getLocale } from '@/paraglide/runtime'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // Each route adds its title, description, canonical and social tags with seo().
      { name: 'theme-color', content: '#0032a0' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument() {
  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body>
        <SiteShell>
          <Outlet />
        </SiteShell>
        <PwaUpdateNotice />
        <Scripts />
      </body>
    </html>
  )
}
