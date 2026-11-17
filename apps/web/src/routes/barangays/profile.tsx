import { Navigate, createFileRoute } from '@tanstack/react-router'
import { findBarangayByPsgc } from '@/features/directories/data'
import { barangayPath } from '@/features/directories/paths'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/barangays/profile')({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === 'string' ? search.code : '',
  }),
  head: () =>
    seo({
      description: 'Legacy barangay profile URL compatibility route.',
      path: '/barangays/profile',
      noindex: true,
    }),
  component: BarangayProfileCompatibility,
})

function BarangayProfileCompatibility() {
  const { code } = Route.useSearch()
  const barangay = findBarangayByPsgc(code)
  return <Navigate to={barangay ? barangayPath(barangay) : '/barangays'} replace />
}
