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

const namedOfficialSchema = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
  party: z.string().optional(),
  role: z.string().optional(),
  district: z.number().int().min(1).max(4).optional(),
})

export const officialsDataSchema = z.object({
  term: z.string().min(1),
  last_verified: z.iso.date(),
  sources: z.array(sourceSchema).min(1),
  governor: namedOfficialSchema,
  vice_governor: namedOfficialSchema,
  board_members: z.array(namedOfficialSchema),
  ex_officio: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      seat: z.string().min(1),
      status: z.enum(['verified', 'verify']),
    }),
  ),
  representatives: z.array(namedOfficialSchema),
})
export type OfficialsData = z.infer<typeof officialsDataSchema>

const populationSchema = z.object({
  total: z.number().int().positive(),
  year: z.number().int().min(1900),
  source: z.string().min(1),
})

export const demographicsDataSchema = z.object({
  province: z.string().min(1),
  region: z.string().min(1),
  capital: z.string().min(1),
  income_class: z.string().min(1),
  land_area_km2: z.number().positive(),
  population: populationSchema,
  population_2020: populationSchema,
  density_2024_per_km2: z.object({
    value: z.number().positive(),
    note: z.string(),
  }),
  counts: z.object({
    cities: z.number().int(),
    municipalities: z.number().int(),
    barangays: z.number().int(),
  }),
  districts_basis: z.string().min(1),
  lgus: z
    .array(
      z.object({
        name: z.string().min(1),
        type: z.enum(['city', 'municipality']),
        capital: z.boolean().optional(),
        district: z.number().int().min(1).max(4),
        population_2020: z.number().int().positive(),
        area_km2: z.number().positive(),
        barangays: z.number().int().positive(),
      }),
    )
    .length(22),
  sources: z.array(sourceSchema).min(1),
})
export type DemographicsData = z.infer<typeof demographicsDataSchema>

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

export function parseContent<T>(schema: z.ZodType<T>, value: unknown, name: string): T {
  const result = schema.safeParse(value)
  if (!result.success) {
    throw new Error(`Invalid ${name}: ${z.prettifyError(result.error)}`)
  }
  return result.data
}
