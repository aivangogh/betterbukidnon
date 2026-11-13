import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '@/components/layout/not-found'

// Prerendered to 404.html (and fil/, ceb/), which Cloudflare serves for unknown URLs.
// Unknown URLs inside the app render the same page as the router's not-found page.
export const Route = createFileRoute('/404')({
  component: NotFound,
})
