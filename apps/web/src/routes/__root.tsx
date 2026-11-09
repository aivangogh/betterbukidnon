import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { SiteShell } from '@/components/layout/site-shell'
import { PwaUpdateNotice } from '@/components/pwa/update-notice'
import { site } from '@/content/site'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: `${site.name} | Bukidnon Civic Portal` },
      { name: 'description', content: site.description },
      { name: 'theme-color', content: '#0b3153' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'icon', href: '/icons/app-icon.svg', type: 'image/svg+xml' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en">
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
