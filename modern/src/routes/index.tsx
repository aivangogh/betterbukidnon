import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Building2,
  HeartPulse,
  Landmark,
  Search,
} from 'lucide-react'
import { motion } from 'motion/react'

export const Route = createFileRoute('/')({ component: HomePage })

const highlights = [
  {
    title: 'Provincial services',
    text: 'Find the right office, requirements, and official contacts.',
    to: '/services',
    icon: Building2,
  },
  {
    title: 'Health and safety',
    text: 'Access health services, emergency contacts, and public guidance.',
    to: '/services/health',
    icon: HeartPulse,
  },
  {
    title: 'Open government',
    text: 'Explore officials, legislation, budgets, and public records.',
    to: '/government',
    icon: Landmark,
  },
] as const

function HomePage() {
  return (
    <>
      <section className="overflow-hidden bg-gradient-to-br from-civic-900 via-civic-700 to-pine-700 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="mb-4 font-semibold text-civic-100">
              A civic portal built for Bukidnons
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Public information should be easy to find and understand.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Browse provincial services, officials, emergency contacts,
              statistics, and transparency records in one accessible place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-civic-900 shadow-lg hover:bg-civic-50"
              >
                Browse services <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-lg border border-white/50 px-5 py-3 font-semibold hover:bg-white/10"
              >
                Contact directory
              </Link>
            </div>
          </motion.div>
          <div className="self-end rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3">
              <Search className="size-5" />
              <h2 className="font-semibold">Find a service</h2>
            </div>
            <Link
              to="/services"
              className="mt-4 block rounded-xl bg-white px-4 py-4 text-slate-500 shadow"
            >
              Search services and government offices…
            </Link>
            <p className="mt-4 text-sm text-slate-200">
              Popular: property tax, birth certificates, social assistance
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map(({ title, text, to, icon: Icon }) => {
            const content = (
              <>
                <Icon className="size-9 text-civic-600" />
                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {title}
                </h2>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-civic-700">
                  Explore{' '}
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </>
            )
            const className =
              'group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-civic-200 hover:shadow-lg'
            return to === '/services/health' ? (
              <Link
                key={title}
                to="/services/$category"
                params={{ category: 'health' }}
                className={className}
              >
                {content}
              </Link>
            ) : (
              <Link key={title} to={to} className={className}>
                {content}
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
