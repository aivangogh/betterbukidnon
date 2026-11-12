import { Link } from '@tanstack/react-router'
import bettergovLogoUrl from '@/assets/logo/bettergov-footer.svg?url'
import logoWhiteUrl from '@/assets/logo/better-bukidnon-logo-white.svg?url'
import { useLocale } from '@/components/i18n/locale-provider'
import { Icon } from '@/components/ui/icon'
import {
  footerQuickLinks,
  footerResources,
  repositoryUrl,
  volunteerEmail,
  type ExternalNavLink,
  type InternalNavLink,
} from '@/content/navigation'
import versionData from '../../../../../version.json'

const columnHeading = 'mb-5 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-white/50'
const columnLink =
  'block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white'
const pill =
  'mt-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-[0.8125rem] text-white/70 no-underline transition hover:bg-white/10 hover:text-white'

function FooterLink({ item }: { item: InternalNavLink | ExternalNavLink }) {
  const { t } = useLocale()
  if ('href' in item) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={columnLink}>
        {t(item.label)}
      </a>
    )
  }
  return (
    <Link {...item.link} className={columnLink}>
      {t(item.label)}
    </Link>
  )
}

export function SiteFooter() {
  const { t } = useLocale()
  return (
    <footer className="bg-linear-180 from-footer to-footer-dark text-white">
      <div className="container-site">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 border-b border-white/8 pb-10 pt-15 max-lg:grid-cols-2 max-lg:gap-10 max-sm:grid-cols-1 max-sm:gap-8 max-sm:pb-8 max-sm:pt-10">
          <div className="max-w-80 max-xl:col-span-full max-lg:max-w-full max-sm:flex max-sm:flex-col max-sm:items-center max-sm:text-center">
            <img src={logoWhiteUrl} alt="Better Bukidnon logo" className="mb-4 h-14 w-auto" />
            <p className="mb-6 text-[0.875rem] leading-[1.6] text-white/70">
              {t('footer-empowering-the-people-of-bukidnon-with-transparent')}
            </p>
            <div className="flex gap-3">
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex size-10 items-center justify-center rounded-[10px] bg-white/8 text-[1.125rem] text-white/70 no-underline transition hover:-translate-y-0.5 hover:bg-primary hover:text-white"
              >
                <Icon name="github" />
              </a>
              <a
                href={`mailto:${volunteerEmail}`}
                aria-label="Email the volunteers"
                className="flex size-10 items-center justify-center rounded-[10px] bg-white/8 text-[1.125rem] text-white/70 no-underline transition hover:-translate-y-0.5 hover:bg-primary hover:text-white"
              >
                <Icon name="envelope-fill" />
              </a>
            </div>
          </div>

          <div className="max-sm:flex max-sm:flex-col max-sm:items-center max-sm:text-center">
            <h2 className={columnHeading}>{t('footer-quick-links')}</h2>
            <ul className="m-0 list-none p-0">
              {footerQuickLinks.map((item) => (
                <li key={item.label} className="mb-2">
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </div>

          <div className="max-sm:flex max-sm:flex-col max-sm:items-center max-sm:text-center">
            <h2 className={columnHeading}>{t('footer-resources')}</h2>
            <ul className="m-0 list-none p-0">
              {footerResources.map((item) => (
                <li key={item.label} className="mb-2">
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </div>

          <div className="max-sm:flex max-sm:flex-col max-sm:items-center max-sm:text-center">
            <div
              role="status"
              aria-label="Cost to the People of Bukidnon: Zero Pesos"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-success/8 px-3 py-1.5 text-[0.75rem] text-white/80"
            >
              Cost to the People of Bukidnon = <span className="font-bold text-success">₱0</span>
            </div>
            <a href={`mailto:${volunteerEmail}`} className={pill}>
              <Icon name="envelope-heart" className="text-white" /> Volunteer with us
            </a>
            <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" className={pill}>
              <Icon name="github" className="text-white" /> Contribute code with us
            </a>
            <div className="mt-4 flex items-center gap-5">
              <a
                href="https://bettergov.ph"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BetterGov.ph"
                className="inline-flex items-center opacity-60 transition-opacity hover:opacity-100"
              >
                <img
                  src={bettergovLogoUrl}
                  alt="BetterGov.ph"
                  width={120}
                  height={28}
                  loading="lazy"
                  className="block h-13.5 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-6 max-sm:text-center">
          <div className="flex w-full flex-wrap items-center gap-1.5 text-[0.8125rem] text-white/50 max-sm:flex-col max-sm:gap-1">
            <span className="text-white/60">
              &copy; {new Date().getFullYear()} BetterBukidnon.org
            </span>
            <span className="text-white/45">MIT | CC BY 4.0</span>
            <span className="text-white/40">
              Volunteer civic project, not an official government website. Built on the BetterSolano
              template (MIT).
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 whitespace-nowrap text-white/50 max-sm:ml-0">
              <Icon name="boxes" className="text-[0.875rem]" /> Ver. {versionData.version}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
