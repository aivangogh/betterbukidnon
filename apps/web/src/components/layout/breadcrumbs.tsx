import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'
import type { InternalNavLink } from '@/content/navigation'

type Crumb = { label: string; link?: InternalNavLink['link'] }

/** Legacy `.breadcrumbs`: "Home / Section / Page", with the last item as the current page. */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
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
    </div>
  )
}
