import { createFileRoute } from '@tanstack/react-router'
import { ChartNoAxesCombined } from 'lucide-react'
import { SectionPage } from '@/components/content/section-page'
export const Route = createFileRoute('/statistics')({
  component: () => (
    <SectionPage
      eyebrow="Open data"
      title="Bukidnon at a glance"
      description="Population, land area, barangays, cities, municipalities, and other verified provincial indicators."
      icon={ChartNoAxesCombined}
    />
  ),
})
