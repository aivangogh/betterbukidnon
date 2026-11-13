import { createFileRoute, notFound } from '@tanstack/react-router'
import { serviceCategories } from '@/features/services/categories'
import { ServiceCategoryPage } from '@/features/services/category-page'
import { localized } from '@/lib/i18n'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/services/$category')({
  loader: ({ params }) => {
    const page = serviceCategories[params.category]
    if (!page) throw notFound()
    return page
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? seo({
          title: localized(loaderData.title),
          description: localized(loaderData.metaDescription),
          path: `/services/${params.category}`,
        })
      : {},
  component: function CategoryRoute() {
    return <ServiceCategoryPage page={Route.useLoaderData()} />
  },
})
