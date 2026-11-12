import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { localeSchema, type Locale, type LocalizedText } from '@/content/schemas'
import { translate, type TranslationKey, type TranslationParams } from '@/content/translations'

const STORAGE_KEY = 'betterbukidnon-locale'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: TranslationParams) => string
  /** Picks the current language from content data, falling back to English. */
  l: (text: LocalizedText) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {
      // Language detection still works when storage is blocked.
    }
    const browser = navigator.language.toLowerCase()
    const preferred =
      saved ?? (browser.startsWith('fil') ? 'fil' : browser.startsWith('ceb') ? 'ceb' : 'en')
    const parsed = localeSchema.safeParse(preferred)
    if (parsed.success) setLocaleState(parsed.data)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => {
        setLocaleState(nextLocale)
        try {
          localStorage.setItem(STORAGE_KEY, nextLocale)
        } catch {
          // The in-memory selection remains active for this visit.
        }
      },
      t: (key, params) => translate(locale, key, params),
      l: (text) => text[locale] ?? text.en,
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used within LocaleProvider')
  return context
}
