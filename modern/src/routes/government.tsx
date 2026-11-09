import { createFileRoute } from '@tanstack/react-router'
import { Landmark } from 'lucide-react'
import { SectionPage } from '@/components/content/section-page'
export const Route = createFileRoute('/government')({
  component: () => (
    <SectionPage
      eyebrow="Provincial government"
      title="Government of Bukidnon"
      description="Learn about the Governor, Vice Governor, Sangguniang Panlalawigan, congressional districts, cities, and municipalities."
      icon={Landmark}
    />
  ),
})
