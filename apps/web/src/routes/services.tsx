import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/services')({ component: ServicesPage })

const categories = [
  ['Agriculture', 'agriculture'],
  ['Business', 'business'],
  ['Certificates', 'certificates'],
  ['Education', 'education'],
  ['Environment', 'environment'],
  ['Health', 'health'],
  ['Infrastructure', 'infrastructure'],
  ['Public safety', 'public-safety'],
  ['Social services', 'social-services'],
  ['Tax and payments', 'tax-payments'],
] as const

function ServicesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <p className="font-semibold text-civic-700">Service directory</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">How can the province help?</h1>
      <p className="mt-4 max-w-3xl text-lg text-slate-600">
        Choose a category to find the responsible provincial office, requirements, and official
        sources.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(([label, category]) => (
          <Link
            key={category}
            to="/services/$category"
            params={{ category }}
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 shadow-sm hover:border-civic-300"
          >
            <span>{label}</span>
            <ArrowRight className="size-5 text-civic-600 transition group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  )
}
