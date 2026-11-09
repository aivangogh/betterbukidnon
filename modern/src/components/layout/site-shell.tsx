import { Link } from '@tanstack/react-router'
import { Menu, ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'
import { navigation, site } from '@/content/site'
import logoUrl from '../../../../assets/images/logo/better-bukidnon-logo.svg?url'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <a
        className="sr-only z-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-md focus:bg-white focus:px-4 focus:py-3"
        href="#main-content"
      >
        Skip to main content
      </a>
      <div className="bg-civic-900 px-4 py-2 text-center text-sm text-white">
        Emergency: 911 · Bukidnon PDRRMO: (088) 813-5255
      </div>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 font-bold text-civic-900"
            onClick={() => setOpen(false)}
          >
            <img src={logoUrl} alt="" className="h-11 w-auto" />
            <span>{site.name}</span>
          </Link>
          <button
            type="button"
            className="rounded-md p-2 lg:hidden"
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Toggle navigation</span>
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="primary-navigation"
            aria-label="Primary"
            className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-1 border-b bg-white p-4 shadow-lg lg:static lg:flex lg:flex-row lg:border-0 lg:p-0 lg:shadow-none`}
          >
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-civic-50 hover:text-civic-700"
                activeProps={{ className: 'bg-civic-50 text-civic-700' }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="mt-20 bg-civic-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 lg:px-8">
          <div>
            <p className="text-lg font-bold">{site.name}</p>
            <p className="mt-2 text-sm text-slate-300">{site.disclaimer}</p>
          </div>
          <div>
            <p className="font-semibold">Public service</p>
            <p className="mt-2 text-sm text-slate-300">
              Cost to the people of Bukidnon: ₱0
            </p>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <ShieldCheck className="mt-0.5 size-5 shrink-0" />
            <span>
              Facts should be verified against the linked official government
              sources.
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
