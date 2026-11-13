import { expect, it } from 'vite-plus/test'
import { contactDirectory } from './contact'

it('keeps the public hotline directory complete and callable', () => {
  expect(contactDirectory.hotlines).toHaveLength(6)
  expect(contactDirectory.hotlines.every((hotline) => hotline.href.startsWith('tel:'))).toBe(true)
})
