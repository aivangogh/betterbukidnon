import { createFileRoute } from '@tanstack/react-router'
import { SectionPage } from '@/components/layout/section-page'
import { demographics } from '@/features/government/data'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/statistics')({
  head: () =>
    seo({
      title: m.seo_statistics_title(),
      description: m.seo_statistics_description(),
      path: '/statistics',
    }),

  component: StatisticsPage,
})

function StatisticsPage() {
  const metrics = [
    [
      demographics.population.total.toLocaleString('en-PH'),
      `Population (${demographics.population.year})`,
    ],
    [demographics.land_area_km2.toLocaleString('en-PH'), 'Land area (km²)'],
    [demographics.counts.barangays.toLocaleString('en-PH'), 'Barangays'],
    [
      `${demographics.counts.cities + demographics.counts.municipalities}`,
      'Cities and municipalities',
    ],
  ]
  return (
    <SectionPage
      eyebrow="Open data"
      title="Bukidnon at a glance"
      description="Population, land area, barangays, cities, municipalities, and verified provincial indicators."
      icon="bar-chart-fill"
    >
      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([value, label]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <dd className="text-3xl font-bold text-primary-dark">{value}</dd>
            <dt className="mt-2 text-sm font-medium text-slate-600">{label}</dt>
          </div>
        ))}
      </dl>
      <div className="mt-12 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="p-5 text-left text-xl font-bold text-slate-950">
            Local government units
          </caption>
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3">LGU</th>
              <th className="p-3">District</th>
              <th className="p-3">2020 population</th>
              <th className="p-3">Barangays</th>
            </tr>
          </thead>
          <tbody>
            {demographics.lgus.map((lgu) => (
              <tr key={lgu.name} className="border-t border-slate-200">
                <th className="p-3 font-semibold">{lgu.name}</th>
                <td className="p-3">{lgu.district}</td>
                <td className="p-3">{lgu.population_2020.toLocaleString('en-PH')}</td>
                <td className="p-3">{lgu.barangays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionPage>
  )
}
