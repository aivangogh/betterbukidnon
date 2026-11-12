import { useRouter } from '@tanstack/react-router'
import { useLocale } from '@/components/i18n/locale-provider'
import { appPath } from '@/lib/paths'

/**
 * A link from content data: app paths navigate in the app, `tel:` links dial, and external
 * URLs open in a new tab (with a screen-reader hint), as on the legacy pages.
 */
export function SiteLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const { t } = useLocale()

  if (/^https?:/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="sr-only"> {t('nav-opens-new-tab')}</span>
      </a>
    )
  }
  if (!href.startsWith('/')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  const path = appPath(href)
  return (
    <a
      href={path}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        void router.navigate({ href: path })
      }}
    >
      {children}
    </a>
  )
}
