import { loadDocument } from '@/lib/content'
import { serviceDocumentSchema } from './schemas'

/** The written guide for a service-details page, if it has one (`content/services/<slug>`). */
export const loadServiceGuide = (slug: string) =>
  loadDocument('services', slug, serviceDocumentSchema)

export type ServiceGuide = NonNullable<Awaited<ReturnType<typeof loadServiceGuide>>>
