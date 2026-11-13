import { describe, expect, it } from 'vite-plus/test'
import { demographics, officials } from './data'

describe('government data', () => {
  it('validates officials and demographics at import time', () => {
    expect(officials.governor.name).toBeTruthy()
    expect(demographics.lgus).toHaveLength(22)
  })
})
