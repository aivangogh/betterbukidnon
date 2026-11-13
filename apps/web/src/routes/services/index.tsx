import { createFileRoute } from '@tanstack/react-router'
import { ServicesDirectoryPage } from '@/features/services/directory-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/services/')({
  // ?q= opens the search with that query (the target of the home page's SearchAction).
  validateSearch: (search: Record<string, unknown>): { q?: string } =>
    typeof search.q === 'string' && search.q ? { q: search.q } : {},
  head: () =>
    seo({
      title: m.seo_services_title(),
      description: m.seo_services_description(),
      path: '/services',
    }),
  component: function ServicesRoute() {
    return <ServicesDirectoryPage initialQuery={Route.useSearch().q} />
  },
})
