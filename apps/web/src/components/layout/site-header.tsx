import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import logoUrl from '@/assets/logo/better-bukidnon-logo.svg?url'
import { LanguageMenu } from '@/components/i18n/language-menu'
import { Icon } from '@/components/ui/icon'
import { primaryNavigation, type NavItem } from '@/content/navigation'
import { cn } from '@/lib/utils'
import { m } from '@/paraglide/messages'

const MOBILE_NAV = '(max-width: 1024px)'
const isMobileNav = () => window.matchMedia(MOBILE_NAV).matches

const linkClass =
  'font-medium text-ink select-none hover:text-primary max-xl:block max-xl:rounded-md max-xl:px-4 max-xl:py-3 max-xl:transition-colors max-xl:hover:bg-surface-alt max-xl:focus:bg-surface-alt max-xl:focus:outline-none max-xl:focus-visible:outline-2 max-xl:focus-visible:-outline-offset-2 max-xl:focus-visible:outline-primary'

// The legacy CSS draws the dropdown caret as a 4px border triangle.
const caretClass =
  "after:ml-1.5 after:inline-block after:size-0 after:border-x-4 after:border-t-4 after:border-x-transparent after:border-t-current after:align-middle after:content-[''] max-xl:flex max-xl:items-center max-xl:justify-between max-xl:after:ml-auto max-xl:after:shrink-0 max-xl:after:transition-transform"

function DropdownItem({
  item,
  active,
  open,
  onOpenChange,
}: {
  item: NavItem
  active: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const trigger = useRef<HTMLElement>(null)
  const menu = useRef<HTMLUListElement>(null)
  const menuLinks = () => Array.from(menu.current?.querySelectorAll('a') ?? [])
  const children = item.children ?? []

  const triggerProps = {
    'aria-haspopup': true,
    'aria-expanded': open,
    className: cn(
      linkClass,
      caretClass,
      active && 'text-primary',
      open && 'max-xl:after:rotate-180',
    ),
    onClick: (event: React.MouseEvent) => {
      // Below 1025px the trigger opens its submenu instead of navigating.
      if (!item.link || isMobileNav()) {
        event.preventDefault()
        onOpenChange(!open)
      }
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        onOpenChange(true)
        requestAnimationFrame(() => menuLinks()[0]?.focus())
      } else if ((event.key === 'Enter' || event.key === ' ') && (!item.link || isMobileNav())) {
        event.preventDefault()
        onOpenChange(!open)
        if (!open) requestAnimationFrame(() => menuLinks()[0]?.focus())
      }
    },
  }

  const onMenuKeyDown = (event: React.KeyboardEvent, index: number) => {
    const count = children.length
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      menuLinks()[(index + step + count) % count]?.focus()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onOpenChange(false)
      trigger.current?.focus()
    } else if (event.key === 'Tab' && !event.shiftKey && index === count - 1) {
      onOpenChange(false)
    }
  }

  const menuLinkClass =
    'block whitespace-nowrap px-4 py-2 text-ink no-underline transition-colors hover:bg-surface-alt hover:text-primary max-xl:whitespace-normal max-xl:px-4 max-xl:py-2.5 max-xl:text-[0.9375rem] max-xl:text-ink-light max-xl:focus:bg-surface-alt max-xl:focus:text-primary'

  return (
    <li
      className="group/dropdown relative max-xl:static"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onOpenChange(false)
      }}
    >
      {item.link ? (
        <Link {...item.link} ref={trigger as React.Ref<HTMLAnchorElement>} {...triggerProps}>
          {item.label()}
        </Link>
      ) : (
        <button
          type="button"
          ref={trigger as React.Ref<HTMLButtonElement>}
          {...triggerProps}
          className={cn(triggerProps.className, 'cursor-pointer max-xl:w-full max-xl:text-left')}
        >
          {item.label()}
        </button>
      )}
      <ul
        ref={menu}
        className={cn(
          // Desktop: floating panel shown on hover or when opened from the keyboard.
          'invisible absolute left-0 top-full z-[1001] flex min-w-55 translate-y-2.5 flex-col rounded-site bg-white py-2 opacity-0 shadow-md transition-fade-hide',
          'xl:group-hover/dropdown:visible xl:group-hover/dropdown:translate-y-0 xl:group-hover/dropdown:opacity-100 xl:group-hover/dropdown:transition-fade-show',
          open && 'visible translate-y-0 opacity-100 transition-fade-show',
          // 1024px and below: an accordion inside the slide-down menu.
          'max-xl:static max-xl:max-h-0 max-xl:min-w-0 max-xl:translate-y-0 max-xl:overflow-hidden max-xl:rounded-none max-xl:bg-transparent max-xl:p-0 max-xl:opacity-100 max-xl:shadow-none max-xl:transition-collapse-hide',
          open && 'max-xl:max-h-125 max-xl:py-1 max-xl:pl-4 max-xl:transition-collapse-show',
        )}
      >
        {children.map((child, index) => (
          <li key={child.label()} className="w-full">
            {'href' in child ? (
              <a
                href={child.href}
                target="_blank"
                rel="noopener noreferrer"
                className={menuLinkClass}
                onKeyDown={(event) => onMenuKeyDown(event, index)}
              >
                {child.label()}
                <span className="sr-only"> {m.nav_opens_new_tab()}</span>
              </a>
            ) : (
              <Link
                {...child.link}
                className={menuLinkClass}
                onKeyDown={(event) => onMenuKeyDown(event, index)}
              >
                {child.label()}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </li>
  )
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const section = pathname.split('/')[1] ?? ''
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const nav = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  const closeMenu = (returnFocus = false) => {
    setMenuOpen(false)
    setOpenDropdown(null)
    if (returnFocus) toggle.current?.focus()
  }

  useEffect(() => closeMenu(), [pathname])

  // Lock page scroll behind the open menu, restoring the scroll position afterwards.
  useEffect(() => {
    if (!menuOpen) return
    const scrollY = window.scrollY
    const { style } = document.body
    Object.assign(style, {
      overflow: 'hidden',
      position: 'fixed',
      width: '100%',
      top: `-${scrollY}px`,
    })
    return () => {
      Object.assign(style, { overflow: '', position: '', width: '', top: '' })
      window.scrollTo(0, scrollY)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu(true)
    }
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (!nav.current?.contains(target) && !toggle.current?.contains(target)) closeMenu()
    }
    const media = window.matchMedia(MOBILE_NAV)
    const onResize = () => {
      if (!media.matches) closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('click', onClick)
    media.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', onClick)
      media.removeEventListener('change', onResize)
    }
  }, [menuOpen])

  const trapFocus = (event: React.KeyboardEvent) => {
    if (!menuOpen || event.key !== 'Tab' || !nav.current) return
    const focusable = nav.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <header className="sticky top-0 z-[1000] bg-white py-3 shadow-sm max-xl:py-2.5 max-md:py-2 max-xs:py-1.5">
      <div className="container-site flex min-h-12 items-center justify-between max-xl:min-h-11 max-xl:flex-wrap max-md:min-h-9 max-md:gap-1.5 max-xs:min-h-8">
        <div className="flex items-center gap-4 py-1 max-xl:order-1 max-xl:shrink-0 max-xl:py-0.5">
          <Link to="/" className="max-xl:flex max-xl:min-h-11 max-xl:items-center">
            <img
              src={logoUrl}
              alt="Better Bukidnon Logo"
              className="h-12 w-auto max-xl:h-10 max-md:h-9 max-xs:h-8"
            />
          </Link>
        </div>

        <nav
          ref={nav}
          id="main-nav"
          aria-label="Main Navigation"
          onKeyDown={trapFocus}
          className={cn(
            'max-xl:invisible max-xl:absolute max-xl:inset-x-0 max-xl:top-full max-xl:order-4 max-xl:h-[calc(100dvh-100%)] max-xl:-translate-y-2 max-xl:overflow-y-auto max-xl:overscroll-contain max-xl:border-t max-xl:border-surface-alt max-xl:bg-white max-xl:px-4 max-xl:pb-12 max-xl:pt-2 max-xl:opacity-0 max-xl:transition-fade-hide',
            menuOpen &&
              'max-xl:visible max-xl:translate-y-0 max-xl:opacity-100 max-xl:transition-fade-show',
          )}
        >
          <ul className="flex gap-6 max-xl:flex-col max-xl:gap-0">
            {primaryNavigation.map((item) => {
              const active = item.sections.includes(section)
              if (item.children) {
                return (
                  <DropdownItem
                    key={item.label()}
                    item={item}
                    active={active}
                    open={openDropdown === item.label()}
                    onOpenChange={(open) => setOpenDropdown(open ? item.label() : null)}
                  />
                )
              }
              return (
                <li key={item.label()} className="relative">
                  <Link
                    {...item.link}
                    className={cn(linkClass, active && 'text-primary')}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label()}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 py-1 max-xl:order-2 max-xl:ml-auto max-xl:shrink-0 max-xl:py-0">
          <LanguageMenu />
        </div>

        <button
          ref={toggle}
          type="button"
          aria-label="Toggle Navigation"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={(event) => {
            event.stopPropagation()
            if (menuOpen) closeMenu(true)
            else setMenuOpen(true)
          }}
          className="hidden cursor-pointer items-center justify-center border-0 bg-transparent p-2 text-[1.5rem] leading-none text-primary focus:outline-none focus-visible:rounded focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary max-xl:order-3 max-xl:ml-1 max-xl:flex max-xl:size-11 max-xl:shrink-0"
        >
          <Icon name={menuOpen ? 'x-lg' : 'list'} />
        </button>
      </div>
    </header>
  )
}
