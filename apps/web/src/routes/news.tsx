import { createFileRoute } from '@tanstack/react-router'
import { Newspaper } from 'lucide-react'
import { SectionPage } from '@/components/content/section-page'
export const Route = createFileRoute('/news')({
  component: () => (
    <SectionPage
      eyebrow="Updates"
      title="News and public information"
      description="Curated public-interest updates from verified provincial and government sources."
      icon={Newspaper}
    />
  ),
})
