import { WifiOff } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SectionPage } from '@/components/content/section-page'

export const Route = createFileRoute('/offline')({
  component: () => (
    <SectionPage
      eyebrow="Offline"
      title="You are offline"
      description="Check your connection, then try again. Previously visited portal pages may still be available."
      icon={WifiOff}
    >
      <Link
        to="/"
        className="mt-8 inline-flex rounded-lg bg-civic-700 px-5 py-3 font-semibold text-white"
      >
        Return home
      </Link>
    </SectionPage>
  ),
})
