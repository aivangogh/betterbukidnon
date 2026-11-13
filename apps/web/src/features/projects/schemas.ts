import { z } from 'zod'

export const projectStatusSchema = z.enum(['active', 'development', 'archived'])
export type ProjectStatus = z.infer<typeof projectStatusSchema>

export const projectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.url(),
  repos: z.array(z.object({ name: z.string().min(1), url: z.url() })).default([]),
  type: z.enum(['org', 'community']),
  category: z.string().regex(/^[a-z0-9-]+$/),
  status: projectStatusSchema,
  /** A Bootstrap Icons class such as `bi-cash-coin`, as in the legacy data. */
  icon: z
    .string()
    .regex(/^bi-[a-z0-9-]+$/)
    .default('bi-grid-3x3-gap-fill'),
})

export const projectsDataSchema = z.object({ projects: z.array(projectSchema) })
export type Project = z.infer<typeof projectSchema>
