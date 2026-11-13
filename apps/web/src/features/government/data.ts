import { z } from 'zod'
import demographicsJson from '../../../../../data/demographics.json'
import officialsJson from '../../../../../data/officials.json'
import { parseContent, sourceSchema } from '@/lib/schemas'

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

export const officials = parseContent(officialsDataSchema, officialsJson, 'data/officials.json')

export const demographics = parseContent(
  demographicsDataSchema,
  demographicsJson,
  'data/demographics.json',
)
