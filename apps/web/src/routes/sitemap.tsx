import { createFileRoute, Link } from '@tanstack/react-router'
import { SectionPage } from '@/components/content/section-page'
import { primaryNavigation } from '@/content/navigation'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/sitemap')({
  head: () =>
    seo({
      title: m.seo_sitemap_title(),
      description: m.seo_sitemap_description(),
      path: '/sitemap',
    }),
  component: SitemapPage,
})

function SitemapPage() {
  return (
    <SectionPage
      eyebrow="Navigation"
      title="Sitemap"
      description="Browse the main public pages in the BetterBukidnon.org portal."
      icon="diagram-3-fill"
    >
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {primaryNavigation
          .flatMap((item) => (item.link ? [{ ...item, link: item.link }] : []))
          .map((item) => (
            <li key={item.label()}>
              <Link
                {...item.link}
                className="block rounded-xl border border-slate-200 bg-white p-5 font-semibold text-primary shadow-sm hover:border-primary/30"
              >
                {item.label()}
              </Link>
            </li>
          ))}
      </ul>
    </SectionPage>
  )
}
