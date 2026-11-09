import { createFileRoute } from '@tanstack/react-router'
import { Phone } from 'lucide-react'
import { SectionPage } from '@/components/content/section-page'
export const Route = createFileRoute('/contact')({
  component: () => (
    <SectionPage
      eyebrow="Directory"
      title="Contact provincial offices"
      description="Find public contact channels and emergency hotlines. For urgent emergencies in the Philippines, call 911."
      icon={Phone}
    />
  ),
})
