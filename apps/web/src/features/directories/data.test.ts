import { describe, expect, it } from 'vite-plus/test'
import {
  barangays,
  bukidnonBoundary,
  findBarangay,
  findBarangayByPsgc,
  findBarangaysForLgu,
  findLgu,
  lgus,
} from './data'
import { barangayPath, directoryBarangaySlug, directoryPaths } from './paths'

describe('LGU and barangay directory data', () => {
  it('validates the 22 LGUs, 464 barangays, and province boundary at import time', () => {
    expect(lgus).toHaveLength(22)
    expect(barangays).toHaveLength(464)
    expect(bukidnonBoundary.geometry.type).toBe('Polygon')
  })

  it('keeps every barangay connected to its recorded LGU', () => {
    for (const barangay of barangays) {
      const lgu = findLgu(barangay.lgu_slug)
      expect(lgu).toBeDefined()
      expect(lgu?.psgc_code).toBe(barangay.lgu_psgc)
      expect(lgu?.district).toBe(barangay.district)
    }
    expect(findBarangaysForLgu('baungon')).toHaveLength(16)
  })

  it('builds route-safe paths from dataset slugs', () => {
    const balintad = findBarangay('baungon/balintad')
    expect(balintad).toBeDefined()
    expect(directoryPaths.lgus).toBe('/lgus')
    expect(directoryPaths.lgu('baungon')).toBe('/lgus/baungon')
    expect(barangayPath(balintad!)).toBe('/barangays/baungon/balintad')
    expect(directoryBarangaySlug('baungon', 'balintad')).toBe('baungon/balintad')
    expect(findBarangayByPsgc(balintad!.psgc_code)).toBe(balintad)
    expect(findBarangayByPsgc(balintad!.psgc_9digit)).toBe(balintad)
  })

  it('rejects a malformed compound barangay slug', () => {
    expect(() => barangayPath({ lgu_slug: 'baungon', slug: 'baungon/balintad/extra' })).toThrow(
      'Invalid barangay route slug',
    )
  })
})
