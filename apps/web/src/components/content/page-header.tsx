import { Icon, type IconName } from '@/components/ui/icon'

/** Legacy `.page-header`: centered badge, title and description on the blue gradient. */
export function PageHeader({
  badge,
  icon,
  title,
  description,
  children,
}: {
  badge: string
  icon: IconName
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <section className="bg-linear-135 from-primary to-secondary py-12 text-white">
      <div className="container-site">
        <div className="mx-auto max-w-150 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-[0.8125rem] font-medium text-white">
            <Icon name={icon} />
            {badge}
          </span>
          <h1 className="mb-2 text-[2rem] text-white">{title}</h1>
          {description && <p className="m-0 text-[1rem] text-white/90">{description}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
