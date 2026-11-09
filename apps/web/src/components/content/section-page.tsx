import type { LucideIcon } from 'lucide-react'

export function SectionPage({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  children?: React.ReactNode
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
      <div className="flex size-12 items-center justify-center rounded-xl bg-civic-100 text-civic-700">
        <Icon />
      </div>
      <p className="mt-6 font-semibold text-civic-700">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
      {children}
    </section>
  )
}
