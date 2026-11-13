import { Icon, type IconName } from '@/components/ui/icon'

/** Legacy `.quick-stats`: four facts in a row, two up to 768px, one below 576px. */
export function Stats({ children }: { children: React.ReactNode }) {
  return (
    <dl className="mb-5 grid grid-cols-4 gap-2.5 max-[769px]:grid-cols-2 max-sm:grid-cols-1">
      {children}
    </dl>
  )
}

export function Stat({
  icon,
  label,
  children,
}: {
  icon: IconName
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-site border border-black/6 bg-white p-3 text-center">
      <Icon name={icon} className="text-[1rem] text-primary" />
      <dt className="mb-0.5 text-[0.625rem] font-medium uppercase leading-[1.2] tracking-[-0.02em] text-ink-light">
        {label}
      </dt>
      {/* Formatted MDX puts the value on its own line, which makes it a paragraph. */}
      <dd className="m-0 text-[0.8125rem] font-semibold text-ink [&_p]:m-0">{children}</dd>
    </div>
  )
}

/** Legacy `.service-grid`: three columns, two up to 993px, one below 576px. */
export function Cards({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 max-[993px]:grid-cols-2 max-sm:grid-cols-1">
      {children}
    </div>
  )
}

/** Legacy `.service-card`: a titled card with an optional tag (`.service-meta`). */
export function Card({
  icon,
  title,
  tag,
  children,
}: {
  icon: IconName
  title: string
  tag?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-site border border-black/6 bg-white p-3.5 transition-all duration-200 hover:border-primary hover:shadow-[0_2px_10px_rgba(0,50,160,0.08)] [&_p]:mb-2 [&_p]:text-[0.6875rem] [&_p]:leading-[1.4] [&_p]:text-ink-light">
      <h3 className="mb-1.5 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink">
        <Icon name={icon} className="text-[0.875rem] text-primary" />
        <span>{title}</span>
      </h3>
      {children}
      {tag && (
        <div className="flex flex-wrap gap-2 text-[0.625rem]">
          <span className="rounded bg-primary/6 px-1.5 py-0.5 font-medium text-primary">{tag}</span>
        </div>
      )}
    </div>
  )
}
