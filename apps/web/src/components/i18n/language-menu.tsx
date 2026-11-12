import { useRouterState } from '@tanstack/react-router'
import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { localizePath } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { locales } from '@/paraglide/runtime'
import { localeNames, useLocale } from './locale-provider'

export function LanguageMenu() {
  const { locale } = useLocale()
  // The router location is the unprefixed route path, e.g. /services/health.
  const path = useRouterState({ select: (state) => state.location.href })
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const options = useRef<Array<HTMLAnchorElement | null>>([])
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [open])

  const close = (returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) toggle.current?.focus()
  }

  const focusOption = (index: number) => {
    const count = locales.length
    options.current[(index + count) % count]?.focus()
  }

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(event) => {
        const index = options.current.indexOf(document.activeElement as HTMLAnchorElement)
        if (event.key === 'Escape' && open) {
          event.stopPropagation()
          close(true)
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          if (!open) setOpen(true)
          const step = event.key === 'ArrowDown' ? 1 : -1
          // Wait a frame so newly shown options can take focus.
          requestAnimationFrame(() =>
            focusOption(index === -1 ? locales.indexOf(locale) : index + step),
          )
        }
      }}
      onBlur={(event) => {
        if (event.relatedTarget && !root.current?.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'relative inline-flex h-7.5 cursor-pointer items-center gap-1.25 rounded-full border border-primary/25 bg-white px-2.5 text-[0.8125rem] font-semibold leading-none text-primary transition-colors after:absolute after:inset-x-0 after:-inset-y-2 hover:border-primary/35 hover:bg-primary/6 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          open && 'border-primary/35 bg-primary/6',
        )}
      >
        <Icon name="globe2" className="text-[1rem]" />
        <span>{locale.toUpperCase()}</span>
        <span className="sr-only">, Language: {localeNames[locale]}</span>
        <Icon
          name="chevron-down"
          className={cn('text-[0.6875rem] transition-transform', open && 'rotate-180')}
        />
      </button>
      <div
        id={listId}
        hidden={!open}
        className="absolute right-0 top-[calc(100%+10px)] z-[1001] min-w-52.5 rounded-xl border border-black/8 bg-white p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)]"
      >
        {locales.map((option, index) => (
          // A full page load: each language is its own prerendered page.
          <a
            key={option}
            ref={(element) => {
              options.current[index] = element
            }}
            href={localizePath(path, option)}
            hrefLang={option}
            lang={option}
            aria-current={option === locale ? 'true' : undefined}
            className={cn(
              'flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 text-left text-[0.9375rem] font-medium text-ink no-underline hover:bg-surface-alt hover:text-ink hover:no-underline focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
              option === locale && 'font-semibold text-primary hover:text-primary',
            )}
          >
            <Icon
              name="check2"
              className={cn('w-[1em] text-[1rem]', option !== locale && 'invisible')}
            />
            <span>{localeNames[option]}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
