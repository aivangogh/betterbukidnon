import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Landmark } from 'lucide-react'
import { SectionPage } from '@/components/content/section-page'
import { demographics, officials } from '@/content/civic-data'

export const Route = createFileRoute('/government')({
  component: GovernmentPage,
})

function GovernmentPage() {
  return (
    <SectionPage
      eyebrow="Provincial government"
      title="Government of Bukidnon"
      description="Learn about the provincial executive, Sangguniang Panlalawigan, congressional districts, cities, and municipalities."
      icon={Landmark}
    >
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[officials.governor, officials.vice_governor].map((official) => (
          <div
            key={official.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold text-civic-700">{official.title}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">{official.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{official.party}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/government/officials"
          className="inline-flex items-center gap-2 rounded-lg bg-civic-700 px-5 py-3 font-semibold text-white hover:bg-civic-800"
        >
          View all officials <ArrowRight className="size-4" />
        </Link>
        <a
          href="#lgus"
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800"
        >
          View cities and municipalities
        </a>
      </div>
      <section id="lgus" className="mt-16 scroll-mt-28">
        <h2 className="text-2xl font-bold text-slate-950">Cities and municipalities</h2>
        <p className="mt-2 text-slate-600">
          {demographics.counts.cities} cities and {demographics.counts.municipalities}{' '}
          municipalities across four legislative districts.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {demographics.lgus.map((lgu) => (
            <li key={lgu.name} className="rounded-lg border border-slate-200 bg-white p-4">
              <span className="font-semibold">{lgu.name}</span>
              <span className="mt-1 block text-sm capitalize text-slate-500">
                {lgu.type} · District {lgu.district}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </SectionPage>
  )
}
