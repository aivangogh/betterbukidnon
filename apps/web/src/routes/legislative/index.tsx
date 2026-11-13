import { createFileRoute } from '@tanstack/react-router'
import { Icon } from '@/components/ui/icon'
import { SectionPage } from '@/components/layout/section-page'
import { ordinances, resolutions } from '@/features/legislative/data'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/legislative/')({
  head: () =>
    seo({
      title: m.seo_legislative_title(),
      description: m.seo_legislative_description(),
      path: '/legislative',
    }),

  component: LegislativePage,
})

function LegislativePage() {
  return (
    <SectionPage
      eyebrow="Sangguniang Panlalawigan"
      title="Legislative records"
      description="Provincial ordinances and resolutions copied only from official records."
      icon="bank2"
    >
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <RecordGroup
          title="Ordinances"
          count={ordinances.ordinances.length}
          source={ordinances._source}
        />
        <RecordGroup
          title="Resolutions"
          count={resolutions.resolutions.length}
          source={resolutions._source}
        />
      </div>
    </SectionPage>
  )
}

function RecordGroup({ title, count, source }: { title: string; count: number; source: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      {count === 0 ? (
        <>
          <p className="mt-3 leading-7 text-slate-600">
            No verified {title.toLowerCase()} have been added. Use the official Provincial
            Government source.
          </p>
          <a
            href="https://bukidnon.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-primary"
          >
            Official source <Icon name="box-arrow-up-right" className="text-base" />
          </a>
        </>
      ) : (
        <p className="mt-3">{count} records</p>
      )}
      <p className="mt-5 text-xs text-slate-500">Dataset source: {source}</p>
    </section>
  )
}
