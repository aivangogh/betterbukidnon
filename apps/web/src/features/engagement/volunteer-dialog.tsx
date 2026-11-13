import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import logoWhiteUrl from '@/assets/logo/better-bukidnon-logo-white.svg?url'
import { Icon, type IconName } from '@/components/ui/icon'

const STORAGE_KEY = 'bb-vol-popup-v1'
const SHOW_DELAY_MS = 800

// Same roles as the legacy popup (index.html #vol-popup-overlay).
const roles: ReadonlyArray<{ icon: IconName; label: string }> = [
  { icon: 'code-slash', label: 'Software Dev' },
  { icon: 'layers', label: 'UI/UX Design' },
  { icon: 'palette', label: 'Graphic Design' },
  { icon: 'pencil-square', label: 'Content Creation' },
  { icon: 'megaphone', label: 'Digital Marketing' },
]

export function VolunteerDialog() {
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {
      // A blocked storage API should not prevent the invitation from opening.
    }

    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : SHOW_DELAY_MS
    const timer = window.setTimeout(() => {
      previousFocus.current = document.activeElement as HTMLElement | null
      setOpen(true)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return

    const scrollY = window.scrollY
    const body = document.body
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = `${scrollbarWidth}px`
    body.style.overflow = 'hidden'
    closeButtonRef.current?.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss()
        return
      }
      if (event.key !== 'Tab') return

      const dialog = document.getElementById('volunteer-dialog')
      if (!dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((element) => element.offsetParent !== null)
      if (!focusable.length) return
      event.preventDefault()
      const current = focusable.indexOf(document.activeElement as HTMLElement)
      const step = event.shiftKey ? -1 : 1
      const next =
        current === -1
          ? event.shiftKey
            ? focusable.length - 1
            : 0
          : (current + step + focusable.length) % focusable.length
      focusable[next]?.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [open])

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Dismissal still works when storage is unavailable.
    }
    setOpen(false)
    window.setTimeout(() => previousFocus.current?.focus(), 0)
  }

  const still = useReducedMotion()

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="volunteer-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="volunteer-dialog-title"
          className="fixed inset-0 z-[20000] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/72 p-4 backdrop-blur-[4px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: still ? 0 : 0.3 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) dismiss()
          }}
        >
          <motion.div
            className="relative max-h-[calc(100dvh-32px)] w-full max-w-115 overflow-y-auto overflow-x-hidden overscroll-contain rounded-[20px] bg-surface shadow-[0_0_0_1px_rgba(0,50,160,0.12),0_8px_32px_rgba(0,0,0,0.24),0_28px_72px_rgba(0,0,0,0.2)] max-[500px]:rounded-2xl forced-colors:border forced-colors:border-[CanvasText]"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: still ? 0 : 0.38, ease: [0.34, 1.56, 0.64, 1] },
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 10,
              transition: { duration: still ? 0 : 0.22, ease: 'easeIn' },
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close volunteer popup"
              className="absolute right-3.5 top-3.5 z-[2] flex size-9 cursor-pointer leading-[normal] items-center justify-center rounded-full border-0 bg-white/18 text-[1rem] text-white transition-[background-color,transform] duration-200 before:absolute before:-inset-1.25 before:content-[''] hover:scale-110 hover:bg-white/32 focus-visible:scale-110 focus-visible:bg-white/32 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              onClick={dismiss}
            >
              <Icon name="x-lg" />
            </button>
            <div className="relative overflow-hidden bg-[linear-gradient(140deg,#0032a0_0%,#003d82_55%,#001f6b_100%)] px-8 pb-7.5 pt-9.5 text-center max-[500px]:px-5 max-[500px]:pb-6 max-[500px]:pt-7 [@media(max-height:560px)]:px-6 [@media(max-height:560px)]:pb-4 [@media(max-height:560px)]:pt-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 before:absolute before:-right-17.5 before:-top-22.5 before:size-65 before:rounded-full before:bg-white/6 before:content-[''] after:absolute after:-bottom-17.5 after:-left-12.5 after:size-45 after:rounded-full after:bg-accent/10 after:content-['']"
              />
              <img
                src={logoWhiteUrl}
                alt="BetterBukidnon.org"
                width={210}
                height={76}
                draggable={false}
                className="relative z-[1] mx-auto mb-4.5 block h-auto w-52.5 max-w-[72%] select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.22)] max-[500px]:w-42.5 [@media(max-height:560px)]:mb-2.5 [@media(max-height:560px)]:w-37.5"
              />
              <h2
                id="volunteer-dialog-title"
                className="relative z-[1] mb-2.5 mt-0 text-[1.5rem] font-extrabold leading-[1.15] text-white max-[500px]:text-[1.25rem] [@media(max-height:560px)]:text-[1.25rem]"
              >
                Be Part of Something Greater
              </h2>
              <p className="relative z-[1] m-0 text-[0.875rem] leading-[1.55] text-white/75">
                Bukidnon deserves public information that is easy to find. Help us build it.
              </p>
            </div>
            <div className="px-7 pb-7.5 pt-6.5 max-[500px]:px-5 max-[500px]:pb-6 max-[500px]:pt-5 [@media(max-height:560px)]:px-5.5 [@media(max-height:560px)]:pb-5 [@media(max-height:560px)]:pt-4">
              <p className="mb-5 text-center text-[0.9375rem] leading-[1.6] text-ink [@media(max-height:560px)]:mb-3.5">
                We are looking for passionate <strong className="text-primary">Bukidnons</strong>{' '}
                who want to serve their community through their craft.
              </p>
              <div
                role="list"
                className="mb-6.5 flex flex-wrap justify-center gap-2 [@media(max-height:560px)]:mb-4"
              >
                {roles.map((role) => (
                  <div
                    key={role.label}
                    role="listitem"
                    className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-primary/14 bg-primary/6 px-3.5 py-1.75 text-[0.8125rem] font-semibold text-primary forced-colors:border-[CanvasText]"
                  >
                    <Icon name={role.icon} className="text-[0.9375rem]" />
                    <span>{role.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center gap-2.5">
                <a
                  href="mailto:volunteer@betterbukidnon.org"
                  rel="noopener"
                  onClick={dismiss}
                  className="inline-flex w-full items-center justify-center gap-2.25 rounded-xl border-0 bg-linear-135 from-primary to-secondary px-6 py-3.5 text-[1rem] font-bold text-white shadow-[0_4px_16px_rgba(0,50,160,0.32)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-white hover:no-underline hover:shadow-[0_8px_28px_rgba(0,50,160,0.44)] focus-visible:-translate-y-0.5 focus-visible:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon name="envelope-heart-fill" className="text-[1.125rem]" />
                  I Want to Volunteer
                </a>
                <button
                  type="button"
                  onClick={dismiss}
                  className="cursor-pointer rounded-sm border-0 bg-transparent px-2 py-1 text-[0.8125rem] leading-[normal] text-ink-light transition-colors hover:text-ink hover:underline focus-visible:text-ink focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
