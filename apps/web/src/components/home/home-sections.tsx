import { Link } from '@tanstack/react-router'
import { Icon, type IconName } from '@/components/ui/icon'
import { LottieAnimation } from '@/components/ui/lottie'
import type { InternalNavLink } from '@/content/navigation'
import { text, type Message } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { GlanceHeader, SectionHeader, SectionLink } from './home-ui'
import { m } from '@/paraglide/messages'

const dotGrid = (alpha: number) =>
  `radial-gradient(circle, rgba(0,50,160,${alpha}) 1px, transparent 1px)`

export function LguCta() {
  const button =
    'inline-flex items-center gap-2.5 rounded-site px-7 py-3.5 text-[1rem] font-semibold transition-all hover:no-underline max-[769px]:w-full max-[769px]:justify-center max-[769px]:px-6'
  return (
    <section
      aria-labelledby="lgu-cta-heading"
      className="bg-surface-alt bg-size-[20px_20px] py-20 max-[769px]:py-14"
      style={{ backgroundImage: dotGrid(0.12) }}
    >
      <div className="container-site">
        <div className="mx-auto flex max-w-300 items-center gap-12 max-[769px]:flex-col max-[769px]:gap-8 max-[769px]:text-center">
          <LottieAnimation
            src="/animations/ramonloganjr-booking.json"
            className="aspect-square max-w-105 flex-[0_0_420px] max-[769px]:mx-auto max-[769px]:max-w-80 max-[769px]:flex-none"
          />
          <div className="flex-1 text-left max-[769px]:text-center">
            <h2
              id="lgu-cta-heading"
              className="mb-4 mt-0 text-[2.25rem] font-extrabold leading-[1.2] text-ink max-[769px]:text-[1.5rem]"
            >
              {m.home_lgu_cta_heading()}
            </h2>
            <p className="mb-8 text-[1.0625rem] text-ink-light max-[769px]:mb-6 max-[769px]:text-[0.9375rem]">
              {m.home_lgu_cta_subtitle()}
            </p>
            <div className="flex flex-wrap items-center gap-4 max-[769px]:flex-col max-[769px]:justify-center max-[769px]:gap-3">
              <Link
                to="/government"
                hash="lgus"
                className={cn(
                  button,
                  'bg-[#152c95] text-white hover:bg-[#13277c] hover:text-white hover:shadow-[0_4px_16px_rgba(21,44,149,0.3)]',
                )}
              >
                <Icon name="geo-alt-fill" />
                <span>{m.home_lgu_cta_find()}</span>
              </Link>
              <Link
                to="/government"
                className={cn(
                  button,
                  'border border-[#d1d5db] bg-white text-ink hover:border-ink hover:text-ink hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
                )}
              >
                <Icon name="building" />
                <span>{m.home_lgu_cta_offices()}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const popularServices: ReadonlyArray<{
  icon: IconName
  title: Message
  text: Message
  category?: string
}> = [
  { icon: 'cash-coin', title: m.service_tax, text: m.service_tax_desc, category: 'tax-payments' },
  {
    icon: 'people-fill',
    title: m.service_social,
    text: m.service_social_desc,
    category: 'social-services',
  },
  {
    icon: 'heart-pulse-fill',
    title: m.service_health,
    text: m.service_health_desc,
    category: 'health',
  },
  {
    icon: 'flower1',
    title: m.home_agriculture,
    text: m.home_agriculture_desc,
    category: 'agriculture',
  },
  {
    icon: 'file-earmark-text-fill',
    title: m.service_certificates,
    text: m.service_certificates_desc,
    category: 'certificates',
  },
  { icon: 'grid-fill', title: m.btn_view_all_services, text: m.home_browse_complete_directory },
]

export function PopularServices() {
  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeader
          title={m.section_popular()}
          subtitle={m.home_quick_access_to_frequently_requested_provincial()}
        />
        <div className="grid grid-cols-3 gap-6 max-[993px]:grid-cols-2 max-[769px]:grid-cols-1">
          {popularServices.map((service) => {
            const all = !service.category
            const content = (
              <>
                <span
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-[10px] text-[1.25rem]',
                    all ? 'bg-white/20 text-white' : 'bg-surface-alt text-primary',
                  )}
                >
                  <Icon name={service.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className={cn('mb-1 mt-0 text-[1rem]', all ? 'text-white' : 'text-ink')}>
                    {service.title()}
                  </h3>
                  <p className={cn('m-0 text-[0.8125rem]', all ? 'text-white' : 'text-ink-light')}>
                    {service.text()}
                  </p>
                </div>
                <Icon
                  name="arrow-right"
                  className={cn(
                    'opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100',
                    all ? 'text-white' : 'text-ink-light',
                  )}
                />
              </>
            )
            const card = cn(
              'group flex items-center gap-4 rounded-xl border p-6 transition-all duration-200 hover:no-underline',
              all
                ? 'border-transparent bg-linear-135 from-primary to-secondary text-white hover:text-white hover:shadow-[0_4px_16px_rgba(0,50,160,0.3)]'
                : 'border-line bg-white text-ink hover:border-primary hover:text-ink hover:shadow-[0_4px_12px_rgba(0,50,160,0.1)]',
            )
            return service.category ? (
              <Link
                key={service.title()}
                to="/services/$category"
                params={{ category: service.category }}
                className={card}
              >
                {content}
              </Link>
            ) : (
              <Link key={service.title()} to="/services" className={card}>
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Same figures as the legacy homepage; sources are in docs/bukidnon-facts.md.
const glance: ReadonlyArray<{
  icon: IconName
  /** A message, or literal text such as a figure. */
  value: string | Message
  label: Message
  source: Message
  link: InternalNavLink['link']
}> = [
  {
    icon: 'people-fill',
    value: '1,601,902',
    label: m.home_population,
    source: m.home_2024_census,
    link: { to: '/statistics' },
  },
  {
    icon: 'geo-alt-fill',
    value: '464',
    label: m.home_barangays,
    source: m.home_lgu_count,
    link: { to: '/government', hash: 'lgus' },
  },
  {
    icon: 'award-fill',
    value: m.home_1st_class,
    label: m.home_province,
    source: m.home_income_classification,
    link: { to: '/budget' },
  },
  {
    icon: 'rulers',
    value: m.home_land_area_value,
    label: m.home_land_area,
    source: m.home_land_area_rank,
    link: { to: '/statistics' },
  },
]

export function GlanceStats() {
  return (
    <section className="bg-surface-alt py-12">
      <div className="container-site">
        <GlanceHeader
          title={m.home_bukidnon_at_a_glance()}
          action={
            <SectionLink link={{ to: '/statistics' }}>{m.home_view_statistics()}</SectionLink>
          }
        />
        <div className="grid grid-cols-4 gap-6 max-[993px]:grid-cols-2 max-[577px]:grid-cols-1">
          {glance.map((stat) => (
            <Link
              key={stat.label()}
              {...stat.link}
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-line bg-white p-6 text-ink transition-all duration-300 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-linear-180 before:from-primary before:to-secondary before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:-translate-y-0.5 hover:border-primary hover:text-ink hover:no-underline hover:shadow-[0_8px_24px_rgba(0,50,160,0.12)] hover:before:opacity-100"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-surface-alt text-[1.25rem] text-primary transition-all duration-300 group-hover:bg-linear-135 group-hover:from-primary group-hover:to-secondary group-hover:text-white">
                <Icon name={stat.icon} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[1.5rem] font-bold leading-[1.2] text-primary transition-colors duration-300 group-hover:text-primary-dark">
                  {text(stat.value)}
                </span>
                <span className="mt-0.5 block text-[0.875rem] font-medium text-ink">
                  {stat.label()}
                </span>
                <span className="mt-0.5 block text-[0.75rem] text-ink-light">{stat.source()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
