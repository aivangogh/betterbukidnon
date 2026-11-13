import { describe, expect, it } from 'vite-plus/test'
import en from '../../messages/en.json' with { type: 'json' }
import fil from '../../messages/fil.json' with { type: 'json' }
import ceb from '../../messages/ceb.json' with { type: 'json' }
import { projects } from '@/features/projects/projects'

type Messages = Record<string, string>
const locales = { en, fil, ceb } as Record<string, Messages>
const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? '').sort((a, b) => a.localeCompare(b))

describe('interface messages', () => {
  it('only translates keys that exist in English', () => {
    for (const [locale, messages] of Object.entries(locales)) {
      for (const key of Object.keys(messages)) expect(en, `${locale}: ${key}`).toHaveProperty(key)
    }
  })

  it('keeps the same {placeholders} in every language', () => {
    for (const [locale, messages] of Object.entries(locales)) {
      for (const [key, text] of Object.entries(messages)) {
        if (key === '$schema') continue
        expect(placeholders(text), `${locale}: ${key}`).toEqual(
          placeholders((en as Messages)[key] ?? ''),
        )
      }
    }
  })

  it('has a name and description in every language for each project', () => {
    for (const project of projects) {
      for (const [locale, messages] of Object.entries(locales)) {
        expect(messages, `${locale}: ${project.id}`).toHaveProperty(`proj_${project.id}_name`)
        expect(messages, `${locale}: ${project.id}`).toHaveProperty(`proj_${project.id}_desc`)
      }
    }
  })
})
