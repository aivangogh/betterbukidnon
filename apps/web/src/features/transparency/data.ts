import { z } from 'zod'
import fiscalJson from '../../../../../data/fiscal_transparency.json'
import { parseContent } from '@/lib/schemas'

export const fiscalDataSchema = z.object({
  _status: z.enum(['empty', 'verified']),
  _source: z.string().min(1),
  province: z.string().min(1),
  fiscal_years: z.array(
    z.object({
      year: z.number().int(),
      source_url: z.url(),
      periods: z.array(z.record(z.string(), z.unknown())),
    }),
  ),
})

export const fiscalData = parseContent(
  fiscalDataSchema,
  fiscalJson,
  'data/fiscal_transparency.json',
)
