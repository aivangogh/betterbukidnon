import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/icon'

const STORAGE_KEY = 'bb-vol-popup-v1'
const SHOW_DELAY_MS = 800

const roles = [
  'Research and verify public information',
  'Improve accessibility and translations',
  'Build civic technology for Bukidnon',
  'Share local knowledge and community needs',
  'Help keep this portal accurate and useful',
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

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="volunteer-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="volunteer-dialog-title"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) dismiss()
          }}
        >
          <motion.div
            className="relative my-8 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close volunteer popup"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={dismiss}
            >
              <Icon name="x-lg" className="text-xl" />
            </button>
            <div className="bg-linear-135 from-primary to-secondary px-7 py-10 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-tint">
                BetterBukidnon volunteers
              </p>
              <h2 id="volunteer-dialog-title" className="mt-3 text-3xl font-bold">
                Be part of something greater
              </h2>
              <p className="mt-3 text-slate-200">
                Help make reliable public information easier for every Bukidnon to find.
              </p>
            </div>
            <div className="p-7">
              <p className="leading-7 text-slate-600">
                This is a volunteer civic project. You can contribute a few hours, local knowledge,
                research, design, or code.
              </p>
              <ul className="mt-5 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                {roles.map((role) => (
                  <li key={role} className="rounded-lg bg-primary-tint px-3 py-2">
                    {role}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark"
                  href="mailto:volunteer@betterbukidnon.org"
                  onClick={dismiss}
                >
                  <Icon name="envelope-fill" className="text-base" /> Email the volunteers
                </a>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={dismiss}
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
