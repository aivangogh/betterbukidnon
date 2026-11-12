import { createFileRoute } from '@tanstack/react-router'
import { InformationPage } from '@/components/content/information-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/faq')({
  head: () => seo({ title: m.seo_faq_title(), description: m.seo_faq_description(), path: '/faq' }),

  component: () => (
    <InformationPage
      eyebrow="Help"
      title="Frequently asked questions"
      description="Common questions about provincial services and this volunteer civic portal."
      icon="question-circle-fill"
      sections={[
        {
          heading: 'Is this an official government website?',
          body: 'No. BetterBukidnon.org is a volunteer civic project. Always confirm time-sensitive requirements and fees with the responsible government office.',
        },
        {
          heading: 'Where do I get a birth certificate or business permit?',
          body: 'Many transactions are handled by city or municipal offices. Use the service directory to find the responsible office and official source before visiting.',
        },
        {
          heading: 'How do I report incorrect information?',
          body: 'Use the contact directory to reach the responsible government office, or email the volunteers with the source that needs correction.',
        },
      ]}
    />
  ),
})
