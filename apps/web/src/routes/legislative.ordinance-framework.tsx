import { BookOpenCheck } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { InformationPage } from '@/components/content/information-page'

export const Route = createFileRoute('/legislative/ordinance-framework')({
  component: () => (
    <InformationPage
      eyebrow="Legislative records"
      title="Ordinance framework"
      description="How provincial ordinances function within Bukidnon's local legislative process."
      icon={BookOpenCheck}
      sections={[
        {
          heading: 'What is an ordinance?',
          body: 'A provincial ordinance is a local law enacted by the Sangguniang Panlalawigan within the powers granted to provinces by the Local Government Code.',
        },
        {
          heading: 'What ordinances cover',
          body: 'They may address provincial programs, public property, roads, fees, taxes, appropriations, and other matters within provincial authority.',
        },
        {
          heading: 'Official records',
          body: 'This portal only publishes records that can be verified against official provincial sources.',
        },
      ]}
    />
  ),
})
