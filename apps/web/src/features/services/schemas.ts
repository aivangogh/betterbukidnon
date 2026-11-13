import { z } from 'zod'
import { localizedTextSchema } from '@/lib/schemas'

export const serviceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  categoryId: z.string().min(1),
  url: z.string().min(1),
  icon: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  office: z.string().optional(),
  level: z.string().optional(),
  fee: z.string().optional(),
  processingTime: z.string().optional(),
})

export const servicesDataSchema = z.object({ services: z.array(serviceSchema) })
export type Service = z.infer<typeof serviceSchema>

/** An app path (`/services/health`), `tel:` number, or external `https:` URL. */
const hrefSchema = z.string().regex(/^(\/|tel:|https:\/\/)/)
const iconSchema = z.string().regex(/^[a-z0-9-]+$/)

export const serviceCategoryPageSchema = z.object({
  breadcrumb: localizedTextSchema,
  badge: localizedTextSchema,
  icon: iconSchema,
  title: localizedTextSchema,
  description: localizedTextSchema,
  /** The page's search-result description (meta description). */
  metaDescription: localizedTextSchema,
  contacts: z.array(
    z.object({
      icon: iconSchema,
      href: hrefSchema,
      label: localizedTextSchema,
      value: localizedTextSchema,
    }),
  ),
  sections: z.array(
    z.object({
      title: localizedTextSchema,
      intro: localizedTextSchema.optional(),
      cards: z.array(
        z.object({
          icon: iconSchema,
          title: localizedTextSchema,
          text: localizedTextSchema,
          link: z.object({ href: hrefSchema, label: localizedTextSchema }).optional(),
        }),
      ),
    }),
  ),
  note: z.object({
    text: localizedTextSchema,
    link: z.object({ href: hrefSchema, label: localizedTextSchema }),
  }),
})
export type ServiceCategoryPage = z.infer<typeof serviceCategoryPageSchema>

export const serviceCategoriesDataSchema = z.object({
  categories: z.record(z.string().regex(/^[a-z0-9-]+$/), serviceCategoryPageSchema),
})

/** Frontmatter of a service guide (`content/services/<slug>/<locale>.mdx`). */
export const serviceDocumentSchema = z
  .object({
    /** The page heading. */
    title: z.string().min(1),
    /** The breadcrumb and the browser/search title, when shorter than `title`. */
    shortTitle: z.string().min(1),
    /** Meta description for search results and link previews. */
    description: z.string().min(50).max(300),
    /** The line under the heading. */
    summary: z.string().min(1),
    badge: z.string().min(1),
    /** Bootstrap Icons name for the badge. */
    icon: z.string().min(1),
    /** The service category the page belongs to, for the breadcrumb. */
    category: z.string().min(1),
  })
  .strict()
export type ServiceDocument = z.infer<typeof serviceDocumentSchema>
