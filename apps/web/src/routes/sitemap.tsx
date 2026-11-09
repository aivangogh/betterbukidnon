import { createFileRoute, Link } from '@tanstack/react-router'
import { SectionPage } from '@/components/content/section-page'
import { navigation } from '@/content/site'

export const Route = createFileRoute('/sitemap')({ component: SitemapPage })

function SitemapPage() {
  return (
    <SectionPage
      eyebrow="Navigation"
      title="Sitemap"
      description="Browse the main public pages in the BetterBukidnon.org portal."
      icon="diagram-3-fill"
    >
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {[{ label: 'Home', to: '/' }, ...navigation].map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="block rounded-xl border border-slate-200 bg-white p-5 font-semibold text-primary shadow-sm hover:border-primary/30"
            >
              {item.label.startsWith('nav.') ? item.label.slice(4) : item.label}
            </Link>
          </li>
        ))}
      </ul>
    </SectionPage>
  )
}
