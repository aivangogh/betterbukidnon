import { createFileRoute, Link } from '@tanstack/react-router'
import { Icon } from '@/components/ui/icon'
import { ServiceSearchBox } from '@/components/services/service-search-box'

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
      <p className="font-semibold text-primary">Service directory</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">How can the province help?</h1>
      <p className="mt-4 max-w-3xl text-lg text-slate-600">
        Choose a category to find the responsible provincial office, requirements, and official
        sources.
      </p>
      {/* Legacy .page-header-search; the page around it is rebuilt in the Services PR. */}
      <div className="mx-auto mt-6 max-w-125">
        <ServiceSearchBox
          id="service-search"
          placeholder="Search services (e.g., birth certificate, business permit)"
          wrapperClassName="group/search w-full"
          inputClassName="w-full rounded-full border-2 border-transparent bg-white py-4 pl-12 pr-5 text-[1rem] leading-[normal] shadow-[0_4px_20px_rgba(0,50,160,0.12),0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-250 placeholder:text-[#9ca3af] hover:shadow-[0_6px_24px_rgba(0,50,160,0.15),0_2px_8px_rgba(0,0,0,0.08)] focus:border-primary focus:shadow-[0_8px_32px_rgba(0,50,160,0.2),0_4px_12px_rgba(0,0,0,0.08)] focus:outline-none"
        >
          <Icon
            name="search"
            className="pointer-events-none absolute left-4.5 top-1/2 -translate-y-1/2 text-[1.125rem] text-primary opacity-70 transition-opacity group-focus-within/search:opacity-100"
          />
        </ServiceSearchBox>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(([label, category]) => (
          <Link
            key={category}
            to="/services/$category"
            params={{ category }}
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 shadow-sm hover:border-primary/30"
          >
            <span>{label}</span>
            <Icon
              name="arrow-right"
              className="text-xl text-primary transition group-hover:translate-x-1"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
