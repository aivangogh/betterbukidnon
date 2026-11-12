import { useRouter } from '@tanstack/react-router'
import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'
import type { Service } from '@/content/schemas'
import {
  addRecentSearch,
  clearRecentSearches,
  getSuggestions,
  searchCategories,
  searchServices,
  serviceHref,
  tokenize,
  trackSearch,
  type Suggestions,
} from '@/content/search'
import { cn } from '@/lib/utils'

// Markup and behavior follow the legacy assets/js/search.js dropdown and its injected styles.

type Item = { kind: 'suggestion'; term: string } | { kind: 'result'; service: Service }

function Highlight({ text, query }: { text: string; query: string }) {
  const terms = tokenize(query).filter((term) => term.length >= 2)
  if (!terms.length) return <>{text}</>
  const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark
            key={index}
            className="rounded-none bg-transparent bg-linear-180 from-transparent from-60% to-primary/15 to-60% p-0 text-inherit"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  )
}

const sectionHeader =
  'flex items-center justify-between px-4 pb-2 pt-3 text-[0.6875rem] font-semibold uppercase tracking-[0.5px] text-[#888]'
const selectedRow =
  'border-l-primary bg-[linear-gradient(90deg,rgba(0,50,160,0.06)_0%,rgba(0,50,160,0.02)_100%)]'

export function ServiceSearchBox({
  id,
  placeholder,
  label = 'Search services',
  inputClassName,
  wrapperClassName,
  children,
}: {
  id: string
  placeholder: string
  label?: string
  inputClassName?: string
  /** Classes for the element that holds the input and the dropdown (legacy .search-input-wrapper). */
  wrapperClassName?: string
  /** Extra controls next to the input, such as a submit button. */
  children?: React.ReactNode
}) {
  const router = useRouter()
  const listId = useId()
  const wrapper = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<string | null>(null)
  const [results, setResults] = useState<Service[]>([])
  const [suggestions, setSuggestions] = useState<Suggestions>({
    popular: [],
    recent: [],
    suggestions: [],
  })
  const [selected, setSelected] = useState(-1)
  const [browsing, setBrowsing] = useState(true)

  const showBrowse = (value: string) => {
    setResults([])
    setSuggestions(getSuggestions(value))
    setBrowsing(true)
    setSelected(-1)
    setOpen(true)
  }

  const performSearch = (value: string, inCategory = category) => {
    const found = searchServices(value, { category: inCategory })
    setResults(found)
    setSuggestions(getSuggestions(value))
    setBrowsing(false)
    setSelected(-1)
    setOpen(true)
    trackSearch(value, found.length)
  }

  // Debounced like legacy: suggestions update at once, results 150ms after typing stops.
  useEffect(() => {
    if (!open) return
    const value = query.trim()
    if (value.length < 2) return
    const timer = setTimeout(() => performSearch(value), 150)
    return () => clearTimeout(timer)
    // performSearch reads the latest category itself; re-run only when the query changes.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) {
        setOpen(false)
        setSelected(-1)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const go = (service: Service) => {
    addRecentSearch(query.trim())
    setOpen(false)
    void router.navigate({ href: serviceHref(service) })
  }

  const applySuggestion = (term: string) => {
    setQuery(term)
    performSearch(term)
    input.current?.focus()
  }

  // Items reachable with the arrow keys, in the order they are shown.
  const browseRecent = browsing ? suggestions.recent : []
  const browsePopular = browsing ? suggestions.popular : []
  const showBrowseLists = browseRecent.length > 0 || browsePopular.length > 0
  const didYouMean =
    !showBrowseLists && results.length === 0 ? suggestions.suggestions.slice(0, 5) : []
  const items: Item[] = showBrowseLists
    ? [...browseRecent, ...browsePopular].map((term) => ({ kind: 'suggestion', term }))
    : [
        ...didYouMean.map((term): Item => ({ kind: 'suggestion', term })),
        ...results.map((service): Item => ({ kind: 'result', service })),
      ]
  const optionId = (index: number) => `${listId}-option-${index}`

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelected((index) => Math.min(index + 1, items.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelected((index) => Math.max(index - 1, -1))
    } else if (event.key === 'Enter') {
      const item = items[selected]
      if (item) {
        event.preventDefault()
        if (item.kind === 'suggestion') applySuggestion(item.term)
        else go(item.service)
      } else if (results[0]) {
        event.preventDefault()
        go(results[0])
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
      setSelected(-1)
    }
  }

  useEffect(() => {
    if (selected >= 0)
      document.getElementById(optionId(selected))?.scrollIntoView({ block: 'nearest' })
    // optionId only depends on listId, which never changes.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  let position = -1
  const suggestionRow = (term: string, icon: IconName) => {
    position++
    const index = position
    return (
      <a
        key={`${index}-${term}`}
        id={optionId(index)}
        href="#"
        role="option"
        aria-selected={selected === index}
        onClick={(event) => {
          event.preventDefault()
          applySuggestion(term)
        }}
        className={cn(
          'group/s flex items-center border-l-3 border-transparent px-4 py-2.75 text-left text-[0.875rem] text-[#333] no-underline transition-all duration-150 hover:text-primary hover:no-underline max-sm:px-3.5 max-sm:py-2.5',
          'hover:border-l-primary hover:bg-[linear-gradient(90deg,rgba(0,50,160,0.06)_0%,rgba(0,50,160,0.02)_100%)]',
          selected === index && cn(selectedRow, 'text-primary'),
        )}
      >
        <Icon
          name={icon}
          className={cn(
            'mr-2.5 text-[0.8125rem] text-[#999] transition-colors group-hover/s:text-primary',
            selected === index && 'text-primary',
          )}
        />
        {term}
      </a>
    )
  }

  const value = query.trim()

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        if (value.length >= 2 && results[0]) go(results[0])
      }}
    >
      <div ref={wrapper} className={cn('relative', wrapperClassName)}>
        <input
          ref={input}
          type="search"
          id={id}
          role="combobox"
          aria-label={label}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={selected >= 0 ? optionId(selected) : undefined}
          placeholder={placeholder}
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            if (event.target.value.trim().length < 2) showBrowse(event.target.value.trim())
            else setOpen(true)
          }}
          onFocus={() => (value.length < 2 ? showBrowse(value) : performSearch(value))}
          onKeyDown={onKeyDown}
          className={inputClassName}
        />
        {children}
        {open && (
          <div
            id={listId}
            role="listbox"
            aria-label="Search suggestions"
            className="absolute inset-x-0 top-full z-[1000] mt-2 max-h-120 animate-[search-dropdown-in_0.2s_ease] overflow-y-auto rounded-2xl border border-primary/10 bg-white text-left shadow-[0_12px_40px_rgba(0,50,160,0.15),0_4px_12px_rgba(0,0,0,0.08)] [scrollbar-color:rgba(0,50,160,0.2)_transparent] [scrollbar-width:thin] max-sm:mt-1.5 max-sm:rounded-xl"
          >
            <div className="flex flex-nowrap gap-1.5 overflow-x-auto rounded-t-2xl border-b border-primary/6 bg-linear-180 from-[#fafbfc] to-white px-3.5 py-3 [scrollbar-width:none] max-sm:gap-1.25 max-sm:rounded-t-xl max-sm:px-3 max-sm:py-2.5">
              {[{ id: null, label: 'All' }, ...searchCategories].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setCategory(chip.id)
                    if (value.length >= 2) performSearch(value, chip.id)
                  }}
                  className={cn(
                    'cursor-pointer whitespace-nowrap rounded-[20px] [font-family:revert] border border-primary/15 bg-white px-3.5 py-1.5 text-[0.75rem] font-medium leading-[normal] text-[#555] transition-all duration-200 hover:border-primary hover:bg-primary/4 hover:text-primary max-sm:px-3 max-sm:py-1.25 max-sm:text-[0.6875rem]',
                    category === chip.id &&
                      'border-primary bg-linear-135 from-primary to-[#0044cc] text-white shadow-[0_2px_8px_rgba(0,50,160,0.3)] hover:text-white',
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {showBrowseLists ? (
              <>
                {browseRecent.length > 0 && (
                  <div className="border-b border-primary/6 last:border-b-0">
                    <div className={sectionHeader}>
                      <span>
                        <Icon name="clock-history" className="mr-1.25 text-primary" /> Recent
                        Searches
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          clearRecentSearches()
                          showBrowse('')
                        }}
                        className="cursor-pointer rounded-sm border-0 bg-transparent px-2 py-0.75 [font-family:revert] text-[0.6875rem] font-medium leading-[normal] text-primary normal-case tracking-normal transition-colors hover:bg-primary/8"
                      >
                        Clear
                      </button>
                    </div>
                    {browseRecent.map((term) => suggestionRow(term, 'arrow-counterclockwise'))}
                  </div>
                )}
                {browsePopular.length > 0 && (
                  <div className="border-b border-primary/6 last:border-b-0">
                    <div className={sectionHeader}>
                      <span>
                        <Icon name="fire" className="mr-1.25 text-primary" /> Popular Searches
                      </span>
                    </div>
                    {browsePopular.map((term) => suggestionRow(term, 'search'))}
                  </div>
                )}
              </>
            ) : (
              <>
                {didYouMean.length > 0 && (
                  <div className="border-b border-primary/6 last:border-b-0">
                    <div className={sectionHeader}>
                      <span>
                        <Icon name="lightbulb" className="mr-1.25 text-primary" /> Did you mean?
                      </span>
                    </div>
                    {didYouMean.map((term) => suggestionRow(term, 'search'))}
                  </div>
                )}
                {results.length === 0 ? (
                  <div className="px-6 py-8 text-center text-[#666]">
                    <Icon name="search" className="mb-3 block text-[2.5rem] text-primary/20" />
                    <p className="mb-1.5 mt-0 font-semibold text-[#333]">No services found</p>
                    <small className="text-[0.8125rem] text-[#888]">
                      Try different keywords or check spelling
                    </small>
                  </div>
                ) : (
                  <>
                    {results.map((service) => {
                      position++
                      const index = position
                      return (
                        <a
                          key={service.id}
                          id={optionId(index)}
                          href={serviceHref(service)}
                          role="option"
                          aria-selected={selected === index}
                          onClick={(event) => {
                            if (
                              event.metaKey ||
                              event.ctrlKey ||
                              event.shiftKey ||
                              event.button !== 0
                            )
                              return
                            event.preventDefault()
                            go(service)
                          }}
                          className={cn(
                            'block border-b border-l-3 border-b-primary/6 border-l-transparent px-4 py-3.5 text-left text-ink no-underline transition-all duration-150 last:border-b-0 hover:border-l-primary hover:bg-[linear-gradient(90deg,rgba(0,50,160,0.06)_0%,rgba(0,50,160,0.02)_100%)] hover:text-ink hover:no-underline max-sm:px-3.5 max-sm:py-3',
                            selected === index && selectedRow,
                          )}
                        >
                          <div className="mb-1.5 flex items-center gap-2 text-[0.9375rem] font-semibold text-primary">
                            {/* Legacy puts the highlighted word and the rest of the title in a flex
                                row with an 8px gap, so they are separate items, as here. */}
                            <Highlight text={service.title} query={value} />
                            {service.processingTime?.toLowerCase().includes('same day') && (
                              <span className="rounded-sm bg-success/10 px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.3px] text-success">
                                Fast
                              </span>
                            )}
                          </div>
                          <div className="mb-1.5 flex flex-wrap gap-3 text-[0.75rem] max-sm:gap-2">
                            <span className="inline-flex items-center gap-1.25 rounded-sm bg-black/4 px-2 py-0.5 text-[#666]">
                              <Icon name="folder" className="text-[0.6875rem] opacity-80" />{' '}
                              {service.category}
                            </span>
                            {service.fee && (
                              <span className="inline-flex items-center gap-1.25 font-semibold text-success">
                                <Icon name="cash" className="text-[0.6875rem] opacity-80" />{' '}
                                {service.fee}
                              </span>
                            )}
                            {service.processingTime && (
                              <span className="inline-flex items-center gap-1.25 text-[#0066cc]">
                                <Icon name="clock" className="text-[0.6875rem] opacity-80" />{' '}
                                {service.processingTime}
                              </span>
                            )}
                          </div>
                          {service.office && (
                            <div className="mb-1 flex items-center text-[0.75rem] text-[#777]">
                              <Icon
                                name="building"
                                className="mr-1.5 text-[0.6875rem] text-primary"
                              />{' '}
                              {service.office}
                            </div>
                          )}
                          {service.description && (
                            <div className="truncate text-[0.8125rem] leading-[1.4] text-[#666]">
                              {service.description}
                            </div>
                          )}
                        </a>
                      )
                    })}
                    <div className="flex items-center justify-between rounded-b-2xl border-t border-primary/6 bg-[#fafbfc] px-4 py-2.5 text-[0.75rem] text-[#888] max-sm:rounded-b-xl">
                      <span className="font-medium">
                        {results.length} service{results.length !== 1 ? 's' : ''} found
                      </span>
                      <span className="flex items-center justify-center gap-4 rounded-b-2xl border-t border-primary/6 bg-[#fafbfc] px-4 py-2.5 text-[0.6875rem] max-sm:hidden">
                        {[
                          [['↑', '↓'], 'Navigate'],
                          [['Enter'], 'Select'],
                          [['Esc'], 'Close'],
                        ].map(([keys, action]) => (
                          <span key={String(action)}>
                            {(keys as string[]).map((key) => (
                              <kbd
                                key={key}
                                className="mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-[#ddd] bg-white px-1.25 font-[inherit] text-[0.625rem] font-semibold text-[#555] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                              >
                                {key}
                              </kbd>
                            ))}{' '}
                            {action}
                          </span>
                        ))}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </form>
  )
}
