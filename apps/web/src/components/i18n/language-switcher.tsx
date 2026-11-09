import { Languages } from 'lucide-react'
import { localeNames } from '@/content/translations'
import { localeSchema } from '@/content/schemas'
import { useLocale } from './locale-provider'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale()
  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">
      <Languages className="size-4" aria-hidden="true" />
      <span className="sr-only">{t('shell.language')}</span>
      <select
        aria-label={t('shell.language')}
        value={locale}
        onChange={(event) => setLocale(localeSchema.parse(event.target.value))}
        className="bg-transparent outline-none"
      >
        {localeSchema.options.map((option) => (
          <option key={option} value={option}>
            {localeNames[option]}
          </option>
        ))}
      </select>
    </label>
  )
}
