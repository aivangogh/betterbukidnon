import { z } from 'zod'
import { parseContent } from '@/lib/schemas'
import barangaysJson from '@data/barangays.json'
import boundaryText from '@data/bukidnon-boundary.geojson?raw'
import lgusJson from '@data/lgus.json'

const verificationStatus = z.enum(['verified', 'pending_verification', 'historical'])
const psgcCode = z.string().regex(/^\d{10}$/)
const psgcNineDigit = z.string().regex(/^\d{9}$/)
const directorySourceSchema = z.object({
  agency: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  tier: z.number().int().min(1).max(3),
  last_verified: z.iso.date(),
  status: verificationStatus,
  scope: z.string().min(1),
  effective_period: z.string().min(1).optional(),
})

const sealSchema = z.object({
  status: verificationStatus,
  path: z.string().min(1),
  source_url: z.url(),
  license: z.string().min(1).optional(),
  note: z.string().min(1).optional(),
  is_barangay_seal: z.boolean().optional(),
})

const coordinatesSchema = z.object({
  lat: z.number().gte(-90).lte(90),
  lon: z.number().gte(-180).lte(180),
  precision: z.string().min(1),
  source: z.string().min(1),
})

const lguOfficialSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  party: z.string().min(1).nullable(),
  status: verificationStatus,
  source_url: z.url(),
  last_verified: z.iso.date(),
})

const lguSchema = z.object({
  psgc_code: psgcCode,
  psgc_9digit: psgcNineDigit,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  official_name: z.string().min(1),
  classification: z.enum(['Component City', 'Municipality']),
  is_capital: z.boolean(),
  province: z.literal('Bukidnon'),
  province_psgc: psgcCode,
  region: z.string().min(1),
  district: z.number().int().min(1).max(4),
  coordinates: coordinatesSchema,
  area_km2: z.number().positive(),
  population: z.object({
    latest: z.number().int().nonnegative(),
    latest_year: z.number().int().min(1900),
    latest_source: z.string().min(1),
    population_2020: z.number().int().nonnegative(),
    population_2024: z.number().int().nonnegative().nullable(),
    density_per_km2: z.number().nonnegative(),
  }),
  barangay_count: z.number().int().positive(),
  seal: sealSchema,
  website: z.url().nullable(),
  hall_address: z.string().min(1).nullable(),
  public_phone: z.string().min(1).nullable(),
  leadership: z.object({
    term: z.string().min(1),
    mayor: lguOfficialSchema,
    vice_mayor: lguOfficialSchema,
    councilors_status: verificationStatus,
    councilors_note: z.string().min(1),
    councilors: z.array(z.unknown()),
    ex_officio_status: verificationStatus,
    department_heads_status: verificationStatus,
    status: verificationStatus,
  }),
  sources: z.array(directorySourceSchema).min(1),
  introduction: z.string().min(1),
})

const barangayOfficialSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  term: z.string().min(1),
  source_url: z.url(),
  status: verificationStatus,
})

const barangaySchema = z.object({
  psgc_code: psgcCode,
  psgc_9digit: psgcNineDigit,
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
  lgu_psgc: psgcCode,
  lgu_slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  lgu_name: z.string().min(1),
  district: z.number().int().min(1).max(4),
  province: z.literal('Bukidnon'),
  province_psgc: psgcCode,
  population: z.object({
    value: z.number().int().nonnegative().nullable(),
    year: z.number().int().min(1900).nullable(),
    status: verificationStatus,
  }),
  hall_location: z.object({
    address: z.string().min(1).nullable(),
    coordinates: coordinatesSchema.nullable(),
    precision: z.string().min(1),
    status: verificationStatus,
  }),
  leadership: z.object({
    term: z.string().min(1),
    status: verificationStatus,
    note: z.string().min(1),
    punong_barangay: barangayOfficialSchema.nullable(),
    kagawads: z.array(z.unknown()),
    sk_chairperson: z.unknown().nullable(),
    secretary: z.unknown().nullable(),
    treasurer: z.unknown().nullable(),
  }),
  contacts: z.object({
    status: verificationStatus,
    phone: z.string().min(1).nullable(),
    email: z.email().nullable(),
    website: z.url().nullable(),
  }),
  seal: sealSchema,
  sources: z.array(directorySourceSchema).min(1),
  introduction: z.string().min(1),
})

const lguDirectorySchema = z.object({
  _schema_version: z.literal('1.0'),
  province: z.literal('Bukidnon'),
  province_psgc: psgcCode,
  last_verified: z.iso.date(),
  total_lgus: z.literal(22),
  lgus: z.array(lguSchema).length(22),
})

const barangayDirectorySchema = z.object({
  _schema_version: z.literal('1.0'),
  province: z.literal('Bukidnon'),
  province_psgc: psgcCode,
  psgc_source: z.url(),
  last_verified: z.iso.date(),
  total_barangays: z.literal(464),
  barangays: z.array(barangaySchema).length(464),
})

const boundarySchema = z.object({
  type: z.literal('Feature'),
  properties: z.object({ name: z.literal('Bukidnon') }),
  geometry: z.object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))).min(1),
  }),
})

export type Lgu = z.infer<typeof lguSchema>
export type Barangay = z.infer<typeof barangaySchema>
export type BukidnonBoundary = z.infer<typeof boundarySchema>

const lguDirectory = parseContent(lguDirectorySchema, lgusJson, 'data/lgus.json')
const barangayDirectory = parseContent(
  barangayDirectorySchema,
  barangaysJson,
  'data/barangays.json',
)

function validateDirectoryRelations() {
  const lguBySlug = new Map(lguDirectory.lgus.map((lgu) => [lgu.slug, lgu]))
  if (lguBySlug.size !== lguDirectory.lgus.length)
    throw new Error('Invalid data/lgus.json: LGU slugs must be unique')
  if (new Set(lguDirectory.lgus.map((lgu) => lgu.psgc_code)).size !== lguDirectory.lgus.length)
    throw new Error('Invalid data/lgus.json: LGU PSGC codes must be unique')

  const barangaysBySlug = new Set<string>()
  const barangaysByPsgc = new Set<string>()
  const barangayCountByLgu = new Map<string, number>()
  for (const barangay of barangayDirectory.barangays) {
    if (barangaysBySlug.has(barangay.slug))
      throw new Error(`Invalid data/barangays.json: duplicate slug ${barangay.slug}`)
    barangaysBySlug.add(barangay.slug)
    if (barangaysByPsgc.has(barangay.psgc_code))
      throw new Error(`Invalid data/barangays.json: duplicate PSGC code ${barangay.psgc_code}`)
    barangaysByPsgc.add(barangay.psgc_code)

    const lgu = lguBySlug.get(barangay.lgu_slug)
    if (!lgu) throw new Error(`Invalid data/barangays.json: unknown LGU ${barangay.lgu_slug}`)
    if (
      barangay.lgu_psgc !== lgu.psgc_code ||
      barangay.lgu_name !== lgu.name ||
      barangay.district !== lgu.district
    ) {
      throw new Error(`Invalid data/barangays.json: inconsistent parent for ${barangay.slug}`)
    }
    barangayCountByLgu.set(barangay.lgu_slug, (barangayCountByLgu.get(barangay.lgu_slug) ?? 0) + 1)
  }

  for (const lgu of lguDirectory.lgus) {
    if (barangayCountByLgu.get(lgu.slug) !== lgu.barangay_count)
      throw new Error(`Invalid directory data: barangay count does not match ${lgu.slug}`)
  }
}

validateDirectoryRelations()

export const lgus = lguDirectory.lgus
export const barangays = barangayDirectory.barangays
export const bukidnonBoundary = parseContent(
  boundarySchema,
  JSON.parse(boundaryText),
  'data/bukidnon-boundary.geojson',
)

export const lguBySlug = new Map(lgus.map((lgu) => [lgu.slug, lgu]))
export const barangayBySlug = new Map(barangays.map((barangay) => [barangay.slug, barangay]))
export const barangayByPsgc = new Map(
  barangays.flatMap((barangay) => [
    [barangay.psgc_code, barangay] as const,
    [barangay.psgc_9digit, barangay] as const,
  ]),
)
export const barangaysByLgu = barangays.reduce((groups, barangay) => {
  const group = groups.get(barangay.lgu_slug)
  if (group) group.push(barangay)
  else groups.set(barangay.lgu_slug, [barangay])
  return groups
}, new Map<string, Barangay[]>())

export const findLgu = (slug: string) => lguBySlug.get(slug)
export const findBarangay = (slug: string) => barangayBySlug.get(slug)
export const findBarangayByPsgc = (code: string) => barangayByPsgc.get(code)
export const findBarangaysForLgu = (slug: string) => barangaysByLgu.get(slug) ?? []
