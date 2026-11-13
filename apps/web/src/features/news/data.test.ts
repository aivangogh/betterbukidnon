import { describe, expect, it } from 'vite-plus/test'
import { news } from './data'

describe('news data', () => {
  it('validates news at import time', () => {
    expect(news.news).toEqual([])
  })
})
