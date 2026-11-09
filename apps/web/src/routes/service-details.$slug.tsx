import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, Building2, Clock3, PhilippinePeso } from 'lucide-react'
import { serviceBySlug } from '@/content/services'

export const Route = createFileRoute('/service-details/$slug')({
  loader: ({ params }) => {
    const service = serviceBySlug(params.slug)
    if (!service) throw notFound()
    return { service }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.service.title ?? 'Service'} | BetterBukidnon.org`,
      },
      { name: 'description', content: loaderData?.service.description ?? '' },
    ],
  }),
  component: ServiceDetailPage,
})

function ServiceDetailPage() {
  const { service } = Route.useLoaderData()
  return (
    <article className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <Link to="/services" className="inline-flex items-center gap-2 font-semibold text-civic-700">
        <ArrowLeft className="size-4" />
        All services
      </Link>
      <p className="mt-8 font-semibold text-civic-700">Service guide</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">{service.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{service.description}</p>
      <dl className="mt-10 grid gap-4 md:grid-cols-3">
        <Detail
          icon={Building2}
          label="Responsible office"
          value={service.office ?? 'Confirm with the Provincial Government'}
        />
        <Detail
          icon={PhilippinePeso}
          label="Fee"
          value={service.fee ?? 'Confirm with the office'}
        />
        <Detail icon={Clock3} label="Processing time" value={service.processingTime ?? 'Varies'} />
      </dl>
      <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h2 className="font-bold">Verify before visiting</h2>
        <p className="mt-2 leading-7">
          Requirements, fees, and office procedures can change. Contact the responsible office or
          consult its official government channel before travelling or submitting documents.
        </p>
      </div>
    </article>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="size-6 text-civic-600" />
      <dt className="mt-4 text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-950">{value}</dd>
    </div>
  )
}
