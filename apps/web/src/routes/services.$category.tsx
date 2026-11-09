import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Icon } from '@/components/ui/icon'
import { contactDirectory } from '@/content/contact'
import { serviceBySlug, servicesForCategory } from '@/content/services'

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
      <Link to="/services" className="inline-flex items-center gap-2 font-semibold text-primary">
        <Icon name="arrow-left" className="text-base" />
        All services
      </Link>
      <h1 className="mt-6 text-4xl font-bold text-slate-950">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
      {category === 'health' ? <HealthOverview /> : null}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <Link
            key={service.id}
            to="/service-details/$slug"
            params={{ slug: service.id }}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-primary/30 text-inherit hover:text-inherit hover:no-underline"
          >
            <h2 className="font-bold text-slate-950">{service.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              View service
              <Icon name="arrow-right" className="text-base transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function HealthOverview() {
  const healthService = serviceBySlug('provincial-health-office')
  return (
    <section className="mt-10 rounded-2xl border border-primary-tint bg-primary-tint p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        Provincial Health Office
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">Health support in Bukidnon</h2>
      <p className="mt-3 max-w-3xl leading-7 text-slate-700">
        The Provincial Health Office coordinates public-health programs and provincial health
        services. For life-threatening emergencies anywhere in Bukidnon, call 911.
      </p>
      <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <a
          href={
            contactDirectory.hotlines.find(
              (hotline) => hotline.label === 'Provincial Health Office',
            )?.href
          }
          className="flex items-start gap-3 rounded-xl bg-white p-4 text-inherit hover:text-inherit hover:no-underline"
        >
          <Icon name="telephone-fill" className="mt-0.5 text-xl shrink-0 text-primary" />
          <span>
            <strong className="block text-slate-950">Phone</strong>
            <span className="text-slate-600">(088) 813-5631</span>
          </span>
        </a>
        <div className="flex items-start gap-3 rounded-xl bg-white p-4">
          <Icon name="geo-alt" className="mt-0.5 text-xl shrink-0 text-primary" />
          <span>
            <strong className="block text-slate-950">Address</strong>
            <span className="text-slate-600">{contactDirectory.address}</span>
          </span>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-white p-4">
          <Icon name="clock" className="mt-0.5 text-xl shrink-0 text-primary" />
          <span>
            <strong className="block text-slate-950">Office hours</strong>
            <span className="text-slate-600">{contactDirectory.officeHours}</span>
          </span>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-white p-4">
          <Icon name="exclamation-triangle-fill" className="mt-0.5 text-xl shrink-0 text-primary" />
          <span>
            <strong className="block text-slate-950">Emergency</strong>
            <a className="text-primary" href="tel:911">
              911
            </a>
          </span>
        </div>
      </div>
      {healthService ? (
        <Link
          to="/service-details/$slug"
          params={{ slug: healthService.id }}
          className="mt-6 inline-flex items-center gap-2 font-semibold text-primary"
        >
          View Provincial Health Office service <Icon name="arrow-right" className="text-base" />
        </Link>
      ) : null}
    </section>
  )
}
