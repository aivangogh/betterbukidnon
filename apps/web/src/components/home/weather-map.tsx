import { useEffect, useRef, useState } from 'react'
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png?url'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png?url'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png?url'
import { useLocale } from '@/components/i18n/locale-provider'
import { Icon, type IconName } from '@/components/ui/icon'
import { GlanceHeader } from './home-ui'

// Provincial Capitol, Malaybalay City (same point as the legacy weather-map.js).
const CAPITOL: [number, number] = [8.1575, 125.1278]
const WEATHER_TTL = 15 * 60 * 1000
const WEATHER_CACHE_KEY = 'home_weather'
const OSM_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=124.55%2C7.35%2C125.65%2C8.65&layer=mapnik&marker=8.1575%2C125.1278'

// WMO weather codes, as mapped by the legacy weather-map.js.
const weatherCodes: Record<number, { condition: string; icon: IconName }> = {
  0: { condition: 'Clear sky', icon: 'sun-fill' },
  1: { condition: 'Mainly clear', icon: 'cloud-sun-fill' },
  2: { condition: 'Partly cloudy', icon: 'cloud-sun-fill' },
  3: { condition: 'Overcast', icon: 'clouds-fill' },
  45: { condition: 'Foggy', icon: 'cloud-fog-fill' },
  48: { condition: 'Depositing rime fog', icon: 'cloud-fog-fill' },
  51: { condition: 'Light drizzle', icon: 'cloud-drizzle-fill' },
  53: { condition: 'Moderate drizzle', icon: 'cloud-drizzle-fill' },
  55: { condition: 'Dense drizzle', icon: 'cloud-drizzle-fill' },
  61: { condition: 'Slight rain', icon: 'cloud-rain-fill' },
  63: { condition: 'Moderate rain', icon: 'cloud-rain-fill' },
  65: { condition: 'Heavy rain', icon: 'cloud-rain-heavy-fill' },
  80: { condition: 'Rain showers', icon: 'cloud-rain-fill' },
  95: { condition: 'Thunderstorm', icon: 'cloud-lightning-rain-fill' },
}
const describe = (code: number) =>
  weatherCodes[code] ?? { condition: 'Partly cloudy', icon: 'cloud-sun-fill' as IconName }

type Weather = {
  temperature: number
  humidity: number
  windSpeed: number
  code: number
  hourly: Array<{ time: string; temperature: number; code: number }>
}

type ForecastResponse = {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
  }
  hourly: { time: string[]; temperature_2m: number[]; weather_code: number[] }
}

async function fetchWeather(): Promise<Weather> {
  try {
    const cached = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) ?? 'null') as {
      at: number
      data: Weather
    } | null
    if (cached && Date.now() - cached.at < WEATHER_TTL) return cached.data
  } catch {
    // Ignore unreadable cache entries and fetch fresh data.
  }
  const params = new URLSearchParams({
    latitude: String(CAPITOL[0]),
    longitude: String(CAPITOL[1]),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,weather_code',
    timezone: 'Asia/Manila',
    forecast_days: '1',
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`Weather: HTTP ${response.status}`)
  const data = (await response.json()) as ForecastResponse
  // Times are in Asia/Manila ("2026-11-09T16:00"), so the hour is read straight from the string.
  const nowHour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      hour: 'numeric',
      hourCycle: 'h23',
    }).format(new Date()),
  )
  const start = data.hourly.time.findIndex((time) => Number(time.slice(11, 13)) >= nowHour)
  const weather: Weather = {
    temperature: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    code: data.current.weather_code,
    hourly: data.hourly.time
      .slice(Math.max(start, 0), Math.max(start, 0) + 4)
      .map((time, index) => {
        const hour = Number(time.slice(11, 13))
        const i = Math.max(start, 0) + index
        return {
          time: `${hour % 12 || 12} ${hour < 12 ? 'am' : 'pm'}`,
          temperature: Math.round(data.hourly.temperature_2m[i] ?? 0),
          code: data.hourly.weather_code[i] ?? 0,
        }
      }),
  }
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ at: Date.now(), data: weather }))
  } catch {
    // Shown either way; it is only fetched again on the next visit.
  }
  return weather
}

const card =
  'flex h-full flex-col rounded-2xl border border-black/6 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] max-sm:rounded-xl'

const shimmer =
  'animate-[skeleton-shimmer_1.5s_ease-in-out_infinite] bg-[linear-gradient(90deg,#f0f0f0_25%,#fafafa_50%,#f0f0f0_75%)] bg-size-[200%_100%]'

function WeatherCard() {
  const [state, setState] = useState<'loading' | 'error' | Weather>('loading')

  const load = () => {
    setState('loading')
    fetchWeather()
      .then(setState)
      .catch(() => setState('error'))
  }
  useEffect(load, [])

  if (state === 'loading') {
    return (
      <div
        aria-busy="true"
        aria-label="Loading weather data"
        className="rounded-2xl border border-black/6 bg-white p-8 max-sm:p-6"
      >
        <div className="flex items-start gap-6 pb-6">
          <div className={`size-14 rounded-xl ${shimmer}`} />
          <div className="flex-1">
            <div className={`mb-2 h-10 w-25 rounded-md ${shimmer}`} />
            <div className={`mt-2 h-4 w-20 rounded-md ${shimmer}`} />
            <div className={`mt-2 h-3 w-30 rounded-md ${shimmer}`} />
          </div>
        </div>
        <div className="flex gap-6 border-y border-black/5 py-4">
          <div className={`h-4 w-17.5 rounded-md ${shimmer}`} />
          <div className={`h-4 w-17.5 rounded-md ${shimmer}`} />
        </div>
        <div className="mt-auto flex justify-between gap-1.5 pt-6">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className={`h-18 min-w-0 flex-1 rounded-[10px] ${shimmer}`} />
          ))}
        </div>
      </div>
    )
  }

  // Legacy showed made-up "(Demo)" weather when the API failed; show an honest error instead.
  if (state === 'error') {
    return (
      <div
        role="alert"
        className="flex min-h-70 items-center justify-center rounded-2xl border border-black/6 bg-white p-12"
      >
        <div className="text-center">
          <Icon name="cloud-slash" className="mb-4 text-[2.5rem] text-ink-light opacity-50" />
          <p className="mb-6 text-[0.875rem] text-ink-light">Weather data unavailable</p>
          <button
            type="button"
            onClick={load}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-site border-2 border-transparent bg-primary px-4 py-2 text-[0.8125rem] font-semibold text-white hover:bg-primary-dark"
          >
            <Icon name="arrow-clockwise" /> Retry
          </button>
        </div>
      </div>
    )
  }

  const current = describe(state.code)
  return (
    <div
      role="region"
      aria-label="Current weather in Malaybalay City, Bukidnon"
      className={`group p-8 max-sm:p-6 ${card}`}
    >
      <div className="flex items-start gap-6 pb-6">
        <div
          aria-hidden="true"
          className="text-[3rem] leading-none text-primary opacity-90 transition-transform duration-300 group-hover:scale-105 max-sm:text-[2.5rem]"
        >
          <Icon name={current.icon} />
        </div>
        <div className="flex-1">
          <div className="mb-1.5 text-[2.5rem] font-bold leading-none tracking-[-1px] text-ink max-sm:text-[2rem]">
            {state.temperature}°C
          </div>
          <div className="mb-1 text-[0.9375rem] font-medium text-ink max-sm:text-[0.875rem]">
            {current.condition}
            <span
              className="ml-1 text-[0.65rem] text-success"
              title="Live data from Open-Meteo API"
            >
              ●
            </span>
          </div>
          <div className="flex items-center gap-1 text-[0.75rem] text-ink-light">
            <Icon name="geo-alt" className="text-[0.6875rem] text-primary" /> Malaybalay City,
            Bukidnon
          </div>
        </div>
      </div>
      <div
        role="list"
        aria-label="Weather details"
        className="flex gap-6 border-y border-black/5 py-4 max-sm:gap-4"
      >
        <div
          role="listitem"
          aria-label={`Humidity ${state.humidity} percent`}
          className="flex items-center gap-1.5 text-[0.8125rem] max-sm:text-[0.75rem]"
        >
          <Icon name="droplet" className="text-[0.875rem] text-primary opacity-80" />
          <span className="font-medium text-ink">{state.humidity}%</span>
        </div>
        <div
          role="listitem"
          aria-label={`Wind speed ${state.windSpeed} kilometers per hour`}
          className="flex items-center gap-1.5 text-[0.8125rem] max-sm:text-[0.75rem]"
        >
          <Icon name="wind" className="text-[0.875rem] text-primary opacity-80" />
          <span className="font-medium text-ink">{state.windSpeed} km/h</span>
        </div>
      </div>
      <div
        role="list"
        aria-label="Hourly forecast"
        className="mt-auto flex justify-between gap-1.5 pt-6 max-lg:justify-start max-lg:overflow-x-auto max-lg:pb-1"
      >
        {state.hourly.map((hour) => (
          <div
            key={hour.time}
            role="listitem"
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[10px] bg-surface-alt px-2.5 py-2 transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-primary/6 max-lg:min-w-16 max-lg:flex-none"
          >
            <span className="text-[0.625rem] font-medium uppercase tracking-[0.3px] text-ink-light">
              {hour.time}
            </span>
            <Icon name={describe(hour.code).icon} className="text-[1rem] text-primary opacity-85" />
            <span className="text-[0.8125rem] font-semibold text-ink">{hour.temperature}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CapitolMap() {
  const { t } = useLocale()
  const container = useRef<HTMLDivElement>(null)
  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    const element = container.current
    if (!element) return
    let map: import('leaflet').Map | undefined
    let cancelled = false

    void Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]).then(([L]) => {
      if (cancelled) return
      setInteractive(true)
      map = L.map(element, {
        center: CAPITOL,
        zoom: 14,
        scrollWheelZoom: false,
        keyboard: true,
        keyboardPanDelta: 80,
      })
      // Like legacy: if the first three tiles fail (blocked or offline), fall back to the iframe.
      let loaded = false
      let errors = 0
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      })
        .on('tileload', () => {
          loaded = true
        })
        .on('tileerror', () => {
          if (loaded || ++errors < 3) return
          map?.remove()
          map = undefined
          setInteractive(false)
        })
        .addTo(map)
      L.marker(CAPITOL, {
        icon: L.icon({
          iconUrl: markerIconUrl,
          iconRetinaUrl: markerIcon2xUrl,
          shadowUrl: markerShadowUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .addTo(map)
        .bindPopup('<strong>Bukidnon Provincial Capitol</strong><br>Malaybalay City 8700')
    })

    return () => {
      cancelled = true
      map?.remove()
    }
  }, [])

  return (
    <div className={`overflow-hidden ${card}`}>
      <div
        role="application"
        aria-label="Interactive map of Bukidnon"
        className="relative z-0 h-75 bg-[#f5f5f5] max-sm:h-60"
      >
        {/* Leaflet owns this element; the iframe below covers it until Leaflet is ready. */}
        <div ref={container} className="h-full" />
        {!interactive && (
          <iframe
            src={OSM_EMBED}
            title="Map of Bukidnon"
            loading="lazy"
            aria-label="OpenStreetMap of Bukidnon with a marker on the Provincial Capitol in Malaybalay City"
            className="absolute inset-0 block size-full border-0"
          />
        )}
      </div>
      <p className="m-0 flex items-center gap-1.5 border-t border-black/5 bg-white px-6 py-3 text-[0.75rem] text-ink-light">
        <Icon name="geo-alt" className="text-[0.8125rem] text-primary" />
        <span>{t('home-capitol-address')}</span>
      </p>
      <p className="sr-only">{t('home-map-description')}</p>
    </div>
  )
}

export function WeatherMap() {
  const { t } = useLocale()
  return (
    <section className="bg-surface-alt py-12 max-xl:py-8 max-md:py-6">
      <div className="container-site">
        <GlanceHeader title={t('home-weather-and-map-of-bukidnon')} />
        <div className="grid grid-cols-[340px_minmax(0,1fr)] items-stretch gap-8 max-lg:grid-cols-[minmax(0,1fr)] max-lg:gap-6">
          <div className="flex flex-col" aria-live="polite">
            <WeatherCard />
          </div>
          <div className="flex flex-col">
            <CapitolMap />
          </div>
        </div>
      </div>
    </section>
  )
}
