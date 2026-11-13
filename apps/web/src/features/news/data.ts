import { z } from 'zod'
import newsJson from '../../../../../data/news.json'
import { parseContent } from '@/lib/schemas'

export const newsItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  date: z.iso.date().optional(),
  url: z.url().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
})

export const newsDataSchema = z.object({ news: z.array(newsItemSchema) })
export type NewsItem = z.infer<typeof newsItemSchema>

export const news = parseContent(newsDataSchema, newsJson, 'data/news.json')
