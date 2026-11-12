import { Link } from '@tanstack/react-router'
import { ServiceSearchBox } from '@/components/services/service-search-box'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { buttonBase } from './home-ui'
import { m } from '@/paraglide/messages'

const popular = [
  { label: m.home_real_property_tax, slug: 'provincial-treasurer' },
  { label: m.home_birth_certificate, slug: 'birth-certificate' },
  { label: m.home_social_assistance, slug: 'pswdo' },
] as const

function HeroSearch() {
  return (
    <div className="rounded-2xl border border-primary/8 bg-white p-8 shadow-[0_8px_32px_rgba(0,50,160,0.1),0_2px_8px_rgba(0,0,0,0.04)] transition-[box-shadow,border-color] duration-300 focus-within:border-primary/15 focus-within:shadow-[0_12px_40px_rgba(0,50,160,0.15),0_4px_12px_rgba(0,0,0,0.06)] max-[769px]:p-6">
      <h2 className="mb-6 flex items-center gap-2 text-[1rem] text-ink">
        <Icon name="search" className="text-primary" />
        <span>{m.home_find_a_service()}</span>
      </h2>
      <ServiceSearchBox
        id="hero-search"
        placeholder={m.home_search_placeholder()}
        wrapperClassName="flex gap-2"
        inputClassName="min-w-0 flex-1 rounded-[10px] border-2 border-[#e5e7eb] bg-[#fafbfc] px-4 py-3.5 text-[1rem] leading-[normal] text-ink transition-[border-color,box-shadow,background-color] placeholder:text-[#9ca3af] hover:border-[#d0d5dd] hover:bg-white focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,50,160,0.1)] focus:outline-none"
      >
        <button
          type="submit"
          aria-label="Search"
          className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-0 bg-linear-135 from-primary to-[#0044cc] text-[1.125rem] text-white shadow-[0_2px_8px_rgba(0,50,160,0.3)] transition-all hover:-translate-y-px hover:from-primary-dark hover:to-[#003399] hover:shadow-[0_4px_12px_rgba(0,50,160,0.4)] active:translate-y-0"
        >
          <Icon name="arrow-right" />
        </button>
      </ServiceSearchBox>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.8125rem]">
        <span className="font-medium text-ink-light">{m.home_popular()}</span>
        {popular.map((tag) => (
          <Link
            key={tag.slug}
            to="/service-details/$slug"
            params={{ slug: tag.slug }}
            className="rounded-full border border-transparent bg-primary/6 px-3 py-1.25 font-medium text-primary transition-all hover:border-primary/15 hover:bg-primary/10 hover:no-underline max-xl:inline-flex max-xl:min-h-11 max-xl:items-center max-xl:px-3.5 max-xl:py-0"
          >
            {tag.label()}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function HomeHero() {
  return (
    <section className="bg-linear-135 from-primary to-secondary py-30 max-[769px]:py-12">
      <div className="container-site">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-12 max-[993px]:grid-cols-[minmax(0,1fr)] max-[993px]:gap-8">
          <div className="max-[993px]:text-center">
            <h1 className="mb-4 text-[2.5rem] leading-[1.2] text-white max-[769px]:text-[2rem]">
              {m.hero_welcome()}
            </h1>
            <p className="mb-8 text-[1.125rem] leading-[1.6] text-white/90 max-[769px]:text-[1rem]">
              {m.hero_subtitle()}
            </p>
            <div className="flex flex-wrap gap-4 max-[993px]:justify-center">
              <Link
                to="/services"
                className={cn(
                  buttonBase,
                  'bg-white text-primary hover:-translate-y-0.5 hover:bg-surface-alt hover:text-primary hover:shadow-md',
                )}
              >
                <Icon name="arrow-right" />
                <span>{m.home_browse_services()}</span>
              </Link>
              <Link
                to="/contact"
                className={cn(
                  buttonBase,
                  'border-white bg-transparent text-white hover:bg-white/15 hover:text-white',
                )}
              >
                {m.home_contact_us()}
              </Link>
            </div>
          </div>
          <HeroSearch />
        </div>
      </div>
    </section>
  )
}
