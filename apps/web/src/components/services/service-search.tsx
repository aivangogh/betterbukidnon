import { Icon } from '@/components/ui/icon'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { searchServices } from '@/content/services'

export function ServiceSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('')
  const results = searchServices(query)

  return (
    <div className={compact ? '' : 'mt-10'}>
      <label className="sr-only" htmlFor="service-search">
        Search provincial services
      </label>
      <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-900 shadow-lg">
        <Icon name="search" className="text-xl shrink-0 text-primary" />
        <input
          id="service-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search services and government offices…"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-500"
          type="search"
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear service search"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
            onClick={() => setQuery('')}
          >
            <Icon name="x-lg" className="text-base" />
          </button>
        ) : null}
      </div>
      {query.length >= 2 ? (
        <div className="mt-2 overflow-hidden rounded-xl bg-white text-slate-900 shadow-lg">
          {results.length ? (
            <ul aria-label="Service search results">
              {results.map((service) => (
                <li key={service.id}>
                  <Link
                    to="/service-details/$slug"
                    params={{ slug: service.id }}
                    className="block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-primary-tint"
                    onClick={() => setQuery('')}
                  >
                    <span className="font-semibold">{service.title}</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {service.office ?? service.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-slate-600">No matching services found.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
