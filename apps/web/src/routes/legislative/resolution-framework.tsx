import { createFileRoute } from '@tanstack/react-router'
import { InformationPage } from '@/components/layout/information-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/legislative/resolution-framework')({
  head: () =>
    seo({
      title: m.seo_resolutions_title(),
      description: m.seo_resolutions_description(),
      path: '/legislative/resolution-framework',
    }),

  component: () => (
    <InformationPage
      eyebrow="Legislative records"
      title="Resolution framework"
      description="How provincial resolutions record the position or action of the Sangguniang Panlalawigan."
      icon="file-earmark-text"
      sections={[
        {
          heading: 'What is a resolution?',
          body: "A resolution is a formal expression of the Provincial Board's opinion, will, or decision on a specific matter. It is generally not a local law.",
        },
        {
          heading: 'Common uses',
          body: 'Resolutions can express support, make requests, recognize people or events, authorize agreements, or record other official actions.',
        },
        {
          heading: 'Verified publication',
          body: 'Records appear here only after their source and session information have been verified.',
        },
      ]}
    />
  ),
})
