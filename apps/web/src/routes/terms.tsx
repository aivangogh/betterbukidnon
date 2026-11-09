import { createFileRoute } from '@tanstack/react-router'
import { InformationPage } from '@/components/content/information-page'

export const Route = createFileRoute('/terms')({
  component: () => (
    <InformationPage
      eyebrow="Terms"
      title="Terms of use"
      description="Use this portal as a guide to verified sources, not as a substitute for official government advice."
      icon="file-earmark-text"
      sections={[
        {
          heading: 'Information accuracy',
          body: 'We work to link reliable sources, but offices, schedules, fees, and requirements can change. Confirm important details with the responsible office.',
        },
        {
          heading: 'No official representation',
          body: 'BetterBukidnon.org is an independent volunteer civic project and does not represent the Provincial Government of Bukidnon.',
        },
        {
          heading: 'Responsible use',
          body: 'Do not rely on this portal for immediate emergency response. In an emergency, call 911 or the appropriate hotline.',
        },
      ]}
    />
  ),
})
