import type { LucideIcon } from 'lucide-react'
import { SectionPage } from './section-page'

export function InformationPage({
  eyebrow,
  title,
  description,
  icon,
  sections,
}: {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  sections: ReadonlyArray<{ heading: string; body: string }>
}) {
  return (
    <SectionPage eyebrow={eyebrow} title={title} description={description} icon={icon}>
      <div className="mt-10 grid gap-5">
        {sections.map((section) => (
          <section
            key={section.heading}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-950">{section.heading}</h2>
            <p className="mt-3 leading-7 text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>
    </SectionPage>
  )
}
