import { createFileRoute } from '@tanstack/react-router'
import { InformationPage } from '@/components/content/information-page'

export const Route = createFileRoute('/accessibility')({
  component: () => (
    <InformationPage
      eyebrow="Accessibility"
      title="Accessibility statement"
      description="BetterBukidnon.org aims to make public information usable by everyone."
      icon="universal-access"
      sections={[
        {
          heading: 'Our commitment',
          body: 'We use semantic structure, keyboard-accessible controls, readable contrast, and responsive layouts so residents can access public information on their own devices.',
        },
        {
          heading: 'Known limitations',
          body: 'Some linked third-party government documents and historic records may not be fully accessible. We will improve content as issues are reported and verified.',
        },
        {
          heading: 'Alternative access',
          body: 'If a page or document is difficult to use, contact the volunteers or the responsible government office for assistance and an alternative format.',
        },
      ]}
    />
  ),
})
