import { describe, expect, it } from 'vite-plus/test'
import { ordinances, resolutions } from './data'

describe('legislative data', () => {
  it('validates ordinances and resolutions at import time', () => {
    expect(ordinances.ordinances).toEqual([])
    expect(resolutions.resolutions).toEqual([])
  })
})
