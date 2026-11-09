import { createFileRoute } from '@tanstack/react-router'
import { PhilippinePeso } from 'lucide-react'
import { SectionPage } from '@/components/content/section-page'
export const Route = createFileRoute('/budget')({
  component: () => (
    <SectionPage
      eyebrow="Transparency"
      title="Budget and financial records"
      description="Find provincial budget, revenue, expenditure, and infrastructure information with links to official sources."
      icon={PhilippinePeso}
    />
  ),
})
