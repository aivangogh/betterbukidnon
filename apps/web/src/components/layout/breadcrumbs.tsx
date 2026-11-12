import { Link, useRouter } from '@tanstack/react-router'
import { Fragment } from 'react'
import type { InternalNavLink } from '@/content/navigation'
import { localizePath } from '@/lib/i18n'
import { scriptJson } from '@/lib/seo'
import { breadcrumbStructuredData } from '@/lib/structured-data'

type Crumb = { label: string; link?: InternalNavLink['link'] }

/**
 * Legacy `.breadcrumbs`: "Home / Section / Page", with the last item as the current page.
 * Also emits the trail as a schema.org BreadcrumbList for search results.
 */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  const router = useRouter()
  const structured = breadcrumbStructuredData(
    items.map((item) => ({
      label: item.label,
      // buildLocation gives the route path; the trail must point to this language's pages.
      href: item.link ? localizePath(router.buildLocation(item.link).href) : undefined,
    })),
  )
  return (
    <div className="container-site">
      <nav
        aria-label="Breadcrumb"
        className="py-4 text-[0.875rem] text-ink-light max-md:text-[0.8125rem]"
      >
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <Fragment key={item.label}>
              {index > 0 && <span className="mx-2">/</span>}
              {item.link && !last ? (
                <Link {...item.link} className="text-ink-light">
                  {item.label}
                </Link>
              ) : (
                <span className="mx-2 first:ml-0" aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </Fragment>
          )
        })}
      </nav>
      <script
        type="application/ld+json"
        // Serialized page data only, with `<` escaped.
        dangerouslySetInnerHTML={{ __html: scriptJson(structured) }}
      />
    </div>
  )
}
