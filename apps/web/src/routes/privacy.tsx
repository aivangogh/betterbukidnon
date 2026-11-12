import { createFileRoute } from '@tanstack/react-router'
import { InformationPage } from '@/components/content/information-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/privacy')({
  head: () =>
    seo({
      title: m.seo_privacy_title(),
      description: m.seo_privacy_description(),
      path: '/privacy',
    }),

  component: () => (
    <InformationPage
      eyebrow="Privacy"
      title="Privacy notice"
      description="This portal is designed to provide public information without requiring an account."
      icon="shield-lock"
      sections={[
        {
          heading: 'Information we store',
          body: 'The site may store your selected language and voluntary interface preferences in your browser. It does not require account registration to browse public information.',
        },
        {
          heading: 'External services',
          body: 'Links to official government sites, social-media posts, maps, or documents are governed by the privacy practices of those services.',
        },
        {
          heading: 'Contacting us',
          body: 'If you email the volunteers, your message and contact details are used only to respond to your request or improve the portal.',
        },
      ]}
    />
  ),
})
