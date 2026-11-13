import { Link } from '@tanstack/react-router'
import { Icon, type IconName } from '@/components/ui/icon'
import { LottieAnimation } from '@/components/ui/lottie'
import { contactDirectory } from '@/config/contact'
import { repositoryUrl } from '@/config/navigation'
import { text, type Message } from '@/lib/i18n'
import { GlanceHeader, SectionHeader, SectionLink } from './home-ui'
import { m } from '@/paraglide/messages'

const timeline: ReadonlyArray<{
  /** A message, or literal text such as a year. */
  year: string | Message
  text: Message
}> = [
  { year: m.home_history_precolonial_label, text: m.home_history_precolonial },
  { year: '1850s', text: m.home_history_1850s },
  { year: '1907', text: m.home_history_1907 },
  { year: '1917', text: m.home_history_1917 },
  { year: '1977', text: m.home_history_1977 },
  { year: '1998–2001', text: m.home_history_cityhood },
  { year: '2012', text: m.home_history_2012 },
]

const historyCards: ReadonlyArray<{ icon: IconName; title: Message; text: Message }> = [
  {
    icon: 'people-fill',
    title: m.home_history_card_tribes_title,
    text: m.home_history_card_tribes,
  },
  {
    icon: 'triangle-fill',
    title: m.home_history_card_highlands_title,
    text: m.home_history_card_highlands,
  },
]

export function History() {
  return (
    <section className="section-y bg-linear-180 from-surface-alt to-surface">
      <div className="container-site">
        <GlanceHeader
          title={
            <>
              <Icon name="book" className="text-primary" />
              <span>{m.home_brief_history_of_bukidnon()}</span>
            </>
          }
        />
        <div className="grid grid-cols-[1fr_340px] items-start gap-8 max-[901px]:grid-cols-1">
          <div className="relative pl-7 before:absolute before:inset-y-2 before:left-1.5 before:w-0.5 before:rounded-xs before:bg-linear-180 before:from-primary before:to-primary/20 before:content-['']">
            {timeline.map((item, index) => (
              <div
                key={item.text()}
                className="group relative animate-[history-fade-in-up_0.5s_ease_forwards] pb-5 opacity-0 last:pb-0 motion-reduce:animate-none motion-reduce:opacity-100"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="absolute -left-7 top-1 z-[1] size-3.5 rounded-full border-3 border-primary bg-surface transition-all duration-300 group-hover:scale-120 group-hover:bg-primary group-hover:shadow-[0_0_0_4px_rgba(0,50,160,0.15)]" />
                <div className="rounded-[10px] border border-black/6 bg-surface px-4.5 py-4 transition-all duration-300 group-hover:translate-x-1 group-hover:border-primary group-hover:shadow-[0_4px_16px_rgba(0,50,160,0.1)]">
                  <span className="mb-2 inline-block rounded-[20px] bg-primary px-2.5 py-0.75 text-[0.75rem] font-bold text-white">
                    {text(item.year)}
                  </span>
                  <p className="m-0 text-[0.875rem] leading-[1.6] text-ink">{item.text()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="sticky top-25 flex flex-col gap-4 max-[901px]:static max-[901px]:flex-row max-[901px]:flex-wrap max-sm:flex-col">
            {historyCards.map((card) => (
              <div
                key={card.title()}
                className="flex items-start gap-3.5 rounded-xl border border-black/6 bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_4px_16px_rgba(0,50,160,0.1)] max-[901px]:flex-[1_1_280px] max-sm:flex-[1_1_100%]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-linear-135 from-primary to-secondary">
                  <Icon name={card.icon} className="text-[1.25rem] text-white" />
                </div>
                <div>
                  <h3 className="mb-1.5 mt-0 text-[0.9375rem] font-semibold text-ink">
                    {card.title()}
                  </h3>
                  <p className="m-0 text-[0.8125rem] leading-[1.5] text-ink-light">{card.text()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const FACEBOOK_PAGE = 'https://www.facebook.com/lgubukidnon'

export function LatestUpdates() {
  const points: ReadonlyArray<{ icon: IconName; text: string }> = [
    { icon: 'megaphone', text: 'Official announcements & advisories' },
    { icon: 'calendar-event', text: 'Events & community programs' },
    { icon: 'broadcast', text: 'Posted in real time, as it happens' },
  ]
  return (
    <section className="section-y bg-linear-180 from-[#f0f4ff] to-white">
      <div className="container-site">
        <SectionHeader
          title={m.section_updates()}
          action={<SectionLink link={{ to: '/news' }}>{m.home_view_all()}</SectionLink>}
        />
        <div className="grid grid-cols-[380px_1fr] items-center gap-[clamp(32px,5vw,72px)] max-[1101px]:grid-cols-[340px_1fr] max-[961px]:grid-cols-1 max-[961px]:gap-8">
          <div className="max-[961px]:mx-auto max-[961px]:max-w-140 max-[961px]:text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1877f2]/10 px-3.5 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#1877f2]">
              <Icon name="facebook" /> Official Facebook Page
            </span>
            <h3 className="mb-3 mt-0 text-[1.75rem] font-bold leading-[1.2] text-ink">
              Announcements from the Provincial Government
            </h3>
            <p className="mb-5 text-[0.9375rem] leading-[1.65] text-ink-light">
              Follow the Provincial Government of Bukidnon on Facebook for announcements,
              advisories, events and community updates as they are posted.
            </p>
            <ul className="mb-7 flex list-none flex-col gap-3 p-0 max-[961px]:items-center">
              {points.map((point) => (
                <li
                  key={point.icon}
                  className="flex items-center gap-3 text-[0.9rem] text-ink max-[961px]:justify-center"
                >
                  <Icon name={point.icon} className="w-5 shrink-0 text-[1.05rem] text-[#1877f2]" />{' '}
                  {point.text}
                </li>
              ))}
            </ul>
            <a
              href={FACEBOOK_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-site bg-[#1877f2] px-5.5 py-3 text-[0.9375rem] font-semibold text-white transition-[background-color,transform] hover:-translate-y-px hover:bg-[#0b5ed7] hover:text-white hover:no-underline focus:bg-[#0b5ed7] focus:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1877f2]"
            >
              <Icon name="facebook" /> Visit the Facebook Page
            </a>
          </div>
          <div className="w-full max-w-125 justify-self-center">
            <div className="w-full overflow-hidden rounded-[14px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06),0_8px_28px_rgba(0,0,0,0.1)]">
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(`${FACEBOOK_PAGE}/`)}&tabs=timeline&width=500&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                width="500"
                height="700"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                title="LGU Bukidnon Official Facebook Page — Live Updates"
                className="block h-175 w-full overflow-hidden border-0"
              />
            </div>
            <p className="mb-0 mt-2.5 text-center text-[0.8125rem] text-ink-light">
              Can't see the feed?{' '}
              <a
                href={FACEBOOK_PAGE}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium"
              >
                Open it on Facebook
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const leaderContact = 'inline-flex items-center justify-center gap-2 text-[0.875rem] text-ink-light'

export function Leadership() {
  const badge =
    'mb-4 inline-block rounded-full bg-linear-135 from-primary to-secondary px-3.5 py-1.5 text-[0.75rem] font-semibold text-white'
  const card = 'rounded-xl border border-line bg-white p-8 text-center'
  return (
    <section className="section-y bg-surface-alt">
      <div className="container-site">
        <SectionHeader
          title={m.section_leadership()}
          action={
            <SectionLink link={{ to: '/government/officials' }}>
              {m.home_view_all_officials()}
            </SectionLink>
          }
        />
        <div className="grid grid-cols-2 gap-6 max-[769px]:grid-cols-1">
          <div className={card}>
            <div className={badge}>{m.title_governor()}</div>
            <h3 className="mb-4 mt-0 text-[1.25rem] text-ink">Hon. Rogelio Neil P. Roque</h3>
            <div className="flex flex-col gap-2">
              <span className={leaderContact}>
                <Icon name="building" /> <span>{m.home_pgo()}</span>
              </span>
              <a href="tel:+63888132457" className={`${leaderContact} hover:text-primary`}>
                <Icon name="telephone" /> (088) 813-2457
              </a>
            </div>
          </div>
          <div className={card}>
            <div className={badge}>{m.title_vice_governor()}</div>
            <h3 className="mb-4 mt-0 text-[1.25rem] text-ink">Hon. Clive D. Quiño</h3>
            <div className="flex flex-col gap-2">
              <span className={leaderContact}>
                <Icon name="bank" /> <span>{m.home_sp_presiding_officer()}</span>
              </span>
              <Link to="/legislative" className={`${leaderContact} hover:text-primary`}>
                <Icon name="arrow-right" /> <span>{m.home_view_legislative()}</span>
              </Link>
            </div>
          </div>
        </div>
        <p className="mb-0 mt-4 text-center text-[0.8125rem] text-ink-light">
          {m.home_leadership_term()}
        </p>
      </div>
    </section>
  )
}

export function ContactInfo() {
  const card =
    'flex items-start gap-4 rounded-xl border border-line bg-white p-6 text-ink transition-all duration-200 hover:border-primary hover:text-ink hover:no-underline hover:shadow-[0_4px_12px_rgba(0,50,160,0.08)]'
  const items: ReadonlyArray<{
    icon: IconName
    title: Message
    value: string
    note: string
    href?: string
    external?: boolean
  }> = [
    {
      icon: 'telephone-fill',
      title: m.contact_phone,
      value: contactDirectory.phone,
      note: m.contact_hours(),
      // (088) 813-5741 -> tel:+63888135741 (drop the trunk 0 after the country code)
      href: `tel:+63${contactDirectory.phone.replace(/\D/g, '').slice(1)}`,
    },
    {
      icon: 'globe2',
      title: m.home_official_website,
      value: 'bukidnon.gov.ph',
      note: m.home_official_website_note(),
      href: contactDirectory.website,
      external: true,
    },
    {
      icon: 'geo-alt-fill',
      title: m.contact_address,
      value: m.home_capitol_compound(),
      note: m.home_capitol_city(),
    },
  ]
  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeader
          title={m.section_contact()}
          action={<SectionLink link={{ to: '/contact' }}>{m.home_view_all()}</SectionLink>}
        />
        <div className="grid grid-cols-3 gap-6 max-[993px]:grid-cols-1">
          {items.map((item) => {
            const content = (
              <>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-linear-135 from-primary to-secondary text-[1.125rem] text-white">
                  <Icon name={item.icon} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 mt-0 text-[0.8125rem] font-medium uppercase tracking-[0.5px] text-ink-light">
                    {item.title()}
                  </h3>
                  <p className="mb-1 text-[1rem] font-semibold text-ink">{item.value}</p>
                  <span className="text-[0.8125rem] text-ink-light">{item.note}</span>
                </div>
              </>
            )
            return item.href ? (
              <a
                key={item.title()}
                href={item.href}
                className={card}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {content}
              </a>
            ) : (
              <div key={item.title()} className={card}>
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function VolunteerCta() {
  return (
    <section
      aria-labelledby="volunteer-cta-heading"
      className="bg-surface-alt py-12 max-md:py-8"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,50,160,0.1) 1px, transparent 1px), radial-gradient(circle at 20% 50%, rgba(0,50,160,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(6,167,125,0.05) 0%, transparent 50%)',
        backgroundSize: '20px 20px, 100% 100%, 100% 100%',
      }}
    >
      <div className="container-site">
        <div className="mx-auto grid max-w-300 grid-cols-[420px_1fr] items-center gap-12 px-12 py-8 max-[1200px]:min-[993px]:grid-cols-[360px_1fr] max-[1200px]:min-[993px]:gap-8 max-[1200px]:min-[993px]:px-8 max-[1200px]:min-[993px]:py-6 max-[993px]:min-md:grid-cols-[300px_1fr] max-[993px]:min-md:gap-8 max-[993px]:min-md:px-8 max-[993px]:min-md:py-6 max-md:grid-cols-1 max-md:gap-6 max-md:px-4 max-md:py-6 max-md:text-center max-xs:gap-4 max-xs:px-2 max-xs:py-4">
          <LottieAnimation
            src="/animations/ramonloganjr-exam.json"
            className="aspect-square justify-self-center max-md:max-w-70 max-xs:max-w-55"
          />
          <div className="text-left max-md:text-center">
            <h2
              id="volunteer-cta-heading"
              className="mb-2 mt-0 text-[2.25rem] font-extrabold leading-[1.2] text-ink max-[993px]:min-md:text-[1.75rem] max-md:text-[1.5rem]"
            >
              {m.home_volunteer_heading()}
            </h2>
            <p className="mb-4 text-[1.0625rem] font-semibold text-primary max-md:text-[1rem]">
              {m.home_volunteer_subtitle()}
            </p>
            <p className="mb-8 text-[0.9375rem] leading-[1.7] text-ink-light max-md:text-[0.875rem]">
              {m.home_volunteer_description()}
            </p>
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-site bg-primary px-8 py-3.5 text-[1rem] font-semibold text-white shadow-[0_2px_8px_rgba(0,50,160,0.25)] transition-all hover:-translate-y-px hover:bg-[#002a88] hover:text-white hover:no-underline hover:shadow-[0_4px_16px_rgba(0,50,160,0.35)] focus:bg-[#002a88] focus:text-white focus:shadow-[0_0_0_3px_rgba(0,50,160,0.4)] focus:outline-none active:translate-y-0 max-md:w-full max-md:justify-center"
            >
              <Icon name="github" />
              <span>{m.home_volunteer_cta()}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
