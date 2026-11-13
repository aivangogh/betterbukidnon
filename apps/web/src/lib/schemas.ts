import { z } from 'zod'

/** Validates data at import time and names the file in the error, so bad data fails the build. */
export function parseContent<T>(schema: z.ZodType<T>, value: unknown, name: string): T {
  const result = schema.safeParse(value)
  if (!result.success) {
    throw new Error(`Invalid ${name}: ${z.prettifyError(result.error)}`)
  }
  return result.data
}

/** Text in each site language; English is required and is the fallback for the others. */
export const localizedTextSchema = z.object({
  en: z.string().min(1),
  fil: z.string().min(1).optional(),
  ceb: z.string().min(1).optional(),
})
export type LocalizedText = z.infer<typeof localizedTextSchema>

/** Where a dataset's facts come from. */
export const sourceSchema = z.object({
  name: z.string().min(1),
  url: z.url(),
})
