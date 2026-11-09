import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { canonicalServicePath, servicesForCategory } from '@/content/services'

const categories = {
  agriculture: [
    'Agriculture services',
    'Support for farmers, livestock raisers, cooperatives, and agricultural communities.',
  ],
  business: [
    'Business permits and licensing',
    'Understand which permits are handled by cities, municipalities, and provincial offices.',
  ],
  certificates: [
    'Certificates and vital records',
    'Guidance for birth, marriage, death, and civil registry documents.',
  ],
  education: [
    'Education and scholarships',
    'Find provincial education assistance and scholarship information.',
  ],
  environment: [
    'Environmental services',
    'Provincial programs for natural resources, waste, and environmental protection.',
  ],
  health: [
    'Health services',
    'Provincial health offices, hospitals, public-health programs, and emergency guidance.',
  ],
  infrastructure: [
    'Infrastructure services',
    'Public works, engineering, construction, and infrastructure information.',
  ],
  'public-safety': [
    'Public safety',
    'Emergency management, disaster preparedness, and public-safety contacts.',
  ],
  'social-services': [
    'Social services',
    'Assistance programs for families, children, older people, and vulnerable residents.',
  ],
  'tax-payments': [
    'Tax and payment services',
    'Provincial treasury, assessment, real-property tax, and payment guidance.',
  ],
} as const

type Category = keyof typeof categories

export const Route = createFileRoute('/services/$category')({
  loader: ({ params }) => {
    if (!(params.category in categories)) throw notFound()
    return { category: params.category as Category }
  },
  component: CategoryPage,
})

function CategoryPage() {
  const { category } = Route.useLoaderData()
  const [title, description] = categories[category]
  const services = servicesForCategory(category)
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <Link
        to="/services"
        className="inline-flex items-center gap-2 font-semibold text-civic-700"
      >
        <ArrowLeft className="size-4" />
        All services
      </Link>
      <h1 className="mt-6 text-4xl font-bold text-slate-950">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        {description}
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <a
            key={service.id}
            href={canonicalServicePath(service.url)}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-civic-300"
          >
            <h2 className="font-bold text-slate-950">{service.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {service.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-civic-700">
              View service
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
