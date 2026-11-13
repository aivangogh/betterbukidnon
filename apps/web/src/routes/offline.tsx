import { createFileRoute, Link } from '@tanstack/react-router'
import { SectionPage } from '@/components/layout/section-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/offline')({
  head: () =>
    seo({
      title: m.seo_offline_title(),
      description: m.seo_home_description(),
      path: '/offline',
      noindex: true,
    }),

  component: () => (
    <SectionPage
      eyebrow="Offline"
      title="You are offline"
      description="Check your connection, then try again. Previously visited portal pages may still be available."
      icon="wifi-off"
    >
      <Link
        to="/"
        className="mt-8 inline-flex rounded-lg bg-primary px-5 py-3 font-semibold text-white"
      >
        Return home
      </Link>
    </SectionPage>
  ),
})
