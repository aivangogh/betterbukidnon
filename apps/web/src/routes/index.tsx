import { createFileRoute } from '@tanstack/react-router'
import { VolunteerDialog } from '@/features/engagement/volunteer-dialog'
import { HomeHero } from '@/features/home/home-hero'
import { GlanceStats, LguCta, PopularServices } from '@/features/home/home-sections'
import {
  ContactInfo,
  History,
  LatestUpdates,
  Leadership,
  VolunteerCta,
} from '@/features/home/home-sections-lower'
import { WeatherMap } from '@/features/home/weather-map'
import { homeStructuredData } from '@/lib/structured-data'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/')({
  head: () => ({
    ...seo({ description: m.seo_home_description(), path: '/' }),
    scripts: homeStructuredData(),
  }),
  component: HomePage,
})

// Same sections and order as the legacy index.html.
function HomePage() {
  return (
    <>
      <HomeHero />
      <LguCta />
      <PopularServices />
      <GlanceStats />
      <WeatherMap />
      <History />
      <LatestUpdates />
      <Leadership />
      <ContactInfo />
      <VolunteerCta />
      <VolunteerDialog />
    </>
  )
}
