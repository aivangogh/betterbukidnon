import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/icon'

// Same location, currencies and refresh times as the legacy assets/js/info-bar.js.
const MALAYBALAY = { lat: 8.1575, lon: 125.1278 }
const CURRENCIES = ['USD', 'GBP', 'SAR', 'AED', 'JPY', 'CAD', 'AUD'] as const
const RATES_TTL = 30 * 60 * 1000
const WEATHER_TTL = 15 * 60 * 1000
const RATE_ROTATION = 4000

type Currency = (typeof CURRENCIES)[number]
type Rates = Partial<Record<Currency, number>>

const timeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Manila',
  hour: 'numeric',
  minute: '2-digit',
})
const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Manila',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

async function cached<T>(key: string, ttl: number, load: () => Promise<T>): Promise<T> {
  try {
    const entry = JSON.parse(localStorage.getItem(key) ?? 'null') as { at: number; data: T } | null
    if (entry && Date.now() - entry.at < ttl) return entry.data
  } catch {
    // Fall through to the network when storage is blocked or holds bad data.
  }
  const data = await load()
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    // The value is still shown; it is just fetched again next visit.
  }
  return data
}

// The legacy primary source (exchangerate.host) now needs an API key, so only its working
// fallback is used. Rates are PHP-based, so invert to show pesos per unit of currency.
async function loadRates(): Promise<Rates> {
  const response = await fetch('https://open.er-api.com/v6/latest/PHP')
  if (!response.ok) throw new Error(`Exchange rates: HTTP ${response.status}`)
  const { rates } = (await response.json()) as { rates?: Record<string, number> }
  const result: Rates = {}
  for (const currency of CURRENCIES) {
    const perPeso = rates?.[currency]
    if (perPeso && perPeso > 0) result[currency] = 1 / perPeso
  }
  return result
}

async function loadTemperature(): Promise<number | null> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${MALAYBALAY.lat}&longitude=${MALAYBALAY.lon}&current_weather=true`,
  )
  if (!response.ok) throw new Error(`Weather: HTTP ${response.status}`)
  const data = (await response.json()) as { current_weather?: { temperature?: number } }
  return data.current_weather?.temperature ?? null
}

function usePolling<T>(key: string, ttl: number, load: () => Promise<T>) {
  const [value, setValue] = useState<T | null>(null)
  useEffect(() => {
    let active = true
    const update = () =>
      cached(key, ttl, load)
        .then((data) => active && setValue(data))
        .catch(() => {
          // Keep the "--" placeholder; the next interval tries again.
        })
    void update()
    const timer = setInterval(update, ttl)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [key, ttl, load])
  return value
}

function useNow() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return now
}

function useRotation(length: number) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIndex((value) => (value + 1) % length), RATE_ROTATION)
    return () => clearInterval(timer)
  }, [length])
  return index
}

const divider = 'border-l border-white/15 pl-4 max-md:ml-2 max-md:pl-2 max-sm:ml-1.5 max-sm:pl-1.5'

export function InfoBar() {
  const rates = usePolling('infobar_exchange_rates', RATES_TTL, loadRates)
  const temperature = usePolling('infobar_weather', WEATHER_TTL, loadTemperature)
  const now = useNow()
  const currency = CURRENCIES[useRotation(CURRENCIES.length)] ?? CURRENCIES[0]
  const rate = rates?.[currency]

  return (
    <div
      role="complementary"
      aria-label="Real-time information"
      className="bg-info-bar py-1.5 text-[0.6875rem] font-normal tracking-[0.01em] text-white"
    >
      <div className="container-site">
        <div className="flex flex-wrap items-center justify-end gap-6 max-xl:justify-center max-md:flex-nowrap max-md:gap-0">
          <div
            className="inline-flex items-center gap-1.25 whitespace-nowrap max-md:gap-0.75 max-sm:gap-0.5 max-sm:text-[0.625rem]"
            aria-label="Exchange rates"
          >
            <Icon
              name="currency-exchange"
              className="text-[0.75rem] text-[#ffff00] max-sm:text-[0.6875rem]"
            />
            <span className="inline-block min-w-27.5 text-left max-md:min-w-0">
              <span key={currency} className="inline-block animate-rate-fade-in">
                1 {currency} = ₱ {rate === undefined ? '--' : rate.toFixed(2)}
              </span>
            </span>
          </div>
          <div
            className={`inline-flex items-center gap-1.25 whitespace-nowrap max-md:gap-0.75 max-sm:gap-0.5 max-sm:text-[0.625rem] ${divider}`}
            aria-label="Current weather in Bukidnon"
          >
            <Icon
              name="thermometer-half"
              className="text-[0.75rem] text-[#ffff00] max-sm:text-[0.6875rem]"
            />
            <span>Malaybalay</span>
            <span>{temperature === null ? '--' : Math.round(temperature)}°C</span>
          </div>
          <div
            className={`inline-flex flex-nowrap items-center gap-1.25 whitespace-nowrap max-md:gap-0.75 max-sm:gap-0.5 max-sm:text-[0.625rem] ${divider}`}
            aria-label="Philippine Date and Time"
          >
            <Icon
              name="calendar3"
              className="text-[0.75rem] text-[#ffff00] max-sm:text-[0.6875rem]"
            />
            <span>{now ? dateFormat.format(now) : '--- --, ----'}</span>
            <span className="mx-0.5 text-[0.5rem] max-md:mx-px">•</span>
            <Icon name="clock" className="text-[0.75rem] text-[#ffff00] max-sm:text-[0.6875rem]" />
            <span className="font-medium tabular-nums">
              {now ? timeFormat.format(now) : '--:-- --'}
            </span>
            <span className="text-[0.625rem] uppercase tracking-[0.5px] max-sm:text-[0.5625rem]">
              PHT
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
