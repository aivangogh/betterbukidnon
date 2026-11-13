import { z } from 'zod'
import ordinancesJson from '../../../../../data/ordinances.json'
import resolutionsJson from '../../../../../data/resolutions.json'
import { parseContent } from '@/lib/schemas'

const legislativeRecordSchema = z.object({
  title: z.string().min(1),
  sessionDate: z.iso.date(),
})

export const ordinancesDataSchema = z.object({
  _source: z.string().min(1),
  ordinances: z.array(legislativeRecordSchema.extend({ ordinanceNo: z.string().min(1) })),
})

export const resolutionsDataSchema = z.object({
  _source: z.string().min(1),
  resolutions: z.array(legislativeRecordSchema.extend({ resolutionNo: z.string().min(1) })),
})

export const ordinances = parseContent(ordinancesDataSchema, ordinancesJson, 'data/ordinances.json')

export const resolutions = parseContent(
  resolutionsDataSchema,
  resolutionsJson,
  'data/resolutions.json',
)
