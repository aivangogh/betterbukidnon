import { Link } from '@tanstack/react-router'
import { Icon } from '@/components/ui/icon'
import type { InternalNavLink } from '@/content/navigation'
import { cn } from '@/lib/utils'

/** Legacy `.home-section-link`: arrow link whose gap widens on hover. */
export function SectionLink({
  link,
  children,
}: {
  link: InternalNavLink['link']
  children: React.ReactNode
}) {
  return (
    <Link
      {...link}
      className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-primary transition-[gap] hover:gap-2.5 hover:no-underline max-xl:min-h-11"
    >
      <Icon name="arrow-right" />
      <span>{children}</span>
    </Link>
  )
}

/** Legacy `.home-section-header`: 1.5rem title, optional link, optional subtitle below. */
export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode
  subtitle?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-wrap items-center justify-between gap-4 max-[769px]:flex-col max-[769px]:text-center',
        className,
      )}
    >
      <h2 className="m-0 text-[1.5rem]">{title}</h2>
      {action}
      {subtitle && <p className="m-0 w-full text-ink-light">{subtitle}</p>}
    </div>
  )
}

/** Legacy `.home-stats-v2-header`: smaller 1.25rem title used by the glance, weather and history sections. */
export function GlanceHeader({
  title,
  action,
}: {
  title: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex items-center justify-between max-[577px]:flex-col max-[577px]:gap-4 max-[577px]:text-center">
      <h2 className="m-0 flex items-center gap-2.5 text-[1.25rem]">{title}</h2>
      {action}
    </div>
  )
}

/** Legacy `.btn` sizing shared by the hero and dialog buttons. */
export const buttonBase =
  'inline-flex items-center gap-2 rounded-site border-2 border-transparent px-6 py-3 text-center font-semibold transition-all duration-200 hover:no-underline focus-visible:shadow-[0_0_0_3px_rgba(247,127,0,0.5)] focus-visible:outline-none max-md:px-5 max-md:py-2.5 max-md:text-[0.9375rem]'
