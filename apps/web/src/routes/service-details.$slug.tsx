import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { DocumentBody } from '@/components/blocks/document-body'
import { PageHeader } from '@/components/content/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Icon, type IconName } from '@/components/ui/icon'
import { serviceCategories } from '@/content/service-categories'
import { serviceBySlug } from '@/content/services'
import { loadServiceDocument } from '@/lib/content'
import { localized } from '@/lib/i18n'
import { seo } from '@/lib/seo'
import { getLocale } from '@/paraglide/runtime'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/service-details/$slug')({
  loader: async ({ params }) => {
    const document = await loadServiceDocument(params.slug)
    if (document) return { document }
    const service = serviceBySlug(params.slug)
    if (!service) throw notFound()
    return { service }
  },
  head: ({ loaderData, params }) => {
    const path = `/service-details/${params.slug}`
    if (loaderData?.document) {
      const { meta, locales } = loaderData.document
      return seo({ title: meta.shortTitle, description: meta.description, path, locales })
    }
    return loaderData?.service
      ? seo({ title: loaderData.service.title, description: loaderData.service.description, path })
      : {}
  },
  component: ServiceDetailPage,
})

function ServiceDetailPage() {
  const data = Route.useLoaderData()
  return data.document ? <ServiceGuide {...data.document} /> : <ServiceSummary {...data} />
}

/** A service guide written as a document (`content/services/<slug>`). */
function ServiceGuide({
  path,
  locale,
  meta,
}: NonNullable<Awaited<ReturnType<typeof loadServiceDocument>>>) {
  const category = serviceCategories[meta.category]
  return (
    <>
      <Breadcrumbs
        items={[
          { label: m.nav_home(), link: { to: '/' } },
          { label: m.nav_services(), link: { to: '/services' } },
          ...(category
            ? [
                {
                  label: localized(category.breadcrumb),
                  link: { to: '/services/$category', params: { category: meta.category } },
                } as const,
              ]
            : []),
          { label: meta.shortTitle },
        ]}
      />
      {/* An untranslated page shows the English text; mark it so screen readers read it as English. */}
      <div lang={locale === getLocale() ? undefined : locale}>
        <PageHeader
          badge={meta.badge}
          icon={meta.icon as IconName}
          title={meta.title}
          description={meta.summary}
        />
        <DocumentBody path={path} />
      </div>
    </>
  )
}

/** Services without a written guide yet: the summary from `data/services.json`. */
function ServiceSummary({ service }: { service?: ReturnType<typeof serviceBySlug> }) {
  if (!service) return null
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
