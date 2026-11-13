import { createFileRoute, notFound } from '@tanstack/react-router'
import { loadServiceGuide } from '@/features/services/guides'
import { ServiceGuidePage } from '@/features/services/guide-page'
import { serviceBySlug } from '@/features/services/services'
import { ServiceSummaryPage } from '@/features/services/summary-page'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/service-details/$slug')({
  loader: async ({ params }) => {
    const document = await loadServiceGuide(params.slug)
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
  if (data.document) return <ServiceGuidePage {...data.document} />
  return data.service ? <ServiceSummaryPage service={data.service} /> : null
}
