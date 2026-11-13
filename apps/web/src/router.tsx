import { createRouter } from '@tanstack/react-router'
import { RouterNotFound } from '@/components/layout/not-found'
import { deLocalizeUrl, localizeUrl } from './paraglide/runtime'
import { routeTree } from './routeTree.gen'

// Pages are served without a trailing slash (wrangler html_handling: drop-trailing-slash),
// so locale roots are /fil and /ceb, not /fil/.
function withoutTrailingSlash(url: URL) {
  if (url.pathname.length > 1 && url.pathname.endsWith('/'))
    url.pathname = url.pathname.slice(0, -1)
  return url
}

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultNotFoundComponent: RouterNotFound,
    // Routes are defined once; /fil/... and /ceb/... map onto them and back.
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => withoutTrailingSlash(localizeUrl(url)),
    },
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
