import { Link } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ServiceSearchBox } from './service-search-box'
import { Icon, type IconName } from '@/components/ui/icon'
import { m } from '@/paraglide/messages'
import type { Message } from '@/lib/i18n'

// Same cards and order as the legacy services/index.html.
const categories: ReadonlyArray<{
  id: string
  icon: IconName
  title: Message
  text: Message
}> = [
  {
    id: 'certificates',
    icon: 'file-earmark-text-fill',
    title: m.cat_certificates,
    text: m.cat_certificates_desc,
  },
  { id: 'business', icon: 'shop', title: m.cat_business, text: m.cat_business_desc },
  { id: 'social-services', icon: 'people-fill', title: m.cat_social, text: m.cat_social_desc },
  { id: 'health', icon: 'heart-pulse-fill', title: m.cat_health, text: m.cat_health_desc },
  { id: 'tax-payments', icon: 'cash-coin', title: m.cat_tax, text: m.cat_tax_desc },
  { id: 'agriculture', icon: 'tree-fill', title: m.cat_agriculture, text: m.cat_agriculture_desc },
  {
    id: 'infrastructure',
    icon: 'building-fill-gear',
    title: m.cat_infrastructure,
    text: m.cat_infrastructure_desc,
  },
  { id: 'education', icon: 'mortarboard-fill', title: m.cat_education, text: m.cat_education_desc },
  { id: 'public-safety', icon: 'shield-fill-check', title: m.cat_safety, text: m.cat_safety_desc },
  {
    id: 'environment',
    icon: 'globe-americas',
    title: m.cat_environment,
    text: m.cat_environment_desc,
  },
]

const lifeEvents: ReadonlyArray<{ category: string; icon: IconName; label: Message }> = [
  { category: 'business', icon: 'shop', label: m.svc_starting_a_business },
  { category: 'certificates', icon: 'heart', label: m.svc_getting_married },
  { category: 'certificates', icon: 'emoji-smile', label: m.svc_having_a_baby },
  { category: 'social-services', icon: 'wallet2', label: m.svc_need_financial_help },
  { category: 'social-services', icon: 'person-badge', label: m.svc_senior_citizen_services },
  { category: 'social-services', icon: 'universal-access', label: m.svc_person_with_disability },
  { category: 'infrastructure', icon: 'hammer', label: m.svc_buildinghome_improvement },
  { category: 'public-safety', icon: 'question-circle', label: m.svc_got_in_trouble },
]

/** The Services directory (`/services`), as in the legacy services/index.html. */
export function ServicesDirectoryPage({ initialQuery }: { initialQuery?: string }) {
  return (
    <>
      <Breadcrumbs
        items={[{ label: m.svc_home(), link: { to: '/' } }, { label: m.nav_services() }]}
      />
      <PageHeader
        badge={m.svc_services()}
        icon="grid-fill"
        title={m.services_title()}
        description={m.services_subtitle()}
      >
        <div className="mx-auto mt-6 max-w-125">
          <ServiceSearchBox
            id="service-search"
            initialQuery={initialQuery}
            placeholder="Search services (e.g., birth certificate, business permit)"
            wrapperClassName="group/search w-full"
            inputClassName="w-full rounded-full border-2 border-transparent bg-white py-4 pl-12 pr-5 text-[1rem] leading-[normal] text-ink shadow-[0_4px_20px_rgba(0,50,160,0.12),0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-250 placeholder:text-[#9ca3af] hover:shadow-[0_6px_24px_rgba(0,50,160,0.15),0_2px_8px_rgba(0,0,0,0.08)] focus:border-primary focus:shadow-[0_8px_32px_rgba(0,50,160,0.2),0_4px_12px_rgba(0,0,0,0.08)] focus:outline-none"
          >
            <Icon
              name="search"
              className="pointer-events-none absolute left-4.5 top-1/2 -translate-y-1/2 text-[1.125rem] text-primary opacity-70 transition-opacity group-focus-within/search:opacity-100"
            />
          </ServiceSearchBox>
        </div>
      </PageHeader>

      <section className="section-y">
        <div className="container-site">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 max-xl:grid-cols-2 max-md:grid-cols-1 min-[1200px]:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/services/$category"
                params={{ category: category.id }}
                className="group flex overflow-hidden rounded-xl border border-line bg-white text-ink no-underline transition-all duration-200 hover:border-primary hover:text-ink hover:no-underline hover:shadow-[0_4px_16px_rgba(0,50,160,0.1)]"
              >
                <div className="flex w-14 shrink-0 items-center justify-center bg-linear-135 from-primary to-secondary text-[1.25rem] text-white">
                  <Icon name={category.icon} />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-6">
                  <h3 className="m-0 text-[1rem] font-semibold text-ink">{category.title()}</h3>
                  <p className="m-0 text-[0.8125rem] leading-[1.4] text-ink-light">
                    {category.text()}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-primary transition-[gap] duration-200 group-hover:gap-2">
                    <Icon name="arrow-right" />
                    <span>{m.svc_view_services()}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-alt">
        <div className="container-site">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-[1.5rem]">{m.life_events_title()}</h2>
            <p className="text-ink-light">{m.life_events_subtitle()}</p>
          </div>
          <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
            {lifeEvents.map((event) => (
              <Link
                key={event.label()}
                to="/services/$category"
                params={{ category: event.category }}
                className="flex items-center gap-2.5 rounded-[10px] border border-line bg-white px-6 py-4 text-ink no-underline transition-all duration-200 hover:border-primary hover:text-ink hover:no-underline hover:shadow-[0_2px_8px_rgba(0,50,160,0.08)]"
              >
                <Icon name={event.icon} className="text-[1.25rem] text-primary" />
                <span className="text-[0.875rem] font-medium">{event.label()}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
