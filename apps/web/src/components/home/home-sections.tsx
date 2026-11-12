import { Link } from '@tanstack/react-router'
import { useLocale } from '@/components/i18n/locale-provider'
import { Icon, type IconName } from '@/components/ui/icon'
import { LottieAnimation } from '@/components/ui/lottie'
import type { InternalNavLink } from '@/content/navigation'
import { isTranslationKey, type TranslationKey } from '@/content/translations'
import { cn } from '@/lib/utils'
import { GlanceHeader, SectionHeader, SectionLink } from './home-ui'

const dotGrid = (alpha: number) =>
  `radial-gradient(circle, rgba(0,50,160,${alpha}) 1px, transparent 1px)`

export function LguCta() {
  const { t } = useLocale()
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
              {t('home-lgu-cta-heading')}
            </h2>
            <p className="mb-8 text-[1.0625rem] text-ink-light max-[769px]:mb-6 max-[769px]:text-[0.9375rem]">
              {t('home-lgu-cta-subtitle')}
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
                <span>{t('home-lgu-cta-find')}</span>
              </Link>
              <Link
                to="/government"
                className={cn(
                  button,
                  'border border-[#d1d5db] bg-white text-ink hover:border-ink hover:text-ink hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
                )}
              >
                <Icon name="building" />
                <span>{t('home-lgu-cta-offices')}</span>
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
  title: TranslationKey
  text: TranslationKey
  category?: string
}> = [
  { icon: 'cash-coin', title: 'service-tax', text: 'service-tax-desc', category: 'tax-payments' },
  {
    icon: 'people-fill',
    title: 'service-social',
    text: 'service-social-desc',
    category: 'social-services',
  },
  {
    icon: 'heart-pulse-fill',
    title: 'service-health',
    text: 'service-health-desc',
    category: 'health',
  },
  {
    icon: 'flower1',
    title: 'home-agriculture',
    text: 'home-agriculture-desc',
    category: 'agriculture',
  },
  {
    icon: 'file-earmark-text-fill',
    title: 'service-certificates',
    text: 'service-certificates-desc',
    category: 'certificates',
  },
  { icon: 'grid-fill', title: 'btn-view-all-services', text: 'home-browse-complete-directory' },
]

export function PopularServices() {
  const { t } = useLocale()
  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeader
          title={t('section-popular')}
          subtitle={t('home-quick-access-to-frequently-requested-provincial')}
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
                    {t(service.title)}
                  </h3>
                  <p className={cn('m-0 text-[0.8125rem]', all ? 'text-white' : 'text-ink-light')}>
                    {t(service.text)}
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
                key={service.title}
                to="/services/$category"
                params={{ category: service.category }}
                className={card}
              >
                {content}
              </Link>
            ) : (
              <Link key={service.title} to="/services" className={card}>
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
  /** A translation key, or literal text such as a figure. */
  value: string
  label: TranslationKey
  source: TranslationKey
  link: InternalNavLink['link']
}> = [
  {
    icon: 'people-fill',
    value: '1,601,902',
    label: 'home-population',
    source: 'home-2024-census',
    link: { to: '/statistics' },
  },
  {
    icon: 'geo-alt-fill',
    value: '464',
    label: 'home-barangays',
    source: 'home-lgu-count',
    link: { to: '/government', hash: 'lgus' },
  },
  {
    icon: 'award-fill',
    value: 'home-1st-class',
    label: 'home-province',
    source: 'home-income-classification',
    link: { to: '/budget' },
  },
  {
    icon: 'rulers',
    value: 'home-land-area-value',
    label: 'home-land-area',
    source: 'home-land-area-rank',
    link: { to: '/statistics' },
  },
]

export function GlanceStats() {
  const { t } = useLocale()
  const text = (value: string) => (isTranslationKey(value) ? t(value) : value)
  return (
    <section className="bg-surface-alt py-12">
      <div className="container-site">
        <GlanceHeader
          title={t('home-bukidnon-at-a-glance')}
          action={
            <SectionLink link={{ to: '/statistics' }}>{t('home-view-statistics')}</SectionLink>
          }
        />
        <div className="grid grid-cols-4 gap-6 max-[993px]:grid-cols-2 max-[577px]:grid-cols-1">
          {glance.map((stat) => (
            <Link
              key={stat.label}
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
                  {t(stat.label)}
                </span>
                <span className="mt-0.5 block text-[0.75rem] text-ink-light">{t(stat.source)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
