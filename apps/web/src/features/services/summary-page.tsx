import { Link } from '@tanstack/react-router'
import { Icon, type IconName } from '@/components/ui/icon'
import type { Service } from './schemas'

/** Services without a written guide yet: the summary from `data/services.json`. */
export function ServiceSummaryPage({ service }: { service: Service }) {
  return (
    <article className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <Link to="/services" className="inline-flex items-center gap-2 font-semibold text-primary">
        <Icon name="arrow-left" className="text-base" />
        All services
      </Link>
      <p className="mt-8 font-semibold text-primary">Service guide</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">{service.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{service.description}</p>
      <dl className="mt-10 grid gap-4 md:grid-cols-3">
        <Detail
          icon="building"
          label="Responsible office"
          value={service.office ?? 'Confirm with the Provincial Government'}
        />
        <Detail icon="cash-coin" label="Fee" value={service.fee ?? 'Confirm with the office'} />
        <Detail icon="clock" label="Processing time" value={service.processingTime ?? 'Varies'} />
      </dl>
      <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h2 className="mb-0 text-[length:inherit] font-bold text-inherit">
          Verify before visiting
        </h2>
        <p className="mt-2 leading-7">
          Requirements, fees, and office procedures can change. Contact the responsible office or
          consult its official government channel before travelling or submitting documents.
        </p>
      </div>
    </article>
  )
}

function Detail({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon name={icon} className="text-2xl text-primary" />
      <dt className="mt-4 text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-950">{value}</dd>
    </div>
  )
}
