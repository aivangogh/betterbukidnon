import { describe, expect, it } from 'vite-plus/test'
import { fiscalData } from './data'

describe('transparency data', () => {
  it('validates fiscal data at import time', () => {
    expect(fiscalData.fiscal_years).toEqual([])
  })
})
