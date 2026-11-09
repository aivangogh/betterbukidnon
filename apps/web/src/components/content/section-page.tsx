import { Icon, type IconName } from '@/components/ui/icon'

export function SectionPage({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  icon: IconName
  children?: React.ReactNode
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary-tint text-primary">
        <Icon name={icon} className="text-2xl" />
      </div>
      <p className="mt-6 font-semibold text-primary">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
      {children}
    </section>
  )
}
