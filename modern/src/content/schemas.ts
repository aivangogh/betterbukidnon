import { z } from 'zod'

export const localeSchema = z.enum(['en', 'fil', 'ceb'])
export type Locale = z.infer<typeof localeSchema>

export const sourceSchema = z.object({
  name: z.string().min(1),
  url: z.url(),
})

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

export const newsItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  date: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
})

export const newsDataSchema = z.object({ news: z.array(newsItemSchema) })
export type NewsItem = z.infer<typeof newsItemSchema>

export function parseContent<T>(
  schema: z.ZodType<T>,
  value: unknown,
  name: string,
): T {
  const result = schema.safeParse(value)
  if (!result.success) {
    throw new Error(`Invalid ${name}: ${z.prettifyError(result.error)}`)
  }
  return result.data
}
